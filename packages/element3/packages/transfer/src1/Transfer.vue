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
      <button
        class="el-transfer__button"
        @click="addToLeft"
        data-test="transfer__button-left"
      >
        <span>{{ buttonTexts[0] }}</span>
      </button>
      <button
        class="el-transfer__button"
        @click="addToRight"
        data-test="transfer__button-right"
      >
        <span>{{ buttonTexts[1] }}</span>
      </button>
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
import { useLocale } from '../../../src/composables/locale'
import { computed, defineComponent } from 'vue'
import TransferPanel from './TransferPanel.vue'
import { props } from './props'
export default defineComponent({
  name: 'ElTransfer',

  emits: ['update:modelValue'],
  components: {
    TransferPanel
  },
  props,
  setup(props, { emit }) {
    const t = useLocale()
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
    } = useTransfercheckedChange(props, emit)

    return {
      sourceData,
      targetData,
      onSourceCheckedChange,
      onTargetCheckedChange,
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
    const { data, modelValue } = props

    if (modelValue.length === 0) {
      return data.slice()
    }

    return data.filter((item) => modelValue.indexOf(item.key) === -1)
  })

  const targetData = computed(() => {
    const { data, modelValue } = props

    if (modelValue.length === 0) {
      return []
    }

    return data.filter((item) => modelValue.indexOf(item.key) > -1)
  })

  return {
    leftTransferPanelTitle,
    rightTransferPanelTitle,
    sourceData,
    targetData
  }
}

const useTransfercheckedChange = (props, emit) => {
  let sourceChecked = []
  let targetChecked = []

  const onSourceCheckedChange = (val) => {
    sourceChecked = val
  }

  const onTargetCheckedChange = (val) => {
    targetChecked = val
  }

  const addToLeft = () => {
    if (targetChecked.length === 0) {
      return
    }
    const { modelValue } = props
    const currentValue = modelValue.slice()

    for (let i = 0; i < targetChecked.length; i++) {
      if (currentValue.indexOf(targetChecked[i]) > -1) {
        currentValue.splice(i, 1)
      }
    }

    emit('update:modelValue', currentValue)
  }

  const addToRight = () => {
    if (sourceChecked.length === 0) {
      return
    }
    const { modelValue } = props
    const arr = Array.from(new Set([].concat(modelValue, sourceChecked)))
    emit('update:modelValue', arr)
  }

  return {
    onSourceCheckedChange,
    onTargetCheckedChange,
    addToLeft,
    addToRight
  }
}
</script>
