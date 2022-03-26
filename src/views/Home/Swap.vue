<template>
	<box title="Swap">
      <h3>
        Trao đổi
        <a href="#" class="setting"><img src="../../assets/setting.png"></a>
      </h3>
      <crypto-input :currency="coins[0]" :value="values[0]" :key="`0-${values[0]}`" label="Từ" :set-max="setMax" />
      <div style="text-align: center;"><a class="btn-switch" href="#" @click="switchCoin"><img src="../../assets/arrow-down.png"></a></div>
      <crypto-input :currency="coins[1]" :value="values[1]" :key="`1-${values[1]}`" label="Sang" />
      <div class="note">Giá trị nhận được chỉ mang tính chất tương đối do biến động tại thời điểm lệnh được thực thi.</div>
      <button class="button" href="">Xác nhận</button>
    </box>
</template>
<script type="text/javascript">
import { mapMutations, mapGetters } from 'vuex';
import CryptoInput from '../../components/CryptoInput';
import Box from '../../components/Box';
import helper from "../../helper";
export default {
	components: {
	    Box, CryptoInput
	},
	data() {
		return {
			coins: ["vref", "usdc"],
			values: [0, 0],
			loading: false
		}
	},
	computed: {
		...mapGetters(['accounts'])
	},
	methods: {
		async setMax() {
			this.loading = true;
			let value = await this[this.coins[0].toUpperCase()].methods.balanceOf(this.accounts[0]).call();
			value /= 10**(this[this.coins[0].toUpperCase()].decimals);
			this.loading = false;
			this.$set(this.values, 0, value);
		},
		switchCoin() {
			this.coins.reverse()
			this.values = [0, 0]
		},
	},
	mounted() {

	},
	mixins: [helper]
}
</script>
<style scoped>
.setting {
  float: right;
}
.setting img {
  width: 16px;
}
.btn-switch {
  background: linear-gradient(98.58deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 12px;
  padding: 10px 13px;
  display: inline-block;
  margin: 0 auto 20px auto;
}
.btn-switch img {
  width: 16px;
}
.note {
  margin-top:  30px;
  font-size: 13px;
  line-height: 15px;
  letter-spacing: 0.02em;
  text-align: center;
}
.button {
  background: linear-gradient(2.05deg, #B3E9FA -0.32%, #FDE9A3 120.46%);
  border-radius: 68px;
  color: #061D27;
  font-weight: 700;
  text-align: center;
  padding: 18px 0;
  margin-top: 30px;
  font-size: 18px;
  display: block;
  width: 100%;
  border: 0;
  cursor: pointer;
}
</style>