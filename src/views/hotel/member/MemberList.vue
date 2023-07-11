<template>
  <el-card>
    <!--头部区域 Start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Avatar/></el-icon>会员管理
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
      <el-table stripe element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
                style="width: 100%;text-align: center;" :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{ fontSize: '15px',background: '#00BFFF',color: 'white',textAlign: 'center' }">

        <el-table-column label="序号" width="80" type="index" :index="Nindex"/>

        <el-table-column label="头像">
          <template #default="scope">
            <el-image v-if="scope.row.memberIcon!==null" style="width: 64px; height: 64px" :src="url+'uploadFile/'+scope.row.memberIcon" fit="cover" />
            <el-tag v-else type="success">未上传</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="昵称">
          <template #default="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>

        <el-table-column label="姓名" width="80px">
          <template #default="scope">
            <span>{{scope.row.realName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="手机号" width="120px">
          <template #default="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>

        <el-table-column label="登录密码">
          <template #default="scope">
            <span>{{scope.row.password}}</span>
          </template>
        </el-table-column>

        <el-table-column label="余额" width="80px">
          <template #default="scope">
            <span>{{scope.row.balance}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="邮箱">
          <template #default="scope">
            <span>{{scope.row.email}}</span>
          </template>
        </el-table-column> -->

        <el-table-column label="状态">
          <template #default="scope">
            <el-switch
                v-model="scope.row.status"
                inline-prompt
                active-text="启用"
                inactive-text="禁用"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
            />
          </template>
        </el-table-column>

        <!-- <el-table-column label="登录次数">
          <template #default="scope">
            <span>{{scope.row.loginTimes}}</span>
          </template>
        </el-table-column> -->

        <el-table-column label="创建时间">
          <template #default="scope">
            <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button type="success" size="small" @click="recharge(scope.row.id)">充值</el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="Delete"
                           icon-color="#626AEF" :title="'确定删除名为“'+scope.row.nickname+'”的会员吗？'"
                           @confirm="delMember(scope.row.id)">
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

  <!--充值弹出框 start-->
  <el-dialog align-center v-model="rechargeDialogFormVisible" width="42%" destroy-on-close>

    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">会员充值</h1>
      </div>
    </template>

    <!--充值组件 start-->
    <Recharge :memberInfo="memberInfo" @closeRechargeForm="closeRechargeForm" @success="success"/>
    <!--充值组件 end-->
  </el-dialog>
  <!--充值弹出框 end-->
</template>

<script setup lang="ts">
import { ref,reactive,toRefs ,onMounted} from 'vue'
import {getMemberListApi,getMemberApi,deleteMemberApi} from "@/api/hotel/member/member";
import {formatTime} from "@/utils/date";
import {ElMessage} from 'element-plus'
import Recharge from "./components/Recharge.vue"
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

// 获取会员列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getMemberListApi(params)
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

// 充值弹出框状态
const rechargeDialogFormVisible = ref(false)
// 编辑会员信息
const memberInfo = ref()
const recharge = async (id:number)=>{
  const { data } = await getMemberApi(id)
  memberInfo.value = data.result
  rechargeDialogFormVisible.value = true
}

// 关闭会员充值弹出框
const closeRechargeForm = ()=> {
  rechargeDialogFormVisible.value = false
}
// 提交表单回调函数
const success = ()=>{
  loadData(state)
  closeRechargeForm()
}

// 删除会员信息
const delMember = async (id: number)=>{
  const { data } = await deleteMemberApi(id)
  if(data.status === 200){
    ElMessage.success('删除成功')
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}

// 导出列表
const column = [
  {name: 'id',label: '会员ID'},
  {name: 'nickname',label: '会员昵称'},
  {name: 'realName',label: '会员姓名'},
  {name: 'email',label: '会员邮箱'},
  {name: 'phone',label: '手机号'},
  {name: 'loginTimes',label: '登录次数'},
  {name: 'balance',label: '余额'}
]
// 导出会员信息
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '会员信息数据',
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
</style>
