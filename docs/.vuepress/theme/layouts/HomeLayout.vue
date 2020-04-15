<template>
  <ParentLayout>
    <template #page-bottom>
      XXX
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import Home from '@parent-theme/components/Home.vue'

// console.log('DEBUG: Home', Home);

export default {
  components: {
    ParentLayout,
  }
}
</script>

<style>
</style>
