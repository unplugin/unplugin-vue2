<script setup lang="ts">
import ScriptSetup from "./ScriptSetup.vue";
import TestES2020Features from "./TestES2020Features.vue";
import TestCssModules from "./css/TestCssModules.vue";
import TestCssVBind from "./css/TestCssVBind.vue";
import TestEmptyCss from "./css/TestEmptyCss.vue";
import TestScopedCss from "./css/TestScopedCss.vue";
import TestCustomBlock from "./custom/TestCustomBlock.vue";
import TestHmr from "./hmr/TestHmr.vue";
import TestBlockSrcImport from "./src-import/TestBlockSrcImport.vue";
import TestAssets from "./test-assets/TestAssets.vue";
import TestComponent from "./test-component/TestComponent.vue";
</script>

<template>
	<div>
		<h1>Unplugin-Vue2 Playground</h1>
		<ScriptSetup msg="prop from parent" />
		<!-- <TestMultiplySrcImport /> -->
		<TestBlockSrcImport />
		<TestScopedCss />
		<TestCssModules />
		<TestCustomBlock />
		<TestEmptyCss />
		<TestHmr />
		<TestAssets />
		<TestES2020Features />
		<TestComponent />
		<TestCssVBind />
	</div>
</template>
