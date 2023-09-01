import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	clean: true,
	rollup: {
		inlineDependencies: true,
	},
	externals: [
		"webpack",
		"rollup",
		"vite",
		"esbuild",
		"rspack",
		"vue/compiler-sfc",
	],
});
