<template>
  <!--顶部 start-->
  <div class="hotel-header  header-store">
    <div class="hotel-container">
      <router-link class="logo"  to="/index" >
        <img src="@/assets/hotel/images/hotel-logo.png" alt="酒店管理系统">
      </router-link>
      <ul class="hotel-nav">
        <li  class="hotel-nav-item" :class="{'hotel-active':hotelActive=='/index'}">
          <router-link  to="/index" >首页</router-link>
        </li>
        <li  class="hotel-nav-item" :class="{'hotel-active':hotelActive=='/hotel/list'}">
          <router-link  to="/hotel/list" >全部房间</router-link>
        </li>

        <!--已登录 start-->
        <template v-if="memberInfo.nickname!=''">
        <li  class="hotel-nav-item hotel-member" :class="{'hotel-active':hotelActive=='/hotel/myInfo'}">
          <router-link class="hotel-nav-avatar hotel-case-active"  to="/hotel/myInfo" >
            <img v-if="memberInfo.memberIcon!= null" :src="url+'uploadFile/'+memberInfo.memberIcon">
            <img v-else src="@/assets/hotel/images/head.jpg">
            <cite class="layui-hide-xs">欢迎您：{{memberInfo.nickname}}</cite>
          </router-link>
        </li>
        <li  class="hotel-nav-item">
          <a class="hotel-case-active" @click="exitSystem" href="JavaScript:void(0);">退出</a>
        </li>
        </template>
        <!--已登录 end-->
        <!--未登录 start-->
        <template v-else>
        <li  class="hotel-nav-item" :class="{'hotel-active':hotelActive=='/hotel/login'}">
          <router-link  to="/hotel/login" >马上登录</router-link>
        </li>
        <li  class="hotel-nav-item" :class="{'hotel-active':hotelActive=='/hotel/register'}">
          <router-link  to="/hotel/register">立即注册</router-link>
        </li>
        </template>
        <!--未登录 end-->
        <li  class="hotel-nav-item">
          <router-link  to="/home" class="fly-case-active" target="_blank">进入后台</router-link>
        </li>

      </ul>

    </div>
  </div>
  <!--顶部 start-->
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import {useMemberStore} from "../../../../store/modules/member"
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
// 获取路由对象
const route = useRoute()
const  hotelActive = ref()//是数据hotelActive成为响应式数据
//主要用于对当前选择的样式进行切换
hotelActive.value = route.path
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 获取会员在pinia对象
const { memberInfo } = useMemberStore()
console.log('memberInfo',memberInfo)
// 退出系统
const exitSystem = async ()=> {

  ElMessageBox.confirm(
      '您确定要退出酒店管理系统吗?',
      '温馨提醒',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: '退出成功',
        })
        // 清除用户登录信息
        window.localStorage.removeItem("memberStore")
        // 返回酒店首页
        window.location.href="/"
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
}




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

.hotel-container .hotel-nav {
  right: 15px;
  position: absolute;
  top: 0;
  padding: 0;
  background: none;
  color: #fff;
  box-sizing: border-box;
}
.hotel-nav * {
  font-size: 14px;
}
.hotel-nav .hotel-nav-item {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  line-height: 60px;
  font-size: 20px;
  font-weight: bold;
  margin: 0 20px;
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
  height: 3px;
  background-color: #F08080;
  transition: all .2s;
  -webkit-transition: all .2s;
}

.hotel-nav-avatar img {
  width: 36px;
  height: 36px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 100%;
  vertical-align: middle;
}
/** 顶部样式 end*/
</style>
