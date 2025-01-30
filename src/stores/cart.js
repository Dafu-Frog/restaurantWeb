import { defineStore } from "pinia"

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),

  getters: {
    totalCount: (state) => {
      return state.items.reduce((sum, item) => sum + item.count, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((sum, item) => sum + item.price * item.count, 0)
    },
  },

  actions: {
    updateCart(item) {
      const existingItem = this.items.find((i) => i.id === item.id)
      if (existingItem) {
        if (item.count === 0) {
          this.items = this.items.filter((i) => i.id !== item.id)
        } else {
          existingItem.count = item.count
        }
      } else if (item.count > 0) {
        this.items.push(item)
      }
    },

    clearCart() {
      this.items = []
    },
  },
})
