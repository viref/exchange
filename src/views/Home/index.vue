<template>
  <div class="container bootstrap-wrapper">
    <div class="row col-sm-12 col-md-8">
      <box class="tab">
        <p @click.prevent="selectTab('dotChart')" :class="{ active: tabItem==='dotChart' }" href="#dotChart">Dot Chart</p>
      </box>  
      <box class="tab">
        <p @click.prevent="selectTab('candleChart')" :class="{ active: tabItem==='candleChart' }" href="#candleChart">Candle Chart</p>
      </box>
    </div>
    <div class="row">
      <box class="col-sm-12 col-md-8">
        <h3>
          Chart
        </h3>
        <chart :tab-item="tabItem"/>
      </box>
      <div class="col-sm-12 col-md-4">
        <swap />
        <box>
          <ul v-if="slippageReceived" class="list-note">
            <li>Minimum received</li>
            <li><img src="../../assets/faq.png" class="faq" /></li>
            <li>{{ slippageReceived.toLocaleString() }} {{ coins[1].toUpperCase() }}</li>
          </ul>
          <ul v-if="currentPrice" class="list-note">
            <li>Current Price</li>
            <li>{{ currentPrice }} USDC/VREF</li>
          </ul>
          <ul class="list-note">
            <li>Price Impact</li>
            <li style="color: #53A548">< {{ slippage }}%</li>
          </ul>
          <ul class="list-note">
            <li>Liquidity Provider Fee</li>
            <li>{{ exchangeFee }} {{ coins[1].toUpperCase() }}</li>
          </ul>
          <div class="clear"></div>
        </box>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import Box from '../../components/Box';
import Swap from './Swap';
import Chart from './Chart';
export default {
  name: 'Home',
  components: {
    Box,
    Swap,
    Chart
  },
  data() {
    return {
      tabItem: 'dotChart'
    }
  },
  computed: {
    ...mapGetters(['isConnected', 'slippageReceived', 'slippage', 'coins', 'currentPrice']),
    exchangeFee() {
      return 0;//this.currency=='vref'?1:0.1;
    }
  },
  methods: {
    selectTab(tabItem) {
      this.tabItem = tabItem
    }
  }
}
</script>
<style scoped>
.list-note {
  width: 100%;
  height: 24px;
  margin-bottom: 20px;
}
.list-note:last-of-type {
  margin-bottom: 0px;
}
.list-note li {
  line-height: 24px;
  float: left;
  opacity: 0.8;
  margin-right: 6px;
}
.list-note li:last-child {
  float: right;
  opacity: 1;
  font-weight: 700;
}
.faq {
  float: left;
  margin-top: 3px;
  width: 20px;
}
.active {
  color: #FFF;
}
.tab p {
  cursor: pointer;
}
.tab p:not(.active) {
  color: grey;
}
.tab:first-child {
  margin-right: 10px;
}
</style>
