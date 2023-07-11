<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formCheckin" label-width="80px">
    <el-row>

      <el-col :span="12">
        <el-form-item label="订单编号" prop="orderNumber">
          <el-input v-model="formCheckin.orderNumber" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="会员姓名" prop="memberName">
          <el-input v-model="formCheckin.memberName" placeholder="请输入会员姓名" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formCheckin.gender" placeholder="请选择性别">
            <el-option value="女" label="女"/>
            <el-option value="男" label="男"/>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="formCheckin.idCard" placeholder="请输入身份证" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="入住人数" prop="memberNumber">
          <el-input v-model="formCheckin.memberNumber" placeholder="请输入入住人数" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="省份" prop="province">
          <el-input v-model="formCheckin.province" placeholder="请输入省份" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="城市" prop="city">
          <el-input v-model="formCheckin.city" placeholder="请输入城市" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formCheckin.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="formCheckin.address" placeholder="请输入家庭住址" />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="备注">
          <el-input v-model="formCheckin.remarks" :rows="2" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="checkin(ruleFormRef)" type="success" :loading="subLoading" color="#083a6d">保存</el-button>
  </div>

</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {checkinApi} from "@/api/hotel/reserve/reserve"
// 定义事件
const emit = defineEmits(['closeCheckinForm','success'])
// 按钮状态
const subLoading = ref(false)
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  orderNumber: [{required: true,message: '订单号不能为空',trigger: 'blur'}],
  memberName: [{ required: true,message: '会员名称不能为空',trigger: 'blur' }],
  gender: [{ required: true,message: '性别不能空',trigger: 'blur' }],
  idCard: [{ required: true,message: '身份证不能为空',trigger: 'blur' }],
  memberNumber: [{ required: true,message: '入住人数不能为空',trigger: 'blur' }],
  province: [{required: true,message: '省份不能为空',trigger: 'blur'}],
  city: [{ required: true,message: '城市不能为空',trigger: 'blur' }],
  address: [{ required: true,message: '家庭住址不能空',trigger: 'blur' }],
  phone: [{ required: true,message: '手机号不能为空',trigger: 'blur' }]
})
// 表单数据对象
const formCheckin = reactive({
  orderNumber: 0,
  memberName: '',
  gender: '',
  idCard: '',
  memberNumber: '',
  province: '',
  remarks: '',
  city: '',
  address: '',
  phone: ''

})
// 获取父组件传过来的reserveInfo对象
const props = defineProps(['reserveInfo'])
const reserveInfo = ref(props.reserveInfo)
// 给表单填充数据
for (const key in formCheckin) {
  formCheckin[key] = reserveInfo.value[key]
}
// 保存入住信息
const checkin = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await checkinApi(formCheckin)
      if(data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项')
    }
  })
  subLoading.value = false
}
// 取消表单
const close = ()=>{
  emit('closeCheckinForm')
}
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
