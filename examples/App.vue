<template>
  <div>
    <vue-croep ref="croep" />

    <button @click="crop">crop</button>
  </div>
</template>

<script>
import VueCroep from '../src/Index.vue'

export default {
  name: 'example',

  components: { VueCroep },

  methods: {
    crop () {
      this.$refs.croep.crop()
    }
  }
}
</script>
