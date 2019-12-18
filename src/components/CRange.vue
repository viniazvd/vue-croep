<template>
  <div class="range">
    <button class="decrease" @click="onDecrease"></button>

    <input
      step="1"
      type="range"
      class="input"
      :value="value"
      :min="min"
      :max="max"
      @input="onChange"
    >

    <button class="increase" @click="onIncrease"></button>
  </div>
</template>

<script>
export default {
  name: 'c-range',

  props: {
    value: Number,
    min: Number,
    max: Number
  },

  methods: {
    onChange (event) {
      this.$emit('input', +event.target.value)
    },

    onDecrease () {
      const value = this.value - this.max / 4

      this.$emit('input', value <= this.min ? this.min : value)
    },

    onIncrease () {
      const value = this.value + this.max / 4

      this.$emit('input', value >= this.max ? this.max : value)
    }
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
    background: transparent;
    -webkit-appearance: none;

    &:focus { outline: none; }

    // bar
    &::-webkit-slider-runnable-track {
      height: 8px;
      width: 180px;
      cursor: pointer;
      border-radius: 25px;
      background-color: #dfe1e6;
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
    background: #dfe1e6;
    margin: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px 3px rgba(#121E48, 0.03);
    cursor: pointer;
    border: 0;
    outline: none;
    transition: .1s ease-out;
    &:hover {
      background: #7873EE;
      box-shadow: 0 4px 8px 3px rgba(#BC4CF7, 0.1);
    }
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
