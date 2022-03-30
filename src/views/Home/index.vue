<template>
  <div class="container bootstrap-wrapper">
    <div class="row">
      <box class="col-sm-12 col-md-8">
        <h3>
          Biểu đồ giá theo thời gian
        </h3>
        <chart />
      </box>
      <div class="col-sm-12 col-md-4">
        <swap @update="updateReceivedAmount" />
        <box>
          <ul v-if="received" class="list-note">
            <li>Tối thiểu nhận được</li>
            <li><img src="../../assets/faq.png" class="faq" /></li>
            <li>{{ slippageReceived }} {{ currency.toUpperCase() }}</li>
          </ul>
          <ul class="list-note">
            <li>Trượt giá tối đa</li>
            <li style="color: #53A548">+ {{ slippage }}%</li>
          </ul>
          <ul class="list-note">
            <li>Phí thanh khoản</li>
            <li>{{ exchangeFee }} {{ currency.toUpperCase() }}</li>
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
      currency: ''
    }
  },
  computed: {
    ...mapGetters(['isConnected', 'received', 'slippage']),
    slippageReceived() {
      return parseInt((this.received * (1-this.slippage/100))*100)/100
    },
    exchangeFee() {
      return this.currency=='vref'?1:0.1;
    }
  },
  methods: {
    setMax() {
      console.log("hello")
    },
    updateReceivedAmount(amount) {
      this.received = amount[0];
      this.currency = amount[1];
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
</style>