<template>
  <el-steps :active="active" align-center finish-status="success" style="margin-top: 30px;">
    <el-step :icon="QuestionFilled" description="商品是否在记录中" title="Step 1"/>
    <el-step :icon="HomeFilled" description="商品在记录中" title="Step 2"/>
    <el-step :icon="HomeFilled" description="商品不在记录中" title="Step 3"/>
  </el-steps>
  <el-row v-if="active === 0" justify="center" style="margin-top: 30%;">
    <el-col :span="6" style="display: flex; justify-content: center">
      <el-button @click="next(1)">是</el-button>
    </el-col>
    <el-col :span="6" style="display: flex; justify-content: center">
      <el-button @click="next(0)">否</el-button>
    </el-col>
  </el-row>
  <div v-else-if="active === 1">
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">商品ID</el-col>
      <el-col :span="12">
        <el-select v-model="item.itemId">
          <el-option v-for="id in itemsMap.keys()" :key="id" :label="id" :value="id"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">商品名</el-col>
      <el-col :span="12">
        <el-input :model-value="itemsMap.get(item.itemId)" disabled/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">数量</el-col>
      <el-col :span="12">
        <el-input-number v-model="item.num"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">仓库ID</el-col>
      <el-col :span="12">
        <el-select v-model="item.storehouseId">
          <el-option v-for="id in storehouseIds" :key="id" :label="id" :value="id"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="1.5">
        <el-button @click="next">保存</el-button>
      </el-col>
    </el-row>
  </div>
  <div v-else>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">商品ID</el-col>
      <el-col :span="12">
        <el-input v-model="item.itemId"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">商品名</el-col>
      <el-col :span="12">
        <el-input v-model="item.itemName"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">数量</el-col>
      <el-col :span="12">
        <el-input-number v-model="item.num"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">价格</el-col>
      <el-col :span="12">
        <el-input-number v-model="item.price"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">会员折扣</el-col>
      <el-col :span="12">
        <el-input-number v-model="item.discount"/>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="2">仓库ID</el-col>
      <el-col :span="12">
        <el-select v-model="item.storehouseId">
          <el-option v-for="id in storehouseIds" :key="id" :label="id" :value="id"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row align="middle" justify="center" style="margin-top: 50px">
      <el-col :span="1.5">
        <el-button @click="next">保存</el-button>
      </el-col>
    </el-row>
  </div>
  <el-alert v-show="showMsg" :type="isSuccess ? 'success' : 'error'" class="alert">
    {{ isSuccess ? '成功' : '错误' }}
  </el-alert>
</template>

<script lang="ts" setup>
import { HomeFilled, QuestionFilled } from '@element-plus/icons-vue'
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { ShoppingItem } from '@/api/types'

interface Item {
  itemId: string
  num: number
  itemName: string
  storehouseId: string
  discount: number,
  price: number,
  name: string
}

const active = ref<number>(0)

const next = (value = 0) => {
  switch (active.value) {
    case 0:
      if (value) {
        active.value += 1
      } else {
        active.value += 2
      }
      break
    case 1:
      active.value = save(true)
      break
    case 2:
      active.value = save(false)
      break
  }
}

const storehouseIds = ref<string[]>([])

const item = ref<Item>({
  num: 0,
  discount: 0,
  price: 0
} as Item)

watch(item, () => {
  if (active.value === 1) {
    item.value.itemName = itemsMap.value.get(item.value.itemId) as string
  }
})

const items = ref<ShoppingItem[]>([])

const itemsMap = computed<Map<string, string>>(() => {
  const map = new Map<string, string>()
  items.value.forEach(value => map.set(value.id, value.name))
  return map
})

const showMsg = ref<boolean>(false)

const isSuccess = ref<boolean>(false)

const save = (isInTable: boolean): number => {
  if (!isInTable && [...itemsMap.value.keys()].indexOf(item.value.itemId) !== -1) {
    isSuccess.value = false
    showMsg.value = true
    setTimeout(() => {
      showMsg.value = false
    }, 2000)
    return 2
  }

  axios.post('/store/item/add', JSON.stringify({
    ...item.value,
    isInTable: isInTable
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    isSuccess.value = !response.data.status
    showMsg.value = true
    setTimeout(() => {
      showMsg.value = false
    }, 2000)
  })

  return 0
}

onMounted(() => {
  axios.get('/store/getStorageID')
    .then(response => {
      storehouseIds.value = response.data.data
    })
    .catch(err => console.log(err))

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
.alert {
  position: absolute;
  width: 34%;
  top: 30%;
  margin: 0 25%;
}
</style>
