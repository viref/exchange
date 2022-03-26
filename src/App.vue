<template>
  <div id="app">
    <div class="header">
      <div class="container">
        <a href="https://viref.net" class="logo"><img src="./assets/viref-logo.png" /></a>
        <ul class="menu">
          <li><a href="" class="active">Trang chủ</a></li>
          <li><a href="">Blogs</a></li>
          <li><a href="">Liên hệ</a></li>
          <li><a href="">Về chúng tôi</a></li>
          <li><a href="">Whitepaper</a></li>
        </ul>
        <div class="right-item">
          <a class="button" href="#">
            Liên kết ví
          </a>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <router-view/>
  </div>
</template>
<script>
import './assets/reset.css';
import './assets/grid.css';

export default {

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
}

.logo {
  float: left;
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
  padding: 10px 20px;
}
.menu a {
  opacity: 0.7;
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
}

.button {
  display: block;
  border: 1px solid #FFFFFF;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 700;
}
</style>
