<template>
  <Header />
  <SignIn />
  <BottomNav />
</template>

<script lang="ts" setup>
import Header from '../../components/common/Header.vue'
import SignIn from '../../components/auth/signin/SignIn.vue'
import BottomNav from '../../components/common/BottomNav.vue'
</script>

<style lang="scss" scoped>
@import '@/scss/main';
</style>
