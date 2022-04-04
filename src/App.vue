<template>
  <RouterView v-if="device === 'pc'" />
  <RouterView v-else-if="device === 'tablet'" name="tablet" />
  <RouterView v-if="device === 'mobile'" name="mobile" />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

const device = ref<string>('pc')

const getDevice = () => {
  if (window.innerWidth < 600) {
    device.value = 'mobile'
  } else if (window.innerWidth >= 600 && window.innerWidth < 1280) {
    device.value = 'tablet'
  } else {
    device.value = 'pc'
  }
}

onMounted(() => {
  window.addEventListener('resize', getDevice, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', getDevice)
})

getDevice()
</script>

<style lang="scss" scoped>
@import '@/scss/main';
</style>
