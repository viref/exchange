<template>
  <div id="app">
    <div class="header">
      <div class="container">
        <a href="https://viref.net" class="logo"><img src="./assets/viref-logo.png" /></a>
        <ul class="menu">
          <!-- <li><a href="https://viref.net" class="active">Home</a></li> -->
          <li><a href="https://bscscan.com/address/0x2b7Cc0556F82A23e17eD47339081c0160CCC64FC#code" target="_blank">Contract</a></li>
          <li><a href="https://whitepaper.viref.net">Whitepaper</a></li>
        </ul>
        <div class="right-item" >
          <a class="outline-button" href="#" @click.prevent="connectWallet">
            <img src="./assets/wallet.png" />
            {{ buttonTitle }}
          </a>
          <user-popup v-if="accounts[0]" />
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <router-view />
  </div>
</template>
<script>
import './assets/reset.css';
import './assets/grid.css';
import helper from "./helper";
import { mapGetters } from 'vuex';
import truncateMiddle from 'truncate-middle';
import UserPopup from './components/UserPopup';

export default {
  components: { UserPopup },
  data() {
    return {
      loading: true,
      tab: 'contract',
      web3Modal: null,
      networkId: null,
      popupHidden: false
    }
  },
  computed: {
    ...mapGetters(['accounts']),
    isRightNetwork() {
      return this.usdc && this.usdc.address;
    },
    buttonTitle() {
      if ( this.accounts[0] ) return truncateMiddle(this.accounts[0], 5, 4, '...');
      else return 'Connect wallet'
    }
  },
  methods: {
  },
  mounted() {
    if ( window.ethereum ) {
      this.getAccounts().then(accounts => {
        if ( accounts.length ) 
          return this.connectWallet();
      }).catch(e => console.log(e)).finally(e => {
        this.loading = false;
      })
    } else {
      window.addEventListener('ethereum#initialized', this.detectEthereum, {
        once: true,
      });

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
      setTimeout(this.detectEthereum, 3000); // 3 seconds
    }
  },
  mixins: [helper]
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@300;600&display=swap');
html, body {
  height: 100vh;
  padding: 0;
  margin: 0;
}
html {
  background: url("./assets/Union.svg") center center repeat, 
              url("./assets/Vector.svg") left bottom no-repeat, 
              url("./assets/Star 4.svg") 80vw 10vh no-repeat,
              url("./assets/Star 3.svg") 70vw 20vh no-repeat #061D27;
  background-attachment: fixed;
}
body{
  font-family: 'Mulish', sans-serif;
  font-size: 16px;
  color: #fff;
  font-weight: 300;
}
a {
  color: #fff;
}
.clear {
  clear: both;
}

.container {
  width: 100%;
  max-width: 1394px;
  margin: 0 auto;
}

.header {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(80px);
  padding: 20px 0;
  color: white;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.logo {
  float: left;
  padding: 4px 0;
}
.logo img {
  width: 120px;
}
.menu {
  float: left;
  margin-left: 60px;
}
.menu li {
  float: left;
  padding: 0px 10px;
}
.menu a {
  opacity: 0.7;
  line-height: 42px;
  padding: 10px;
}
.menu a:hover {
  opacity: 1;
}
.menu li a.active {
  font-weight: 600;
  opacity: 1;
}
.right-item {
  float: right;
  position: relative;
}

.outline-button {
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 700;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  line-height: 24px;
}
.right-item:hover .outline-button {
  border: 1px solid rgba(255, 255, 255, 1);
}
.outline-button img {
  width: 24px;
  float: left;
  margin-right: 8px;
}
.box h3, .popup h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}
</style>
