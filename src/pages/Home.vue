<template>
  <div class="home">
    <div class="tabs">
      <router-link
        tag="div"
        v-for="(item, index) in tabs"
        :key="'tab-'+index"
        :to="item.path"
        class="tab-item"
      >{{item.text}}<span v-show="item.todos.length > 0" class="badge">{{item.todos.length}}</span>
      </router-link>
    </div>
    <div class=""></div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      tabs: [
        {
          text: '我的',
          path: '/home/mine',
          todos: [1, 2, 3]
        },
        {
          text: '未注册',
          path: '/home/unregistered',
          todos: [1, 2, 3]
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs{
  font-size: 0;
  height: rpx(90);
  box-shadow: 0 0 2px 0 rgba(0,0,0,.3);
  .tab-item{
    display: inline-block;
    width: 50%;
    font-size: rpx(28);
    text-align: center;
    height: rpx(90);
    line-height: rpx(90);
    position: relative;
    color: #888;
    .badge{
      font-size: 70%;
      display: inline-block;
      background: #ff0000;
      padding:0 rpx(4);
      color:#fff;
      line-height: 1;
      border-radius: 40%;
      position: absolute;
      top: rpx(30);
      margin-left: rpx(10);
    }
    &.router-link-active{
      color: #2c8ebb;
      border-bottom: 1px solid #2c8ebb;
    }
  }
}
</style>
