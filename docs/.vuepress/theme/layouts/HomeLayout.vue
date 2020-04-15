<template>
  <ParentLayout>
    <!-- <Foo #foo/> -->
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

console.log('DEBUG: ParentLayout', ParentLayout);

export default {
  components: {
    ParentLayout,
  }
}
</script>

<style>
</style>
