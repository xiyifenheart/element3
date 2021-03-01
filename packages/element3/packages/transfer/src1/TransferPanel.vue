<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate"
      >
        {{ title }}
        <span class="el-transfer-panel__header-Summary">{{
          checkedSummary
        }}</span>
      </el-checkbox>
    </p>
    <div class="el-transfer-panel__body">
      <el-checkbox-group
        v-model="checked"
        @change="checkedChangeHandler"
        class="el-transfer-panel__list"
      >
        <el-checkbox
          class="el-transfer-panel__item"
          :label="item[keyProp]"
          :key="item[keyProp]"
          :disabled="item[disabledProp]"
          v-for="item in data"
        >
          {{ item[labelProp] }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
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
      checkedSummary,
      isIndeterminate
    } = useTransferPanelData(props, emit)

    if (props.defaultChecked.length > 0) {
      // state.checked = props.defaultChecked.slice()
      state.checked = computed(() => {
        return props.defaultChecked
      })
      emit('checked-change', state.checked)
    }

    const checkedChangeHandler = (val) => {
      emit('checked-change', val)
    }

    const handleAllCheckedChange = (val) => {
      state.checked = val ? props.data.map((item) => item[keyProp.value]) : []
      emit('checked-change', state.checked)
    }

    return {
      ...toRefs(state),
      keyProp,
      labelProp,
      disabledProp,
      checkedChangeHandler,
      handleAllCheckedChange,
      isIndeterminate,
      titleProp,
      checkedSummary
    }
  }
}

const useTransferPanelData = (props) => {
  const { props: p, format, data } = props
  let state = reactive({
    checked: [],
    allChecked: false
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

  const isIndeterminate = computed(() => {
    const checkedLength = state.checked.length
    return checkedLength > 0 && checkedLength < data.length
  })

  return {
    state,
    keyProp,
    labelProp,
    disabledProp,
    titleProp,
    checkedSummary,
    isIndeterminate
  }
}
</script>
