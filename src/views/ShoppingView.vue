<template>
  <el-row :gutter="20" justify="center" style="width: 90%; margin: 5% 5%; height: calc(95vh * 0.84);">
    <el-col :span="22">
      <el-card header="商品" shadow="hover" style="height: 100%">
        <el-table height="600px" :data="items" stripe>
          <el-table-column label="商品名" prop="name"/>
          <el-table-column label="折扣" prop="discount"/>
          <el-table-column label="价格" prop="price"/>
          <el-table-column label="库存" prop="stock"/>
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
  <el-button circle type="primary" class="cart" :icon="ShoppingCartFull" @click="cartDialogActive = true"/>
  <el-dialog v-model="cartDialogActive" destroy-on-close>
    <template #header>购物车</template>
    <el-table :data="itemsInCart" height="500px" show-summary :summary-method="getCartSummary" ref="cartDialogRef">
      <el-table-column label="商品名">
        <template #default="scope">
          {{ itemNameMap.get(scope.row.id) }}
        </template>
      </el-table-column>
      <el-table-column label="折扣">
        <template #default="scope">
          {{ itemDiscountMap.get(scope.row.id) }}
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template #default="scope">
          {{ itemPriceMap.get(scope.row.id) }}
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
    <el-button type="primary" style="margin: 10px 0 10px 100%; transform: translateX(-100%)"
               :disabled="itemsInCart.length === 0" @click="handleOrderSettlement">
      结算
    </el-button>
  </el-dialog>
  <el-dialog v-model="orderDialogActive">
    <template #header>订单</template>
    <el-row style="margin: 5px 0">
      <el-col :span="12">ID: {{ orderInfo.id }}</el-col>
      <el-col :span="12">{{ orderInfo.orderTime }}</el-col>
    </el-row>
    <el-row style="margin: 5px 0">
      <el-table :data="orderInfo.detail" max-height="500" border>
        <el-table-column prop="name" label="商品名"/>
        <el-table-column label="支付金额">
          <template #default="scope">
            <span>{{ scope.row.price - scope.row.discount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="margin: 5px 0">
      <el-col :span="6">{{ orderInfo.state ? '已完成' : '未完成' }}</el-col>
      <el-col :span="12">收银员: {{ orderInfo.stuffId }}</el-col>
      <el-col :span="6">总支付金额: {{ orderInfo.price }}</el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { computed, nextTick, onMounted, ref } from 'vue'
import { CheckOrderItem, Order, ShoppingItem } from '@/api/types'
import { ShoppingCartFull } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'

const items = ref<ShoppingItem[]>([])

const itemsInCart = ref<CheckOrderItem[]>([])

const itemNameMap = computed<Map<string, string>>(() => {
  const im = new Map<string, string>()
  items.value.forEach(value => im.set(value.id, value.name))
  return im
})

const itemPriceMap = computed<Map<string, number>>(() => {
  const map = new Map<string, number>()
  items.value.forEach(value => map.set(value.id, value.price))
  return map
})

const itemDiscountMap = computed<Map<string, number>>(() => {
  const map = new Map<string, number>()
  items.value.forEach(value => map.set(value.id, value.discount))
  return map
})

const cartDialogActive = ref<boolean>(false)

const orderDialogActive = ref<boolean>(false)

const orderInfo = ref<Order>()

function getCartSummary () {
  if (itemsInCart.value.length !== 0) {
    const res: string[] = []

    res.push('合计')

    const discount = itemsInCart.value.map((value, index) => {
      return itemDiscountMap.value.get(value.id) as number * itemsInCart.value[index].num
    }).reduce((pre, cur) => pre + cur)

    const price = itemsInCart.value.map((value, index) => {
      return itemPriceMap.value.get(value.id) as number * itemsInCart.value[index].num
    }).reduce((pre, cur) => pre + cur)

    const num = itemsInCart.value.map(value => value.num).reduce((pre, cur) => pre + cur)

    res.push(discount.toString())
    res.push(price.toString())
    res.push(num.toString())
    res.push(`¥${price - discount}`)

    return res
  } else {
    return new Array<string>(5).fill('')
  }
}

function addItem (id: string) {
  let cnt = 0
  itemsInCart.value.forEach(value => {
    if (value.id === id) {
      value.num++
      return
    }
    cnt++
  })
  if (cnt === itemsInCart.value.length) {
    itemsInCart.value.push({
      id,
      num: 1
    })
  }
  items.value.forEach(value => value.id === id ? value.stock-- : '')
}

function removeItem (id: string) {
  itemsInCart.value.forEach((value, index) => {
    if (value.id === id) {
      value.num--
    }
    if (value.num === 0) {
      itemsInCart.value.splice(index, 1)
    }
  })
  items.value.forEach(value => value.id === id ? value.stock++ : '')
}

function handleOrderSettlement () {
  axios.post('/shopping/checkOrder').then(response => {
    if (response.data.status === 0) {
      orderInfo.value = response.data.data
      orderDialogActive.value = true
    } else {
      console.log(response.data.msg)
    }
  }).catch(err => console.log(err))
  nextTick(() => {
    cartDialogActive.value = false
    itemsInCart.value = []
  })
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
