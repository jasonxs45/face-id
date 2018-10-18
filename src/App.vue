<template>
  <div id="app">
    <div id="nav">
      <router-link
        v-for="(item, index) in menus"
        :key="'menu-'+index"
        :to="item.path"
        class="nav-item"
        :exact="item.path !== '/home'"
      >{{item.text}}</router-link>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      menus: [
        {
          text: '近日来访',
          path: '/home'
        },
        {
          text: '客户管理',
          path: '/manage'
        },
        {
          text: '来访统计',
          path: '/statistic'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#app{
  font-size: p2r(30);
  #nav{
    position: fixed;
    width: 100%;
    left:0;
    bottom: 0;
    height: p2r(100);
    z-index: 10;
    font-size: 0;
    .nav-item{
      display: inline-block;
      width: 33.333%;
      text-align: center;
      font-size: p2r(30);
      vertical-align: top;
      line-height: p2r(100);
      transition: all .3s;
      &.router-link-active{
        background: #2c8ebb;
        color: #fff;
      }
    }
    & + .content{
      padding-bottom: p2r(100);
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
