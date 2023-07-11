<template>
<div class="home">
  <!--顶部背景图和内容 start-->
  <div class="top_bg">
    <h1>酒店后台管理系统</h1>
    <p>酒店管理系统·欢迎您，admin</p>
  </div>
  <!--顶部背景图和内容 end-->
  <!-- 日历start -->
 <RoomStates/>
  <!-- 日历end -->

</div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import {getIndexTotalApi} from "@/api/hotel/home/home";
import  RoomStates  from "../../hotel/roomstatus/RoomStatusList.vue";
// 统计今日预计到达人数
const arriveNums = ref(0)
// 统计今日预离人数
const leaveNums = ref(0)
// 统计今日订单数量
const orderNums = ref(0)
// 统计今日营业额
const tradeNums = ref(0)
const value = new Date();
// 学科成绩对比
const legendData = ref(['入住人数'])
const seriesData = ref([])
const categoryData = ref([])

// 统计数据
const getIndexTotal = async ()=>{
  const { data } = await getIndexTotalApi()
  if(data.status === 200){
    arriveNums.value = data.result.arriveNums
    leaveNums.value = data.result.leaveNums
    orderNums.value = data.result.orderNums
    tradeNums.value = data.result.tradeNums

    categoryData.value = data.result.checkinNum.categoryList
    seriesData.value = data.result.checkinNum.barEchartsSeriesList
  }
}



onMounted(()=> {
  getIndexTotal()
})
</script>

<style scoped>
.home {
  width: 100%;
  position: relative;
}
.top_bg{
  width: 100%;
  height: 200px;
  background-image: url(@/assets/hotel/images/backG.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  line-height: 60px;
  text-align: center;
  margin: 0 auto 10px;
}
.top_bg h1 {
  font-size: 60px;
  text-shadow: 3px 3px 0px #515151;
  padding-top: 50px;
}
.top_bg p{
  font-weight: lighter;
  font-size: 18px;
}
.calender{
  background-color: pink;
  /* position: absolute;
  right: 0; */
}
.data_row .el-col {
  height: 100px;
  margin-bottom: 20px;
  overflow: hidden;
}
.data_row .el-col>div {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  color: white;
}

.data_left {
  float: left;
  width: 40%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.data_left .el-icon {
  font-size: 60px;
}
.data_right {
width: 60%;
  float: right;
  margin-top: 10px;
}
.data_right h1 {
  font-size: 40px;
}
.data_right h1 span {
  font-size: 15px;
  margin-left: 10px;
}
.data_right p {
  font-size: 14px;
  font-weight: 600;
  margin-left: 3px;
}
</style>
