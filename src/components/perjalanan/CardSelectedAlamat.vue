<template>
  <ion-card>
    <ion-card-content>
      {{ address ? address : 'Gerakkan map' }}
      <e-a-button
        class="ion-margin-top"
        fill="solid"
        expand="block"
        @click="emits('select')"
      >
        Pilih
      </e-a-button>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts" setup>
import EAButton from '@/Components/EAButton.vue'
import { IonCard, IonCardContent } from '@ionic/vue'

defineProps({ address: String })
const emits = defineEmits<{ (e: 'select'): void }>()
</script>
