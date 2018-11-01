<template>
  <div class="mine">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div v-if="list.length > 0" v-for="(item, index) in list" :key="'item-'+index" class="item van-hairline--bottom">
          <van-row type="flex" justify="space-between">
            <img v-lazy="item.ImgUrl" :src="item.ImgUrl" class="avatar" alt="">
            <div class="guest-info">
              <p class="guest-name">
                <span class="name">{{item.Name}}</span>
                <van-tag :type="item.state? 'danger' : 'success'" class="tag">{{item.state? '未跟进' : '跟进中'}}</van-tag>
              </p>
              <a class="guest-tel" :href="'tel:'+item.Mobile">{{item.Mobile}}</a>
              <p class="guest-time">{{item.date}}</p>
            </div>
            <div class="operate-box">
              <van-icon class="icon" name="add-o"></van-icon>
              <a class="text">来访记录</a>
            </div>
          </van-row>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
// import api from 'common/api'
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import { PullRefresh, List, Row, Icon, Tag } from 'vant'
Vue.use(PullRefresh).use(List).use(Row).use(Icon).use(Tag)
export default {
  name: 'Mine',
  data () {
    return {
      refreshing: false,
      loading: false,
      totalCount: 0
    }
  },
  computed: {
    ...mapState('mine', [
      'list',
      'pageIndex'
    ]),
    finished () {
      return Boolean(this.totalCount) && (this.list.length >= this.totalCount)
    }
  },
  created () {
    // this.fetchList()
  },
  methods: {
    ...mapMutations('mine', [
      'resetList',
      'concatList',
      'setPageIndex'
    ]),
    ...mapActions('mine', [
      'load'
    ]),
    onLoad () {
      this.load().then(res => {
        this.loading = false
        if (res.data.Success) {
          this.totalCount = res.data.count
          this.concatList(res.data.data)
          if (!this.finished) {
            this.setPageIndex()
          }
        }
      })
    },
    onRefresh () {
      this.setPageIndex('reset')
      this.load().then(res => {
        this.refreshing = false
        if (res.data.Success) {
          this.resetList(res.data.data)
          if (!this.finished) {
            this.setPageIndex()
          }
        }
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
