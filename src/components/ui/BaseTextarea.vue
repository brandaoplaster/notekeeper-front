<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  label?: string
  rows?: number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows ?? 3"
      class="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>
