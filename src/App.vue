<template>
  <div id="app" class="vue-croep">
    <div
      class="wrapper"
      @mousemove="move"
      @mouseup="isDragging = false"
      @mousedown.prevent="isDragging = true"
    >
      <img
        v-show="isLoaded && !hasError"
        ref="image"
        class="image"
        :src="src"
        @load="isLoaded = true"
        @error="hasError = true"
      />

      <div v-if="hasError">ERROR</div>

      <svg
        v-else
        width="500"
        height="500"
        fill="white"
        class="wrapper-selector"
      >
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity=".5" />
          </filter>

          <clipPath id="mask">
            <circle :r="selector / 2" :cx="coordinates.x" :cy="coordinates.y" />
          </clipPath>
        </defs>

        <circle
          class="selector"
          stroke-width="2"
          stroke="#FFFFFF"
          filter="url(#shadow)"
          :r="selector / 2"
          :cx="coordinates.x"
          :cy="coordinates.y"
        />

        <image
          opacity=".5"
          width="500px"
          height="500px"
          preserveAspectRatio="none"
          :href="src"
        />
      </svg>
    </div>

    <input class="range" type="range" min="50" max="200" step="1" v-model="selector">

    <button @click="create">create</button>

    <canvas id="canvas" width="250" height="250" style="border: 1px solid black" />
  </div>
</template>

<script>
export default {
  name: 'vue-croep',

  props: {
    size: {
      type: Number,
      default: 500
    },

    src: {
      type: String,
      default: 'https://i0.wp.com/roteirodenoticias.com.br/wp-content/uploads/2018/04/mengo_atropela.jpg?fit=800%2C440'
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
      isLoaded: false,
      hasError: false,
      isDragging: false
    }
  },

  watch: {
    isLoaded: { handler: 'init' },
    selector: { handler: 'update' }
  },

  computed: {
    translate () {
      const { x, y, width } = this.coordinates
      const scale = width / this.selector

      const halfImage = 250
      const halfScale = scale / 2
      const halfSelector = this.selector / 2

      return {
        scale,
        halfSelector,
        size: halfImage * scale,
        x: (-x + halfSelector) * halfScale,
        y: (-y + halfSelector) * halfScale
      }
    },

    selectorStyle () {
      const { size, x, y } = this.translate

      return {
        'width': `${size}px`,
        'height': `${size}px`,
        'transform': `translateX(${x}px) translateY(${y}px)`
      }
    }
  },

  methods: {
    init () {
      if (!this.isLoaded) return

      const { halfSelector } = this.translate

      this.coordinates = {
        x: halfSelector,
        y: halfSelector,
        width: this.size,
        height: this.size
      }
    },

    move (e) {
      if (!this.isDragging) return

      this.update(e)
    },

    update (e) {
      const { height } = this.coordinates
      const { halfSelector } = this.translate

      const x = e.layerX || this.coordinates.x
      const y = e.layerY || this.coordinates.y

      this.coordinates = { ...this.coordinates, x, y }

      // fix positioning if passing container
      if (y <= this.selector / 2) this.coordinates.y = halfSelector // up
      if (x <= this.selector / 2) this.coordinates.x = halfSelector // left
      if (y >= height - this.selector / 2) this.coordinates.y = height - halfSelector // down
      if (x >= height - this.selector / 2) this.coordinates.x = height - halfSelector // right
    },

    create () {
      const image = this.$refs.image

      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      const { size, x, y } = this.translate

      ctx.drawImage(image, x, y, size, size)

      console.log(canvas.toDataURL())
    }
  }
}
</script>

<style lang="scss">
* { box-sizing: border-box; }
body { margin: 0; padding: 0; }

.vue-croep {
  display: flex;
  align-items: center;
  flex-direction: column;

  & > .wrapper {
    position: relative;
    background: white;
    display: inline-block;
    border: 1px solid black;

    & > .image {
      z-index: 1;
      width: 500px;
      height: 500px;
      display: block;
      clip-path: url(#mask);
      position: relative;
    }

    & > .wrapper-selector {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;

      // & > .selector:hover { cursor: pointer; }
    }
  }

  & > .range {
    height: 10px;
    width: 180px;
    margin-top: 40px;
  }
}
</style>
