<template>
  <app-layout>
    <template #header>
      <app-bar title="Daftar Akun">
        <template #start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
      </app-bar>
    </template>

    <template #content>
      <ion-list>
        <ion-item>
          <ion-label position="floating">Nama</ion-label>
          <ion-input
            required
            type="text"
            autocomplete="name"
            v-model="nama"
          ></ion-input>
        </ion-item>
      </ion-list>
    </template>

    <template #footer>
      <e-a-button
        @click="register()"
        class="ion-margin"
        expand="block"
        color="primary"
        :disabled="nama ? false : true"
      >
        Daftar
      </e-a-button>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import EAButton from '@/components/EAButton.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/stores/auth'
import { User } from '@/types/user'
import {
  IonBackButton,
  IonButtons,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  useIonRouter,
} from '@ionic/vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const ionRouter = useIonRouter()
const auth = useAuth()

const { phone } = route.params
const nama = ref('')

const register = async () => {
  const res = await auth.register(nama.value, phone.toString())
  const data = await res.data

  if (data.status == 'OK') {
    await auth.setAuthUser(data.data.user as User, data.data.token)
    ionRouter.push('/tabs/home')
  }
}
</script>
