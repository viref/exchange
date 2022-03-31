<template>
	<div class="loading">
      <div class="loading-container">
        <lottie-animation :width="50" :height="50"
        ref="anim" :loop="true" :autoPlay="true"
        :animationData="require('@/assets/loading.json')"
      /></div>
    </div>
</template>
<script type="text/javascript">
import LottieAnimation from 'lottie-web-vue'
export default {
  components: {,
		LottieAnimation
	},
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
.loading {
  width: 200px;
  height: 200px;
  overflow: hidden;
  position: relative;
}
.loading-container {
  width: 400px;
  height: 400px;
  position: absolute;
  left: -100px;
  top: -50px;
}
</style>