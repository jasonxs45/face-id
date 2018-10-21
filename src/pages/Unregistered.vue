<template>
  <div class="unregistered">
    <div v-if="list.length > 0" v-for="(item, index) in list" :key="'item-'+index" class="item van-hairline--bottom">
      <row type="flex" justify="space-between" align="center">
        <img :src="item.avatar" class="avatar" alt="">
        <div class="guest-info">
          <p class="guest-time">{{item.date}}</p>
        </div>
        <div class="operate-box">
          <icon class="icon" name="add-o" @click="showBox"></icon>
        </div>
      </row>
    </div>
    <popup v-model="show" position="right">
      <div class="form-wrapper">
        <h3 class="title">注册客户</h3>
        <div class="form-container">
          <img class="avatar" v-if="list.length > 0" :src="list[0].avatar" alt="">
          <row class="row van-hairline--bottom">
            <Field
              v-model="name"
              required
              clearable
              placeholder="请输入姓名"
              class="name"
            />
            <radio-group v-model="gander" class="radio-group">
              <radio class="radio" name="男">男</radio>
              <radio class="radio" name="女">女</radio>
            </radio-group>
          </row>
          <row class="row van-hairline--bottom">
            <Field
              v-model="tel"
              required
              clearable
              placeholder="请输入手机号码"
              type="tel"
            />
          </row>
          <row class="row">
            <label v-for="(item, index) in types" :key="'type-'+index" class="x-radio">
              <input class="input" type="radio" name="type" :value="item">
              <span class="text">{{item}}</span>
            </label>
          </row>
        </div>
        <Button type="primary" size="large" class="submit">注册</Button>
      </div>
    </popup>
  </div>
</template>
<script>
import api from 'common/api'
// import Vue from 'vue'
import { Row, CellGroup, Icon, Popup, Field, Button, Radio, RadioGroup } from 'vant'
// Vue.use(Row).use(Icon).use(Popup).use(VanButton)
export default {
  name: 'Unregistered',
  components: {
    Row,
    CellGroup,
    Icon,
    Popup,
    Field,
    Button,
    Radio,
    RadioGroup
  },
  data () {
    return {
      list: [],
      show: false,
      name: '',
      gander: '',
      tel: '',
      types: ['客户', '员工', '供应商', '黑名单', '其他']
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
    },
    showBox () {
      this.show = true
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
  width: 92vw;
  height: 100vh;
  padding: rpx(30);
  background: #fff;
  position: relative;
  .form-container{
    margin-top: rpx(60);
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
  .submit{
    position: absolute;
    width: 90%;
    bottom: rpx(60);
    left: 5%;
  }
  .title{
    font-size: rpx(36);
    text-align: center;
    margin: rpx(30) 0;
  }
}
</style>
