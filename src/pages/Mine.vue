<template>
  <div class="mine">
    <div v-if="list.length > 0" v-for="(item, index) in list" :key="'item-'+index" class="item van-hairline--bottom">
      <row type="flex" justify="space-between">
        <img :src="item.avatar" class="avatar" alt="">
        <div class="guest-info">
          <p class="guest-name">
            <span class="name">{{item.name}}先生</span>
            <tag :type="item.state? 'danger' : 'success'" class="tag">{{item.state? '未跟进' : '跟进中'}}</tag>
          </p>
          <a class="guest-tel" :href="'tel:'+item.tel">{{item.tel}}</a>
          <p class="guest-time">{{item.date}}</p>
        </div>
        <div class="operate-box">
          <icon class="icon" name="add-o"></icon>
          <a class="text">来访记录</a>
        </div>
      </row>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue'
import { Row, Icon, Tag } from 'vant'
import api from 'common/api'
// Vue.use(Row).use(Icon).use(Tag)

export default {
  name: 'Mine',
  components: {
    Row,
    Icon,
    Tag
  },
  data () {
    return {
      list: []
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      api.mock('/minelist').then(res => {
        this.list = res.data.List
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.item{
  padding: rpx(30);
  .avatar{
    width: rpx(120);
    height: rpx(120);
    object-fit: cover;
  }
  .guest-info{
    flex:1;
    padding: 0 rpx(30);
    .guest-name{
      .name{
        display: inline-block;
        vertical-align: middle;
        font-size: rpx(30);
      }
      .tag{
        vertical-align: middle;
        margin-left: rpx(10);
      }
    }
    .guest-tel{
      margin-top: rpx(15);
      line-height: 1;
      font-size: rpx(26);
      color: #333;
      display: block;
    }
    .guest-time{
      font-size: rpx(26);
      color: #888;
      margin-top: rpx(15);
    }
  }
  .operate-box{
    width: rpx(120);
    text-align: center;
    .icon{
      font-size: rpx(54);
      margin-top: rpx(10);
      color: #2c8ebb;
    }
    .text{
      display: block;
      font-size: rpx(28);
      margin-top: rpx(20);
    }
  }
}
</style>
