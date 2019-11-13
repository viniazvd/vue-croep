<template>
  <div class="vue-croep">
    <div
      class="wrapper"
      v-on="{
        [events.move]: move,
        [events.end]: () => isDragging = false
      }"
    >
      <vue-coe-image
        ref="image"
        class="image"
        fallback="https://i.ytimg.com/vi/Yt9t9e9gmmw/maxresdefault.jpg"
        :src="src"
        :style="{
          width: size + 'px',
          height: size + 'px',
          opacity: isDragging ? 1 : 0.7
        }"
        crossorigin="anonymous"
        @error="hasError = true"
        @intersect="isLoaded = true"
        v-on:[events.start].native.prevent="isDragging = true"
      />

      <c-selector
        :src="src"
        :size="size"
        :selector="selector"
        :is-loaded="isLoaded"
        :has-error="hasError"
        :coordinates="coordinates"
      />
    </div>

    <c-range
      :selector="selector"
      :max-range="coordinates.width"
      @update:selector="range"
    />

    <canvas
      id="canvas"
      :width="coordinates.width / 2"
      :height="coordinates.width / 2"
      style="border: 1px solid black; border-radius: 50%"
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
      default: 300
    },

    src: {
      type: String,
      default: 'https://pbs.twimg.com/profile_images/515195474848927744/wWahjxpP_400x400.jpeg'
    }
  },

  data () {
    return {
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
    isLoaded: { handler: 'init' },
    selector: { handler: 'update' },
    src: { handler: 'resetLoader' }
  },

  mounted () {
    this.events = {
      'end': isMobile() ? 'touchend' : 'mouseup',
      'move': isMobile() ? 'touchmove' : 'mousemove',
      'start': isMobile() ? 'touchstart' : 'mousedown'
    }
  },

  computed: {
    translate () {
      const { x, y, width } = this.coordinates
      const scale = width / this.selector

      const halfScale = scale / 2
      const halfImage = this.size / 2
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

      this.coordinates = {
        x: this.size / 2,
        y: this.size / 2,
        width: this.size,
        height: this.size
      }
    },

    range (λ) {
      this.selector = +λ.target.value
    },

    resetLoader () {
      this.isLoaded = false
    },

    getPosition (e, position) {
      const axis = position.toUpperCase()

      const desktopEvent = e['layer' + axis]
      const mobileEvent = e.changedTouches && e.changedTouches[0]['client' + axis]

      return mobileEvent || desktopEvent
    },

    move (e) {
      if (!this.isDragging) return

      this.update(e)
    },

    update (e) {
      const { height } = this.coordinates
      const { halfSelector } = this.translate

      const x = this.getPosition(e, 'x') || this.coordinates.x
      const y = this.getPosition(e, 'y') || this.coordinates.y

      this.coordinates = { ...this.coordinates, x, y }

      // fix positioning if passing container
      if (y <= this.selector / 2) this.coordinates.y = halfSelector // up
      if (x <= this.selector / 2) this.coordinates.x = halfSelector // left
      if (y >= height - this.selector / 2) this.coordinates.y = height - halfSelector // down
      if (x >= height - this.selector / 2) this.coordinates.x = height - halfSelector // right
    },

    crop () {
      if (this.hasError) {
        console.error('preview image was not loaded')
        return
      }

      const image = this.$refs.image.$el.children.item(1)

      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      const { size, x, y } = this.translate

      ctx.drawImage(image, x, y, size, size)

      this.$emit('cropped', canvas.toDataURL())
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
      cursor: grab;
      display: block;
      clip-path: url(#mask);
      position: relative;

      & > .lazy-load-image { height: 100%; }
    }
  }
}
</style>
