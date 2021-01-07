<template>
  <div class="el-transfer">
    <transfer-panel
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
      ></button>
      <button
        class="el-transfer__button"
        @click="addToRight"
        data-test="transfer__button-right"
      ></button>
    </div>
    <transfer-panel
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
    const { sourceData, targetData } = useTransferData(props)

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
      addToRight
    }
  }
})

const useTransferData = (props) => {
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
