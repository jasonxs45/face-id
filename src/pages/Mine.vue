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
                <van-tag :type="item.State? 'success' : 'danger'" class="tag">{{item.State? '跟进中' : '未跟进'}}</van-tag>
              </p>
              <a class="guest-tel" :href="'tel:'+item.Mobile">{{item.Mobile}}</a>
              <p class="guest-time">{{item.date}}</p>
            </div>
            <div class="operate-box">
              <van-icon class="icon" name="add-o" @click="showBox(index)"></van-icon>
              <a class="text" @click="checkRecord(index)">来访记录</a>
            </div>
          </van-row>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="show" :overlay="false" position="bottom">
      <div class="form-wrapper">
        <div class="form-container">
          <h3 class="title">添加来访记录</h3>
          <van-row class="row van-hairline--bottom">
            <van-field
              v-model="bakinfo"
              :autosize="autosize"
              clearable
              placeholder="请填写备注"
              type="textarea"
              class="bakinfo"
            ></van-field>
          </van-row>
        </div>
        <div class="btns">
          <van-button :disabled="submiting" type="primary" size="large" class="submit" @click="submit">添加</van-button>
          <van-button type="primary" plain size="large" @click="hideBox" class="back">返回</van-button>
        </div>
      </div>
    </van-popup>
    <van-dialog v-model="recordShow">
      <div class="record-wrapper">
        <h3 class="title">来访记录</h3>
        <div class="content">
          <template v-if="recordList.length > 0">
            <van-row v-for="(item, index) in recordList" :key="'rl-'+index" type="flex" justify="space-between" class="record">
              <van-col class="text">{{item.text}}</van-col>
              <van-col class="time">{{item.date}}</van-col>
            </van-row>
          </template>
          <div v-else class="norecord">暂无记录！</div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import api from 'common/api'
import Vue from 'vue'
import { PullRefresh, List, Lazyload, Row, Col, Icon, Tag, Popup, Button, Field, Dialog } from 'vant'
Vue.use(PullRefresh).use(List).use(Lazyload).use(Row).use(Col).use(Icon).use(Tag).use(Popup).use(Button).use(Field).use(Dialog)
export default {
  name: 'Mine',
  data () {
    return {
      refreshing: false,
      loading: false,
      totalCount: 0,
      show: false,
      submiting: false,
      bakinfo: '',
      id: '',
      autosize: {
        minHeight: 50,
        maxHeight: 200
      },
      list: [],
      pageIndex: 0,
      recordShow: false,
      recordList: []
    }
  },
  computed: {
    finished () {
      return Boolean(this.totalCount) && (this.list.length >= this.totalCount)
    }
  },
  methods: {
    showBox (index) {
      this.show = true
      this.id = this.list[index].ID
    },
    hideBox () {
      this.show = false
    },
    submit () {
      this.submiting = true
      this.$toast.loading({
        message: '提交中',
        duration: 0
      })
      api.fetch({
        work: 'addremark',
        id: this.id,
        remark: this.bakinfo
      }).then(res => {
        this.submiting = false
        if (res.data.Success) {
          this.$toast.success('添加成功')
        } else {
          this.$toast(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
        this.$toast.clear()
        this.$toast('网络错误，请稍后重试')
      })
    },
    load () {
      return api.fetch({
        work: 'getcustinfo',
        pagesize: 15,
        indexpage: this.pageIndex
      })
    },
    onLoad () {
      if (!this.finished) {
        this.pageIndex += 1
        this.load().then(res => {
          this.loading = false
          if (res.data.Success) {
            this.totalCount = res.data.count
            this.list = this.list.concat(res.data.data)
          }
        }).catch(err => {
          console.log(err)
          this.$toast('网络错误，请稍后重试！')
        })
      }
    },
    onRefresh () {
      this.pageIndex = 1
      this.load().then(res => {
        this.refreshing = false
        if (res.data.Success) {
          this.list = res.data.data
        }
      })
    },
    checkRecord (index) {
      this.recordList = []
      this.$toast.loading({
        message: '加载中'
      })
      let id = this.list[index].ID
      api.fetch({
        work: 'getcust',
        id
      }).then(res => {
        this.$toast.clear()
        if (res.data.Success) {
          this.recordList = res.data.Data.map(item => {
            let arr = item.split('|')
            item = {
              text: arr[0],
              date: arr[1]
            }
            return item
          })
          this.recordShow = true
        }
      }).catch(err => {
        this.$toast.clear()
        console.log(err)
      })
    }
  },
  activated () {
    console.log('mine actived')
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
.form-wrapper{
  width: 100%;
  height: 100vh;
  padding: rpx(30) rpx(30) rpx(320);
  background: #fff;
  position: relative;
  .form-container{
    padding-top: rpx(30);
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .row{
      margin-top: rpx(60);
    }
    .bakinfo{
      border:1px solid #ddd;
      border-radius: 4px;
    }
  }
  .btns{
    position: absolute;
    width: 90%;
    bottom: 0;
    left: 5%;
    background: #fff;
    padding: rpx(30) 0;
    .submit,
    .back{
      margin: rpx(15) auto;
    }
  }
  .title{
    font-size: rpx(36);
    text-align: center;
    margin: rpx(30) 0;
  }
}
.record-wrapper{
  padding: rpx(20);
  min-height: rpx(300);
  .title{
    text-align: center;
    font-size: rpx(30);
    color: #555;
    padding: rpx(20) 0;
  }
  .content{
    padding: rpx(10);
  }
  .record{
    font-size: rpx(26);
    color: #333;
    margin: rpx(40) 0 0;
    line-height: 1.5;
    .text{
      margin-right: rpx(10);
    }
    .time{
      width: rpx(240);
      flex: 0 0 rpx(240);
    }
  }
  .norecord{
    font-size: rpx(36);
    text-align: center;
    margin: rpx(50) 0;
    color: #666;
    font-weight: 200;
  }
}
</style>
