<script>
import TestAsyncComponent from "./async/TestAsyncComponent.vue";
import TestRecursive from "./recursive/TestRecursive.vue";

export default {
	name: "TestRecursion",
	components: {
		TestRecursive,
		TestAsyncComponent,
	},
};
</script>

<template>
	<div>
		<h2>Vue Component</h2>

		<TestRecursive />
		<TestAsyncComponent />
	</div>
</template>
