<template>
  <svg
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
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      :href="src"
    />
  </svg>
</template>

<script>
export default {
  name: 'c-selector',

  props: {
    src: String,
    size: Number,
    selector: Number,
    coordinates: Object
  }
}
</script>

<style lang="scss">
.wrapper-selector {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 5px;
}
</style>
