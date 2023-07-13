import { defineComponent, PropType, h } from 'vue'
import { isDescriptionHidden, computeLabel } from '@jsonforms/core'
import { Options } from '@jsonforms/vue-vanilla'
import { Field, FieldWrapper, FieldRenderProps } from '@progress/kendo-vue-form'
import { Error, Hint, Label } from '@progress/kendo-vue-labels'

const ControlWrapper = defineComponent({
  name: 'ControlWrapper',
  props: {
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: undefined,
    },
    errors: {
      type: String,
      required: false,
      default: undefined,
    },
    label: {
      type: String,
      required: false,
      default: undefined,
    },
    options: {
      type: Object as PropType<Options>,
      required: false,
      default: undefined,
    },
    visible: {
      type: Boolean,
      required: false,
      default: true,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    focused: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: [String, Number, Array, Object],
      required: false,
      default: undefined,
    },
  },
  computed: {
    showDescription(): boolean {
      return !isDescriptionHidden(
        this.visible,
        this.description,
        this.focused,
        !!this.options?.showUnfocusedDescription
      )
    },
    computedLabel(): string {
      return computeLabel(
        this.label,
        this.required,
        !!this.options?.hideRequiredAsterisk
      )
    },
  },
  render() {
    const {
      $slots,
      visible,
      id,
      errors,
      label,
      value,
      description,
      computedLabel,
      showDescription,
    } = this
    return visible
      ? h(
          Field,
          {
            name: id,
            label,
            component: 'template',
            value,
            validator: () => {
              return this.errors
            },
          },
          {
            template: (slot: any) => {
              const props = slot.props as FieldRenderProps
              return h(FieldWrapper, { id }, () => [
                h(Label, { for: `${id}-input` }, () => computedLabel),
                h('div', null, {
                  default: () => $slots.default?.(props),
                }),
                props.touched && errors
                  ? h(Error, () => errors)
                  : showDescription
                  ? h(Hint, () => description)
                  : null,
              ])
            },
          }
        )
      : ''
  },
})

export default ControlWrapper
