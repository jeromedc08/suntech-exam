import { computed, ref } from 'vue'
import { useJsonFormsControl } from '@jsonforms/vue'
import { merge, cloneDeep } from 'lodash'

export default (
  input: ReturnType<typeof useJsonFormsControl>,
  target: (target: any) => any = (v) => v.value
) => {
  const options = computed(() =>
    merge(
      {},
      cloneDeep(input.control.value.config),
      cloneDeep(input.control.value.uischema.options)
    )
  )
  const focused = ref(false)
  const onChange = (event: Event) => {
    input.handleChange(input.control.value.path, target(event?.target))
  }

  return { ...input, options, focused, onChange }
}
