import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "@/views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/home",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/home",
      },
      {
        path: "home",
        component: () => import("@/views/HomePage.vue"),
      },
      {
        path: "riwayat",
        component: () => import("@/views/RiwayatPage.vue"),
      },
      {
        path: "akun",
        component: () => import("@/views/AkunPage.vue"),
      },
    ],
  },
  {
    path: "/perjalanan",
    name: "Perjalanan",
    component: () => import("@/views/PerjalananPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
