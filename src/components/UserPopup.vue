<template>
	<div class="popup">
	    <div class="popup-content">
	      <h3>My Account</h3>
	      <div class="address">
	        <strong>Wallet address</strong>
	        <div class="address-content">{{ accounts[0] }}
	          <a class="copy-container" href="#copy" @click.prevent="copyAddress"><IconButton class="icon-copy"></IconButton></a>
	        </div>
	        <div class="wallet-currency">
	          <div class="label">USDC</div>
	          <div class="value">{{ usdcBalance }}</div>
	        </div>
	        <div class="wallet-currency">
	          <div class="label">VREF</div>
	          <div class="value">{{ vrefBalance }}</div>
	        </div>
	        <a class="disconnect" href="#logout" @click.prevent="disconnectWallet">Disconnect account</a>
	      </div>
	    </div>
	</div>
</template>
<script type="text/javascript">
import IconButton from './IconButton';
import { mapGetters } from 'vuex';
import helper from "../helper";
import functions from "../helper/functions"

export default {
	components: { IconButton },
	data() {
		return {
			usdcBalance: 0,
			vrefBalance: 0
		}
	},
	computed: {
		...mapGetters(['accounts']),
	},
	methods: {
		async loadBalance() {
			this.usdcBalance = functions.formatMoney(window.web3.utils.fromWei(await this.getBalance('usdc', this.accounts[0])));
			this.vrefBalance = functions.formatMoney(window.web3.utils.fromWei(await this.getBalance('vref', this.accounts[0])));
		},
		copyAddress() {
			functions.copyToClipboard(this.accounts[0]);
		}
	},
	mounted() {
		this.loadBalance();
	},
	mixins: [helper]
}
</script>
<style scoped>
.popup {
  display: none;
  position: absolute;
  top: 40px;
  right: 0;
  width: 400px;
  padding-top: 10px;
  z-index: 100;
}
.popup-content {
  background: #192E38;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.right-item:hover .popup {
  display: block;
}
.popup .address {
  color: rgba(255, 255, 255, 0.8);
}
.popup .address-content {
  background: linear-gradient(98.58deg, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0.08) 100%);
  padding: 8px 12px;
  margin: 10px 0;
  border-radius: 6px;
  max-width: 100%;
  overflow: hidden;
  font-size: 14px;
  position: relative;
}
.address-content .copy-container {
	display: block;
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  height: 100%;
  line-height: 30px;
  padding: 0 10px;
}
.right-item:hover .popup {
  display: block;
}
.wallet-currency {
  height: 20px;
  line-height: 20px;
  margin: 10px 0;
}
.wallet-currency .label {
  float: left;
}
.wallet-currency .value {
  float: right;
  font-weight: 700;
  color: #fff;
}
.icon-copy {
  margin-top: 4px;
  margin-right: 0 !important;
}
.disconnect {
  display: block;
  width: 100%;
  line-height: 30px;
  border-radius: 16px;
  border: 1px solid rgba(255, 65, 65, 1);
  text-align: center;
  margin-top:  20px;
}
.disconnect:hover {
  color: rgba(255, 65, 65, 1);
  cursor: pointer;
}
</style>