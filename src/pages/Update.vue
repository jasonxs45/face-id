<template>
  <div class="update">
    <van-panel class="panel">
      <van-row slot="header" type="flex" justify="space-between" class="header van-hairline--bottom">
        <h3 class="tit">
          {{charactor.Name}}
          <span class="sub-tit">{{charactor.Sex === '男' ? '先生' : '女士'}}</span>
          <a :href="'tel:'+charactor.Mobile" class="tel">{{charactor.Mobile}}</a>
        </h3>
        <van-tag plain type="success">{{charactor.CustProess[0][0]}}</van-tag>
      </van-row>
      <div class="body">
        <van-row type="flex">
          <p class="tit">意向房源：</p>
          <p class="admire">{{charactor.CustHouse}}</p>
        </van-row>
        <van-row type="flex"  class="steps-wrapper">
          <div>
            <p class="tit">客户进度：</p>
          </div>
          <van-steps direction="vertical" :active="0" active-color="#2c8ebb">
            <van-step v-for="(item, index) in charactor.CustProess" :key="'step-'+index">
              <p class="step-desc">{{item[0]}}<span class="time">{{item[1]}}</span></p>
            </van-step>
          </van-steps>
        </van-row>
      </div>
    </van-panel>
    <van-panel title="更改状态" class="panel">
      <div class="body">
        <van-row gutter="10">
          <van-col v-for="(item, index) in states" :key="'state-'+index" span="8">
            <label class="radio">
              <input v-model="state" class="input" type="radio" name="state" :value="item"/>
              <div class="text"><span class="cell">{{item}}</span></div>
            </label>
          </van-col>
        </van-row>
      </div>
    </van-panel>
    <van-panel title="备注" class="panel">
        <van-field
          v-model="bakinfo"
          :autosize="autosize"
          clearable
          placeholder="请填写备注"
          type="textarea"
          class="bakinfo"
        ></van-field>
    </van-panel>
    <div class="btns">
      <van-button type="primary" size="large" class="submit" @click="updateState">更新</van-button>
      <van-button type="default" size="large" class="cancel" @click="$router.go(-1)">取消</van-button>
    </div>
  </div>
</template>
<script>
import api from 'common/api'
import cloneDeep from 'clone-deep'
import { mapState } from 'vuex'
import Vue from 'vue'
import { Row, Col, Panel, Tag, Steps, Step, Field, Button } from 'vant'
Vue.use(Row).use(Col).use(Panel).use(Tag).use(Steps).use(Step).use(Field).use(Button)
export default {
  name: 'Update',
  data () {
    return {
      name: '测试',
      sex: '女',
      tel: '15988990099',
      state: null,
      states: ['新客户', '无效客户', '来访', '认筹', '认购', '签约'],
      bakinfo: '',
      autosize: {
        minHeight: 50,
        maxHeight: 200
      }
    }
  },
  computed: {
    ...mapState('mine', [
      'list'
    ]),
    index () {
      return parseInt(this.$route.params.index)
    },
    charactor () {
      let obj = cloneDeep(this.list[this.index])
      obj.CustProess = obj.CustProess.split(',')
      obj.CustProess = obj.CustProess.map(ele => {
        ele = ele.split('|')
        return ele
      })
      return obj
    }
  },
  methods: {
    updateState () {
      if (!this.state) {
        this.$toast('请选择状态')
        return
      }
      api.fetch({
        work: 'updateState',
        state: this.state,
        id: this.charactor.ID
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
.update{
  background: #f1f1f1;
  min-height: 100%;
  padding: rpx(15) rpx(15) rpx(320);
  .panel{
    margin: rpx(15) 0;
    &:first-child{
      margin-top: 0;
    }
    .header{
      padding: rpx(20) rpx(30);
      .tit{
        font-size: rpx(30);
        color: #333;
        .sub-tit{
          font-size: 80%;
          color: #777;
        }
        .tel{
          margin-left: rpx(10);
          font-size: 80%;
          color: #777;
        }
      }
    }
    .body{
      padding: rpx(10) rpx(30);
      .tit{
        font-size: rpx(26);
        margin-top: rpx(20);
        color: #666;
      }
      .admire{
        font-size: rpx(28);
        margin-top: rpx(20);
      }
      .step-desc{
        font-size: rpx(26);
        .time{
          margin-left: rpx(10);
          font-size: 80%;
        }
      }
    }
    .footer{
      text-align: right;
    }
  }
  .radio{
    position: relative;
    display: block;
    .input{
      position: absolute;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      opacity: 0;
      &:checked + .text{
        background: #2c8ebb;
        color: #fff;
      }
    }
    .text{
      display: table;
      width: 100%;
      text-align: center;
      border: 1px solid #2c8ebb;
      height: rpx(80);
      border-radius: rpx(4);
      margin: rpx(10) 0;
      color: #2c8ebb;
      overflow: hidden;
      .cell{
        display: table-cell;
        vertical-align: middle;
        font-size: rpx(24);
      }
    }
  }
  .btns{
    background: #f1f1f1;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    padding: rpx(15);
    .submit,
    .cancel{
      margin: rpx(30) 0;
    }
    .cancel{
      margin-top: 0;
    }
  }
}
</style>
