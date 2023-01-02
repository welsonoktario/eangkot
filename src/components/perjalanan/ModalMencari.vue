<template>
  <modal-layout :no-header="true" title="title">
    <template #content>
      <div class="modal-mencari">
        <div class="loader">
          <svg
            class="car"
            height="40"
            width="104"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              transform="translate(2 1)"
              stroke="#245652"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                class="car__body"
                d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01"
                stroke-width="3"
              />
              <ellipse
                class="car__wheel--left"
                stroke-width="3.2"
                fill="#FFF"
                cx="83.493"
                cy="30.25"
                rx="6.922"
                ry="6.808"
              />
              <ellipse
                class="car__wheel--right"
                stroke-width="3.2"
                fill="#FFF"
                cx="46.511"
                cy="30.25"
                rx="6.922"
                ry="6.808"
              />
              <path
                class="car__line car__line--top"
                d="M22.5 16.5H2.475"
                stroke-width="3"
              />
              <path
                class="car__line car__line--middle"
                d="M20.5 23.5H.4755"
                stroke-width="3"
              />
              <path
                class="car__line car__line--bottom"
                d="M25.5 9.5h-19"
                stroke-width="3"
              />
            </g>
          </svg>
        </div>
        <div class="mencari-text">
          <div class="ion-text-center">
            <ion-title class="ion-margin-bottom">Tunggu Sebentar</ion-title>
            <ion-label class="ion-margin-top ion-margin-horizontal">
              Kami sedang menyiapkan angkot untuk perjalanan anda
            </ion-label>
          </div>
        </div>
      </div>
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
  serverTimestamp,
  Unsubscribe,
} from '@firebase/firestore'
import { IonLabel, IonTitle, modalController } from '@ionic/vue'
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
    timestamp: serverTimestamp(),
    jemput: new GeoPoint(perjalanan.jemput[1], perjalanan.jemput[0]),
    tujuan: new GeoPoint(perjalanan.tujuan[1], perjalanan.tujuan[0]),
    status: StatusPesanan.PENDING,
  })

  unsub.value = onSnapshot(pesananRef, async (doc) => {
    const data = doc.data()
    if (data.status === StatusPesanan.ACCEPT) {
      unsub.value()

      perjalanan.setAngkot(nearestAngkot)
      perjalanan._isPerjalananStarted = true

      await modalController.dismiss(true)
    } else if (data.status === StatusPesanan.CANCEL) {
      blacklist.value.push(nearestAngkot.docId)
      cariAngkot()
    }
  })
}
</script>

<style scoped lang="scss">
.modal-mencari {
  height: 100% !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mencari-text {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mencari-subtitle {
  width: 2rem !important;
}

.loader {
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 2;
}

.car {
  &__body {
    animation: shake 0.2s ease-in-out infinite alternate;
  }

  &__line {
    transform-origin: center right;
    stroke-dasharray: 22;
    animation: line 0.8s ease-in-out infinite;
    animation-fill-mode: both;

    &--top {
      animation-delay: 0s;
    }

    &--middle {
      animation-delay: 0.2s;
    }

    &--bottom {
      animation-delay: 0.4s;
    }
  }
}

@keyframes shake {
  0% {
    transform: translateY(-1%);
  }
  100% {
    transform: translateY(3%);
  }
}

@keyframes line {
  0% {
    stroke-dashoffset: 22;
  }

  25% {
    stroke-dashoffset: 22;
  }

  50% {
    stroke-dashoffset: 0;
  }

  51% {
    stroke-dashoffset: 0;
  }

  80% {
    stroke-dashoffset: -22;
  }

  100% {
    stroke-dashoffset: -22;
  }
}
</style>
