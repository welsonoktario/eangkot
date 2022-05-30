import { User } from "@/models/user";
import { defineStore } from "pinia";
import { Storage } from "@capacitor/storage";
import { http } from "@/utils";

type AuthState = {
  user: User | undefined;
  token: string | undefined;
};

export const useAuth = defineStore("auth", {
  state: () =>
    ({
      user: undefined,
      token: undefined,
    } as AuthState),
  getters: {
    authUser: (state) => state.user,
    authToken: (state) => state.token,
  },
  actions: {
    async setAuthUser(user: User, token: string = null) {
      this.user = user;

      await Storage.remove({ key: "user" });
      await Storage.set({ key: "user", value: JSON.stringify(user) });

      if (token) {
        await Storage.remove({ key: "token" });
        this.token = token;
        await Storage.set({ key: "token", value: token });
      }
    },
    async checkAuth() {
      const user = await Storage.get({ key: "user" });
      const token = await Storage.get({ key: "token" });

      if (user.value != "null" && token.value != "null") {
        this.user = JSON.parse(user.value);
        this.token = token.value;

        http.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        return true;
      }

      return false;
    },
  },
});
