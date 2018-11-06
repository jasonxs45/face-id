<template>
  <div class="manage">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div v-if="list.length > 0" v-for="(item, index) in transedList" :key="'item-'+index" class="item">
          <van-panel class="panel">
            <van-row slot="header" type="flex" justify="space-between" class="header van-hairline--bottom">
              <h3 class="tit">
                {{item.Name}}
                <span class="sub-tit">{{item.Sex === '男' ? '先生' : '女士'}}</span>
                <a :href="'tel:'+item.Mobile" class="tel">{{item.Mobile}}</a>
              </h3>
              <van-tag  v-if="item.CustProess.length>0&&item.CustProess[0].length > 0" plain type="success">{{item.CustProess[0][0]}}</van-tag>
            </van-row>
            <div class="body">
              <van-row v-if="item.CustHouse" type="flex">
                <p class="tit">意向房源：</p>
                <p class="admire">{{item.CustHouse}}</p>
              </van-row>
              <van-row v-if="item.CustProess.length>0&&item.CustProess[0].length > 0" type="flex"  class="steps-wrapper">
                <div>
                  <p class="tit">客户进度：</p>
                </div>
                <van-steps direction="vertical" :active="0" active-color="#2c8ebb">
                  <!-- <van-step v-for="(step, index1) in item.CustProess" :key="'step-'+index1">
                    <p class="step-desc">{{step[0]}}<span class="time">{{step[1]}}</span></p>
                  </van-step> -->
                  <van-step >
                    <p class="step-desc">{{item.CustProess[0][0]}}<span class="time">{{item.CustProess[0][1]}}</span></p>
                  </van-step>
                </van-steps>
              </van-row>
            </div>
            <div slot="footer" class="footer">
              <van-button type="primary" plain size="small" @click="showBox(index)">更新状态</van-button>
            </div>
          </van-panel>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="show" :overlay="false" position="bottom">
      <div class="form-wrapper">
        <div class="form-container">
          <van-panel v-if="charactor" class="panel">
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
        </div>
        <div class="btns">
          <van-button :disabled="submiting" type="primary" size="large" class="submit" @click="submit">添加</van-button>
          <van-button type="primary" plain size="large" @click="hideBox" class="back">返回</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import api from 'common/api'
import Vue from 'vue'
import { PullRefresh, List, Row, Col, Panel, Tag, Step, Steps, Button, Popup, Field } from 'vant'
Vue.use(PullRefresh).use(List).use(Row).use(Col).use(Panel).use(Tag).use(Step).use(Steps).use(Button).use(Popup).use(Field)
export default {
  name: 'Manage',
  data () {
    return {
      refreshing: false,
      loading: false,
      totalCount: 0,
      list: [],
      pageIndex: 0,
      show: false,
      bakinfo: '',
      state: '',
      states: ['新客户', '无效客户', '来访', '认筹', '认购', '签约'],
      autosize: {
        minHeight: 30,
        maxHeight: 70
      },
      submiting: false,
      targetIndex: 0
    }
  },
  computed: {
    finished () {
      return Boolean(this.totalCount) && (this.list.length >= this.totalCount)
    },
    transedList () {
      let target = this.list
      target.forEach(item => {
        if (!Array.isArray(item.CustProess)) {
          if (item.CustProess === null) {
            item.CustProess = [[]]
          } else {
            item.CustProess = item.CustProess.split(',')
            item.CustProess = item.CustProess.reverse()
            item.CustProess = item.CustProess.map(ele => {
              ele = ele.split('|')
              return ele
            })
          }
        }
      })
      return target
    },
    charactor () {
      return this.transedList[this.targetIndex]
    }
  },
  methods: {
    showBox (index) {
      this.show = true
      this.targetIndex = index
      this.state = ''
      this.bakinfo = ''
    },
    hideBox () {
      this.show = false
    },
    load () {
      return api.fetch({
        work: 'getcustinfo',
        pagesize: 15,
        indexpage: this.pageIndex
      })
    },
    submit () {
      if (!this.state) {
        this.$toast({
          message: '请选择状态'
        })
        return
      }
      this.submiting = true
      this.$toast.loading({
        message: '提交中',
        duration: 0
      })
      api.fetch({
        work: 'updatestate',
        id: this.charactor.ID,
        state: this.state,
        remark: this.bakinfo
      }).then(res => {
        this.submiting = false
        if (res.data.Success) {
          this.$toast.success('更新成功！')
          this.show = false
          // 前台修改数据
          res.data.Data.CustProess = res.data.Data.CustProess.split(',')
          res.data.Data.CustProess = res.data.Data.CustProess.reverse()
          res.data.Data.CustProess = res.data.Data.CustProess.map(ele => {
            ele = ele.split('|')
            return ele
          })
          this.transedList[this.targetIndex] = res.data.Data
          this.charactor.CustProess = res.data.Data.CustProess
        } else {
          this.$toast(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
        this.$toast.clear()
        this.$toast('网络错误，请稍后重试')
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
    }
  }
}
</script>
<style lang="scss" scoped>
.manage{
  background: #f1f1f1;
  min-height: 100%;
}
.item{
  padding: 0 rpx(20);
  margin: rpx(30) 0;
  .panel{
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
}
.form-wrapper{
  width: 100%;
  height: 100vh;
  // padding: rpx(15) 0 rpx(320);
  background: #f1f1f1;
  position: relative;
  overflow: hidden;
  .form-container{
    height: 100%;
    padding: rpx(15) rpx(15) rpx(320);
    overflow-y: auto;
    overflow-x: hidden;
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
    // .btns{
    //   background: #f1f1f1;
    //   position: fixed;
    //   bottom: 0;
    //   width: 100%;
    //   left: 0;
    //   padding: rpx(15);
    //   .submit,
    //   .cancel{
    //     margin: rpx(30) 0;
    //   }
    //   .cancel{
    //     margin-top: 0;
    //   }
    // }
  }
  .btns{
    position: fixed;
    z-index: 2;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #f1f1f1;
    padding: rpx(15);
    .submit,
    .back{
      margin: rpx(30) 0;
    }
    .back{
      margin-top: 0;
    }
  }
  .title{
    font-size: rpx(36);
    text-align: center;
    margin: rpx(30) 0;
  }
}
</style>
