<template>
  <!--顶部 start-->
  <TopHeader />
  <!--顶部 end-->

  <!--搜索 start-->
  <div class="hotel-room-nav">
    <Search />
  </div>
  <!--搜索 end-->

  <!--详情内容 start-->
  <div class="hotel-container hotel-data">
    <el-card class="hotel-data-intro">
      <template #header>
        <div class="hotel-card-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }"
              >酒店首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>
              <a href="/public">酒店1楼</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>房间详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="intro-img photos">
            <img :src="roomInfo.coverImg">
          </div>
        </el-col>

        <el-col :span="12">
          <div class="intro-txt">
            <h1 class="title" id="roomName">{{ roomInfo.roomName }}</h1>
            <input type="hidden" id="id" name="id" value="1" />
            <div class="store-attrs">
              <div class="summary">
                <p class="reference">
                  <span>房间号</span>
                  <span id="roomNumber">{{ roomInfo.roomNumber }}</span>
                </p>
                <p class="reference">
                  <span>床　型</span>
                  <span id="bedType">{{ roomInfo.bedType }}</span>
                </p>
                <p class="reference">
                  <span>宽　带</span>
                  <span id="broadband">{{ roomInfo.broadband }}</span>
                </p>
                <p class="reference">
                  <span>标准价</span> <span id="standardPrice">￥{{
                    roomInfo.standardPrice
                  }}</span>
                </p>
                <p class="activity">
                  <span>会员价</span>
                  <strong class="price">
                    <span id="memberPrice">￥{{ roomInfo.memberPrice }}</span>
                  </strong>
                </p>
              </div>
            </div>

            <p class="store-detail-active" id="shopEvent">
              <el-button
                @click="reserveRoom(roomInfo.id, roomInfo.roomNumber)"
                color="#FF9434"
                style="
                  width: 200px;
                  line-height: 52px;
                  font-size: 18px;
                  height: 52px;
                  color: white;
                "
              >
                <el-icon size="32" class="hotel-icon"><Stopwatch /></el-icon>
                立即预定
              </el-button>
            </p>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
  <!--详情内容 end-->

  <!--底部 start-->
  <Footer />
  <!--底部 end-->

  <!--预定房间信息弹出框 start-->
  <el-dialog
    align-center
    v-model="reserveRoomDialogFormVisible"
    width="42%"
    destroy-on-close
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen /></el-icon>
        <h2 id="titleId">会员预订房间</h2>
      </div>
    </template>
    <!--预定房间组件 start-->
    <ReserveRoom
      :roomInfo="roomInfo"
      @closeAddReserveRoomForm="closeAddReserveRoomForm"
      @success="success"
    />
    <!--预定房间组件 end-->
  </el-dialog>
  <!--预定房间信息弹出框 end-->
</template>

<script setup lang="ts">
import TopHeader from "../comm/header/TopHeader.vue";
import Search from "../comm/search/Search.vue";
import Footer from "../comm/footer/Footer.vue";
import ReserveRoom from "./components/ReserveRoom.vue";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { getRoomDetailApi } from "@/api/hotel/detail/detail";
const router = useRouter();
const route = useRoute();
const roomId: any = route.params.id;
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API;
// 获取房间信息
const roomInfo = ref("");
const getRoomDetail = async () => {
  const { data } = await getRoomDetailApi(roomId);
  console.log(data);
  roomInfo.value = data.result;
};

// 预订房间弹出框状态
const reserveRoomDialogFormVisible = ref(false);

// 取消预订房间
const closeAddReserveRoomForm = () => {
  reserveRoomDialogFormVisible.value = false;
};

// 预订成功回调函数
const success = () => {
  reserveRoomDialogFormVisible.value = false;
};

// 点击预订按钮事件
const reserveRoom = (roomId: number, roomNo: number) => {
  reserveRoomDialogFormVisible.value = true;
};

onMounted(() => {
  getRoomDetail();
});
</script>

<style scoped>
.hotel-room-nav {
  background-color: #fff;
}

.hotel-container {
  width: 1350px;
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
}

.hotel-data-intro {
  margin: 30px 0;
  background-color: #fff;
}
.hotel-data-intro .intro-img {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 268px;
  text-align: center;
  background-color: #fbfbfb;
  margin: 15px;
}
.hotel-data-intro .intro-img img {
  max-width: 100%;
}
.hotel-data-intro .intro-txt {
  padding: 10px;
}

.hotel-data-intro .intro-txt .title {
  line-height: 35px;
  padding: 0 0 20px;
  font-size: 32px;
  color: #333;
}

.store-attrs .summary {
  width: 100%;
  height: 249px;
  background: #f5f5f5;
  padding-top: 5px;
}

.store-attrs .summary p {
  line-height: 40px;
  padding-left: 34px;
  color: #888888;
}

.store-attrs .summary p span {
  padding-right: 40px;
}
#standardPrice{
  color: #FF0000;
  text-decoration-line: line-through;
}
.price{
  font-size: 20px;
  color: #FF0000;
}
.store-detail-active {
  padding: 29px 0 20px;
}

.hotel-icon {
  margin-right: 9px;
}

.detail-body {
  margin: 20px 0 0;
  min-height: 306px;
  line-height: 26px;
  font-size: 16px;
  color: #333;
  word-wrap: break-word;
}
.hotel-elem-quote {
  margin-bottom: 10px;
  padding: 15px;
  line-height: 22px;
  border-left: 5px solid #009688;
  border-radius: 0 2px 2px 0;
  background-color: #f2f2f2;
}

/*预订房间弹出框样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
