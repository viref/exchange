<template>
  <div class="container bootstrap-wrapper">
    <div class="row">
      <box class="col-sm-12 col-md-8">
        <h3>
          Biểu đồ giá theo thời gian
        </h3>
      </box>
      <div class="col-sm-12 col-md-4">
        <box title="Swap">
          <h3>
            Trao đổi
            <a href="#" class="setting"><img src="../assets/setting.png"></a>
          </h3>
          <crypto-input currency="vref" label="Từ" :set-max="setMax" />
          <div style="text-align: center;"><a class="btn-switch" href="#"><img src="../assets/arrow-down.png"></a></div>
          <crypto-input currency="usdc" label="Sang" />
          <div class="note">Giá trị nhận được chỉ mang tính chất tương đối do biến động tại thời điểm lệnh được thực thi.</div>
          <button class="button" href="">Xác nhận</button>
        </box>
        <box>
          <ul class="list-note">
            <li>Tối thiểu nhận được</li>
            <li><img src="../assets/faq.png" class="faq" /></li>
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
import Box from '../components/Box';
import CryptoInput from '../components/CryptoInput';
export default {
  name: 'Home',
  components: {
    Box,
    CryptoInput
  },
  methods: {
    setMax() {
      console.log("hello")
    }
  }
}
</script>
<style scoped>
h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}
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