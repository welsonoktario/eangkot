<template>
  <app-layout :fullscreen="true">
    <template #content>
      <ion-grid style="height: 100%" class="ion-padding-bottom">
        <ion-row style="height: 50%">
          <ion-col>
            <h1 class="ion-text-center font-bold font-serif">eAngkot</h1>
          </ion-col>
        </ion-row>
        <ion-row
          class="ion-align-items-end ion-padding-horizontal"
          style="height: 50%"
        >
          <ion-col>
            <ion-list lines="full">
              <form class="ion-margin-horizontal" @submit.prevent="otp()">
                <ion-item>
                  <ion-label position="floating">No. HP</ion-label>
                  <ion-input required v-model="phone" type="tel"></ion-input>
                </ion-item>
                <e-a-button
                  class="ion-margin-vertical"
                  expand="block"
                  color="primary"
                  type="submit"
                >
                  Mulai
                </e-a-button>
              </form>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import ModalOtp from '@/components/Auth/ModalOtp.vue'
import EAButton from '@/components/EAButton.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/stores/auth'
import { User } from '@/types/user'
import {
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  modalController,
  useIonRouter,
} from '@ionic/vue'
import { ref } from 'vue'

const ionRouter = useIonRouter()
const auth = useAuth()
const phone = ref('')

const login = async () => {
  const res = await auth.login(phone.value)
  const data = await res.data

  if (data.msg === 'REGISTERED') {
    await auth.setAuthUser(data.data.user as User, data.data.token)

    ionRouter.navigate('/tabs/home', 'root', 'replace')
  } else if (data.msg === 'REGISTER') {
    ionRouter.push(`/auth/register/${phone.value}`)
  }
}

const otp = async () => {
  const modal = await modalController.create({
    component: ModalOtp,
    componentProps: {
      phone: phone.value,
    },
    canDismiss: true,
  })

  await modal.present()

  const verified: boolean = (await modal.onDidDismiss()).data

  if (verified) {
    login()
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100%;
  vertical-align: middle;
}

.spin {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

ion-spinner {
  width: 28px;
  height: 28px;
  stroke: #444;
  fill: #222;
}

.font-bold {
  font-weight: 700;
  color: var(--ion-color-primary);
}
</style>
