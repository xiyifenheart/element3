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
import { ref } from 'vue'
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
        const { defaultChecked } = props
        let checked = ref([])
        
        if (defaultChecked.length > 0) {
            checked.value = defaultChecked
            emit('checked-change', defaultChecked)
        }
        

        const checkedChangeHandler = (val) => {
            emit('checked-change', val)
        }

        return {
            checked,
            checkedChangeHandler
        }
    }
}
</script>