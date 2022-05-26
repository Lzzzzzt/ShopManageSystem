<template>
  <el-row class="header" @click="router.push({path: '/'})">
    中小型超市管理系统
  </el-row>
  <el-row style="width: 100vw; height: 95vh;">
    <el-col :span="4">
      <el-menu style="height: 100%" router unique-opened>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <ShoppingCart/>
            </el-icon>
            <span>超市</span>
          </template>
          <el-menu-item :route="{name: 'purchaseItems'}" index="1-1">
            <span>购物</span>
          </el-menu-item>
          <el-menu-item :route="{name: 'return'}" index="1-2">
            <span>退货</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Box/>
            </el-icon>
            <span>仓库</span>
          </template>
          <el-menu-item index="2-1" :route="{name: 'stock'}">
            库存
          </el-menu-item>
          <el-sub-menu index="2-2">
            <template #title>
              <span>商品</span>
            </template>
            <el-menu-item index="2-2-1" :route="{name: 'ItemAdd'}">
              进货
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2-3" :route="{name: 'plan'}">
            <span>进货计划</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <Menu/>
            </el-icon>
            <span>管理</span>
          </template>
          <el-menu-item index="3-1">
            <span>员工</span>
          </el-menu-item>
          <el-menu-item index="3-2">
            <span>VIP</span>
          </el-menu-item>
          <el-menu-item index="3-3">
            <span>供应商</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <router-view/>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { Router, useRouter } from 'vue-router'
import { Box, Menu, ShoppingCart } from '@element-plus/icons-vue'

const router: Router = useRouter()

</script>

<style>
body {
  margin: 0;
}

.header {
  height: 5vh;
  border-bottom: 1px solid var(--el-border-color);
  background-color: #409EFF;
  color: white;
  line-height: 5vh;
  font-size: 20px;

  padding-left: 10px;
  cursor: pointer;
}
</style>
