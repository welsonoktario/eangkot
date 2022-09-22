<template>
  <modal-layout :no-header="true" title="title">
    <template #content>
      <h1>Mencari</h1>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import ModalLayout from '@/components/ModalLayout.vue'
import { modalController } from '@ionic/vue'
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(async () => {
    const status = Math.random() > 0.5 ? 1 : 0
    await modalController.dismiss(status)
  }, 3000)
})
</script>
