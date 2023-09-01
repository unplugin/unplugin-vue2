<script>
export default {
	components: {
		ComponentA: () => import("./componentA.vue"),
	},
	beforeCreate() {
		this.$options.components.ComponentB = () => import("./componentB.vue");
	},
};
</script>

<template>
	<div>
		<h3>Async Component</h3>
		<ComponentA />
		<ComponentB />

		<pre>
export default {
  components: {
    componentA: () => import('./componentA.vue')
  },
  beforeCreate() {
    this.$options.components.ComponentB = () => import('./componentB.vue')
  }
}
    </pre>
	</div>
</template>
