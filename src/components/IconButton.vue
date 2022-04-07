<template>
	<a href="#copy" class="copy"></a>
</template>
<script type="text/javascript">
export default {
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
.copy, .addMetamask {
	display: block;
	float: right;
	width: 20px;
	height: 20px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	margin-right: 10px;
	opacity: 0.8;
}
.copy:hover, .addMetamask:hover {
	opacity: 1;
}
.copy {
	background-image: url("../assets/icon-copy.png");
}
</style>