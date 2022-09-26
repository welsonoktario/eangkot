<template>
  <div class="app-bar">
    <div class="app-bar-start">
      <slot name="start" v-if="slots.start"></slot>
    </div>
    <IonText class="app-bar-title">{{ title }}</IonText>
    <div class="app-bar-end">
      <slot name="end" v-if="slots.end"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IonText } from '@ionic/vue'
import { useSlots } from 'vue'

const slots = useSlots()
defineProps({
  title: String,
})
</script>
