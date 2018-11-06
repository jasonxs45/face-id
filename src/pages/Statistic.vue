<template>
  <div class="statistic">
    <h3 class="title">昨日概况</h3>
    <van-row class="general">
      <van-col class="column" span="8">
        <p class="tit">访问人数</p>
        <p class="total">{{yesterData[0]}}</p>
        <p class="day positive">日：{{this.dp.SumPercent}}</p>
        <p class="week negative">周：{{this.wp.SumPercent}}</p>
        <p class="month negative">月：{{this.mp.SumPercent}}</p>
      </van-col>
      <van-col class="column van-hairline--left" span="8">
        <p class="tit">新访问人数</p>
        <p class="total">{{yesterData[1]}}</p>
        <p class="day positive">日：{{this.dp.NewPercent}}</p>
        <p class="week negative">周：{{this.wp.NewPercent}}</p>
        <p class="month negative">月：{{this.mp.NewPercent}}</p>
      </van-col>
      <van-col class="column van-hairline--left" span="8">
        <p class="tit">新添加人数</p>
        <p class="total">{{yesterData[2]}}</p>
        <p class="day positive">日：{{this.dp.NewAddPercent}}</p>
        <p class="week negative">周：{{this.wp.NewAddPercent}}</p>
        <p class="month negative">月：{{this.mp.NewAddPercent}}</p>
      </van-col>
    </van-row>
    <div class="van-hairline--bottom"></div>
    <h3 class="title">今日趋势</h3>
    <div class="line-chart" ref="lineChart"></div>
     <div class="van-hairline--bottom"></div>
    <h3 class="title">访客构成</h3>
    <van-row class="date-change">
      <van-col class="tit">日期范围：</van-col>
      <van-col class="tags">
        <label v-for="(item, index) in timeRange" :key="'tag-'+index" class="tag">
          <input v-model="range" class="input" type="radio" name="date" :value="item.value" @change="radioChange" />
          <span class="txt">{{item.name}}</span>
        </label>
      </van-col>
    </van-row>
    <p class="date-range">{{starttime}}<span class="text">到</span>{{endtime}}</p>
    <div class="bar-pie-chart" ref="barPieChart"></div>
  </div>
</template>
<script>
import api from 'common/api'
import { formatNumber } from 'common/utils/formatNumber'
import Vue from 'vue'
import { Row, Col, Icon } from 'vant'
Vue.use(Row).use(Col).use(Icon)
const color = [
  '#3699d9',
  '#f28227',
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
  '#CDB5CD'
]
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/grid')
require('echarts/lib/component/dataZoom')
export default {
  name: 'Statistic',
  data () {
    return {
      num: 2,
      endtime: null,
      yesterData: [],
      dp: {},
      wp: {},
      mp: {},
      yesterdayLineData: [],
      todayLineData: [],
      pieData: [],
      range: 1,
      timeRange: [
        {
          name: '昨天',
          value: 1
        },
        {
          name: '近7天',
          value: 7
        },
        {
          name: '近30天',
          value: 30
        }
      ]
    }
  },
  computed: {
    lineChart () {
      return echarts.init(this.$refs.lineChart)
    },
    barPieChart () {
      return echarts.init(this.$refs.barPieChart)
    },
    starttime () {
      let date = Date.now() - 24 * 60 * 60 * 1000 * this.range
      date = new Date(date)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }
  },
  methods: {
    _getlastdata () {
      return api.fetch({
        work: 'getlastdata'
      })
    },
    _getdata () {
      return api.fetch({
        work: 'getdata'
      })
    },
    _getpercent () {
      return api.fetch({
        work: 'getpercent'
      })
    },
    _getdatabytime () {
      return api.fetch({
        work: 'getdatabytime',
        starttime: this.starttime,
        endtime: this.endtime
      })
    },
    totalQueries () {
      this.$toast.loading({
        duration: 0,
        message: '加载中'
      })
      Promise.all([this._getlastdata(), this._getdata(), this._getpercent(), this._getdatabytime()]).then(res => {
        this.$toast.clear()
        this.yesterData = [res[0].data.NewCount, res[0].data.NewAddCount, res[0].data.SumCount]
        this.dp = res[2].data.DayPercent
        this.wp = res[2].data.WeekPercent
        this.mp = res[2].data.MountPercent
        // 线图
        this.yesterdayLineData = res[1].data.LastData
        this.todayLineData = res[1].data.NowData
        this.initLineChart()
        // 柱状图饼图
        this.pieData = [
          {
            name: '注册',
            value: res[3].data.CustCount
          },
          {
            name: '未注册',
            value: res[3].data.NoLoginCount
          }
        ]
        this.initBarPieChart()
      }).catch(err => {
        console.log(err)
        this.$toast.clear()
      })
    },
    initLineChart () {
      let option = {
        color,
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
          data: ['昨天', '今天'],
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
          name: '人数',
          nameLocation: 'end',
          type: 'value'
        },
        series: [
          {
            name: '昨天',
            type: 'line',
            animation: false,
            areaStyle: {},
            data: this.yesterdayLineData
          },
          {
            name: '今天',
            type: 'line',
            animation: false,
            areaStyle: {},
            data: this.todayLineData
          }
        ]
      }
      this.lineChart.setOption(option)
    },
    initBarPieChart () {
      let itemStyle = {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      }
      let labelLine = {
        normal: {
          show: false
        }
      }
      let label = {
        normal: {
          position: 'inside',
          formatter (params) {
            return params.name + ' ' + params.percent.toFixed(0) + '%'
          }
        }
      }
      let xAxisNames = ['注册', '未注册']
      let barSeriesData = [
        {
          name: '注册',
          value: this.pieData[0].value,
          itemStyle: {
            color: color[0]
          }
        },
        {
          name: '未注册',
          value: this.pieData[1].value,
          itemStyle: {
            color: color[1]
          }
        }
      ]
      let series = [
        {
          name: '构成比例',
          type: 'bar',
          animation: false,
          data: barSeriesData
        },
        {
          name: '构成比率',
          type: 'pie',
          radius: 70,
          center: ['75%', 120],
          data: this.pieData,
          itemStyle,
          label,
          labelLine,
          tooltip: {
            formatter (params) {
              return `${params.seriesName}<br/>
                      ${params.marker + params.name}:${formatNumber(params.value, 0, 1)}<br/>
                      ${params.percent ? '占比:' + params.percent.toFixed(0) + '%' : ''}`
            }
          }
        }
      ]
      let option = {
        color,
        grid: {
          bottom: 50,
          width: '40%',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          }
        },
        tooltip: {
          formatter (params) {
            let title = '访客构成'
            let subTitle = params[0].axisValue
            let para = ''
            for (let i = 0; i < params.length; i++) {
              para += `${params[i].marker + params[i].seriesName}：${formatNumber(params[i].value, 0, 1)}<br/>`
            }
            return `${title}<br/>${subTitle}<br/>${para}`
          }
        },
        legend: {
          data: ['注册', '未注册'],
          x: 'center'
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisNames
          }
        ],
        yAxis: {
          name: '人数',
          nameLocation: 'end',
          type: 'value'
        },
        series
      }
      // 绑定图例点击事件
      this.barPieChart.on('legendselectchanged', params => {
        // 筛选柱状图 具体数值
        series[0].data = barSeriesData.filter((item, index) => {
          return Object.values(params.selected)[index] === true
        })
        this.barPieChart.setOption({
          xAxis: {
            data: xAxisNames.filter(item => params.selected[item])
          },
          series
        })
      })
      this.barPieChart.setOption(option)
    },
    radioChange () {
      this.$toast.loading({
        message: '加载中',
        duration: 0
      })
      this._getdatabytime().then(res => {
        this.$toast.clear()
        if (res.data.Success) {
          // 柱状图饼图
          this.pieData = [
            {
              name: '注册',
              value: res.data.CustCount
            },
            {
              name: '未注册',
              value: res.data.NoLoginCount
            }
          ]
          this.initBarPieChart()
        }
      }).catch(err => {
        console.log(err)
        this.$toast.clear()
      })
    }
  },
  created () {
    let date = Date.now() - 24 * 60 * 60 * 1000
    date = new Date(date)
    this.endtime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.totalQueries()
  }
}
</script>
<style lang="scss" scoped>
.title{
  margin: rpx(30) rpx(20);
  color:#333;
  font-weight: 600;
}
.general{
  .tit{
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
  width: 100%;
  height: rpx(480);
}
.bar-pie-chart{
  width: 100%;
  height: rpx(480);
}
.date-change{
  font-size: rpx(24);
  padding: rpx(10) rpx(20);
  .tit{
    font-weight: 200;
    padding-top: rpx(10);
  }
  .tags{
    font-size: 0;
    .tag{
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin: 0 rpx(10);
      .input{
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        opacity: 0;
        &:checked + .txt{
          background: #2c8ebb;
          border-color: #2c8ebb;
          color: #fff;
        }
      }
      .txt {
        display: inline-block;
         border:1px solid #ddd;
        border-radius: 15px;
        font-size: rpx(24);
        padding: rpx(10);
        color: #888;
      }
    }
  }
}
.date-range{
  font-size: rpx(26);
  padding: rpx(10) rpx(20);
  .text{
    font-weight: 200;
    margin:0 rpx(10);
  }
}
</style>
