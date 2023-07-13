import { h, defineComponent } from 'vue'
import {
  JsonFormsRendererRegistryEntry,
  isStringControl,
  rankWith,
  ControlElement,
} from '@jsonforms/core'
import {
  RendererProps,
  rendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue'
import useControl from '@/services/forms/utils/useControl'
import ControlWrapper from '@/services/forms/renderer/ControlWrapper'
import { FieldRenderProps } from '@progress/kendo-vue-form'
import { Input } from '@progress/kendo-vue-inputs'

const ControlRenderer = defineComponent({
  name: 'CustomStringControlRenderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useControl(
      useJsonFormsControl(props),
      (target) => target.value || undefined
    )
  },
  render() {
    return h(
      ControlWrapper,
      {
        id: this.control.id,
        description: this.control.description,
        errors: this.control.errors,
        label: this.control.label,
        value: this.control.data,
        visible: this.control.visible,
        required: this.control.required,
        options: this.options,
        focused: this.focused,
      },
      {
        default: (props: FieldRenderProps) => {
          return h(Input, {
            id: `${this.control.id}-input`,
            value: props.value,
            disabled: !this.control.enabled,
            autofocus: this.options.focus,
            placeholder: this.options.placeholder,
            valid: props.valid,
            onInput: async (event: Event) => {
              await this.onChange(event)
              props.onChange?.(event)
            },
            onFocus: () => {
              this.focused = true
              props.onFocus?.()
            },
            onBlur: () => {
              this.focused = false
              props.onBlur?.()
            },
          })
        },
      }
    )
  },
})

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: ControlRenderer,
  tester: rankWith(2, isStringControl),
}
