<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formMember" label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="会员昵称" prop="nickname">
          <el-input v-model="formMember.nickname" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="会员手机号" prop="phone">
          <el-input v-model="formMember.phone" disabled/>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="充值金额" prop="balance">
          <el-input-number v-model="formMember.balance"/>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="备注">
          <el-input v-model="formMember.remarks" :rows="2" type="textarea" placeholder="请输入备注"/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="recharge(ruleFormRef)" type="success" :loading="subLoading" color="#00BFFF">确定充值</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {rechargeApi} from "@/api/hotel/member/member"
// 定义事件
const emit = defineEmits(['closeRechargeForm','success'])
// 按钮状态
const subLoading = ref(false)
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  nickname: [{ required: true,message: '会员昵称不能为空',trigger: 'blur' }],
  balance: [{ required: true,message: '充值金额不能为空',trigger: 'blur' }],
  phone:[{ required: true,message: '手机号不能为空',trigger: 'blur' }]
})
// 表单数据对象
const formMember = reactive({
  id: 0,
  nickname: '',
  phone: '',
  balance: 0,
  remarks: ''
})
// 获取父组件传过来的memberInfo对象
const props = defineProps(['memberInfo'])
const memberInfo = ref(props.memberInfo)
// 给表单填充数据
for (const key in formMember) {
  formMember[key] = memberInfo.value[key]
}
// 会员充值
const recharge = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await rechargeApi(formMember)
      if(data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else{
      ElMessage.error('提交失败，你还有未填写的项')
    }
  })
  subLoading.value = false
}

// 取消表单
const close = ()=>{
  emit('closeRechargeForm')
}
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
