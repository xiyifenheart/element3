<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel_header">{{ title }}</p>
    <p class="el-transfer-panel_header-Summary">{{ checkedSummary }}</p>
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
    },
    format: Object
  },
  setup(props, { emit }) {
    const {
      state,
      keyProp,
      labelProp,
      disabledProp,
      titleProp,
      checkedSummary
    } = useTransferPanelData(props, emit)

    if (props.defaultChecked.length > 0) {
      state.checked = computed(() => {
        return props.defaultChecked
      })
      emit('checked-change', state.checked)
    }

    const checkedChangeHandler = (val) => {
      emit('checked-change', val)
    }
    return {
      ...toRefs(state),
      keyProp,
      labelProp,
      disabledProp,
      checkedChangeHandler,
      titleProp,
      checkedSummary
    }
  }
}

const useTransferPanelData = (props) => {
  const { props: p, format, data } = props
  let state = reactive({
    checked: []
  })
  const keyProp = computed(() => {
    return p.key || 'key'
  })

  const labelProp = computed(() => {
    return p.label || 'label'
  })

  const disabledProp = computed(() => {
    return p.disabled || 'disabled'
  })

  const titleProp = computed(() => {
    return p.title
  })

  const checkedSummary = computed(() => {
    const { noChecked, hasChecked } = format
    const checkedLength = state.checked.length
    const dataLength = data.length
    if (noChecked && hasChecked) {
      const targetStr = checkedLength > 0 ? hasChecked : noChecked
      return targetStr
        .replace(/\${checked}/g, checkedLength)
        .replace(/\${total}/g, dataLength)
    }

    return `${checkedLength}/${dataLength}`
  })

  return {
    state,
    keyProp,
    labelProp,
    disabledProp,
    titleProp,
    checkedSummary
  }
}
</script>
