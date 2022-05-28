<template>
  <el-row justify="center" style="margin: 50px 0 30px 0;">
    <el-col :span="purchasePlanInfo ? 14 : 18">
      <el-select v-model="selectedPurchasePlanId" :clear-icon="Remove" clearable placeholder="进货计划ID">
        <el-option v-for="id in allPlanId" :key="id" :label="id" :value="id" @click="getPurchasePlan"/>
      </el-select>
    </el-col>
    <el-col v-show="purchasePlanInfo" :span="4">
      <div style="display:flex; justify-content: end; align-items: center">
        <span v-if="purchasePlanInfo" style="margin-right: 20px;">{{
            purchasePlanInfo.status ? '已完成' : '未完成'
          }}</span>
        <el-button v-show="purchasePlanInfo" :icon="CloseBold" circle type="danger" @click="handleDel"/>
        <el-button :icon="Plus" circle type="primary" @click="addItemDialogActive = true"/>
      </div>
    </el-col>
  </el-row>
  <el-row justify="center" style="margin: 30px 0;">
    <el-col :span="18">
      <el-table v-if="purchasePlanInfo" :data="purchasePlanInfo.plans" border max-height="600" stripe>
        <el-table-column label="商品ID" prop="itemId"/>
        <el-table-column label="商品名" prop="itemName"/>
        <el-table-column label="数量" prop="itemNum"/>
        <el-table-column label="供应商ID" prop="SupplierId"/>
        <el-table-column label="供应商" prop="SupplierName"/>
      </el-table>
    </el-col>
  </el-row>
  <el-dialog v-model="addItemDialogActive">
    <el-row justify="center" style="margin: 30px 0">
      <el-col :span="4">商品ID</el-col>
      <el-col :span="20">
        <el-select v-model="addingItems.itemId">
          <el-option v-for="id in allItemsInfoMap.keys()" :key="id" :label="id" :value="id"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin: 30px 0">
      <el-col :span="4">商品名</el-col>
      <el-col :span="20">
        <el-input :model-value="1" disabled/>
        <!--        <el-input :model-value="allItemsInfoMap.get(addingItems.itemId).name" disabled/>-->
      </el-col>
    </el-row>
    <el-row justify="center" style="margin: 30px 0">
      <el-col :span="4">数量</el-col>
      <el-col :span="20">
        <el-input-number v-model="addingItems.itemNum"/>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin: 30px 0">
      <el-col :span="4">供应商ID</el-col>
      <el-col :span="20">
        <el-select v-model="addingItems.SupplierId">
          <el-option v-for="id in allSupplierInfoMap.keys()" :key="id" :label="id" :value="id"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin: 30px 0">
      <el-col :span="4">供应商</el-col>
      <el-col :span="20">
        <el-input :model-value="2" disabled/>
        <!--        <el-input :model-value="allSupplierInfoMap.get(addingItems.SupplierId).name" disabled/>-->
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import { CloseBold, Plus, Remove } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { Plan, PurchasePlan, ShoppingItem, Supplier } from '@/api/types'
import axios from 'axios'

const allPlanId = ref<string[]>([])
const selectedPurchasePlanId = ref<string>('')
const purchasePlanInfo = ref<PurchasePlan>()
const addItemDialogActive = ref<boolean>(false)

const allItemsInfo = ref<ShoppingItem[]>([])
const allItemsInfoMap = computed<Map<string, ShoppingItem>>(() => {
  const map = new Map<string, ShoppingItem>()
  allItemsInfo.value.forEach(value => map.set(value.id, value))
  return map
})

const allSupplierInfo = ref<Supplier[]>([])
const allSupplierInfoMap = computed<Map<string, Supplier>>(() => {
  const map = new Map<string, Supplier>()
  allSupplierInfo.value.forEach(value => map.set(value.id, value))
  return map
})

const addingItems = ref<Plan>({} as Plan)

const getPurchasePlan = () => {
  axios.get('/store/plan/show', {
    params: { id: selectedPurchasePlanId.value }
  }).then(response => {
    purchasePlanInfo.value = response.data.data
  }).catch(err => console.log(err))
}

const handleDel = () => {
  axios.post('/store/plan/del', JSON.stringify({ id: selectedPurchasePlanId.value }), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    allPlanId.value = response.data.data
  }).catch(err => console.log(err))
  selectedPurchasePlanId.value = ''
  purchasePlanInfo.value = undefined
}

onMounted(() => {
  axios.get('/store/plan/getId').then(
    response => {
      allPlanId.value = response.data.data
    }
  ).catch(err => console.log(err))

  axios.get('/shopping/items').then(
    response => {
      allItemsInfo.value = response.data.data
    }
  ).then(
    err => console.log(err)
  )

  axios.get('/manage/supplier/show').then(
    response => {
      allSupplierInfo.value = response.data.data
    }
  ).catch(
    err => console.log(err)
  )
})

</script>
<style scoped>

</style>
