<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { useNoteStore } from '@/stores/useNoteStore'
import type { Note } from '@/types/note'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const store = useNoteStore()

const { handleSubmit, resetForm } = useForm({
  validationSchema: {
    title: (value: string) => {
      if (!value || !value.trim()) return 'Title is required'
      return true
    },
  },
})

const { value: title, errorMessage: titleError } = useField<string>('title')
const { value: content } = useField<string>('content')

const onSubmit = handleSubmit((values) => {
  const note: Note = {
    title: values.title.trim(),
    content: values.content?.trim() || undefined,
  }

  store.addNote(note)
  resetForm()
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

      <BaseButton type="submit" label="Add Note" />
    </form>
  </div>
</template>