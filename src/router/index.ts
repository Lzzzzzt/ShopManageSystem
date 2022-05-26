import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import PurchaseView from '@/views/Shopping/PurchaseView.vue'
import ShoppingView from '@/views/Shopping/ShoppingView.vue'
import ReturnView from '@/views/Shopping/ReturnView.vue'

import StockView from '@/views/StoreHouse/StockView.vue'
import StorehouseView from '@/views/StoreHouse/StorehouseView.vue'
import ItemsView from '@/views/StoreHouse/Items/ItemsView.vue'
import ItemAddView from '@/views/StoreHouse/Items/ItemAddView.vue'
import PurchasePlanView from '@/views/StoreHouse/PurchasePlanView.vue'

import ManageView from '@/views/Manage/ManageView.vue'
import StuffView from '@/views/Manage/StuffView.vue'
import VIPView from '@/views/Manage/VIPView.vue'
import SupplierView from '@/views/Manage/SupplierView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/shopping',
    name: 'shopping',
    component: ShoppingView,
    children: [
      {
        path: '/shopping/purchase',
        name: 'purchaseItems',
        component: PurchaseView
      },
      {
        path: '/shopping/return',
        name: 'return',
        component: ReturnView
      }
    ]
  },
  {
    path: '/storehouse',
    name: 'storehouse',
    component: StorehouseView,
    children: [
      {
        path: 'stock',
        name: 'stock',
        component: StockView
      },
      {
        path: 'items',
        name: 'items',
        component: ItemsView,
        children: [
          {
            path: 'add',
            name: 'ItemAdd',
            component: ItemAddView
          }
        ]
      },
      {
        path: 'plan',
        name: 'plan',
        component: PurchasePlanView
      }
    ]
  },
  {
    path: '/manage',
    name: 'manage',
    component: ManageView,
    children: [
      {
        path: 'stuff',
        name: 'stuff',
        component: StuffView
      },
      {
        path: 'vip',
        name: 'vip',
        component: VIPView
      },
      {
        path: 'supplier',
        name: 'supplier',
        component: SupplierView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
