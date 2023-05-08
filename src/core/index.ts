import fs from "node:fs";

import { createUnplugin } from "unplugin";
import type { UnpluginContext, UnpluginContextMeta } from "unplugin";
import type { ViteDevServer } from "vite";
import { createFilter } from "vite";
import type * as _compiler from "vue/compiler-sfc";
import type {
  SFCBlock,
  SFCScriptCompileOptions,
  SFCStyleCompileOptions,
  SFCTemplateCompileOptions,
} from "vue/compiler-sfc";

import { resolveCompiler } from "./compiler";
import { handleHotUpdate } from "./handleHotUpdate";
import { transformMain } from "./main";
import { getResolvedScript } from "./script";
import { transformStyle } from "./style";
import { transformTemplateAsModule } from "./template";
import { NORMALIZER_ID, normalizerCode } from "./utils/componentNormalizer";
import { getDescriptor, getSrcDescriptor } from "./utils/descriptorCache";
import { HMR_RUNTIME_ID, hmrRuntimeCode } from "./utils/hmrRuntime";
import { parseVueRequest } from "./utils/query";

export { parseVueRequest } from "./utils/query";
export type { VueQuery } from "./utils/query";
export type Context = UnpluginContext & UnpluginContextMeta;
export interface Options {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];

  isProduction?: boolean;
  ssr?: boolean;
  sourceMap?: boolean;
  root?: string;

  // options to pass on to vue/compiler-sfc
  script?: Partial<Pick<SFCScriptCompileOptions, "babelParserPlugins">>;
  template?: Partial<
    Pick<
      SFCTemplateCompileOptions,
      | "compiler"
      | "compilerOptions"
      | "preprocessOptions"
      | "transpileOptions"
      | "transformAssetUrls"
      | "transformAssetUrlsOptions"
    >
  >;
  style?: Partial<Pick<SFCStyleCompileOptions, "trim">>;

  // customElement?: boolean | string | RegExp | (string | RegExp)[]
  // reactivityTransform?: boolean | string | RegExp | (string | RegExp)[]
  compiler?: typeof _compiler;
}

export type ResolvedOptions = Options &
  Required<
    Pick<
      Options,
      "include" | "isProduction" | "ssr" | "sourceMap" | "root" | "compiler"
    >
  > & {
    /** Vite only */
    devServer?: ViteDevServer;
    devToolsEnabled?: boolean;
    cssDevSourcemap: boolean;
  };

const createContext = (context: Context, meta: UnpluginContextMeta) =>
  new Proxy<Context & UnpluginContextMeta>(context, {
    get(target, key) {
      if (key in target) {
        return target[key as keyof Context];
      }

      return meta[key as keyof UnpluginContextMeta];
    },
  });

function resolveOptions(rawOptions: Options): ResolvedOptions {
  const root = rawOptions.root ?? process.cwd();

  return {
    ...rawOptions,
    include: rawOptions.include ?? /\.vue$/,
    isProduction:
      rawOptions.isProduction ?? process.env.NODE_ENV === "production",
    ssr: rawOptions.ssr ?? false,
    sourceMap: rawOptions.sourceMap ?? true,
    root,
    compiler: rawOptions.compiler as any, // to be set in buildStart
    devToolsEnabled: process.env.NODE_ENV !== "production",
    cssDevSourcemap: false,
  };
}

export default createUnplugin<Options | undefined>((rawOptions, meta) => {
  let options = resolveOptions(rawOptions ?? {});
  const { include, exclude } = options;

  const filter = createFilter(include, exclude);

  return {
    name: "unplugin-vue2",

    vite: {
      handleHotUpdate(ctx) {
        if (!filter(ctx.file)) {
          return;
        }

        return handleHotUpdate(ctx, options);
      },

      configResolved(config) {
        options = {
          ...options,
          root: config.root,
          isProduction: config.isProduction,
          sourceMap:
            config.command === "build" ? !!config.build.sourcemap : true,
          cssDevSourcemap: config.css?.devSourcemap ?? false,
          devToolsEnabled: !config.isProduction,
        };
        if (!config.resolve.alias.some(({ find }) => find === "vue")) {
          config.resolve.alias.push({
            find: "vue",
            replacement: "vue/dist/vue.runtime.esm.js",
          });
        }
      },

      configureServer(server) {
        options.devServer = server;
      },
    },

    buildStart() {
      options.compiler = options.compiler || resolveCompiler(options.root);
    },

    async resolveId(id) {
      // component export helper
      if (id === NORMALIZER_ID || id === HMR_RUNTIME_ID) {
        return id;
      }
      // serve sub-part requests (*?vue) as virtual modules
      if (parseVueRequest(id).query.vue) {
        return id;
      }
    },

    load(id) {
      const ssr = options.ssr === true;
      if (id === NORMALIZER_ID) {
        return normalizerCode;
      }
      if (id === HMR_RUNTIME_ID) {
        return hmrRuntimeCode;
      }

      const { filename, query } = parseVueRequest(id);
      // select corresponding block for sub-part virtual modules
      if (query.vue) {
        if (query.src) {
          return fs.readFileSync(filename, "utf-8");
        }
        const descriptor = getDescriptor(filename, options)!;
        let block: SFCBlock | null | undefined;
        if (query.type === "script") {
          // handle <scrip> + <script setup> merge via compileScript()
          block = getResolvedScript(descriptor, ssr);
        } else if (query.type === "template") {
          block = descriptor.template!;
        } else if (query.type === "style") {
          block = descriptor.styles[query.index!];
        } else if (query.index != null) {
          block = descriptor.customBlocks[query.index];
        }
        if (block) {
          return {
            code: block.content,
            map: block.map as any,
          };
        }
      }
    },

    async transform(code, id) {
      const ssr = options.ssr === true;
      const { filename, query } = parseVueRequest(id);
      if (query.raw) {
        return;
      }
      if (!filter(filename) && !query.vue) {
        // if (
        //   !query.vue &&
        //   refTransformFilter(filename) &&
        //   options.compiler.shouldTransformRef(code)
        // ) {
        //   return options.compiler.transformRef(code, {
        //     filename,
        //     sourceMap: true
        //   })
        // }
        return;
      }

      if (query.vue) {
        // sub block request
        const descriptor = query.src
          ? getSrcDescriptor(filename, query)!
          : getDescriptor(filename, options)!;

        if (query.type === "template") {
          return {
            code: await transformTemplateAsModule(
              code,
              descriptor,
              options,
              this,
              ssr,
            ),
            map: {
              mappings: "",
            },
          };
        } else if (query.type === "style") {
          return transformStyle(
            code,
            descriptor,
            Number(query.index),
            options,
            this,
            filename,
          );
        }
      } else {
        // main request
        const context = createContext(this as any, meta);

        return transformMain(code, filename, options, context, ssr);
      }
    },
  };
});
