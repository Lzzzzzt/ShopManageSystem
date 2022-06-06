<template>
  <el-row justify="center" style="margin: 50px 0 30px 0;">
    <el-col :span="14">
      <el-select v-model="selectedSupplierId" :clear-icon="Remove" clearable placeholder="供应商ID">
        <el-option v-for="id in allSupplierId" :key="id" :label="id" :value="id" @click="getSupplierInfo"/>
      </el-select>
    </el-col>
    <el-col v-show="supplierInfo" :span="4">
      <div style="display:flex; justify-content: end">
        <el-button v-show="supplierInfo" :icon="CloseBold" circle type="danger" @click="handleDel"/>
        <el-button v-show="supplierInfo" type="warning" @click="handleUpdateSupplierInfo">修改信息</el-button>
      </div>
    </el-col>
    <el-col v-show="!supplierInfo" :span="4">
      <div style="display:flex; justify-content: end">
        <el-button :icon="Plus" circle type="primary" @click="addDialogActive = true"/>
      </div>
    </el-col>
  </el-row>
  <el-row justify="center">
    <el-col v-if="supplierInfo" :span="9">供应商: {{ supplierInfo.name }}</el-col>
    <el-col v-if="supplierInfo" :span="9">电话: {{ supplierInfo.phone }}</el-col>
  </el-row>
  <el-row justify="center" style="margin: 30px 0;">
    <el-col :span="18">
      <el-table v-if="supplierInfo" :data="supplierInfo.items" border max-height="600" stripe>
        <el-table-column label="ID" prop="id"/>
        <el-table-column label="商品名" prop="name"/>
        <el-table-column label="价格" prop="price"/>
        <el-table-column label="数量" prop="num"/>
      </el-table>
    </el-col>
  </el-row>
  <el-row justify="center">
    <el-col v-if="supplierInfo" :span="18">E-Mail: {{ supplierInfo.email }}</el-col>
  </el-row>
  <el-row justify="center">
    <el-col v-if="supplierInfo" :span="18">地址: {{ supplierInfo.address }}</el-col>
  </el-row>
  <el-dialog v-model="changeSupplierInfoActive">
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">
        名字:
      </el-col>
      <el-col :span="16">
        <el-input v-model="supplierInfo.name"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">
        地址:
      </el-col>
      <el-col :span="16">
        <el-input v-model="supplierInfo.address"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">
        电话:
      </el-col>
      <el-col :span="16">
        <el-input v-model="supplierInfo.phone"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">
        E-mail:
      </el-col>
      <el-col :span="16">
        <el-input v-model="supplierInfo.email"/>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="1.5">
        <el-button type="warning" @click="handleSaveChange">保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
  <el-dialog v-model="addDialogActive">
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">ID:</el-col>
      <el-col :span="16">
        <el-input v-model="addingSupplier.id"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">
        名字:
      </el-col>
      <el-col :span="16">
        <el-input v-model="addingSupplier.name"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">
        地址:
      </el-col>
      <el-col :span="16">
        <el-input v-model="addingSupplier.address"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">
        电话:
      </el-col>
      <el-col :span="16">
        <el-input v-model="addingSupplier.phone"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin: 20px 0">
      <el-col :span="4">
        E-mail:
      </el-col>
      <el-col :span="16">
        <el-input v-model="addingSupplier.email"/>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="1.5">
        <el-button type="warning" @click="handleSaveAdd">保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
  <el-alert v-show="errMsg !== ''" :title="errMsg" class="alert" type="error"/>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { CloseBold, Plus, Remove } from '@element-plus/icons-vue'
import { Supplier } from '@/api/types'

const allSupplierId = ref<string[]>([])

const selectedSupplierId = ref<string>('')

const supplierInfo = ref<Supplier>()

const changeSupplierInfoActive = ref<boolean>(false)

const addDialogActive = ref<boolean>(false)

const addingSupplier = ref<Supplier>({} as Supplier)

const errMsg = ref<string>('')

const handleSaveAdd = () => {
  if (allSupplierId.value.indexOf(addingSupplier.value.id) !== -1) {
    errMsg.value = '重复ID'
  } else {
    axios.post('/manage/supplier/add', JSON.stringify(addingSupplier.value), {
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      allSupplierId.value = response.data.data
    }).catch(err => console.log(err))

    errMsg.value = ''
    addingSupplier.value = {
      name: '',
      id: '',
      phone: '',
      address: '',
      email: ''
    } as Supplier
    addDialogActive.value = false
  }
}

const handleUpdateSupplierInfo = () => {
  changeSupplierInfoActive.value = true
}

const handleSaveChange = () => {
  axios.post('/manage/supplier/update', JSON.stringify(supplierInfo.value), {
    headers: { 'Content-Type': 'application/json' }
  })
  changeSupplierInfoActive.value = false
}

const handleDel = () => {
  axios.post('/manage/supplier/del', JSON.stringify({ id: selectedSupplierId.value }), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    allSupplierId.value = response.data.data
  }).catch(err => console.log(err))
  selectedSupplierId.value = ''
  supplierInfo.value = undefined
}

function getSupplierInfo () {
  axios.get('/manage/supplier/getItems', {
    params: {
      id: selectedSupplierId.value
    }
  }).then(response => {
    supplierInfo.value = response.data.data
    console.log(response.data.data)
  }).catch(err => console.log(err))
}

watch(selectedSupplierId, () => {
  if (selectedSupplierId.value === '') {
    supplierInfo.value = undefined
  }
})

onMounted(() => {
  axios.get('/manage/supplier/getId')
    .then(response => {
      allSupplierId.value = response.data.data
    }).catch(err => console.log(err))
})
</script>

<style scoped>
.alert {
  z-index: 9999;
  position: absolute;
  width: 30%;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
