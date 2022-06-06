<template>
  <el-row justify="center" style="margin-top: 50px">
    <el-col :span="20">
      <el-table :data="[...vipInfoMap.values()]" border max-height="800" stripe>
        <el-table-column label="会员ID" prop="id"/>
        <el-table-column label="姓名" prop="name"/>
        <el-table-column label="电话" prop="phone"/>
        <el-table-column label="住址" prop="address"/>
        <el-table-column label="性别" prop="gender"/>
        <el-table-column label="入会时间" prop="date"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button plain type="primary" @click="handleChangeVipInfo(scope.row.id)">修改信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-dialog v-model="changeDialogActive">
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">姓名</el-col>
      <el-col :span="20">
        <el-input v-model="currentChangingVip.name"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">电话</el-col>
      <el-col :span="20">
        <el-input v-model="currentChangingVip.phone"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">住址</el-col>
      <el-col :span="20">
        <el-input v-model="currentChangingVip.address"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">性别</el-col>
      <el-col :span="20">
        <el-input v-model="currentChangingVip.gender"/>
      </el-col>
    </el-row>
    <el-row justify="space-between" style="margin-top: 20px">
      <el-button size="large" type="danger" @click="handleDelVip">删除</el-button>
      <el-button size="large" type="warning" @click="handleSaveChange">保存</el-button>
    </el-row>
  </el-dialog>
  <el-dialog v-model="addVipDialogActive">
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">会员ID</el-col>
      <el-col :span="20">
        <el-input v-model="currentAddingVip.id"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">姓名</el-col>
      <el-col :span="20">
        <el-input v-model="currentAddingVip.name"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">电话</el-col>
      <el-col :span="20">
        <el-input v-model="currentAddingVip.phone"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">住址</el-col>
      <el-col :span="20">
        <el-input v-model="currentAddingVip.address"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">性别</el-col>
      <el-col :span="20">
        <el-input v-model="currentAddingVip.gender"/>
      </el-col>
    </el-row>
    <el-row justify="end" style="margin-top: 20px">
      <el-button size="large" type="warning" @click="handleSaveAdded">保存</el-button>
    </el-row>
  </el-dialog>
  <el-button :icon="Plus" circle class="add" size="large" type="primary" @click="addVipDialogActive = true"/>
  <el-alert v-show="errMsg !== ''" :title="errMsg" class="alert" type="error"/>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Vip } from '@/api/types'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import moment from 'moment'

const vipInfo = ref<Vip[]>([])
const vipInfoMap = computed<Map<string, Vip>>(() => {
  const map = new Map<string, Vip>()
  vipInfo.value.forEach(value => map.set(value.id, value))
  return map
})

const changeDialogActive = ref<boolean>(false)
const currentChangingVip = ref<Vip>({} as Vip)

const addVipDialogActive = ref<boolean>(false)
const currentAddingVip = ref<Vip>({
  id: '',
  name: '',
  date: moment().format('YYYY-MM-DD HH:mm:ss'),
  address: null,
  gender: null,
  phone: ''
} as Vip)

const errMsg = ref<string>('')

function handleChangeVipInfo (id: string) {
  changeDialogActive.value = true
  currentChangingVip.value = vipInfoMap.value.get(id) as Vip
}

function handleDelVip () {
  axios.post('/manage/vip/del', JSON.stringify({ id: currentChangingVip.value.id }), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    vipInfo.value = response.data.data
    changeDialogActive.value = false
  }).catch(err => console.log(err))
}

function handleSaveChange () {
  axios.post('/manage/vip/update', JSON.stringify(currentChangingVip.value), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    vipInfo.value = response.data.data
    changeDialogActive.value = false
  }).catch(err => console.log(err))
}

function handleSaveAdded () {
  if ([...vipInfoMap.value.keys()].indexOf(currentAddingVip.value.id) !== -1) {
    errMsg.value = '重复ID'
  } else {
    currentChangingVip.value.date = moment().format('YYYY-MM-DD HH:mm:ss')
    axios.post('/manage/vip/add', JSON.stringify(currentAddingVip.value), {
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      vipInfo.value = response.data.data
    }).catch(err => console.log(err))

    errMsg.value = ''
    currentAddingVip.value = {
      name: '',
      id: '',
      phone: '',
      address: '',
      gender: '',
      date: moment().format('YYYY-MM-DD HH:mm:ss')
    } as Vip
    addVipDialogActive.value = false
  }
}

onMounted(() => {
  axios.get('/manage/vip/show')
    .then(response => {
      vipInfo.value = response.data.data
    }).catch(err => console.log(err))
})
</script>

<style scoped>
.add {
  position: absolute;
  top: 90%;
  left: 95%;
}

.alert {
  z-index: 9999;
  position: absolute;
  width: 30%;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
