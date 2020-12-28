<template>
  <div class="el-transfer-panel">
    <el-checkbox-group v-model="checked" @change="checkedChangeHandler">
      <el-checkbox
        class="el-transfer-panel__item"
        :label="item.key"
        :key="item.key"
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
    data: {
      type: Array,
      default() {
        return []
      }
    },
    defaultChecked: {
      type: Array,
      default() {
        return []
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

    const checkedChangeHandler = (val) => {
      emit('checked-change', val)
    }

    return {
      ...toRefs(state),
      checkedChangeHandler
    }
  }
}
</script>
