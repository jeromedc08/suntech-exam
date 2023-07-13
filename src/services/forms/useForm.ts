import { h, provide, defineComponent, markRaw, shallowRef, ref } from 'vue'
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue'
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from '@jsonforms/vue-vanilla'
import customRenderers from '@/services/forms/renderer'
import {
  Form,
  FormElement,
  FieldInjectedProps,
  FormSubmitClickEvent,
} from '@progress/kendo-vue-form'
import { Button } from '@progress/kendo-vue-buttons'
import { createEventHook } from '@vueuse/core'

export const useForm = (
  schema: Record<string, unknown>,
  uischema: Record<string, unknown> = {},
  initialData: Record<string, unknown> = {}
) => {
  const styles = mergeStyles(defaultStyles, {
    // add more styles here...
  })

  provide('styles', styles)

  const renderers = markRaw([...vanillaRenderers, ...customRenderers])

  const data = shallowRef({
    ...initialData,
  })

  const changeEventHook = createEventHook<JsonFormsChangeEvent>()
  const submitEventHook = createEventHook<FormSubmitClickEvent>()

  const submitDisabled = ref(false)
  const enableSubmit = (value: boolean) => (submitDisabled.value = !value)

  const FormContent = defineComponent({
    inject: {
      kendoForm: { default: {} },
    },
    render() {
      return h(FormElement, () => [
        h(JsonForms, {
          renderers,
          schema,
          uischema,
          data,
          class: 'FormContent',
          onChange(event: JsonFormsChangeEvent) {
            data.value = event.data
            changeEventHook.trigger(event)
          },
        }),
        h(
          Button,
          {
            type: 'submit',
            disabled:
              submitDisabled.value ||
              !(this.kendoForm as FieldInjectedProps).allowSubmit,
          },
          () => 'Submit'
        ),
      ])
    },
  })

  const Component = h(
    Form,
    {
      onSubmitclick(event: FormSubmitClickEvent) {
        if (event.isValid) {
          submitEventHook.trigger(event)
        }
      },
    },
    () => h(FormContent)
  )

  return {
    Component,
    data,
    enableSubmit,
    onChange: changeEventHook.on,
    onSubmit: submitEventHook.on,
  }
}
