<template>
  <div style="width: 100%; height: 100%">
    <canvas id="mindmap"></canvas>
  </div>
</template>

<script>
export default {

  mounted: function() {
    // create a wrapper around native canvas element (with id="c")
    let canvas = new fabric.Canvas('mindmap',{
      width: window.innerWidth,
      height: window.innerHeight - 64
    });
    var circle = new fabric.Circle({
      radius: 20, fill: 'green', left: 100, top: 100
    });
    var triangle = new fabric.Triangle({
      width: 20, height: 30, fill: 'blue', left: 150, top: 150
    });

    canvas.add(circle, triangle);
  },
}
</script>

<style>

</style>
