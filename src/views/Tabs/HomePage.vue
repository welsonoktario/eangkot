<template>
  <app-layout title="eAngkot" :largeTitle="true">
    <template #header>
      <app-bar title="Home" />
    </template>

    <template #content>
      <ion-grid class="ion-padding-horizontal">
        <ion-row v-if="user">
          <ion-col>
            <h1>
              Halo, <strong>{{ user.nama }}</strong>
            </h1>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <h3>Mau kemana hari ini?</h3>
            <e-a-button router-link="/perjalanan" expand="block">
              {{
                perjalanan.isPerjalananStarted
                  ? 'Lihat Perjalanan'
                  : 'Cari Angkot'
              }}
            </e-a-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </app-layout>
</template>
<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import EAButton from '@/components/EAButton.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth, usePerjalanan } from '@/stores'
import { Angkot, User } from '@/types'
import { Preferences } from '@capacitor/preferences'
import { doc, Firestore, getDoc } from '@firebase/firestore'
import { IonCol, IonGrid, IonRow, loadingController } from '@ionic/vue'
import { inject, onMounted, ref } from 'vue'

const auth = useAuth()
const perjalanan = usePerjalanan()
const db = inject<Firestore>('db')
const user = ref<User>(null)

onMounted(async () => await loadUser())

const loadUser = async () => {
  const loading = await loadingController.create({
    message: 'Mohon tunggu...',
  })

  await loading.present()

  const { value: userPref } = await Preferences.get({ key: 'user' })
  const { value: token } = await Preferences.get({ key: 'token' })

  const userJson = JSON.parse(userPref)

  if (perjalanan.angkot?.docId && perjalanan.trayek) {
    const angkotRef = doc(
      db,
      `angkots-${perjalanan.trayek}/${perjalanan.angkot.docId}`
    )
    const angkotSnapshot = await getDoc(angkotRef)

    if (angkotSnapshot.exists()) {
      const data = angkotSnapshot.data()
      data.docId = angkotSnapshot.id

      perjalanan.setAngkot(data as Angkot)
    }
  }

  user.value = userJson
  auth.setAuthUser(user.value, token)

  await loading.dismiss()
}
</script>
