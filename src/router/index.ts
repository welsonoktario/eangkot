import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { useAuth } from "@/stores";
import AuthPage from "@/views/Auth/AuthPage.vue";
import TabsPage from "@/views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs",
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
    path: "/auth/",
    name: "auth",
    component: AuthPage,
    children: [
      {
        path: "",
        redirect: "/auth/login",
      },
      {
        path: "login",
        name: "auth.login",
        component: () => import("@/views/Auth/LoginPage.vue"),
      },
      {
        path: "register/:phone",
        name: "auth.register",
        component: () => import("@/views/Auth/RegisterPage.vue"),
      },
    ],
  },
  {
    path: "/perjalanan",
    name: "perjalanan",
    component: () => import("@/views/PerjalananPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  if (!to.name.toString().includes("auth.")) {
    const auth = useAuth();
    const isLoggedIn = await auth.checkAuth();

    if (!isLoggedIn) {
      return { name: "auth.login" };
    }
  }
});

export default router;
