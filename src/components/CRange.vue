<template>
  <div class="range">
    <span class="decrease"></span>

    <input
      step="1"
      min="100"
      type="range"
      class="input"
      :value="selector"
      :max="maxRange"
      @input="range => $emit('update:selector', range)"
    >

    <span class="increase"></span>
  </div>
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
  margin-top: 40px;
  display: flex;
  align-items: center;

  & > .input {
    height: 8px;
    width: 180px;
    -webkit-appearance: none;

    &:focus { outline: none; }

    // bar
    &::-webkit-slider-runnable-track {
      height: 8px;
      width: 180px;
      cursor: pointer;
      border-radius: 25px;
      background-color: rgba(#121E48, 0.1);
    }

    // ball
    &::-webkit-slider-thumb {
      width: 14px;
      height: 14px;
      cursor: pointer;
      margin-top: -4px;
      border-radius: 15px;
      background: #FFFFFF;
      box-shadow: 0 0 11px 3px rgba(#121E48, 0.1);
      -webkit-appearance: none;
    }
  }

  & > .increase,
  & > .decrease {
    width: 25px;
    height: 25px;
    border-radius: 25px;
    display: inline-block;
    background-color: rgba(#121E48, 0.1);
    margin: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px 3px rgba(#121E48, 0.03);
  }

  & > .decrease {
    &:before {
      content: "";
      width: 10px;
      height: 1px;
      background: white;
      display: inline-block;
    }
  }

  & > .increase {
    &:before,
    &:after {
      content: "";
      width: 10px;
      height: 1px;
      background: white;
      display: inline-block;
    }
    &:after{
      position: absolute;
      transform: rotate(90deg);
    }
  }
}
</style>
