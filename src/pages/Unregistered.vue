<template>
  <div class="unregistered">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div v-if="list.length > 0" v-for="(item, index) in list" :key="'item-'+index" class="item van-hairline--bottom">
          <van-row type="flex" justify="space-between" align="center">
            <img v-lazy="item.ImgUrl" :src="item.ImgUrl" class="avatar" alt="">
            <div class="guest-info">
              <p class="guest-time">时间：{{item.LoginTime|fmt}}</p>
            </div>
            <div class="operate-box">
              <van-icon class="icon" name="add-o" @click="showBox(index)"></van-icon>
            </div>
          </van-row>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="show" :overlay="false" position="bottom">
      <div class="form-wrapper">
        <div class="form-container">
          <h3 class="title">注册客户</h3>
          <img class="avatar" v-if="list.length > 0" :src="role.avatar" alt="">
          <van-row class="row van-hairline--bottom">
            <van-field
              v-model="name"
              required
              clearable
              :error="nameCheck"
              placeholder="请输入姓名"
              class="name"
            ></van-field>
            <van-radio-group v-model="gander" class="radio-group">
              <van-radio class="radio" name="男">男</van-radio>
              <van-radio class="radio" name="女">女</van-radio>
            </van-radio-group>
          </van-row>
          <van-row class="row van-hairline--bottom">
            <van-field
              v-model="tel"
              required
              clearable
              :error="telCheck"
              placeholder="请输入手机号码"
              type="tel"
            ></van-field>
          </van-row>
          <van-row class="row">
            <label v-for="(item, index) in types" :key="'type-'+index" class="x-radio">
              <input v-model="type" class="input" type="radio" name="type" :value="item.val">
              <span class="text">{{item.desc}}</span>
            </label>
          </van-row>
        </div>
        <div class="btns">
          <van-button :disabled="submiting" type="primary" size="large" class="submit" @click="submit">注册</van-button>
          <van-button type="primary" plain size="large" @click="hideBox" class="back">返回</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import api from 'common/api'
import { formatDate } from 'common/utils/date'
import { NAME_REG, TEL_REG } from 'common/utils/reg'
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import { PullRefresh, List, Row, Icon, Popup, Field, Button, Radio, RadioGroup, Lazyload } from 'vant'
Vue.use(PullRefresh).use(List).use(Row).use(Icon).use(Popup).use(Button).use(Radio).use(RadioGroup).use(Field).use(Lazyload)
export default {
  name: 'Unregistered',
  data () {
    return {
      refreshing: false,
      loading: false,
      totalCount: 0,
      show: false,
      role: {
        avatar: '',
        guid: '',
        id: ''
      },
      name: '',
      gander: '',
      tel: '',
      type: '',
      submiting: false,
      types: [
        { desc: '员工', val: 1 },
        { desc: '客户', val: 2 }
      ]
      // types: ['客户', '员工', '供应商', '黑名单', '其他']
    }
  },
  computed: {
    ...mapState('unregistered', [
      'list',
      'pageIndex'
    ]),
    finished () {
      return Boolean(this.totalCount) && (this.list.length >= this.totalCount)
    },
    nameCheck () {
      return !this.name.match(NAME_REG)
    },
    telCheck () {
      return !this.tel.match(TEL_REG)
    }
  },
  filters: {
    fmt (str) {
      let date = new Date(str)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    showBox (index) {
      this.show = true
      this.role.avatar = this.list[index].ImgUrl
      this.role.guid = this.list[index].Guid
      this.role.id = this.list[index].ID
    },
    hideBox () {
      this.show = false
    },
    submit () {
      if (this.nameCheck) {
        this.$toast('请输入正确格式的姓名')
        return
      }
      if (!this.gander) {
        this.$toast('请选择性别')
        return
      }
      if (this.telCheck) {
        this.$toast('请输入正确格式的手机号码')
        return
      }
      if (!this.type) {
        this.$toast('请选择访客类型')
        return
      }
      this.submiting = true
      this.$toast.loading({
        message: '提交中',
        duration: 0
      })
      api.fetch({
        guid: this.role.guid,
        id: this.role.id,
        work: 'addpeople',
        imgurl: this.role.avatar,
        name: this.name,
        sex: this.gander,
        mobile: this.tel,
        type: this.type
      }).then(res => {
        this.submiting = false
        if (res.data.Success) {
          this.$toast.success('提交成功')
        } else {
          this.$toast(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
        this.$toast.clear()
        this.$toast('网络错误，请稍后重试')
      })
    },
    ...mapMutations('unregistered', [
      'resetList',
      'concatList',
      'setPageIndex'
    ]),
    ...mapActions('unregistered', [
      'load'
    ]),
    onLoad () {
      this.load().then(res => {
        this.loading = false
        if (res.data.Success) {
          this.totalCount = res.data.count
          this.concatList(res.data.data)
          this.setPageIndex()
          // if (!this.finished) {}
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
  },
  created () {
    // this.fetchList()
    // this.concatList()
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
    .guest-time{
      font-size: rpx(28);
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
    .avatar{
      width: rpx(200);
      height: rpx(200);
      display: block;
      margin: rpx(60) auto;
    }
    .row{
      margin-top: rpx(60);
    }
    .name{
      width: 50%;
      display: inline-block;
    }
    .radio-group{
      width: 50%;
      display: inline-block;
      text-align: right;
    }
    .radio{
      display: inline-block;
      margin-left: rpx(20);
    }
    .x-radio{
      position: relative;
      display: inline-block;
      width: 20%;
      height: rpx(80);
      padding: 0 rpx(10);
      .input{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        &:checked+.text{
          background: #2c8ebb;
          color:#fff;
        }
      }
      .text{
        display: block;
        width: 100%;
        height: 100%;
        line-height: rpx(80);
        border:1px solid #2c8ebb;
        text-align: center;
        font-size: rpx(28);
        border-radius: 4px;
        color: #2c8ebb;
      }
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
</style>
