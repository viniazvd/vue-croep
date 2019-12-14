<template>
  <div class="vue-croep">
    <div
      class="wrapper"
      v-on="{
        [events.move]: move,
        [events.end]: () => isDragging = false
      }"
    >
      <img
        ref="image"
        class="image"
        :src="src"
        :style="{
          maxHeight: size + 'px',
          opacity: isDragging ? 1 : 0.7
        }"
        crossorigin="anonymous"
        @load="onImageLoad"
        v-on:[events.start].prevent="isDragging = true"
      />

      <c-selector
        v-if="isLoaded && !hasError"
        :src="src"
        :selector="selector"
        :coordinates="coordinates"
      />
    </div>

    <c-range
      :value="selector"
      :min="100"
      :max="orientedSize"
      @input="range"
    />
  </div>
</template>

<script>
import VueCoeImage from 'vue-coe-image'
import 'vue-coe-image/dist/vue-coe-image.css'

import CRange from './components/CRange.vue'
import CSelector from './components/CSelector.vue'

const isMobile = () => {
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp2|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
}

export default {
  name: 'vue-croep',

  components: { VueCoeImage, CRange, CSelector },

  props: {
    size: {
      type: Number,
      default: 400
    },

    src: {
      type: String,
      default: 'https://pbs.twimg.com/profile_images/515195474848927744/wWahjxpP_400x400.jpeg'
    }
  },

  data () {
    return {
      canvas: null,
      timer: null,
      events: {},
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
    selector: { handler: 'updateBoundaries' },
    src: { handler: 'resetLoader' }
  },

  created () {
    this.events = {
      'end': isMobile() ? 'touchend' : 'mouseup',
      'move': isMobile() ? 'touchmove' : 'mousemove',
      'start': isMobile() ? 'touchstart' : 'mousedown'
    }
  },

  computed: {
    orientation () {
      if (this.coordinates.width > this.coordinates.height)
        return 'landscape'
      if (this.coordinates.width < this.coordinates.height)
        return 'portrait'
      if (this.coordinates.width == this.coordinates.height)
        return 'square'
    },

    translate () {
      const { x, y, height, width } = this.coordinates
      const scale = height / this.selector

      const halfScale = scale / 2
      const halfSelector = this.selector / 2

      return {
        scale,
        halfScale,
        halfSelector,
        x: (-x + halfSelector) * halfScale,
        y: (-y + halfSelector) * halfScale
      }
    },

    selectorStyle () {
      const { x, y } = this.translate

      return {
        'transform': `translateX(${x}px) translateY(${y}px)`
      }
    },

    orientedSize () {
      const { width, height } = this.coordinates

      return this.orientation == 'landscape' ? height : width
    }
  },

  mounted () {
    this.canvas = document.createElement('canvas')

    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    range (value) {
      this.selector = value
      this.updateBoundaries(this.coordinates.x, this.coordinates.y)
    },

    resetLoader () {
      this.hasError = false
    },

    getPosition (e, position) {
      const axis = position.toUpperCase()

      const desktopEvent = e['offset' + axis]
      const offset = axis == 'X' ? e.target.parentNode.offsetLeft : e.target.parentNode.offsetTop
      const mobileEvent = e.changedTouches && e.changedTouches[0]['client' + axis] - offset

      return mobileEvent || desktopEvent
    },

    move (e) {
      if (!this.isDragging) return

      this.update(e)
    },

    update (e) {
      const { width, height } = this.coordinates

      const x = this.getPosition(e, 'x') || this.coordinates.x
      const y = this.getPosition(e, 'y') || this.coordinates.y

      this.coordinates = { ...this.coordinates, x, y }
      this.updateBoundaries(x, y)
    },

    updateBoundaries (x, y) {
      const { width, height } = this.coordinates
      const { halfSelector } = this.translate

      if (y <= this.selector / 2) this.coordinates.y = halfSelector // up
      if (x <= this.selector / 2) this.coordinates.x = halfSelector // left
      if (y >= height - this.selector / 2) this.coordinates.y = height - halfSelector // down
      if (x >= width - this.selector / 2) this.coordinates.x = width - halfSelector // right

      if (this.selector > this.orientedSize)
        this.selector = this.orientedSize
    },

    crop () {
      if (this.hasError) {
        console.error('preview image was not loaded')
        return
      }

      const image = this.$refs.image
      const ctx = this.canvas.getContext('2d')

      const { x, y, width, height } = this.coordinates
      const scale = this.orientedSize / this.selector

      this.canvas.width = this.orientedSize
      this.canvas.height = this.orientedSize

      ctx.drawImage(
        image,
        - (x - this.selector / 2) * scale,
        - (y - this.selector / 2) * scale,
        width * scale,
        height * scale
      )

      this.$emit('cropped', this.canvas.toDataURL())
    },

    onImageLoad (event) {
      const { width, height } = event.target.getBoundingClientRect()

      this.coordinates = {
        x: width / 2,
        y: height / 2,
        width: width,
        height: height
      }

      this.updateBoundaries(this.coordinates.x, this.coordinates.y)
      this.isLoaded = true
    },

    onResize (event) {
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        const { width, height } = this.$refs.image.getBoundingClientRect()

        this.coordinates = {
          ...this.coordinates,
          width: width,
          height: height
        }

        this.updateBoundaries(this.coordinates.x, this.coordinates.y)
      }, 50)
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

    & > .image {
      z-index: 1;
      height: auto;
      max-width: 100%;
      cursor: grab;
      display: block;
      position: relative;
      clip-path: url(#mask);
      -webkit-clip-path: url(#mask);
    }
  }
}
</style>
