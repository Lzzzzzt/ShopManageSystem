<template>
  <el-row :gutter="20" justify="center" style="width: 90%; margin: 5% 5%; height: calc(95vh * 0.84);">
    <el-col :span="22">
      <el-card header="商品" shadow="hover" style="height: 100%">
        <el-table height="600px" :data="items" stripe>
          <el-table-column label="商品名" prop="name"></el-table-column>
          <el-table-column label="折扣" prop="discount"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="库存" prop="stock"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="addItem(scope.row.id)" type="primary" plain :disabled="scope.row.stock <= 0">
                购买
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
  <el-button circle type="primary" class="cart" :icon="ShoppingCartFull" @click="cartActive = true"/>
  <el-dialog v-model="cartActive">
    <el-table :data="cartItems" height="500px" title="购物车">
      <el-table-column label="商品名">
        <template #default="scope">
          {{ itemMap.get(scope.row.id) }}
        </template>
      </el-table-column>
      <el-table-column prop="num" label="数量"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" plain @click="removeItem(scope.row.id)">
            减少
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { CheckOrderItem, ShoppingItem } from '@/api/types'
import { ShoppingCartFull } from '@element-plus/icons-vue'

const items = ref<ShoppingItem[]>([])

const cartItems = ref<CheckOrderItem[]>([])

const itemMap = computed<Map<string, string>>(() => {
  const im = new Map<string, string>()
  items.value.forEach(value => im.set(value.id, value.name))
  return im
})

const cartActive = ref<boolean>(false)

function addItem (id: string) {
  let cnt = 0
  cartItems.value.forEach(value => {
    if (value.id === id) {
      value.num++
      return
    }
    cnt++
  })
  if (cnt === cartItems.value.length) {
    cartItems.value.push({
      id,
      num: 1
    })
  }
  items.value.forEach(value => value.id === id ? value.stock-- : '')
}

function removeItem (id: string) {
  console.log(id)
}

onMounted(() => {
  axios.get('/shopping/items')
    .then(response => {
      items.value = response.data.data
    })
    .catch(err => {
      console.log(err)
    })
})
</script>

<style scoped>
.cart {
  position: absolute;
  top: 94%;
  left: 95%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
}
</style>
