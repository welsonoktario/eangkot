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
import { Trayek } from '@/types'
import { StatusPesanan } from '@/types/statusEnum'
import {
  addDoc,
  collection,
  doc,
  Firestore,
  GeoPoint,
  onSnapshot,
  Unsubscribe,
} from '@firebase/firestore'
import { modalController } from '@ionic/vue'
import { inject, onMounted, ref, watch } from 'vue'

const db: Firestore = inject('db')
const angkot = useAngkot()
const perjalanan = usePerjalanan()
const auth = useAuth()
const unsub = ref<Unsubscribe>()
const isRejected = ref(false)
const blacklist = ref<string[]>([])

onMounted(async () => {
  await cariAngkot()
})

watch(isRejected, (next, prev) => {
  if (next) {
    unsub.value()
  }
})

const cariAngkot = async () => {
  const angkots = angkot.findAngkots(perjalanan.jemput)

  if (angkots.length === 0) {
    await modalController.dismiss(false)
  }

  const nearestAngkot = angkots[0]
  perjalanan.setAngkot(nearestAngkot)
  
  const docRef = doc(
    db,
    `angkots-${(perjalanan.trayek as Trayek).kode}`,
    nearestAngkot.docId
  )
  const colRef = collection(docRef, 'penumpangs')
  const user = auth.authUser

  const pesananRef = await addDoc(colRef, {
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      noHp: user.noHp,
    },
    jemput: new GeoPoint(perjalanan.jemput[1], perjalanan.jemput[0]),
    tujuan: new GeoPoint(perjalanan.tujuan[1], perjalanan.tujuan[0]),
    status: StatusPesanan.PENDING,
  })

  unsub.value = onSnapshot(pesananRef, async (doc) => {
    const data = doc.data()
    if (data.status === StatusPesanan.ACCEPT) {
      await modalController.dismiss(true)
    } else if (data.status === StatusPesanan.CANCEL) {
      blacklist.value.push(nearestAngkot.docId)
      cariAngkot()
    }
  })
}
</script>
