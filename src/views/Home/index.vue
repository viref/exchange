<template>
  <div class="container bootstrap-wrapper">
    <div class="row">
      <box class="col-sm-12 col-md-8">
        <h3>
          Biểu đồ giá theo thời gian
        </h3>
      </box>
      <div class="col-sm-12 col-md-4">
        <swap />
        <box>
          <ul class="list-note">
            <li>Tối thiểu nhận được</li>
            <li><img src="../../assets/faq.png" class="faq" /></li>
            <li>0.025 USDC</li>
          </ul>
          <ul class="list-note">
            <li>Chênh lệch giá</li>
            <li style="color: #53A548">+ 0.2%</li>
          </ul>
          <ul class="list-note">
            <li>Phí thanh khoản</li>
            <li>0.025 USDC</li>
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
export default {
  name: 'Home',
  components: {
    Box,
    Swap
  },
  computed: {
    ...mapGetters(['isConnected'])
  },
  methods: {
    setMax() {
      console.log("hello")
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