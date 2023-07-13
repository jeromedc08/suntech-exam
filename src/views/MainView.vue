<script setup lang="ts">
import { ref } from 'vue'
import profileSchema from '@/services/forms/schema/profile.schema.json'
import profileUISchema from '@/services/forms/schema/profile.uischema.json'
import { useForm } from '@/services/forms/useForm'
import moment from 'moment'
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs'
import { Button } from '@progress/kendo-vue-buttons'

const initialData = {
  age: 0,
}

const {
  Component: Form,
  data,
  enableSubmit,
  onChange,
  onSubmit,
} = useForm(profileSchema, profileUISchema, initialData)

const validateAge = (values: any) => {
  // Calculate the Age
  const birthday = values.birthday
  const age = moment().diff(birthday || new Date(), 'years')
  data.value.age = age
  enableSubmit(!(age < 18))
}

const visibleDialog = ref(false)

onChange((event) => {
  validateAge(event.data)
})

onSubmit(() => {
  visibleDialog.value = true
})
</script>

<template>
  <div class="SimpleForm">
    <h1>Simple Profile Form</h1>
    <Form></Form>
  </div>

  <!-- Success Dilaog -->
  <Dialog v-if="visibleDialog" @close="visibleDialog = false">
    <h3>Setup complete!</h3>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, fugit.</p>
    <DialogActionsBar>
      <Button @click.prevent="visibleDialog = false">Ok</Button>
    </DialogActionsBar>
  </Dialog>
</template>
