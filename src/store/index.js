import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
// import { resolve } from 'dns'
// import { reject } from 'q'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addCounter(state,payload) {
      payload.count++
    },
    addToCart(state,payload) {
      payload.checked = true
      state.cartList.push(payload)
    }
  },
  actions: {
    addCart(context,payload) {
      return new Promise((resolve,reject) => {
         //payload添加的商品
        let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      //判断oldProduct
        if(oldProduct) {
        // oldProduct.count += 1
          context.commit('addCounter',oldProduct)
          resolve('当前商品数+1')
        }else {
          payload.count = 1
        // context.state.cartList.push(payload)
          context.commit('addToCart', payload)
          resolve('添加新商品')
        }    
      })
    }
  },
  modules: {
  },
  getters,
})
