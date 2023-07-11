<template>
  <!--顶部 start-->
 <TopHeader/>
  <!--顶部 end-->
  <!--搜索 start-->
  <div class="hotel-room-nav">
    <Search/>
  </div>
  <!--搜索 end-->

  <!--列表类别 start-->
  <div class="hotel-list-filter">
    <div class="hotel-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">酒店首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/hotel/list' }">类别</el-breadcrumb-item>
              <el-breadcrumb-item> <cite>全部</cite></el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </template>
         <div class="hotel-card-body">
          <div class="room-cat-item">
            <span><el-icon style="margin-right: 12px;"><ArrowRight /></el-icon>类别：</span>
            <ul>
              <li :class="{'active':activeStatus==0}"> <a  href="JavaScript:void(0);" @click="searchRoomType(null)">全部</a> </li>

              <li :class="{'active':activeStatus==item.id}" v-for="item in roomTypeList"> <a  href="JavaScript:void(0);" @click="searchRoomType(item.id)">{{item.typeName}}</a></li>
            </ul>
          </div>
          <div class="room-cat-item color-list">
            <span><el-icon style="margin-right: 12px;"><Memo /></el-icon>楼层：</span>
            <ul id="getAllFloor">
              <li style="background: #F2F2F2" title="全部">
                <a  href="JavaScript:void(0);" @click="searchFloor(null)">
                  <img src="@/assets/hotel/images/all_bg.jpg">
                  <el-icon v-show="floorStatus==0"><Select /></el-icon>
                </a>
              </li>
              <li v-for="(item,index) in floorList"  :title="item.floorName" :class="'bg'+(index+1)" @click="searchFloor(item.id)">
                <a href="JavaScript:void(0);">
                  <el-icon v-show="floorStatus==item.id"><Select /></el-icon>
                </a>
              </li>

            </ul>
          </div>
          <p class="filter-end">筛选出<span>{{ total }}</span>个</p>
         </div>
      </el-card>
    </div>
  </div>
  <!--列表类别 end-->

  <!--列表内容 start-->
  <div class="hotel-room-list">
    <div class="hotel-room-normal">
      <div class="hotel-container">
        <el-row :gutter="20">
          <template v-for="item in roomList">
          <el-col style="padding: 10px;" :span="6">
            <router-link target="_blank" class="template room-list-box " :to="'/hotel/details/'+item.id">
              <img :src="item.coverImg"  class="room-list-cover">
              <h2>{{item.roomName}}</h2>
              <div> <label class="room-list-pay"> ￥{{item.memberPrice}} </label>
                <div class="room-list-colorbar">
                  <span class="room-color-bar" style="border-color: #009688;color: #009688;border-width: 1px;border-style: solid;background-color: #fff;    text-align: center;">NO.{{item.roomNumber}}</span>
                  <span class="room-color-bar" style="border-color: #5fb878;color: #5fb878;border-width: 1px;border-style: solid;background-color: #fff;    text-align: center;">{{item.hotelRoomType.typeName}}</span>
                  <span class="room-color-bar" style="border-color: #01aaed;color: #01aaed;border-width: 1px;border-style: solid;background-color: #fff;    text-align: center;">{{item.hotelFloor.floorNo}}楼</span>
                </div>
              </div>
            </router-link>
          </el-col>
          </template>
        </el-row>
        <div style="margin: 50px 0 80px; text-align: center;"> </div>
      </div>

      <!--分页 start-->
      <el-pagination background layout="total,prev,pager,next,jumper" :total="total"
                     v-model:page-size="pageSize"  @current-change="changPage" />
      <!--分页 end-->

    </div>
  </div>
  <!--列表内容 end-->


  <!--底部 start-->
  <Footer/>
  <!--底部 end-->

</template>

<script setup lang="ts">
import TopHeader from "../comm/header/TopHeader.vue"
import Search from "../comm/search/Search.vue"
import Footer from "../comm/footer/Footer.vue"
import { onMounted,ref,watch } from 'vue'
import {getAllRoomTypeAndFloorApi, getRoomListApi} from "@/api/hotel/index"
import { useRoute } from 'vue-router'
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 路由参数对象
const route = useRoute()
// 房间类型状态
const activeStatus:any= ref(0)
// 楼层状态
const floorStatus:any = ref(0)

// 获取所有房间类别和楼层信息
const roomTypeList = ref<object[]>([])
const floorList = ref<object[]>([])
const getAllRoomTypeAndFloor = async ()=> {
  const { data } = await getAllRoomTypeAndFloorApi()
  roomTypeList.value = data.result.roomTypeList
  floorList.value = data.result.floorList
}

// 根据楼层ID、房间类型ID获取房间列表
// 总条数
const total=ref(0)
// 每页显示行数
const pageSize= ref(12)
// 当前页面
const pageIndex=ref(1)
// 搜索关键字
const searchValue = ref()
const roomTypeId = ref()
const floorId = ref()
const roomList = ref<object[]>([])


const getRoomList = async ()=> {
  const params = {
    'floorId': floorId.value,
    'roomTypeId': roomTypeId.value,
    'pageIndex': pageIndex.value,
    'pageSize': pageSize.value,
    'searchValue': searchValue.value
  }
  const { data } = await getRoomListApi(params)
  roomList.value = data.result.content
  total.value = data.result.totalElements
}
// 改变页码执行的事件
const changPage = (val:number)=> {
  pageIndex.value = val
  getRoomList()
}

// 根据房间类型搜索房间
const searchRoomType = (val:number)=> {
  roomTypeId.value = val
  if(val==null){
    activeStatus.value = 0
  }else {
    activeStatus.value = val
  }
  getRoomList()
}

// 根据楼层ID搜索房间
const searchFloor = (val: number)=> {
  console.log('楼层搜索')
  floorId.value = val
  if(val==null){
    floorStatus.value = 0
  }else {
    floorStatus.value = val
  }
  getRoomList()
}
// 监听关键字

watch(() => route.query.keywords, (newsearchValue) => {
  searchValue.value = newsearchValue
  getRoomList()
})
onMounted(()=> {
  if(route.query.id){
    roomTypeId.value = route.query.id
    activeStatus.value = route.query.id
  }
  if(route.query.floorId){
    floorId.value = route.query.floorId
    floorStatus.value = route.query.floorId
  }
  searchValue.value = route.query.keywords
  console.log('route',route)
  getAllRoomTypeAndFloor()
  getRoomList()
})
</script>

<style scoped>

/*列表类别 start*/
.hotel-list-filter {
  margin-top: 30px;
}
.hotel-container {
  width: 1350px;
  position: relative;
  margin: 0 auto;
  padding: 0 15px;
  box-sizing: border-box;
}

.hotel-list-filter .hotel-card-body {
  padding-left: 25px;
  padding-top: 15px;
}

.room-cat-item {
  display: flex;
  padding-bottom: 32px;
  font-size: 16px;
  line-height: 26px;
}

.hotel-list-filter .room-cat-item  span {
  width: 100px;
  color: #555;
  margin-top: 1px;
}
.room-cat-item ul {
  width: 80%;
  vertical-align: top;
}

.room-cat-item ul li {
  margin-right: 27px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}
room-cat-item span {
  display: inline-block;
  vertical-align: middle;
}

.room-cat-item.color-list li {
  width: 20px;
  height: 12px;
  line-height: 12px;
  margin-right: 14px;
  position: relative;
}

.room-cat-item.color-list li i {
  position: absolute;
  top: 1px;
  left: 4px;
  color: #FFF;
  font-size: 12px;
  font-weight: bold;
}

.hotel-list-filter .hotel-container li.active a,.hotel-list-filter .hotel-container li a:hover{
  color: #5eba78;
}

.room-cat-item.color-list li.bg1 {background: #f35343}
.room-cat-item.color-list li.bg2 {background: #fda925}
.room-cat-item.color-list li.bg3 {background: #f1e73a}
.room-cat-item.color-list li.bg4{background:  #009688 }
.room-cat-item.color-list li.bg5{background:  #39c2d2 }
.room-cat-item.color-list li.bg6{background:  #1E9FFF }
.room-cat-item.color-list li.bg7{background:  #813bd9 }
.room-cat-item.color-list li.bg8{background:  #f8f8f8 }
.room-cat-item.color-list li.bg9{background:  #e6e6e6 }
.room-cat-item.color-list li.bg10{background:  #000 }
.room-cat-item.color-list li.bg11{background:  #794712 }

.hotel-list-filter .hotel-container p.filter-end {
  line-height: 48px;
}

.hotel-list-filter .hotel-container p.filter-end span {
  margin: 0 7px;
  color: #ffa921;
}
/*列表类别 end*/

/*列表内容 start*/
.hotel-room-list .hotel-room-normal{
  padding-top: 45px;
  padding-bottom: 60px;
}

.room-list-box {
  display: block;
  background-color: #FFF;
  transition: all .5s;
  -webkit-transition: all .5s;
  padding-bottom: 6px;
  cursor: pointer;
}

.room-list-box .room-list-cover {
  height: 200px;
  width: 100%;
}

.room-list-box h2 {
  font-size: 18px;
  padding: 20px 15px;
  line-height: 26px;
  text-align: center;
}
.room-list-box>div {
  position: relative;
  padding: 0 15px 15px;
}

.room-list-pay {
  border-color: #FF5722;
  color: #FF5722;
  height: 18px;
  line-height: 18px;
  border-width: 1px;
  border-style: solid;
  padding: 3px 6px;
  font-size: 12px;
}

.room-list-colorbar {
  position: absolute;
  right: 15px;
  top: -1px;
}

.room-color-bar {
  display: inline-block;
  width: 67px;
  height: 20px;
}

.el-pagination{
  margin-top: 20px;
  justify-content: center;
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #083a6d !important; /*修改默认的背景色*/
}
/*列表内容 end*/


</style>
