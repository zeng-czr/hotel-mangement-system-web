<template>
  <el-card>
    <!--头部区域 Start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><School/></el-icon>楼层管理
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-input :prefix-icon="Search" v-model="searchValue"
                        @keyup.enter.native="search" placeholder="关键搜索（回车）" />
            </el-col>

            <el-col :span="11">
              <div class="my-button">
                <el-button plain style="width: 100%;" color="#2fa7b9" @click="addFloor">添加楼层</el-button>
                <el-button  style="width: 100%;"  @click="exportExcelAction" type="primary">
                  <el-icon style="margin-right: 1px"><Download/></el-icon>
                  导出 Excel
                </el-button>
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

        <el-table-column label="楼层">
          <template #default="scope">
            <span>{{scope.row.floorNo}}</span>
          </template>
        </el-table-column>

        <el-table-column label="楼层名称">
          <template #default="scope">
            <span>{{scope.row.floorName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template #default="scope">
            <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editFloor(scope.row.id)">编辑</el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="Delete"
                           icon-color="#626AEF" :title="'确定删除名为“'+scope.row.floorName+'”的楼层吗？'"
                           @confirm="delFloor(scope.row.id)">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>

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

  <!--新增楼层弹出框 start-->
  <el-dialog align-center v-model="addFloorDialogFormVisible" width="42%" destroy-on-close>

    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">添加楼层</h1>
      </div>
    </template>

    <!--添加楼层组件 start-->
    <AddFloor @closeAddFloorForm="closeAddFloorForm"  @success="success"/>
    <!--添加楼层组件 end-->
  </el-dialog>
  <!--新增楼层弹出框 end-->


  <!--编辑楼层弹出框 start-->
  <el-dialog align-center v-model="editFloorDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">编辑楼层</h1>
      </div>
    </template>
    <!--编辑楼层组件 start-->
    <EditFloor :floorInfo="floorInfo" @closeEditFloorForm="closeEditFloorForm" @success="success"/>
    <!--编辑楼层组件 end-->
  </el-dialog>
  <!--编辑楼层弹出框 end-->

</template>

<script setup lang="ts">
import { ref,reactive,toRefs,onMounted } from 'vue'
import {getFloorListApi,getFloorApi,delFloorApi} from "@/api/hotel/floor/floor"
import {formatTime} from "@/utils/date"
import { ElMessage } from 'element-plus'
import AddFloor from "./components/AddFloor.vue"
import EditFloor from "./components/EditFloor.vue"
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

// 获取楼层列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getFloorListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}

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

// 新增楼层弹出框状态
const addFloorDialogFormVisible = ref(false)
// 添加楼层
const addFloor = ()=> {
  addFloorDialogFormVisible.value = true
}

// 关闭新增楼层弹出框
const closeAddFloorForm = ()=> {
  addFloorDialogFormVisible.value = false
}

// 提交表单回调函数
const success = ()=>{
  loadData(state)
  closeAddFloorForm()
  closeEditFloorForm()
}
// 编辑楼层弹出框状态
const editFloorDialogFormVisible = ref(false)
// 编辑楼层信息
const floorInfo = ref()
const editFloor = async (id:number)=>{
  const { data } = await getFloorApi(id)
  floorInfo.value = data.result
  editFloorDialogFormVisible.value = true
}

// 关闭编辑楼层弹出框
const closeEditFloorForm = ()=> {
  editFloorDialogFormVisible.value = false
}

// 删除楼层信息
const delFloor = async (id: number)=>{
  const { data } = await delFloorApi(id)
  if(data.status === 200){
    ElMessage.success('删除成功')
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}

onMounted(()=> {
  loadData(state)
})
// 导出列表
const column = [
  {name: 'id',label: '楼层ID'},
  {name: 'floorNo',label: '楼层号'},
  {name: 'floorName',label: '楼层名称'},
  {name: 'remarks',label: '备注'}
]
// 导出楼层信息
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '楼层信息数据',
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
/*自定义弹出框头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
  color: #00BFFF;
}

/*自定义按钮样式*/
.my-button {
  display: flex;
  justify-content: space-between;
}
</style>
