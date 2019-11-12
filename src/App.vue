<template>
  <div id="app" class="vue-croep">
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

      <svg
        v-if="isLoaded && !hasError"
        fill="white"
        class="wrapper-selector"
        :style="{ width: size + 'px', height: size + 'px' }"
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
          preserveAspectRatio="none"
          style="width: 100%; height: 100%"
          :href="src"
        />
      </svg>
    </div>

    <input
      step="1"
      min="100"
      type="range"
      class="range"
      :value="selector"
      :max="coordinates.width"
      @input="range"
    >

    <button @click="crop">crop</button>

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

const isMobile = () => {
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp2|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
}

export default {
  name: 'vue-croep',

  components: { VueCoeImage },

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
circle { cursor: pointer; }

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

    & > .wrapper-selector {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
    }
  }

  & > .range {
    height: 8px;
    width: 180px;
    margin-top: 40px;
    -webkit-appearance: none;
  }

  & > .range:focus { outline: none; }

  // bar
  & > .range::-webkit-slider-runnable-track {
    height: 8px;
    width: 180px;
    cursor: pointer;
    border-radius: 25px;
    background-color: rgba(#121E48, 0.1);
  }

  // ball
  & > .range::-webkit-slider-thumb {
    width: 14px;
    height: 15px;
    cursor: pointer;
    margin-top: -4px;
    border-radius: 15px;
    background: #FFFFFF;
    -webkit-appearance: none;
    box-shadow: 0 0 11px 3px rgba(#121E48, 0.1);
  }
}
</style>
