<template>
   <v-stage ref="stage" :config="configKonva">
    <v-layer ref="layer">
      <v-group :config="{draggable: true}">
      <v-circle :config="configCircle">
      </v-circle>
        <v-regular-polygon :config="{
      x: 100,
      y: 100,
      sides: 5,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
      shadowOffsetX : 20,
      shadowOffsetY : 25,
      shadowBlur : 40,
      opacity : 0.5,
      draggable: true
    }" />
    <v-text :config="{ x: 100,
      y: 15,
      text: 'Simple Text',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'green',
      draggable: true}">

        </v-text>
      </v-group>
    </v-layer>
  </v-stage>
</template>

<script>
export default {
  data() {
    return {
      configKonva: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: "red",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
      }
    }
  }
}
</script>

<style>

</style>
