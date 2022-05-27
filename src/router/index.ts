import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "@/views/TabsPage.vue";
import { Storage } from "@capacitor/storage";
import { http } from "@/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/auth/login",
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
        name: "tabs.home",
        component: () => import("@/views/HomePage.vue"),
      },
      {
        path: "riwayat",
        name: "tabs.riwayat",
        component: () => import("@/views/RiwayatPage.vue"),
      },
      {
        path: "akun",
        name: "tabs.akun",
        component: () => import("@/views/AkunPage.vue"),
      },
    ],
  },
  {
    path: "/auth/login",
    name: "auth.login",
    component: () => import("@/views/Auth/LoginPage.vue"),
  },
  {
    path: "/auth/register/:phone",
    name: "auth.register",
    component: () => import("@/views/Auth/RegisterPage.vue"),
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

router.beforeEach(async (to, from) => {
  if (!to.name.toString().includes("auth.")) {
    const user = await Storage.get({ key: "user" });
    const token = await Storage.get({ key: "token" });

    if (user.value == "undefined") {
      return { name: "auth.login" };
    } else {
      http.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
      http.defaults.params = {
        user: JSON.parse(user.value).id,
      };
    }
  }
});

export default router;
