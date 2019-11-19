<template>
  <div>
    <input type="file" @change="getBase64">

    <vue-croep ref="croep" :src="src" />

    <button @click="crop">crop</button>
  </div>
</template>

<script>
import VueCroep from '../src/Index.vue'

export default {
  name: 'example',

  components: { VueCroep },

  data () {
    return {
      src: ''
    }
  },

  methods: {
    getBase64 (event) {
      const file = event.target.files[0]
      let reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = () => this.src = reader.result
    },

    crop () {
      this.$refs.croep.crop()
    }
  }
}
</script>
