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
              <span>充值记录</span>
            </div>
          </template>

          <!--内容 start-->
          <!--充值记录 start-->
          <div class="set" style="width: 1006px">
            <el-table stripe  :data="tableData" element-loading-text="数据加载中..."
                      style="width: 100%;text-align: center" :cell-style="{ textAlign: 'center' }"
                      :header-cell-style="{ fontSize: '15px',background: '#00BFFF',color: 'white',textAlign: 'center' }">
              <el-table-column label="序号" width="80" type="index" :index="Nindex"/>

              <el-table-column label="充值金额" showOverflowTooltip>
                <template #default="scope">
                  <span>{{scope.row.money}}</span>
                </template>
              </el-table-column>

              <el-table-column label="备注">
                <template #default="scope">
                  <span>{{scope.row.remarks}}</span>
                </template>
              </el-table-column>

              <el-table-column label="充值时间">
                <template #default="scope">
                  <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
                </template>
              </el-table-column>

            </el-table>
          </div>
          <!--分页 start-->
          <el-pagination background layout="total,prev,pager,next,jumper" :total="total"
                         v-model:page-size="pageSize"    @current-change="changePage"/>
          <!--分页 end-->
          <!--充值记录 end-->

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
import {getMyRechargeRecordListApi} from "@/api/hotel/member/member"
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
const getMyRechargeRecordList = async ()=> {
  const params = {
    'pageIndex': pageIndex.value,
    'pageSize': pageSize.value
  }
  const { data } = await getMyRechargeRecordListApi(params)
  tableData.value = data.result.content
  total.value= data.result.totalElements
}

// 改变页码执行事件
const changePage = (val: number)=> {
  pageIndex.value = val
  getMyRechargeRecordList()
}


onMounted(()=> {
  getMyRechargeRecordList()
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
