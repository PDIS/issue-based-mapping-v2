<template>
  <kanban-board :stages="stages" :blocks="blocks"></kanban-board>
</template>

<script>
export default {
  data() {
    return {
  stages: ['on-hold', 'in-progress', 'needs-review', 'approved'],
  blocks: [
    {
      id: 1,
      status: 'on-hold',
      title: 'Test',
    },
  ],
}
  }
}
</script>

<style lang="scss">
  @import '../assets/kanban.scss';
</style> 