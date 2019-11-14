<h1 align="center">vue-croep ✅</h1>

<p align="center">
  <a href="#"><img src="https://img.shields.io/npm/l/vuelidation.svg" alt="License" target="_blank"></a>
</p>

<br>

<p align="center">
  ✨ <a href="https://viniazvd.github.io/vue-croep/">Example</a>✨
</p>

<br>

## Install
`yarn add vue-croep` or `npm install vue-croep`

**Example**
```vue
<template>
  <div>
    <vue-croep ref="croep" />

    <button @click="crop">crop</button>
  </div>
</template>

<script>
import VueCroep from 'vue-croep'
import 'vue-croep/dist/vue-croep.css'

export default {
  name: 'example',

  components: { VueCroep },

  methods: {
    crop () {
      this.$refs.croep.crop()
    }
  }
}
</script>
```

## Props

Name                |   type   |             default          | About
-----               | -------  | ---------------------------- | ------
size                |  Number  |            `300`             | container size
src                 |  String  |        `mengão picture`      | image to crop

## Event

Name       | About
-----      | -----
cropped    | return base64 of cropped image

## contributors:
- https://github.com/Giseudo :star: :brain:
- https://github.com/kauanslr 

**Made in:** @convenia
