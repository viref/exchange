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
      <button class="button" @click="swap">Xác nhận</button>
    </box>
</template>
<script type="text/javascript">
import { mapMutations, mapGetters } from 'vuex';
import CryptoInput from '../../components/CryptoInput';
import Box from '../../components/Box';
import helper from "../../helper";
import pool from "../../helper/pool";

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
	watch: {
		'values.0': {
			async handler(value) {
				// calculate swap token
				// price slippage
				this.calculate()
			}
		}
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
		swap() {
			let value1 = (BigInt(this.values[1])*BigInt(10**18)).toString();
			if ( this.coins[0]=='vref' ) return this.sellToken(this.values[0], value1);
			else return this.buyToken(this.values[0], value1);
		},
		calculate() {
			if ( this.timer ) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(this.doCalculate.bind(this), 1000);
		},
		async doCalculate() {
			if ( this.loading ) return false;
			if ( this.values[0]==0 ) return this.$set(this.values, 1, 0);
			this.loading = true;
			let _moneyInPool = BigInt(await this.VREF.methods._moneyInPool().call());
			let _tokenInPool = BigInt(await this.VREF.methods._tokenInPool().call());
			let delta;
			let method = 'buyToken';
			if ( this.coins[0]=='vref' ) { // vref to usd
  				delta = pool.sell(_tokenInPool, _moneyInPool, this.values[0]);
  				method = 'sellToken';
			} else {
  				let currentStep = parseInt(await this.VREF.methods.currentStep().call());
  				let state = parseInt(await this.VREF.methods.state().call());
  				let subIDOSold = BigInt(await this.VREF.methods.subIDOSold().call());
				delta = pool.buy(_tokenInPool, _moneyInPool, currentStep, state, subIDOSold, this.values[0]);
			}

			this.loading = false;
			return this.$set(this.values, 1, delta);
		},
		async buyToken(amount, expected=0) {
			if ( !amount ) return;
			this.loading = true;
			let from = this.accounts[0];
			amount = BigInt(parseFloat(amount) * 10**this.USDC.decimals).toString();
			let approved = await this.USDC.methods.allowance(from, this.vref.address).call({ from });
			if ( !approved || parseFloat(approved)<amount ) {
				let approve = await this.USDC.methods.approve(this.vref.address, amount).send({ from });
				if ( !approve || !approve.status ) {
					this.loading = false;
					this.error = "Contract cannot access your money";
					return false;
				}
			}
	        this.VREF.methods.buyToken(amount, expected).send({ from }).then(result => {
	        	let status = result.status;
	        	if ( status ) window.location.reload();
	        }).finally(e => {
	        	this.loading = false;
	        });
	    },
		async sellToken(amount, expected=0) {
			let from = this.accounts[0];
			if ( !amount ) return;
			this.loading = true;
			amount = BigInt(parseFloat(amount) * 10**this.VREF.decimals).toString();
			let approved = await this.VREF.methods.allowance(from, this.vref.address).call({ from });
			if ( !approved || parseFloat(approved)<amount ) {
				let approve = await this.VREF.methods.approve(this.vref.address, amount).send({ from });
				if ( !approve || !approve.status ) {
					this.loading = false;
					this.error = "Contract cannot access your money";
					return false;
				}
			}

	        this.VREF.methods.sellToken(amount, expected || 0).send({ from }).then(result => {
	        	let status = result.status;
	        	if ( status ) window.location.reload();
	        }).finally(e => {
	        	this.loading = false;
	        });
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
	opacity: 0.5;
  background: linear-gradient(98.58deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 12px;
  padding: 10px 13px;
  display: inline-block;
  margin: 0 auto 20px auto;
}
.btn-switch:hover {
	opacity: 1;
}
.btn-switch:hover img {
	transform: rotate(180deg);
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