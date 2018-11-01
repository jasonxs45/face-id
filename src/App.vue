<template>
  <div id="app">
    <div id="nav">
      <router-link
        v-for="(item, index) in menus"
        :key="'menu-'+index"
        :to="item.path"
        class="nav-item"
        :exact="item.path !== '/home'"
      >
        <van-icon :name="item.icon"></van-icon>
        <p class="text">{{item.text}}</p>
      </router-link>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Icon } from 'vant'
Vue.use(Icon)
export default {
  name: 'App',
  data () {
    return {
      menus: [
        {
          text: '近日来访',
          icon: 'contact',
          path: '/home'
        },
        {
          text: '客户管理',
          icon: 'wap-home',
          path: '/manage'
        },
        {
          text: '来访统计',
          icon: 'pending-orders',
          path: '/statistic'
        }
      ]
    }
  },
  mounted () {
    // this.$toast.loading({
    //   duration: 0,
    //   message: '提示',
    //   forbidClick: true
    // })
  }
}
</script>

<style lang="scss" scoped>
#app{
  font-size: rpx(30);
  #nav{
    position: fixed;
    width: 100%;
    left:0;
    bottom: 0;
    height: rpx(100);
    z-index: 10;
    font-size: 0;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0,0,0,.2);
    .nav-item{
      display: inline-block;
      width: 33.333%;
      height: 100%;
      text-align: center;
      font-size: rpx(24);
      vertical-align: top;
      padding-top: rpx(20);
      // line-height: rpx(100);
      transition: all .3s;
      .text{
        margin-top: rpx(10);
      }
      &.router-link-active{
        background: #2c8ebb;
        color: #fff;
      }
    }
    & + .content{
      padding-bottom: rpx(100);
    }
  }
  .content{
    height: 100vh;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
