<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel_header">{{ title }}</p>
    <el-checkbox-group v-model="checked" @change="checkedChangeHandler">
      <el-checkbox
        class="el-transfer-panel__item"
        :label="item[keyProp]"
        :key="item[keyProp]"
        :disabled="item[disabledProp]"
        v-for="item in data"
      >
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
import ElCheckboxGroup from '../../checkbox-group'
import ElCheckbox from '../../checkbox'
import { reactive, toRefs, computed } from 'vue'
export default {
  name: 'ElTransferPanel',
  emits: ['checked-change'],
  components: {
    ElCheckboxGroup,
    ElCheckbox
  },
  props: {
    data: Array,
    defaultChecked: Array,
    props: Object,
    title: {
      type: String,
      default() {
        return ''
      }
    }
  },
  setup(props, { emit }) {
    let state = reactive({
      checked: []
    })

    if (props.defaultChecked.length > 0) {
      state.checked = computed(() => {
        return props.defaultChecked
      })
      emit('checked-change', state.checked)
    }

    const keyProp = computed(() => {
      const { props: p } = props
      return p.key || 'key'
    })

    const labelProp = computed(() => {
      const { props: p } = props
      return p.label || 'label'
    })

    const disabledProp = computed(() => {
      const { props: p } = props
      return p.disabled || 'disabled'
    })

    const titleProp = computed(() => {
      return props.title
    })

    const checkedChangeHandler = (val) => {
      emit('checked-change', val)
    }
    return {
      ...toRefs(state),
      keyProp,
      labelProp,
      disabledProp,
      checkedChangeHandler,
      titleProp
    }
  }
}
</script>
