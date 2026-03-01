<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  label: string
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors"
  >
    {{ label }}
  </button>
</template>