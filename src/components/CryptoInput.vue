<template>
	<div class="currency-input">
	  <div class="label">{{ label }}</div>
	  <div class="text-input">
	    <div class="currency">
	      <img :src="`/img/${currency}-mini.png`">
	      {{ currency.toUpperCase() }}
	    </div>
	    <input type="text" :disabled="disabled" :value="formatedValue" onclick="this.select()" 
	    	v-on:input="updateValue($event.target.value)" />
	    <a v-if="setMax" class="btn-max" href="#" @click="setMax">Max</a>
	    <div class="clear"></div>
	  </div>
	</div>
</template>
<script type="text/javascript">
export default {
	props: ['currency', 'label', 'setMax', 'value', 'disabled'],
	data() {
		return {

		}
	},
	computed: {
		formatedValue() {
			let value = this.value || 0;
    		return parseFloat(value).toLocaleString();
		}
	},
	methods: {
		updateValue(value) {
			value = value || "0";
			let n = parseFloat(value.replace(/\,/g,''));
			this.$emit('input', n)
		}
	},
	mounted() {

	}
}
</script>
<style scoped>
.currency-input {
	margin-bottom: 16px;
}
.currency-input .label {
  opacity: 0.8;
  font-size: 16px;
}
.currency-input .text-input {
  background: linear-gradient(90.51deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(24px);
  border-radius: 30px;
  margin: 8px 0px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.currency-input .currency {
  background: linear-gradient(98.58deg, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0.08) 100%);
  border: 1px solid rgba(18, 18, 18, 0.15);
  border-radius: 24px;
  float: left;
  padding: 8px 12px;
  line-height: 24px;
  font-weight: 700;
  margin-right: 10px;
}
.currency img {
  height: 24px;
  float: left;
  margin-right: 8px;
}
.text-input input {
  background: transparent;
  border: none;
  color: white;
  height: 42px;
  line-height: 42px;
  outline: none;
  -moz-appearance: textfield;
  font-size: 14px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.btn-max {
  background: #1D2F47;
  border: 1px solid #1A3558;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 4px 8px;
  float: right;
  margin-top: 8px;
  display: block;
}
</style>