<script>
import imported from "./testCssModules.module.css";

export default {
	data: () => ({ imported }),
};
</script>

<template>
	<div>
		<h2>CSS Modules</h2>
		<div class="css-modules-sfc" :class="$style.blue">
			&lt;style module&gt; - this should be blue
		</div>
		<div class="css-modules-import" :class="imported.turquoise">
			CSS modules import - this should be orange
		</div>
	</div>
</template>

<style module>
.blue {
	color: blue;
}
</style>
