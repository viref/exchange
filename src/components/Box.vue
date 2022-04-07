<template>
	<div>
		<div class="box">
			<slot />
		</div>
	</div>
</template>
<script type="text/javascript">
export default {
	props: ["title"],
	data() {
		return {

		}
	},
	methods: {

	},
	mounted() {

	}
}
</script>
<style scoped>
.box {
	padding: 24px;
	background: linear-gradient(100.48deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%);
	backdrop-filter: blur(24px);
	border-radius: 24px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	margin-bottom: 20px;
	/*z-index: -1;
    position: relative;*/
}
</style>