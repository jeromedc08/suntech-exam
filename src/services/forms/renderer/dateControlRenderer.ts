import { h, defineComponent } from 'vue'
import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  ControlElement,
  isDateControl,
} from '@jsonforms/core'
import {
  RendererProps,
  rendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue'
import useControl from '@/services/forms/utils/useControl'
import ControlWrapper from '@/services/forms/renderer/ControlWrapper'
import { FieldRenderProps } from '@progress/kendo-vue-form'
import {
  DatePicker,
  DatePickerChangeEvent,
} from '@progress/kendo-vue-dateinputs'
import moment from 'moment'

const ControlRenderer = defineComponent({
  name: 'CustomDateControlRenderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useControl(useJsonFormsControl(props), (target) => {
      return moment(target.value).format('YYYY-MM-DD') || undefined
    })
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
          return h(DatePicker, {
            id: `${this.control.id}-input`,
            disabled: !this.control.enabled,
            placeholder: this.options.placeholder,
            valid: props.valid,
            onChange: async (event: DatePickerChangeEvent) => {
              await this.onChange(event as unknown as Event)
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
  tester: rankWith(3, isDateControl),
}
