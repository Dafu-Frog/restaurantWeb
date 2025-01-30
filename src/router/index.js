import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/home",
    name: "Menu",
    component: () => import("../views/Menu.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "AdminLayout",
    component: () => import("../views/admin/Layout.vue"),
    children: [
      {
        path: "",
        redirect: "/admin/dishes",
      },
      {
        path: "dishes",
        name: "Dishes",
        component: () => import("../views/admin/Dishes.vue"),
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("../views/admin/Orders.vue"),
      },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const userRole = localStorage.getItem("userRole")

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login")
  } else if (to.meta.requiresAdmin && userRole !== "admin") {
    next("/home")
  } else {
    next()
  }
})

export default router
