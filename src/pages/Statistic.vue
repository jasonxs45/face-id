<template>
  <div class="statistic">
    <h3 class="title">昨日概况</h3>
      <van-row class="general">
        <van-col class="column" span="6">
          <p class="title">访问人数</p>
          <p class="total">1123</p>
          <p class="day positive">日：{{num}}<van-icon name="upgrade"></van-icon></p>
          <p class="week negative">周：{{num}}<van-icon name="upgrade"></van-icon></p>
          <p class="month negative">月：{{num}}<van-icon name="upgrade"></van-icon></p>
        </van-col>
        <van-col class="column van-hairline--left" span="6">
          <p class="title">新访问人数</p>
          <p class="total">123</p>
          <p class="day positive">日：{{num}}<van-icon name="upgrade"></van-icon></p>
          <p class="week negative">周：{{num}}<van-icon name="upgrade"></van-icon></p>
          <p class="month negative">月：{{num}}<van-icon name="upgrade"></van-icon></p>
        </van-col>
        <van-col class="column van-hairline--left" span="6">
          <p class="title">总添加人数</p>
          <p class="total">567</p>
          <p class="day positive">日：{{num}}<van-icon name="upgrade"></van-icon></p>
          <p class="week negative">周：{{num}}<van-icon name="upgrade"></van-icon></p>
          <p class="month negative">月：{{num}}<van-icon name="upgrade"></van-icon></p>
        </van-col>
        <van-col class="column van-hairline--left" span="6">
          <p class="title">新添加人数</p>
          <p class="total">23</p>
          <p class="day positive">日：{{num}}<van-icon name="upgrade"></van-icon></p>
          <p class="week negative">周：{{num}}<van-icon name="upgrade"></van-icon></p>
          <p class="month negative">月：{{num}}<van-icon name="upgrade"></van-icon></p>
        </van-col>
      </van-row>
    <h3 class="title">今日趋势</h3>
    <div class="line-chart" ref="lineChart"></div>
    <h3 class="title">访客特征</h3>
    <div>日期范围</div>
    <div><span>年龄</span><span>性别</span></div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Row, Col, Icon } from 'vant'
Vue.use(Row).use(Col).use(Icon)
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/grid')
require('echarts/lib/component/dataZoom')
export default {
  name: 'Statistic',
  data () {
    return {
      num: 2
    }
  },
  computed: {
    lineChart () {
      return echarts.init(this.$refs.lineChart)
    }
  },
  methods: {
    initLineChart () {
      let option = {
        grid: {
          bottom: 60
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: false,
            label: {
              backgroundColor: '#505765'
            }
          }
        },
        legend: {
          data: ['降雨量', '降雨量1'],
          x: 'center'
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 33
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: 3,
            data: [
              '0:00',
              '1:00',
              '2:00',
              '3:00',
              '4:00',
              '5:00',
              '6:00',
              '7:00',
              '8:00',
              '9:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '19:00',
              '20:00',
              '21:00',
              '22:00',
              '23:00'
            ]
          }
        ],
        yAxis: {
          name: '降雨量',
          nameLocation: 'end',
          type: 'value'
        },
        series: [
          {
            name: '降雨量',
            type: 'line',
            animation: false,
            smooth: true,
            areaStyle: {},
            data: [6, 5, 1, 3, 2, 2]
          },
          {
            name: '降雨量1',
            type: 'line',
            animation: false,
            smooth: true,
            areaStyle: {},
            data: [1, 2, 4, 5, 5, 6, 5, 4, 3, 2, 1, 3, 2, 1, 4, 5, 6, 5, 2, 3, 2, 2]
          }
        ]
      }
      this.lineChart.setOption(option)
    }
  },
  mounted () {
    this.initLineChart()
  }
}
</script>
<style lang="scss" scoped>
.title{
  margin: rpx(30) rpx(20);
  color:#333;
}
.general{
  .title{
    margin: rpx(10) rpx(20);
    color:#888;
    font-size: rpx(24);
  }
  .total{
    margin: rpx(20);
    font-size: rpx(28);
    color: #333;
  }
  .day,
  .week,
  .month{
    font-size: rpx(24);
    margin: rpx(10) rpx(20);
    .van-icon{
      margin-left: rpx(10);
      vertical-align: top;
    }
    &.positive{
      color: rgb(6, 191, 4);
    }
    &.negative{
      color: rgb(255, 68, 68);
      .van-icon{
        transform: rotate(180deg);
      }
    }
  }
}
.line-chart{
  width: rpx(690);
  height: rpx(480);
}
</style>
