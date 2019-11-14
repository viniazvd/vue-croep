<template>
  <input
    step="1"
    min="100"
    type="range"
    class="range"
    :value="selector"
    :max="maxRange"
    @input="range => $emit('update:selector', range)"
  >
</template>

<script>
export default {
  name: 'c-range',

  props: {
    selector: Number,
    maxRange: Number
  }
}
</script>

<style lang="scss">
.range {
  height: 8px;
  width: 180px;
  margin-top: 40px;
  -webkit-appearance: none;
}

.range:focus { outline: none; }

// bar
.range::-webkit-slider-runnable-track {
  height: 8px;
  width: 180px;
  cursor: pointer;
  border-radius: 25px;
  background-color: rgba(#121E48, 0.2);
}

// ball
.range::-webkit-slider-thumb {
  width: 14px;
  height: 15px;
  cursor: pointer;
  margin-top: -4px;
  border-radius: 15px;
  background: #FFFFFF;
  -webkit-appearance: none;
  box-shadow: 0 0 11px 3px rgba(#121E48, 0.1);
}
</style>
