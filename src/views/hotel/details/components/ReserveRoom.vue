<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formHotelReserve" label-width="80px">
    <el-row>

      <el-col :span="12">
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="formHotelReserve.roomNumber" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="formHotelReserve.roomName" disabled />
        </el-form-item>
      </el-col>


<!--      <el-col :span="12">
        <el-form-item label="入住时间" prop="checkinDate">
          <el-input v-model="formHotelReserve.checkinDate" placeholder="请输入入住时间"/>
        </el-form-item>
      </el-col>-->

      <el-col :span="24">
        <el-form-item label="入住时间" prop="checkinDate">
          <el-date-picker
              v-model="valueDate"
              type="daterange"
              range-separator="退房时间"
              :disabled-date="disabledDate"
              start-placeholder="请选择入住时间"
              end-placeholder="请选择退房时间"
              @change="changeDate"
              value-format="YYYY-MM-DD"
              @focus="handleOpen"
              @calendar-change="calendarChange"
          >
            <template #default="cell">
              <div class="cell">
                <span v-if="isReserveDays(cell)" class="holiday text">已订</span>
                <span class="text" v-else>{{ cell.text }}</span>
              </div>

            </template>
          </el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="我要留言">
          <el-input v-model="formHotelReserve.remarks" :rows="2" type="textarea" placeholder="请输入留言"/>
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>

  <div class="dialong__button--wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="addReserve(ruleFormRef)" :loading="subLoading" type="success" color="#083a6d">立即提交</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive,ref } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {addReserveApi} from "../../../../api/hotel"
import { formatTime} from "../../../../utils/date"
import {getDatesByRoomIdApi} from "../../../../api/hotel/detail/detail"
import {useMemberStore} from "../../../../store/modules/member"
const emit = defineEmits(['closeAddReserveRoomForm','success'])
const props = defineProps(['roomInfo'])

// 获取会员在pinia对象
const { memberToken } = useMemberStore()

// 按钮状态
const subLoading = ref(false)
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  roomNumber: [{required: true,message: '房间号不能为空',trigger: 'blur'}],
  roomName: [{required: true,message: '房间名称不能为空',trigger: 'blur'}],
  checkinDate: [{required: true,message: '入住时间不能为空',trigger: 'blur'}],
  checkoutDate: [{required: true,message: '退房时间不能为空',trigger: 'blur'}]
})
// 定义表单数据对象
const formHotelReserve = reactive({
  roomId:props.roomInfo.id,
  roomNumber: props.roomInfo.roomNumber,
  roomName: props.roomInfo.roomName,
  checkinDate: '',
  checkoutDate: '',
  remarks: ''
})
// 日期
const valueDate = ref<object[]>([])
// 已经预订的日期
const reserveDays = ref<object[]>([])
// 提交表单
const addReserve = async (formEl: FormInstance | undefined)=> {
  if (!formEl)return
  if(memberToken == ''){
    ElMessage.error('预订失败，请先登录！')
    return false
  }
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await addReserveApi(formHotelReserve)
      if(data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项！')
      console.log('error submit!',fields)
    }
  })
  subLoading.value = false
}

// 开始日期
const startDate= ref(null)

// 当前日期
const calendarChange=(dates:any )=> {
  // 记录选择的开始日期，方便后面根据开始日期限定结束日期
  let hasSelectDate = dates !== null && dates.length > 0
  startDate.value = hasSelectDate ? dates[0] : null
}


// 限制当前时间之前的时间和7天之后的时间
const disabledDate = (time:any)=> {
   //console.log('time:',formatTime(time,'yyyy-MM-dd'))
  // 根据选择的开始日期，日期范围限定在7天之内
  if (startDate.value !== null) {
    return (
        time.getTime() < Date.now() - (3600 * 1000 * 24 * 1)||
        time.getTime() > startDate.value.getTime() + (7 *24*60*60*1000)||
        reserveDays.value.includes(formatTime(time,'yyyy-MM-dd'))
    )
  }
  // 默认限制当前时间之前的时间和已订房间的时间
  return (
      time.getTime() < Date.now() - (3600 * 1000 * 24 * 1)||
      reserveDays.value.includes(formatTime(time,'yyyy-MM-dd'))
  )

}
// 选择时间触发回调函数
const changeDate = (val: string[])=> {
  console.log('val0',val[0])
  console.log('val1',val[1])
  formHotelReserve.checkinDate = val[0]
  formHotelReserve.checkoutDate = val[1]
  if ( val.length === 0) {
    startDate.value = null
  }
}

// 日期控件弹出执行方法,获取该房间已经预订的日期
const handleOpen = async ()=> {
  console.log('日期控件弹出')
  const { data } = await getDatesByRoomIdApi(props.roomInfo.id)
  reserveDays.value = data.result
}

// 显示已预订日期
const isReserveDays = ({ dayjs }) => {
  return reserveDays.value.includes(dayjs.format('YYYY-MM-DD'))
}

// 取消表单
const close = ()=> {
  emit('closeAddReserveRoomForm')
}

</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}

/*日期控件样式*/
.cell {
  height: 40px;
  padding: 18px 0;
  box-sizing: border-box;
}
.cell .text {
  width: 24px;
  height: 24px;
  display: block;
  margin: 0 auto;
  line-height: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}
/*今天日期的背景颜色*/
.today .cell .text{
  background: #626aef;
  color: #fff;
  font-weight: 700;
}

/*设置选中日期的背景颜色*/
.start-date .cell .text,.end-date .cell .text{
  background: #1b8b0d;
  color: #fff;
  font-weight: 700;
}

/*禁用日期颜色背景颜色*/
.disabled .cell .text {
  color: #a8abb2;
  cursor: not-allowed;
}


.cell .holiday {
  border: 2px solid #f53f08;
  border-radius: 50%;
  cursor: not-allowed;
  padding: 2px;

}

</style>
