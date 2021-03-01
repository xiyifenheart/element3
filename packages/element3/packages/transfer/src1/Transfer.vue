<template>
  <div class="el-transfer">
    <transfer-panel
      v-bind="$props"
      :title="leftTransferPanelTitle"
      :data="sourceData"
      :default-checked="leftDefaultChecked"
      @checked-change="onSourceCheckedChange"
      data-test="transfer-panel-left"
      ref="transfer-panel-left"
    >
    </transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        class="el-transfer__button"
        @click="addToLeft"
        data-test="transfer__button-left"
        :disabled="rightChecked.length === 0"
      >
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button
        type="primary"
        class="el-transfer__button"
        @click="addToRight"
        data-test="transfer__button-right"
      >
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
    <transfer-panel
      v-bind="$props"
      :title="rightTransferPanelTitle"
      :data="targetData"
      :default-checked="rightDefaultChecked"
      @checked-change="onTargetCheckedChange"
      data-test="transfer-panel-right"
      ref="transfer-panel-right"
    >
    </transfer-panel>
  </div>
</template>
<script lang="ts">
// import { props } from './props'
const props = {
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
  props: {
    type: Object,
    default() {
      return {
        key: 'key',
        label: 'label',
        disabled: 'disabled'
      }
    }
  },
  titles: {
    type: Array,
    default() {
      return []
    }
  },
  format: {
    type: Object,
    default() {
      return {
        nochecked: '${checked}/${total}',
        hasChecked: '${checked}/${total}'
      }
    }
  },
  buttonTexts: {
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
import { useLocale } from '../../../src/composables/locale'
import { ref, computed, defineComponent } from 'vue'
import TransferPanel from './TransferPanel.vue'
import { ElButton } from '../../../src/components/Button'
export default defineComponent({
  name: 'ElTransfer',

  emits: ['update:modelValue', 'change'],
  components: {
    TransferPanel,
    ElButton
  },
  props,
  setup(props, { emit }) {
    const t = useLocale()

    const leftChecked = ref([])
    const rightChecked = ref([])
    const {
      leftTransferPanelTitle,
      rightTransferPanelTitle,
      sourceData,
      targetData
    } = useTransferData(props, t)
    const titles = computed(() => {
      return props.titles
    })

    const {
      onSourceCheckedChange,
      onTargetCheckedChange,
      addToLeft,
      addToRight
    } = useTransfercheckedChange(props, emit, leftChecked, rightChecked)

    return {
      leftTransferPanelTitle,
      rightTransferPanelTitle,
      sourceData,
      targetData,
      onSourceCheckedChange,
      onTargetCheckedChange,
      leftChecked,
      rightChecked,
      addToLeft,
      addToRight,
      titles
    }
  }
})

const useTransferData = (props, t) => {
  const leftTransferPanelTitle = computed(() => {
    return props.titles[0] || t('el.transfer.titles.0')
  })

  const rightTransferPanelTitle = computed(() => {
    return props.titles[1] || t('el.transfer.titles.1')
  })

  const sourceData = computed(() => {
    const { data, modelValue, props: p } = props

    if (modelValue.length === 0) {
      return data.slice()
    }

    const arr = data.filter((item) => modelValue.indexOf(item[p.key]) === -1)

    return arr
  })

  const targetData = computed(() => {
    const { data, modelValue, props: p } = props

    if (modelValue.length === 0) {
      return []
    }

    const arr = data.filter((item) => modelValue.indexOf(item[p.key]) > -1)

    return arr
  })

  return {
    leftTransferPanelTitle,
    rightTransferPanelTitle,
    sourceData,
    targetData
  }
}

const useTransfercheckedChange = (props, emit, leftChecked, rightChecked) => {
  const onSourceCheckedChange = (val) => {
    leftChecked.value = val
  }

  const onTargetCheckedChange = (val) => {
    rightChecked.value = val
  }

  const addToLeft = () => {
    if (rightChecked.value.length === 0) {
      return
    }
    const { modelValue } = props
    const currentValue = modelValue.slice()

    for (let i = 0; i < rightChecked.value.length; i++) {
      const index = currentValue.indexOf(rightChecked.value[i])
      if (index > -1) {
        currentValue.splice(index, 1)
      }
    }

    emit('update:modelValue', currentValue)
    emit('change', currentValue, 'left', rightChecked.value)
  }

  const addToRight = () => {
    if (leftChecked.value.length === 0) {
      return
    }

    const { modelValue } = props
    const currentValue = Array.from(
      new Set([].concat(modelValue, leftChecked.value))
    )
    emit('update:modelValue', currentValue)
    emit('change', currentValue, 'right', leftChecked.value)
  }

  return {
    onSourceCheckedChange,
    onTargetCheckedChange,
    addToLeft,
    addToRight
  }
}
</script>
