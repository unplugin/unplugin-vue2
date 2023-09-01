<script>
export default {
	name: "TestRecursiveTree",
	props: ["treedata"],
	methods: {
		isEmpty(data) {
			return !data || data.length === 0;
		},
	},
};
</script>

<template>
	<div class="test-recursive-tree">
		<div v-for="item in treedata" :key="item.label" class="test-recursive-item">
			<h5>{{ item.label }}</h5>

			<TestRecursiveTree
				v-if="!isEmpty(item.children)"
				:treedata="item.children"
			/>
		</div>
	</div>
</template>

<style scoped>
.test-recursive-item {
	padding-left: 10px;
}
</style>
