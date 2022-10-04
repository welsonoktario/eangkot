<template>
  <modal-layout :no-header="true" title="title">
    <template #content>
      <h1>Mencari</h1>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import ModalLayout from '@/components/ModalLayout.vue'
import { useAngkot, useAuth, usePerjalanan } from '@/stores'
import {
  addDoc,
  collection,
  doc,
  Firestore,
  GeoPoint,
} from '@firebase/firestore'
import { modalController } from '@ionic/vue'
import { inject, onMounted } from 'vue'

const db: Firestore = inject('db')
const angkot = useAngkot()
const perjalanan = usePerjalanan()
const auth = useAuth()

onMounted(() => {
  console.log(perjalanan.angkot)
  console.log(perjalanan.trayek)
  console.log(perjalanan.jemput)
  console.log(perjalanan.tujuan)

  cariAngkot()
})

const cariAngkot = async () => {
  const angkots = angkot.findAngkots(perjalanan.jemput)
  const nearestAngkot = angkots[0]

  if (angkots.length === 0) {
    await modalController.dismiss(false)
  }

  perjalanan.setAngkot(nearestAngkot)

  const docRef = doc(
    db,
    `angkots-${perjalanan.trayek.kode}`,
    nearestAngkot.id.toString()
  )
  const colRef = collection(docRef, 'penumpangs')
  const user = auth.authUser

  await addDoc(colRef, {
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      noHp: user.noHp,
    },
    jemput: new GeoPoint(perjalanan.jemput[1], perjalanan.jemput[0]),
    tujuan: new GeoPoint(perjalanan.tujuan[1], perjalanan.tujuan[0]),
    status: 'pending',
  })

  await modalController.dismiss(true)
}
</script>
