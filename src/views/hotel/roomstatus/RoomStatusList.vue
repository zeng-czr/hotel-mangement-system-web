<template>
  <el-card>
    <!--头部区域 Start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Box/></el-icon>日历房态
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10">


            <el-col :span="8" style="display: inline-flex;justify-content: center;align-items: center;cursor: pointer;">
              <el-icon style="font-size: 20px;color: #b3b6bc;" @click="refresh"><Refresh/></el-icon>
            </el-col>

          </el-row>
        </div>

        <!--搜索区域 end-->

      </div>
    </template>
    <!--头部区域 end-->
    <!--房态区域 start-->
    <el-calendar>
      <template #date-cell="{ data }">
        <div  style="display: flex;justify-content: center;font-size: 24px;">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
            {{ data.isSelected ? '✔️' : '' }}
          </p>
        </div>
        <div class="my-button" v-show="data.isSelected">
          <el-tag type="primary">剩余<span style="font-size: 18px;color: red;">{{count(data)}}</span></el-tag>
          <el-button size="small" color="#00BFFF" @click="reserve(data.day)">预订</el-button>
          <el-button size="small" type="success" @click="checkin(data.day)">入住</el-button>
        </div>
      </template>
    </el-calendar>
    <!--房态区域 end-->
  </el-card>

  <!--预订 抽屉 start-->
  <el-drawer v-model="disableDrawer"  :direction="direction">
    <template #header>
      <h4>您预订的日期是：{{memberForm.reserveDate}}</h4>
    </template>
    <template #default>
      <el-form ref="ruleFormRef" :rules="rules" :model="memberForm" label-width="10px">
        <!--基础信息 start-->
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <el-form-item label="昵称" prop="nickname" label-width="80px">
            <el-input v-model="memberForm.nickname" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone" label-width="80px">
            <el-input v-model="memberForm.phone" />
          </el-form-item>
        </el-card>
        <!--基础信息 end-->
        <el-divider border-style="dashed"/>
        <!--房间信息 start-->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>分配房间</span>
            </div>
          </template>
          <el-form-item prop="checkRoomList">
          <el-checkbox-group v-model="memberForm.checkRoomList">
            <el-checkbox-button v-for="item in roomList" :key="item.rommNumber" :label="item.rommNumber" @change="changeRoom">
              NO.{{ item.rommNumber }}（￥{{item.standardPrice}}）
            </el-checkbox-button>
          </el-checkbox-group>
          </el-form-item>
        </el-card>
        <!--房间信息 end-->
        <el-divider border-style="dashed"/>
        <!--备注 start-->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>备注</span>
            </div>
          </template>
          <el-form-item>
            <el-input rows="4" v-model="memberForm.remarks" type="textarea" />
          </el-form-item>

        </el-card>
        <!--备注 end-->
      </el-form>
    </template>
    <template #footer>
      <div style="display: flex;justify-content: space-between;">
        <div>
          订单金额：<span style="color:#f5222d;font-weight: 700; " >￥{{ money }}</span>
        </div>
        <el-button style="color: white;" type="primary" color="#FF9900" :loading="subLoading"  @click="addReserve(ruleFormRef)">提交订单</el-button>
      </div>
    </template>
  </el-drawer>
  <!--预订抽屉 end-->

  <!--入住 抽屉 start-->
  <el-drawer v-model="disableCheckinDrawer"  :direction="direction">
    <template #header>
      <h4>您登记入住的日期是：{{checkinForm.checkinDate}}</h4>
    </template>
    <template #default>
      <el-form ref="checkinFormRef" :rules="rules" :model="checkinForm" label-width="10px">
        <!--基础信息 start-->
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <el-row>
          <el-col :span="12">
          <el-form-item label="姓名" prop="memberName" label-width="80px">
            <el-input v-model="checkinForm.memberName" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="手机号" prop="phone" label-width="80px">
            <el-input v-model="checkinForm.phone" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender" label-width="80px">
              <el-radio-group v-model="checkinForm.gender">
                <el-radio-button label="男" />
                <el-radio-button label="女" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入住人数" prop="memberNumber" label-width="80px">
              <el-input-number :min="1" v-model="checkinForm.memberNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idCard" label-width="80px">
              <el-input v-model="checkinForm.idCard" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭住址" prop="address" label-width="80px">
              <el-input v-model="checkinForm.address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省份" prop="province" label-width="80px">
              <el-input v-model="checkinForm.province" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市" prop="city" label-width="80px">
              <el-input v-model="checkinForm.city" />
            </el-form-item>
          </el-col>
          </el-row>
        </el-card>
        <!--基础信息 end-->
        <el-divider border-style="dashed"/>
        <!--房间信息 start-->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>分配房间</span>
            </div>
          </template>
          <el-form-item prop="checkRoomList">
            <el-checkbox-group v-model="checkinForm.checkRoomList">
              <el-checkbox-button v-for="item in roomList" :key="item.rommNumber" :label="item.rommNumber" @change="changeRoom">
                NO.{{ item.rommNumber }}（￥{{item.standardPrice}}）
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-card>
        <!--房间信息 end-->
        <el-divider border-style="dashed"/>
        <!--备注 start-->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>备注</span>
            </div>
          </template>
          <el-form-item>
            <el-input rows="4" v-model="checkinForm.remarks" type="textarea" />
          </el-form-item>

        </el-card>
        <!--备注 end-->
      </el-form>
    </template>
    <template #footer>
      <div style="display: flex;justify-content: space-between;">
        <div>
          订单金额：<span style="color:#f5222d;font-weight: 700; " >￥{{ money }}</span>
        </div>
        <el-button style="color: white;" type="primary" color="#FF9900" :loading="subLoading"  @click="addCheckin(checkinFormRef)">提交订单</el-button>
      </div>
    </template>
  </el-drawer>
  <!--入住抽屉 end-->

</template>

<script setup lang="ts">
import { ref,onMounted,reactive } from 'vue'
import {formatTime} from "@/utils/date"
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {countRoomApi,getRoomListByDateApi} from "@/api/hotel/room/room"
import {addReserveApi,addCheckinApi} from "@/api/hotel/reserve/reserve";

// 每天剩余房间列表
const countRoomList = ref([])
// 总房间数量
const countRoom = ref(0)

const count =  (data:any)=> {
  const countRoomFilter = countRoomList.value.filter(item=>item.reserveDay===data.day)
  if(countRoomFilter.length>0){
    return countRoomFilter[0].countRoom
  }else{
    return countRoom.value
  }
}

// 获取每天剩余房间数和总房间数
const getRoomCount =  async ()=> {
  const { data } = await countRoomApi()
  countRoomList.value = data.result.countRoomMapList
  countRoom.value = data.result.counRoom

}
const disableDate = (day:any)=>{
  const today = formatTime(new Date(),"YYYY-MM-DD")
  const flag = day<today
  console.log(flag)
  return flag;
}

// 会员信息数据对象
const memberForm = reactive({
  nickname: '',
  phone: '',
  remarks: '',
  reserveDate: '',
  checkRoomList: []
})
// 抽屉组件状态
const disableDrawer = ref(false)
// 抽屉组件弹出方式
const direction = ref('rtl')

// 待分配房间
const roomList = ref([])
// 预订
const reserve = async (val:any)=> {
  const { data } = await getRoomListByDateApi(val)
  roomList.value = data.result
  memberForm.reserveDate= val
  disableDrawer.value = true
}

// 改变选中房间执行事件
const money = ref(0)
const changeRoom = ()=> {
  money.value = 0
  // 统计预订金额
 const filterRoomList =roomList.value.filter(item=> {
   return memberForm.checkRoomList.includes(item.rommNumber)
  })
  filterRoomList.forEach(item=> {
    console.log('item:',item.standardPrice)
    money.value += item.standardPrice
  })

  // 统计入住金额
  const filterCheckinRoomList =roomList.value.filter(item=> {
    return checkinForm.checkRoomList.includes(item.rommNumber)
  })
  filterCheckinRoomList.forEach(item=> {
    console.log('item:',item.standardPrice)
    money.value += item.standardPrice
  })

}
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  nickname: [{ required: true,message: '昵称不能为空',trigger: 'blur' }],
  checkRoomList: [{ required: true,message: '请分配房间',trigger: 'blur' }],
  phone:[{ required: true,message: '手机号不能为空',trigger: 'blur' }],
  memberName: [{ required: true,message: '姓名不能为空',trigger: 'blur' }],
  idCard: [{ required: true,message: '身份证不能为空',trigger: 'blur' }],
  gender: [{ required: true,message: '性别不能为空',trigger: 'blur' }],
  memberNumber: [{ required: true,message: '入住人数不能为空',trigger: 'blur' }]
})

// 提交预订表单
const subLoading = ref(false)
const addReserve = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await addReserveApi(memberForm)
      if(data.status === 200){
        ElMessage.success(data.message)
        await getRoomCount()
        disableDrawer.value = false
      }else {
        ElMessage.error(data.message)
      }
    }else{
      ElMessage.error('提交失败，你还有未填写的项')
    }
  })
  subLoading.value = false
}
// 入住表单实例对象
const checkinFormRef = ref<FormInstance>()
// 登记入住信息数据对象
const checkinForm = reactive({
  memberName: '',
  phone: '',
  idCard: '',
  memberNumber: '',
  gender: '',
  province: '',
  city: '',
  address: '',
  remarks: '',
  checkinDate: '',
  checkRoomList: []
})
// 登记入住抽屉状态
const disableCheckinDrawer = ref(false)
// 打开入住抽屉
const checkin = async (val:any)=> {
  checkinForm.checkinDate = val
  disableCheckinDrawer.value = true
  const { data } = await getRoomListByDateApi(val)
  roomList.value = data.result
}
// 添加入住信息
const addCheckin = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await addCheckinApi(checkinForm)
      if(data.status === 200){
        ElMessage.success(data.message)
        await getRoomCount()
        disableCheckinDrawer.value = false
      }else {
        ElMessage.error(data.message)
      }
    }else{
      ElMessage.error('提交失败，你还有未填写的项')
    }
  })
  subLoading.value = false
}
// 刷新
const refresh = ()=> {
  getRoomCount()
  ElMessage.success('刷新成功！')
}
onMounted(()=> {
  getRoomCount()
})

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
.is-prevDay{
  pointer-events: none;
  background-color: rgbs(0,0,0,3);
  color: #fff;
}
.is-selected {
  color: #00BFFF;
}

.my-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>
