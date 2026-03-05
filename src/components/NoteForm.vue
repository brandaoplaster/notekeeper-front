<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useNoteStore } from '@/stores/useNoteStore'
import type { CreateNoteRequest } from '@/api/types'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const store = useNoteStore()
const loading = ref(false)

const { handleSubmit, resetForm } = useForm()
const { value: title, errorMessage: titleError } = useField<string>(
  'title',
  (value) => !!value?.trim() || 'Title is required',
)

const { value: content } = useField<string>('content')

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    const note: CreateNoteRequest = {
      title: values.title.trim(),
      content: values.content?.trim() || undefined,
    }

    await store.addNote(note)
    resetForm()
  } catch (error) {
    console.error('Erro ao criar nota:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-lg mx-auto">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <BaseInput
        :modelValue="title ?? ''"
        @update:modelValue="title = $event"
        label="Title"
        :error="titleError"
        :required="true"
      />

      <BaseTextarea
        :modelValue="content ?? ''"
        @update:modelValue="content = $event"
        label="Content"
      />

      <BaseButton type="submit" :label="loading ? 'Creating...' : 'Add Note'" :disabled="loading" />
    </form>
  </div>
</template>
