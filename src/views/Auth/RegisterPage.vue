<template>
  <AppLayout>
    <template #header>
      <AppBar title="Daftar Akun">
        <template #start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
      </AppBar>
    </template>

    <template #content>
      <IonList>
        <IonItem>
          <IonLabel position="floating">Nama</IonLabel>
          <IonInput
            required
            type="text"
            autocomplete="name"
            v-model="nama"
          ></IonInput>
        </IonItem>
      </IonList>
    </template>

    <template #footer>
      <IonButton
        @click="register()"
        class="ion-margin"
        expand="block"
        color="primary"
        :disabled="nama ? false : true"
      >
        Daftar
      </IonButton>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/stores/auth'
import { User } from '@/types/user'
import {
  IonBackButton,
  IonButton,
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
