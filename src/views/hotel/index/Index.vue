<template>
  <!--顶部 start-->
  <TopHeader/>
  <!--顶部 start-->

  <!--房间分类 搜索 幻灯片 start-->
  <div class="hotel-room-nav hotel-index">

    <!--搜索 start-->
    <SearchKey/>
    <!--搜索 end-->

    <!--幻灯片 房间分类 start-->
    <div class="hotel-banner">
      <!--房间分类 start-->
      <div class="hotel-container">
        <ul>
          <li v-for="item in indexRoomTypeList">
            <router-link  :to="{path: '/hotel/list',query:{id:item.id}}" >
              {{item.typeName}}
            </router-link>
          </li>
        </ul>
      </div>

      <!--幻灯片 start-->
      <el-carousel height="460px">
        <el-carousel-item>
          <img src="@/assets/hotel/images/banner3.jpg" alt="酒店管理系统">
        </el-carousel-item>
        <el-carousel-item>
          <img src="@/assets/hotel/images/banner2.jpg" alt="酒店管理系统">
        </el-carousel-item>
        <el-carousel-item>
          <img src="@/assets/hotel/images/banner4.jpg" alt="酒店管理系统">
        </el-carousel-item>
        <el-carousel-item>
          <img src="@/assets/hotel/images/banner5.jpg" alt="酒店管理系统">
        </el-carousel-item>
      </el-carousel>
      <!--幻灯片 end-->
    </div>
    <!--幻灯片 房间分类 start-->
  </div>
  
  <!--底部 start-->
  <Footer/>
  <!--底部 end-->

</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import {getIndexApi} from "@/api/hotel"
//导入组件
import TopHeader from "../comm/header/TopHeader.vue"
import Footer from "../comm/footer/Footer.vue"
import SearchKey  from "../comm/search/Search.vue"
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 获取首页房间类型
const indexRoomTypeList = ref<object[]>([])
// 获取首页楼层及房间列表
const getIndex = async ()=> {
  const { data} = await getIndexApi()
  console.log('----data-----',data)
  indexRoomTypeList.value = data.result.indexRoomTypeList
}



onMounted(() => {
  getIndex()
})
</script>

<style scoped>
/**顶部样式 start */
.hotel-header {
  height: 59px;
  border-bottom: 1px solid #404553;
  background-color: #00BFFF;
  z-index: 1000;
  position: relative;
}
.hotel-container {
  width: 1350px;
  margin-top: 30px;
  padding: 0;
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
}

 .hotel-container .logo {
  left: 15px;
   position: absolute;
   top: 16px;
}

.hotel-container .logo img {
  width: 82px;
  height: 31px;
  border: none;
}

.hotel-component {
  position: absolute;
  width: 160px;
  left: 120px;
  top: 16px;
}

.hotel-container .hotel-nav {
  right: 15px;
  position: absolute;
  top: 0;
  padding: 0;
  background: none;
  color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
}
.hotel-nav .hotel-nav-item {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  line-height: 60px;
  margin: 0 20px;
}
.hotel-nav * {
  font-size: 14px;
}

.hotel-case-active {
  color: #fff;
}
.hotel-nav .hotel-nav-item a {
  display: block;
  padding: 0 20px;
  color: #fff;
  color: rgba(255,255,255,.7);
  transition: all .3s;
  -webkit-transition: all .3s;
}

.hotel-active {
  color: #fff!important;
}

.hotel-nav .hotel-nav-item a:hover, .hotel-nav .hotel-active a {
  color: #fff;
}

.hotel-nav .hotel-active:after {
  content: '';
  top: auto;
  bottom: 0;
  width: 100%;
}

.hotel-nav .hotel-active:after {
  position: absolute;
  left: 0;
  height: 5px;
  background-color: #5FB878;
  transition: all .2s;
  -webkit-transition: all .2s;
}

/** 顶部样式 end*/


/**房间分类 搜索 幻灯片样式 start*/
ul {
  list-style: none;
  display: flex;
}
li{
  flex: 1;
  text-align: center;
  height: 50px;
  line-height: 50px;
  background-color: #00BFFF;
  margin: 10px;
}
.hotel-room-nav {
  background-color: #fff;
}

.hotel-room-nav.hotel-index {
  padding-bottom: 0;
}

.hotel-room-nav .input-search {
  width: 100%;
  padding: 30px 0 10px;
  text-align: center;
  background-color: #FFF;
}
.hotel-room-nav .input-search .el-input {
  vertical-align: middle;
  width: 500px;
  height: 40px;
  background: #d9dfe0;
  border: none;
  outline: none;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

/**房间分类 搜索 幻灯片样式 end*/

/*底部样式 start*/
.hotel-footer {
  margin: 50px 0 0;
  padding: 20px 0 30px;
  line-height: 30px;
  text-align: center;
  color: #737573;
  border-top: 1px solid #e2e2e2;
}

.hotel-footer a {
  padding: 0 6px;
  font-weight: 300;
  color: #333;
}
/*底部样式 end*/
</style>
