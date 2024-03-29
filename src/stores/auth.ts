import { patch, post } from '@/lib/http'
import { User } from '@/types/user'
import { Preferences } from '@capacitor/preferences'
import { defineStore } from 'pinia'

type AuthState = {
  user: User | undefined
  token: string | undefined
}

export const useAuth = defineStore('auth', {
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
      this.user = user

      await Preferences.remove({ key: 'user' })
      await Preferences.set({ key: 'user', value: JSON.stringify(user) })

      if (token) {
        await Preferences.remove({ key: 'token' })
        this.token = token
        await Preferences.set({ key: 'token', value: token })
      }
    },
    async checkAuth() {
      const user = await Preferences.get({ key: 'user' })
      const token = await Preferences.get({ key: 'token' })

      if (
        user.value &&
        user.value != 'null' &&
        token.value &&
        token.value != 'null'
      ) {
        this.user = JSON.parse(user.value)
        this.token = token.value

        return true
      }

      return false
    },
    async login(phone: string) {
      return await post('auth/login', { phone })
    },
    async requestOTP(phone: string) {
      return await post('auth/request-otp', { phone })
    },
    async checkOTP(phone: string, pin: string) {
      return await post('auth/check-otp', { phone, pin })
    },
    async register(nama: string, phone: string) {
      return await post('auth/register', { nama, phone })
    },
    async ubahProfil(data: object) {
      return await patch(`user/${this.authUser.id}`, data)
    },
    async ubahPassword(data: object) {
      return await patch(`user/${this.authUser.id}/ubah-password`, data)
    },
    async logout() {
      this.user = undefined
      this.token = undefined
      await Preferences.clear()
    },
  },
})
