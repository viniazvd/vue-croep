<template>
  <div id="app" class="vue-croep">
    <div
      class="wrapper"
      @mousemove="update"
      @mouseup="isDragging = false"
      @mousedown.prevent="isDragging = true"
    >
      <img ref="image" class="image" :src="require(`${src}`)" />

      <div class="crop-selector" :style="selectorStyle" />
    </div>

    <!-- <input type="text" v-model="selector"> -->

    <div class="preview-wrapper">
      <img ref="preview" class="preview" :style="previewStyle" />
    </div>

    <button @click="create">create</button>
    <canvas id="canvas" width="250" height="250" style="border: 1px solid black"></canvas>
  </div>
</template>

<script>
export default {
  name: 'vue-croep',

  props: {
    src: {
      type: String,
      default: './assets/logo.png'
    }
  },

  data () {
    return {
      coordinates: {
        x: null,
        y: null,
        width: null,
        height: null
      },
      selector: 100,
      isDragging: false
    }
  },

  watch: {
    src: { immediate: true, handler: 'loadImage' }
  },

  mounted () {
    const image = this.$refs['image']

    const { width, height } = image

    this.coordinates = {
      width,
      height,
      x: this.selector / 2,
      y: this.selector / 2
    }
  },

  computed: {
    scale () {
      return this.coordinates.width / this.selector
    },

    previewStyle () {
      const { x, y } = this.coordinates

      const preview = 250
      const halfScale = this.scale / 2
      const halfSelector = this.selector / 2
      const previewScale = preview * this.scale

      return {
        'width': `${previewScale}px`,
        'height': `${previewScale}px`,
        'transform': `
          translateX(${(-x + halfSelector) * halfScale}px)
          translateY(${(-y + halfSelector) * halfScale}px)
        `
      }
    },

    selectorStyle () {
      return {
        width: `${this.selector}px`,
        height: `${this.selector}px`,
        transform: `
          translateX(${ this.coordinates.x - this.selector / 2}px)
          translateY(${this.coordinates.y - this.selector / 2}px)
        `
      }
    }
  },

  methods: {
    loadImage () {
      this.$nextTick(() => {
        const cropImage = this.$refs['preview']

        cropImage.src = require(`${this.src}`)
      })
    },

    update ({ clientX: x, clientY: y }) {
      if (!this.isDragging) return

      this.coordinates = { ...this.coordinates, x, y }
    },

    create () {
      const preview = this.$refs.preview

      let ctx = document.getElementById('canvas').getContext('2d')
      const { x, y } = this.coordinates

      ctx.drawImage(preview, x, y, 250 * this.scale, 250 * this.scale)
      console.log(ctx)
    }
  }
}
</script>

<style lang="scss">
* { box-sizing: border-box; }

body { margin: 0; padding: 0; }

.vue-croep {
  & > .wrapper {
    position: relative;
    background: white;
    display: inline-block;
    border: 1px solid black;

    & > .image {
      width: 500px;
      height: 500px;
    }

    & > .crop-selector {
      cursor: crosshair;
      border: 1px solid black;
      background: rgba(white, .2);

      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
    }
  }

  & .preview-wrapper {
    width: 250px;
    height: 250px;
    margin: 0 auto;
    overflow: hidden;
    background: white;
    border: 1px solid black;

    & > .preview { display: block; }
  }
}
</style>
