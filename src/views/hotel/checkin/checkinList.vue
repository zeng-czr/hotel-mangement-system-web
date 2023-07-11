<template>
    <el-card>
      <!--头部区域 Start-->
      <template #header>
        <div class="card-header">
          <h3>
            <el-icon style="margin-right: 10px"><Tickets/></el-icon>入住管理
          </h3>

          <!--搜索区域 start-->
          <div class="card-search">
            <el-row :gutter="10">
              <el-col :span="14">
                <el-input :prefix-icon="Search" v-model="searchValue"
                          @keyup.enter.native="search" placeholder="关键搜索（回车）" />
              </el-col>

              <el-col :span="7">
                <el-button plain style="width: 100%;" color="#2fa7b9" @click="exportExcelAction">导出 Excel</el-button>
              </el-col>

              <el-col :span="3" style="display: inline-flex;justify-content: center;align-items: center;cursor: pointer;">
                <el-icon style="font-size: 20px;color: #b3b6bc;" @click="refresh"><Refresh/></el-icon>
              </el-col>

            </el-row>
          </div>

          <!--搜索区域 end-->

        </div>
      </template>
      <!--头部区域 end-->
      <!--表格区域 start-->
      <div class="table-box">
        <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
                  style="width: 100%;text-align: center;" :cell-style="{ textAlign: 'center' }"
                  :header-cell-style="{ fontSize: '15px',background: '#00BFFF',color: 'white',textAlign: 'center' }">

          <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

          <el-table-column label="订单号" show-overflow-tooltip>
            <template #default="scope">
              <span>{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column label="房间号">
            <template #default="scope">
              <span>{{scope.row.room.roomNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column label="姓名">
            <template #default="scope">
              <span>{{scope.row.memberName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="入住状态">
            <template #default="scope">
              <el-tag v-if="scope.row.status===0">未退房</el-tag>
              <el-tag v-else>已退房</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="性别">
            <template #default="scope">
              <span>{{scope.row.gender}}</span>
            </template>
          </el-table-column>

          <el-table-column label="手机号">
            <template #default="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>

          <el-table-column label="身份证">
            <template #default="scope">
              <span>{{scope.row.idCard}}</span>
            </template>
          </el-table-column>

          <el-table-column label="省份">
            <template #default="scope">
              <span>{{scope.row.province}}</span>
            </template>
          </el-table-column>

          <el-table-column label="城市">
            <template #default="scope">
              <span>{{scope.row.city}}</span>
            </template>
          </el-table-column>

          <el-table-column label="家庭住址">
            <template #default="scope">
              <span>{{scope.row.address}}</span>
            </template>
          </el-table-column>

          <el-table-column label="入住时间">
            <template #default="scope">
              <span>{{scope.row.checkinDate}}</span>
            </template>
          </el-table-column>

          <el-table-column label="退房时间">
            <template #default="scope">
              <span>{{scope.row.checkoutDate}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="checkOut(scope.row.id)">退房</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <!--表格区域 end-->
      <!--分页插件 start-->
      <el-pagination background layout="total,sizes,prev,pager,next,jumper" :total="total"
                     v-model:page-size="pageSize" :page-sizes="[10,20,30,40]"
                     @current-change="changePage"/>
      <!--分页插件 end-->
    </el-card>
</template>

<script setup lang="ts">
import { ref,reactive,toRefs,onMounted } from 'vue'
import {getCheckInListApi,checkOutApi} from "@/api/hotel/checkin/checkin";
import {ElMessage,ElMessageBox} from 'element-plus'
import {exportExcel} from "@/utils/exportExcel";
const state = reactive({
  // 搜索关键字
  searchValue: '',
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 每页显示行数
  pageSize: 10,
  // 当前页码
  pageIndex: 1,
  // 数据加载状态
  loading: false
})
// 获取入住列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getCheckInListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}
onMounted(()=> {
  loadData(state)
})
// 刷新
const refresh = ()=> {
  // 搜索关键字
  state.searchValue = ''
  // 加载数据
  loadData(state)
}
// 搜索
const search = ()=> {
  if(state.searchValue!=null){
    loadData(state)
    ElMessage({
      type: 'success',
      message: `关键字“${state.searchValue}”搜索内容如下`
    })
  }
}

// 切换页码执行事件
const changePage = (val: number)=> {
  state.pageIndex = val
  loadData(state)
}
// 处理列表序号
const Nindex = (index: number)=> {
  // 当前页码
  const page = state.pageIndex
  // 每页行数
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}

// 退房
const checkOut = async (id: number)=>{

  ElMessageBox.confirm(
      '确定要退房吗?',
      '温馨提示',
      {
        confirmButtonText: '是的，我确定',
        cancelButtonText: '再考虑一下',
        type: 'warning',
      }
  ).then(async () => {
        const { data } = await checkOutApi(id)
        if(data.status === 200){
          ElMessage.success(data.message)
          await loadData(state)
        }else {
          ElMessage.error(data.message)
        }
      }).catch(() => {

      })


}

// 导出列表
const column = [
  {name: 'id',label: '入住ID'},
  {name: 'orderNumber',label: '订单号'},
  {name: 'memberName',label: '姓名'},
  {name: 'idCard',label: '身份证'},
  {name: 'gender',label: '性别'},
  {name: 'phone',label: '手机号'},
  {name: 'address',label: '家庭住址'}
]
// 导出入住信息
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '入住信息数据',
    format: 'xlsx',
    autowidth: true
  })
}
const {tableData,pageSize,pageIndex,loading,total,searchValue} = toRefs(state)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgb(238 238 238);
  color: #00BFFF;
}
/*分页样式*/
.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #00BFFF;
}
</style>
