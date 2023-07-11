<template>
  <!--顶部 start-->
  <TopHeader/>
  <!--顶部 end-->

  <!--搜索 start-->
  <div class="hotel-room-nav">
    <Search/>
  </div>
  <!--搜索 end-->
  <!--详情内容 start-->
  <div class="hotel-banner" style="background: #f2f2f2;">

    <div class="hotel-container">
      <el-space alignment="flex-start">
        <el-card>
          <!--会员菜单 start-->
          <MemberMenu/>
          <!--会员菜单 end-->
        </el-card>
        <el-card style="height: 344px">
          <template #header>
            <div class="card-header">
              <span>我的预定</span>
            </div>
          </template>

          <!--内容 start-->
          <!--我的预定 start-->
          <div class="set" style="width: 1006px">
            <el-table stripe  :data="tableData" element-loading-text="数据加载中..."
                      style="width: 100%;text-align: center" :cell-style="{ textAlign: 'center' }"
                      :header-cell-style="{ fontSize: '15px',background: '#00BFFF',color: 'white',textAlign: 'center' }">
              <el-table-column label="序号" width="80" type="index" :index="Nindex"/>

              <el-table-column label="订单号" showOverflowTooltip>
                <template #default="scope">
                  <span>{{scope.row.orderNumber}}</span>
                </template>
              </el-table-column>

              <el-table-column label="房间号">
                <template #default="scope">
                  <span>{{scope.row.room.roomNumber}}</span>
                </template>
              </el-table-column>

              <el-table-column label="总金额">
                <template #default="scope">
                  <el-popover effect="light" trigger="hover" placement="top" width="auto">
                    <template #default>
                      <div>预定天数: {{ scope.row.reserveDays }}天</div>
                      <div>房间单价: {{ scope.row.room.memberPrice }}元</div>
                    </template>
                    <template #reference>
                      <el-tag>￥{{ scope.row.amountMoney }}</el-tag>
                    </template>
                  </el-popover>

                </template>
              </el-table-column>

              <el-table-column label="订单状态">
                <template #default="scope">
                  <el-tag @click="payment(scope.row.id,scope.row.room.roomNumber)" style="cursor: pointer;" effect="dark" v-if="scope.row.status ===0 ">已预定，待付款</el-tag>
                  <el-tag type="success" v-else-if="scope.row.status ===1">已付款待入住</el-tag>
                  <el-tag type="info" v-else-if="scope.row.status ===2">已入住未退房</el-tag>
                  <el-tag type="danger" v-else-if="scope.row.status ===3">已退订</el-tag>
                  <el-tag type="warning" v-else-if="scope.row.status ===4">已完成</el-tag>
                  <el-tag type="warning" v-else>已换房</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="入住时间">
                <template #default="scope">
                  <span>{{formatTime(scope.row.checkinDate,'yyyy-MM-dd')}}</span>
                </template>
              </el-table-column>

              <el-table-column label="退房时间">
                <template #default="scope">
                  <span>{{formatTime(scope.row.checkoutDate,'yyyy-MM-dd')}}</span>
                </template>
              </el-table-column>

            </el-table>
          </div>
          <!--分页 start-->
          <el-pagination background layout="total,prev,pager,next,jumper" :total="total"
                         v-model:page-size="pageSize"    @current-change="changePage"/>
          <!--分页 end-->
          <!--我的预定 end-->

          <!--内容 end-->
        </el-card>
      </el-space>
    </div>

  </div>
  <!--详情内容 end-->
  <!--底部 start-->
  <Footer/>
  <!--底部 end-->
</template>

<script setup lang="ts">
import TopHeader from "../comm/header/TopHeader.vue"
import Search from "../comm/search/Search.vue"
import Footer from "../comm/footer/Footer.vue"
import MemberMenu from "../comm/member/MemberMenu.vue"

import { ref,onMounted } from 'vue'
import {formatTime} from "@/utils/date";
import {getMyReserveListApi, paymentApi} from "@/api/hotel/member/member"
import { ElMessage, ElMessageBox } from 'element-plus'

// 我的预定表格数据
const tableData = ref([])
// 我的预定总共条数
const total = ref(0)
// 每页显示条数
const pageSize = ref(4)
// 当前页码
const pageIndex = ref(1)

// 获取我的预定列表
const getMyReserveList = async ()=> {
  const params = {
    'pageIndex': pageIndex.value,
    'pageSize': pageSize.value
  }
  const { data } = await getMyReserveListApi(params)
  tableData.value = data.result.content
  total.value= data.result.totalElements
}

// 改变页码执行事件
const changePage = (val: number)=> {
  pageIndex.value = val
  getMyReserveList()
}

// 点击付款
/**
 *
 * @param id
 *        预定记录ID
 * @param roomNumber
 *        房号
 */
const payment = async (id:number,roomNumber:string)=> {
  ElMessageBox.confirm(
      `您已预订房号为${roomNumber}的房间，确定要付款吗?`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '再考虑一下',
        type: 'warning',
      }
  )
      .then(async () => {
        // 更新订单状态
        const { data } = await paymentApi(id)
        if(data.status === 200){
          ElMessage({
            type: 'success',
            message: data.message,
          })
        }else {
          ElMessage({
            type: 'error',
            message: data.message,
          })
        }


      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '您已取消付款',
        })
      })
}

onMounted(()=> {
  getMyReserveList()
})

</script>

<style scoped>
.hotel-banner{
  margin-top: 60px;
  text-align: center;
  margin-bottom: 300px;
}
.hotel-container {
  display: flex;
  width: 1350px;
  margin: 0 auto;
  padding: 0 15px;
  box-sizing: border-box;
}


/*按钮样式*/
.submit-form {
  display: flex;
  justify-content: center;
  align-items: center;
}
/*分页插件样式*/
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #00BFFF;
}

.el-pagination{
  margin-top: 20px;
  justify-content: center;
}
</style>
