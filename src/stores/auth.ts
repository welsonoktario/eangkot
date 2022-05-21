import { User } from "@/models/user";
import { defineStore } from "pinia";
import { Storage } from "@capacitor/storage";

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
    async setAuthUser(user: User, token: string) {
      this.user = user;
      this.token = token;

      await Storage.clear();
      await Storage.set({ key: "user", value: JSON.stringify(user) });
      await Storage.set({ key: "token", value: token });
    },
    async checkAuth() {
      const user = await Storage.get({ key: "user" });
      const token = await Storage.get({ key: "token" });

      if (user.value && token.value) {
        this.user = JSON.parse(user.value);
        this.token = token.value;

        return true;
      }

      return false;
    },
  },
});
