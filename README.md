# unplugin-vue2

[![NPM version](https://img.shields.io/npm/v/unplugin-vue2?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-vue2)

## 💎 Features

- ⚡️ Supports Vite, Webpack, Vue CLI, Rollup, esbuild and more, powered by unplugin.

## 📦 Installation

```bash
$ npm install unplugin-vue2 -D
$ yarn add unplugin-vue2 -D
$ pnpm add unplugin-vue2 -D
```

## 🚀 Usage

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import UnpluginVue2 from "unplugin-vue2/vite";

export default defineConfig({
	plugins: [
		UnpluginVue2({
			/* options */
		}),
	],
});
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import UnpluginVue2 from "unplugin-vue2/rollup";

export default {
	plugins: [
		UnpluginVue2({
			/* options */
		}),
		// other plugins
	],
};
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
	/* ... */
	plugins: [
		require("unplugin-vue2/webpack")({
			/* options */
		}),
	],
};
```

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
	configureWebpack: {
		plugins: [
			require("unplugin-vue2/webpack")({
				/* options */
			}),
		],
	},
};
```

<br></details>

<details>
<summary>Quasar</summary><br>

```ts
// quasar.conf.js [Vite]
module.exports = {
	vitePlugins: [
		[
			"unplugin-vue2/vite",
			{
				/* options */
			},
		],
	],
};
```

```ts
// quasar.conf.js [Webpack]
const UnpluginVue2Plugin = require("unplugin-vue2/webpack");

module.exports = {
	build: {
		chainWebpack(chain) {
			chain.plugin("unplugin-vue2").use(
				UnpluginVue2Plugin({
					/* options */
				}),
			);
		},
	},
};
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from "esbuild";

build({
	/* ... */
	plugins: [
		require("unplugin-vue2/esbuild")({
			/* options */
		}),
	],
});
```

<br></details>

## 👍 Alternatives

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) - For Vite and Vue 3.
- [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2) - For Vite and Vue 2.
- ~~[vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2) - For Vite and Vue 2.~~
- ~~[rollup-plugin-vue](https://github.com/vuejs/rollup-plugin-vue)~~ - ⚠️ no longer maintained.
- [unplugin-vue](https://github.com/sxzz/unplugin-vue) - For Vue3.
- [vue-loader](https://github.com/vuejs/vue-loader) - For Webpack.
- [esbuild-plugin-vue](https://github.com/egoist/esbuild-plugin-vue) - For esbuild and Vue 3.
- [esbuild-vue](https://github.com/apeschar/esbuild-vue) - For esbuild and Vue 2.

## 📚 Credits

- [Vite](https://github.com/vitejs/vite) - Next generation frontend tooling. It's fast!
- [unplugin](https://github.com/unjs/unplugin) - Unified plugin system for Vite, Rollup, Webpack, and more

## 🙇‍ Thanks

Thanks to [Vite](https://github.com/vitejs/vite). This project is inherited from [@vitejs/plugin-vue2@2.2.0](https://github.com/vitejs/vite-plugin-vue2/tree/v2.2.0).
Thanks to [unplugin-vue](https://github.com/sxzz/unplugin-vue) for this idea (porting @vitejs/plugin-vue2 to unplugin).

## 📝 License

[MIT](./LICENSE). Made with ❤️ by [Ray](https://github.com/so1ve)
