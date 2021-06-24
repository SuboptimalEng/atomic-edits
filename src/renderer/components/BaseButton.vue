<template>
  <button class="border focus:outline-none">
    <div><slot></slot></div>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
};
</script>