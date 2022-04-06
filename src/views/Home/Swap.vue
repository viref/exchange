<template>
	<box title="Swap">
      <h3>
        Swap
        <a href="#" class="setting"><img src="../../assets/setting.png"></a>
      </h3>
      <crypto-input :currency="coins[0]" v-model="values[0]"
      	label="From" :set-max="isConnected ? setMax : null"
      	:disabled="!isConnected" :contract="getConfig(coins[0])" />
      <div style="text-align: center;">
      	<a class="btn-switch" href="#" v-on:click.prevent.stop="switchCoin" title="Switch token">
      		<div style="width: 20px; height: 20px; text-align: center; line-height: 20px;">
	      		<loading v-if="loading" />
	      		<img v-else src="../../assets/arrow-down.png">
	      	</div>
      	</a>
      </div>
      <crypto-input :currency="coins[1]" :value="values[1]" label="To" :disabled="!isConnected || loading" :contract="getConfig(coins[1])" />
      <div class="note">The value received is estimated.</div>
      <button v-if="isConnected" class="button" @click="swap" :disabled="loading">{{ loading?'Đang xử lý':'Chuyển đổi' }}</button>
      <button v-else class="button" @click="connectWallet">Connect wallet</button>
    </box>
</template>
<script type="text/javascript">
import { mapMutations, mapGetters } from 'vuex';
import CryptoInput from '../../components/CryptoInput';
import Box from '../../components/Box';
import Loading from '../../components/Loading';
import helper from "../../helper";
import pool from "../../helper/pool";

export default {
	components: {
	    Box, CryptoInput, Loading
	},
	data() {
		return {
			loading: false,
			timer: null
		}
	},
	computed: {
		...mapGetters(['accounts', 'coins', 'values', 'slippageReceived'])
	},
	watch: {
		'values.0': {
			async handler(value) {
				if ( !this.loading )
					this.calculate()
			}
		},
		'values.1': {
			async handler(value) {
				this.$emit("update", [value, this.coins[0]]);
			}
		}
	},
	methods: {
		...mapMutations(['setValues']),
		async setMax() {
			this.loading = true;
			let value = await this[this.coins[0].toUpperCase()].methods.balanceOf(this.accounts[0]).call();
			value /= 10**(this[this.coins[0].toUpperCase()].decimals);
			this.$set(this.values, 0, parseInt(value));
			this.loading = false;
			this.doCalculate();
		},
		switchCoin() {
			this.coins.reverse()
			this.setValues([0, 0])
		},
		swap() {
			let expected = BigInt(parseFloat(this.values[1])*10**this.VREF.decimals).toString();
			if ( this.coins[0]=='vref' ) return this.sellToken(this.values[0], expected).finally(e => this.loading = false);
			else return this.buyToken(this.values[0], expected).finally(e => this.loading = false);
		},
		calculate() {
			if ( this.timer ) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(this.doCalculate.bind(this), 1000);
		},
		async doCalculate() {
			if ( this.loading ) return false;
			if ( !this.values[0] ) return this.setValues([0, 0]);
			this.loading = true;
			let _moneyInPool = (await this.VREF.methods._moneyInPool().call())/10**this.VREF.decimals;
			let _tokenInPool = (await this.VREF.methods._tokenInPool().call())/10**this.VREF.decimals;
			let delta;
			let method = 'buyToken';
			if ( this.coins[0]=='vref' ) { // vref to usd
  				delta = pool.sell(_tokenInPool, _moneyInPool, this.values[0]);
  				method = 'sellToken';
			} else {
				let currentStep = parseInt(await this.VREF.methods.currentStep().call());
				let state = parseInt(await this.VREF.methods.state().call());
				let subIDOSold = await this.VREF.methods.subIDOSold().call()/10**this.VREF.decimals;
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
			try {
				let approved = await this.USDC.methods.allowance(from, this.vref.address).call({ from });
				if ( !approved || parseFloat(approved)<amount ) {
					let approve = await this.USDC.methods.approve(this.vref.address, amount).send({ from });
					if ( !approve || !approve.status ) {
						this.loading = false;
						this.error = "Contract cannot access your money";
						return false;
					}
				}
				await this.getEstimateGas('buyToken', amount, expected);
				this.VREF.methods.buyToken(amount, expected).send({ from }).then(result => {
					let status = result.status;
					if ( status ) window.location.reload();
				}).finally(e => {
					this.loading = false;
				});
			} catch (error) {
				alert(error.message)
			}
		},
		async sellToken(amount, expected=0) {
			let from = this.accounts[0];
			if ( !amount ) return;
			this.loading = true;
			amount = BigInt(parseFloat(amount) * 10**this.VREF.decimals).toString();
			try {
				await this.getEstimateGas('sellToken', amount, expected || 0)
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
			} catch (error) {
				console.log(error)
			}
		},
		getConfig(name) {
			return this[name] || {};
		}
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
  padding: 0 2px;
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
.button:disabled {
	opacity: 0.5;
}
</style>
