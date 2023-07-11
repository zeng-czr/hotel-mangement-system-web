<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px;"><Box/></el-icon>房间管理
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-input :prefix-icon="Search" v-model="searchValue" @keyup.enter.native="search"
                        placeholder="关键字搜索（回车）"/>
            </el-col>
            <el-col :span="11">
              <div class="my-button">
                <el-button plain style="width: 100%;" color="#2fa7b9" @click="addRoom">添加房间</el-button>
                <el-button  style="width: 100%;"  @click="exportExcelAction" type="primary">
                  <el-icon style="margin-right: 1px"><Download/></el-icon>
                  导出 Excel
                </el-button>
              </div>
            </el-col>
            <el-col :span="3" style="display: inline-flex;justify-content: center;align-items: center; cursor: pointer;">
              <el-icon style="font-size: 20px;color: #b3b6bc;" @click="refresh">
                <Refresh />
              </el-icon>
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->

      </div>
    </template>
    <!--头部 end-->

    <!--表格区域 start-->
    <div class="table-box">
      <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
                style="width: 100%;text-align: center;" :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{ fontSize: '15px',background: '#00BFFF',color: 'white',textAlign: 'center' }">

        <el-table-column  label="序号" width="80" type="index" :index="Nindex"/>

        <el-table-column label="封面" width="80">
          <template #default="scope">
            <img :src="scope.row.coverImg" style="width: 64px;height: 40px;">
          </template>
        </el-table-column>

        <el-table-column label="房间名">
          <template #default="scope">
            <span>{{scope.row.roomName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="房间号" width="80">
          <template #default="scope">
            <span>{{scope.row.roomNumber}}</span>
          </template>
        </el-table-column>

        <el-table-column label="床型">
          <template #default="scope">
            <span>{{scope.row.bedType}}</span>
          </template>
        </el-table-column>

        <el-table-column label="宽带">
          <template #default="scope">
            <span>{{scope.row.broadband}}</span>
          </template>
        </el-table-column>

        <el-table-column label="标准价">
          <template #default="scope">
            <span>{{scope.row.standardPrice}}</span>
          </template>
        </el-table-column>

        <el-table-column label="会员价">
          <template #default="scope">
            <span>{{scope.row.memberPrice}}</span>
          </template>
        </el-table-column>

        <el-table-column label="房间状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.roomStatus==0">空闲</el-tag>
            <el-tag type="info" v-else-if="scope.row.roomStatus==1">预订</el-tag>
            <el-tag type="warning" v-else-if="scope.row.roomStatus==2">入住</el-tag>
            <el-tag type="danger" v-else>维护中</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="房间类型">
          <template #default="scope">
            <span>{{scope.row.hotelRoomType.typeName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="所属楼层">
          <template #default="scope">
            <span>{{scope.row.hotelFloor.floorName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template #default="scope">
            <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editRoom(scope.row.id)">编辑</el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="Delete"
                           icon-color="#626AEF" :title="'确定删除名为“'+scope.row.roomName+'”的房间吗？'"
                           @confirm="delRoom(scope.row.id)">
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

  <!--新增房间弹出框 start-->
  <el-dialog align-center v-model="addRoomDialogFormVisible" width="60%" destroy-on-close>

    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">添加房间</h1>
      </div>
    </template>

    <!--添加房间组件 start-->
    <AddRoom @closeAddRoomForm="closeAddRoomForm" @success="success"/>
    <!--添加房间组件 end-->
  </el-dialog>
  <!--新增房间弹出框 end-->

  <!--编辑房间弹出框 start-->
  <el-dialog align-center v-model="editRoomDialogFormVisible" width="60%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">编辑房间</h1>
      </div>
    </template>
    <!--编辑房间组件 start-->
    <EditRoom :roomInfo="roomInfo" @closeEditRoomForm="closeEditRoomForm" @success="success"/>
    <!--编辑房间组件 end-->
  </el-dialog>
  <!--编辑房间弹出框 end-->

</template>

<script setup lang="ts">
import { ref,reactive,toRefs,onMounted } from 'vue'
import {getRoomListApi,getRoomApi,delRoomApi} from "@/api/hotel/room/room"
import {formatTime} from "@/utils/date"
import {ElMessage} from 'element-plus'
import AddRoom from "./components/AddRoom.vue"
import EditRoom from "./components/EditRoom.vue"
import {exportExcel} from "@/utils/exportExcel";
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
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

// 获取房间列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getRoomListApi(params)
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

// 新增房间弹出框状态
const addRoomDialogFormVisible = ref(false)
// 添加房间
const addRoom = ()=> {
  addRoomDialogFormVisible.value = true
}
// 关闭新增房间弹出框
const closeAddRoomForm = ()=> {
  addRoomDialogFormVisible.value = false
}

// 提交表单回调函数
const success = ()=>{
  loadData(state)
  closeAddRoomForm()
  closeEditRoomForm()
}
// 编辑房间弹出框状态
const editRoomDialogFormVisible = ref(false)
// 编辑房间信息
const roomInfo = ref()
const editRoom = async (id:number)=>{
  const { data } = await getRoomApi(id)
  roomInfo.value = data.result
  editRoomDialogFormVisible.value = true
}
// 关闭编辑房间弹出框
const closeEditRoomForm = ()=> {
  editRoomDialogFormVisible.value = false
}

// 删除房间信息
const delRoom = async (id: number)=>{
  const { data } = await delRoomApi(id)
  if(data.status === 200){
    ElMessage.success('删除成功')
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}
// 导出列表
const column = [
  {name: 'id',label: '房间ID'},
  {name: 'roomName',label: '房间名称'},
  {name: 'roomNumber',label: '房间号'},
  {name: 'bedType',label: '床型'},
  {name: 'broadband',label: '宽带'},
  {name: 'standardPrice',label: '标准价'},
  {name: 'memberPrice',label: '会员价'}
]
// 导出房间信息
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '房间信息数据',
    format: 'xlsx',
    autowidth: true
  })
}
onMounted(()=> {
  loadData(state)
})

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
