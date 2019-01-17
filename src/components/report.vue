<template>
  <el-card class="card">
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!-- 图标 -->
    <div id="main" style="width: 600px;height:400px; margin-top:20px;"></div>
  </el-card>
</template>
<script>
import Echart from "echarts";
export default {
  mounted() {
    //操作dom建议在mounted中进行，mounted中含有el
    this.initEcharts();
  },
  methods: {
    async initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = Echart.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      /* const option = {
        title: {
          text: "数据报表"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }; */
      //发送请求获取真数据
      const res = await this.$http.get(`reports/type/1`);
      console.log(res);
      const option2 = res.data.data;
      const option1 = {
        title: {
            text: '数据图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }

    };
    const option = {...option1,...option2};
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      
    }
  }
};
</script>
<style scoped>
.card {
  height: 100%;
}
</style>
