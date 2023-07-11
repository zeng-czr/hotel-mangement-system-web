<!-- 预定管理 -->
<template>
  <el-card>
    <!--头部区域 Start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Money/></el-icon>预订管理
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input :prefix-icon="Search" v-model="searchValue"
                        @keyup.enter.native="search" placeholder="关键搜索（回车）" />
            </el-col>

            <el-col :span="13">
              <div class="my-button">
              <el-select v-model="status" placeholder="请选择订单状态" style="width: 100%;" @change="onChange">
                <el-option label="已预定待付款" value="0"/>
                <el-option label="已付款待入住" value="1"/>
                <el-option label="已入住未退房" value="2"/>
                <el-option label="已取消" value="3"/>
                <el-option label="已完成" value="4"/>
              </el-select>
              <el-button @click="exportExcelAction" type="primary" style="margin-left: 10px">
                <el-icon><Download/></el-icon>
                导出 Excel</el-button>
              </div>
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

        <!-- <el-table-column label="所属会员">
          <template #default="scope">
            <el-tag type="success">{{(scope.row.member.phone).replace((scope.row.member.phone).substring(3,7), "****")}}：{{scope.row.member.nickname}}</el-tag>
          </template>
        </el-table-column> -->

        <el-table-column label="预订房间">
          <template #default="scope">
            {{scope.row.room.roomNumber}}
          </template>
        </el-table-column>

        <el-table-column label="总金额">
          <template #default="scope">
            <el-tag>￥{{scope.row.amountMoney}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="预订天数">
          <template #default="scope">
            <el-tag type="warning">{{scope.row.reserveDays}}天</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="订单状态">
          <template #default="scope">
            <el-tag v-if="scope.row.status===0" type="warning">已预定，待付款</el-tag>
            <el-tag v-else-if="scope.row.status===1" type="success">已付款待入住</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="info">已入住未退房</el-tag>
            <el-tag v-else-if="scope.row.status===3" type="danger">已退订</el-tag>
            <el-tag v-else >已完成</el-tag>
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

        <el-table-column label="操作" width="200">
          <template #default="scope">
            <template v-if="scope.row.status===1">
            <el-button  size="small" type="danger" @click="unsubscribe(scope.row.id)">退订</el-button>
            <el-button size="small" type="success" @click="checkin(scope.row.id)">入住</el-button>
            </template>
            <template v-else-if="scope.row.status===0">
            <el-button size="small" type="info" color="#00BFFF" @click="payment(scope.row.id)">收款</el-button>
            </template>
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

  <!--入住登记弹出框 start-->
  <el-dialog align-center v-model="checkinDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">登记入住</h1>
      </div>
    </template>
    <!--入住登记组件 start-->
    <CheckinRoom :reserveInfo="reserveInfo" @closeCheckinForm="closeCheckinForm" @success="success"/>
    <!--入住登记组件 end-->
  </el-dialog>
  <!--入住登记弹出框 end-->

</template>

<script setup lang="ts">
import { ref,reactive,toRefs,onMounted } from 'vue'
import {getReserveListApi,unsubscribeApi,paymentApi,getReserveApi} from "@/api/hotel/reserve/reserve"
import {ElMessage,ElMessageBox} from 'element-plus'
import CheckinRoom from "./components/CheckinRoom.vue"
import {exportExcel} from "@/utils/exportExcel";
const state = reactive({
  // 搜索关键字
  searchValue: '',
  // 订单状态
  status: '',
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
// 获取预订列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue,
    'status':state.status
  }
  const { data } = await getReserveListApi(params)
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
  // 订单状态
  state.status = ''
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

// 更改订单状态查询数据
const onChange = ()=> {
  loadData(state)
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

// 退订
const unsubscribe = async (id:number)=> {
  ElMessageBox.confirm(
      '你确定要退订该酒店房间吗?',
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '我再想想',
        type: 'warning',
      }
      ).then(async () => {
        const { data } = await unsubscribeApi(id)
        if(data.status===200){
          ElMessage({
            type: 'success',
            message: data.message,
          })
          // 刷新数据
          refresh()
        }else {
          ElMessage({
            type: 'error',
            message: data.message,
          })
        }
      }).catch(() => {
        console.log('取消')
      })

}

// 确认收款
const payment = async (id:number)=> {
  ElMessageBox.confirm(
      '你确定收到会员预定该酒店房间钱款了吗?',
      '温馨提示',
      {
        confirmButtonText: '是的，我确定',
        cancelButtonText: '我再想想',
        type: 'warning',
      }
  ).then(async () => {
    const { data } = await paymentApi(id)
    if(data.status===200){
      ElMessage({
        type: 'success',
        message: data.message,
      })
      // 刷新数据
      refresh()
    }else{
      ElMessage({
        type: 'error',
        message: data.message,
      })
    }
  }).catch(() => {
    console.log('取消')
  })

}
// 登记入住弹出框状态
const checkinDialogFormVisible = ref(false)
// 入住信息
const reserveInfo = ref()
const checkin = async (id:number)=>{
  const { data } = await getReserveApi(id)
  reserveInfo.value = data.result
  checkinDialogFormVisible.value = true
}

// 关闭入住登记弹出框
const closeCheckinForm = ()=> {
  checkinDialogFormVisible.value = false
}
// 提交表单回调函数
const success = ()=>{
  loadData(state)
  closeCheckinForm()
}

// 导出列表
const column = [
  {name: 'id',label: '预订ID'},
  {name: 'orderNumber',label: '订单号'},
  {name: 'status',label: '订单状态'},
  {name: 'checkinDate',label: '入住时间'},
  {name: 'checkoutDate',label: '退房时间'},
  {name: 'reserveDays',label: '预订天数'},
  {name: 'amountMoney',label: '总金额'},
  {name: 'roomNumber',label: '房间号'},
  {name: 'roomName',label: '房间名称'},
  {name: 'phone',label: '手机号'},
  {name: 'nickname',label: '会员昵称'}
]
// 导出
const exportExcelAction = () => {
  // 处理表格数据
  const newTableData = state.tableData.flatMap((item:any)=>{
    return {...item,...item.room,...item.member}
  })
  exportExcel({
    column,
    data: newTableData,
    filename: '预订信息数据',
    format: 'xlsx',
    autowidth:true
  })
}
const {tableData,pageSize,pageIndex,loading,total,searchValue,status} = toRefs(state)
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
/*自定义按钮样式*/
.my-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/*分页样式*/
.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #00BFFF;
}
/*自定义弹出框头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
  color: #00BFFF;
}
</style>
