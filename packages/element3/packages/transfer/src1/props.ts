import { PropType } from 'vue'

export const props = {
  data: {
    type: Array,
    default() {
      return []
    }
  },
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  leftDefaultChecked: {
    type: Array,
    default() {
      return []
    }
  },
  rightDefaultChecked: {
    type: Array,
    default() {
      return []
    }
  }
}
