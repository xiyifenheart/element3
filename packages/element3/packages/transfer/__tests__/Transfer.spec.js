import ElTransfer from '../src1/Transfer.vue'
import { mount } from '@vue/test-utils'
import { toRefs, reactive, nextTick } from 'vue'
// @todo fix
const getTestData = () => {
  const data = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `备选项 ${i}`,
      disabled: i % 4 === 0
    })
  }
  return data
}
const createTransfer = (props, opts) => {
  return Object.assign({
    template: `
      <el-transfer :data="testData" ref="transfer" ${props}>
      </el-transfer>
    `,
    components: {
      'el-transfer': ElTransfer
    },
    data() {
      return {
        testData: getTestData()
      }
    }
  }, opts)
}

describe('Transfer', () => {
  it('create', () => {
    const wrapper = mount(ElTransfer)
    expect(wrapper.find('.el-transfer').exists()).toBe(true)
  })

  it('render data', () => {
    const Comp = createTransfer('', {})
    const wrapper = mount(Comp)

    const transferLeft = wrapper.get('[data-test="transfer-panel-left"]')

    expect(transferLeft.findAll('.el-transfer-panel__item')).toHaveLength(15)
  })

  it('default target list', () => {
    const Comp = createTransfer('v-model="value"', {
      setup() {
        const state = reactive({
          value: [1, 4]
        })

        return toRefs(state)
      }
    })
    const wrapper = mount(Comp)
    const transfer = wrapper.getComponent({ name: 'ElTransfer'}).vm

    const transferLeft = wrapper.get('[data-test="transfer-panel-left"]')
    const transferRight = wrapper.get('[data-test="transfer-panel-right"]')

    expect(transfer.sourceData.length).toEqual(13)
    expect(transfer.targetData.length).toEqual(2)
    expect(transferLeft.findAll('.el-transfer-panel__item')).toHaveLength(13)
    expect(transferRight.findAll('.el-transfer-panel__item')).toHaveLength(2)
  })

  it('defaultChecked', () => {
    const Comp = createTransfer('v-model="value" :left-default-checked="[2, 3]" :right-default-checked="[1, 4]"', {
      setup() {
        const state = reactive({
          value: [1, 4]
        })

        return toRefs(state)
      }
    })
    const wrapper = mount(Comp)
    const transfer = wrapper.getComponent({ name: 'ElTransfer'})
    const transferPanelLeft = transfer.getComponent({ ref: 'transfer-panel-left' }).vm
    const transferPanelRight = transfer.getComponent({ ref: 'transfer-panel-right' }).vm

    expect(transferPanelLeft.defaultChecked).toEqual([2, 3])
    expect(transferPanelRight.defaultChecked).toEqual([1, 4])
  })

  it('transfer', async () => {
    const Comp = createTransfer('v-model="value" :left-default-checked="[2, 3]" :right-default-checked="[4]"', {
      setup() {
        const state = reactive({
          value: [1, 4]
        })

        return toRefs(state)
      }
    })
    const wrapper = mount(Comp)
    const transfer = wrapper.getComponent({ name: 'ElTransfer'}).vm

    const transferLeft = wrapper.get('[data-test="transfer-panel-left"]')
    const transferRight = wrapper.get('[data-test="transfer-panel-right"]')
    const buttonLeft = wrapper.get('[data-test="transfer__button-left"]')
    const buttonRight = wrapper.get('[data-test="transfer__button-right"]')

    buttonRight.trigger('click')
    await nextTick()
    expect(transfer.sourceData.length).toEqual(11)
    expect(transfer.targetData.length).toEqual(4)
    expect(transferLeft.findAll('.el-transfer-panel__item')).toHaveLength(11)
    expect(transferRight.findAll('.el-transfer-panel__item')).toHaveLength(4)

    buttonLeft.trigger('click')
    await nextTick()
    expect(transfer.sourceData.length).toEqual(12)
    expect(transfer.targetData.length).toEqual(3)
    expect(transferLeft.findAll('.el-transfer-panel__item')).toHaveLength(12)
    expect(transferRight.findAll('.el-transfer-panel__item')).toHaveLength(3)
  })

  // it('filterable', async () => {
  //   const Comp = createTransfer('v-model="value" filterable :filter-method="fliterMethod"', {
  //     setup() {
  //       const value = ref([])
  //       const fliterMethod = (query, option) => option.key === Number(query)
  //       return {
  //         value,
  //         fliterMethod
  //       }
  //     }
  //   })
  //   const wrapper = mount(Comp, {
  //     global: {
  //       components: {
  //         ElTransfer
  //       }
  //     }
  //   })
  //   const leftList = wrapper.findComponent({ name: 'ElTransferPanel' }).vm
  //   leftList.query = '1'
  //   await nextTick()
  //   expect(leftList.filteredData.length).toEqual(1)
  // })

  // it('transfer', async () => {
  //   const Comp = createTransfer('v-model="value" :left-default-checked="[2, 3]" :right-default-checked="[1]"', {
  //     setup() {
  //       const value = ref([1, 4])
  //       const renderFunc = (h, option) => <span>{ option.key } - { option.label }</span>
  //       const onUpdate = (val) => {
  //         value.value = val
  //       }
  //       return {
  //         value,
  //         onUpdate,
  //         renderFunc
  //       }
  //     }
  //   })
  //   const wrapper = mount(Comp, {
  //     global: {
  //       components: {
  //         ElTransfer
  //       }
  //     }
  //   })
  //   const transfer = wrapper.findComponent({ name: 'ElTransfer' }).vm
  //   transfer.addToLeft()
  //   await nextTick()
  //   expect(transfer.sourceData.length).toEqual(14)
  //   transfer.addToRight()
  //   await nextTick()
  //   expect(transfer.sourceData.length).toEqual(12)
  // })

  // it('customize', () => {
  //   const Comp = createTransfer('v-model="value" :titles="titles" :render-content="renderFunc" :format="format"', {
  //     setup() {
  //       const state = reactive({
  //         value: [2],
  //         titles: ['表1', '表2'],
  //         format: { noChecked: 'no', hasChecked: 'has' },
  //         renderFunc(h, option) {
  //           return <span>{ option.key } - { option.label }</span>
  //         }
  //       })
  //       return toRefs(state)
  //     }
  //   })
  //   const wrapper = mount(Comp, {
  //     global: {
  //       components: {
  //         ElTransfer
  //       }
  //     }
  //   })
  //   const label = wrapper.find('.el-transfer-panel__header .el-checkbox__label')
  //   const panelList = wrapper.find('.el-transfer-panel__list .el-checkbox__label span')
  //   expect(label.text().indexOf('表1') > -1).toBe(true)
  //   expect(panelList.text()).toEqual('1 - 备选项 1')
  //   expect(label.find('span').text()).toEqual('no')
  // })

  // it('check', () => {
  //   const Comp = createTransfer('v-model="value"', {
  //     setup() {
  //       const value = ref([])
  //       return {
  //         value
  //       }
  //     }
  //   })
  //   const wrapper = mount(Comp, {
  //     global: {
  //       components: {
  //         ElTransfer
  //       }
  //     }
  //   })
  //   const leftList = wrapper.findComponent({ name: 'ElTransferPanel' }).vm
  //   leftList.handleAllCheckedChange({ target: { checked: true } })
  //   expect(leftList.checked.length).toEqual(12)
  // })
})

// describe('target order', () => {
//   it('original(default)', async () => {
//     const Comp = createTransfer('v-model="value" :left-default-checked="[2, 3]"', {
//       setup() {
//         const value = ref([1, 4])
//         const onUpdate = (val) => {
//           value.value = val
//         }
//         return {
//           value,
//           onUpdate
//         }
//       }
//     })
//     const wrapper = mount(Comp, {
//       global: {
//         components: {
//           ElTransfer
//         }
//       }
//     })
//     const transfer = wrapper.findComponent({ name: 'ElTransfer' }).vm
//     transfer.addToRight()
//     await nextTick()
//     const targetItems = [].slice.call(wrapper.findAll('.el-transfer__buttons + .el-transfer-panel .el-transfer-panel__body .el-checkbox__label span'))
//                         .map(item => item.text())
//     expect(targetItems).toEqual(['备选项 1', '备选项 2', '备选项 3', '备选项 4'])
//   })

//   it('push', async () => {
//     const Comp = createTransfer('v-model="value" :left-default-checked="[2, 3]" target-order="push"', {
//       setup() {
//         const value = ref([1, 4])
//         const onUpdate = (val) => {
//           value.value = val
//         }
//         return {
//           value,
//           onUpdate
//         }
//       }
//     })
//     const wrapper = mount(Comp, {
//       global: {
//         components: {
//           ElTransfer
//         }
//       }
//     })
//     const transfer = wrapper.findComponent({ name: 'ElTransfer' }).vm
//     transfer.addToRight()
//     await nextTick()
//     const targetItems = [].slice.call(wrapper.findAll('.el-transfer__buttons + .el-transfer-panel .el-transfer-panel__body .el-checkbox__label span'))
//                         .map(item => item.text())
//     expect(targetItems).toEqual(['备选项 1', '备选项 4', '备选项 2', '备选项 3'])
//   })

//   it('unshift', async () => {
//     const Comp = createTransfer('v-model="value" :left-default-checked="[2, 3]" target-order="unshift"', {
//       setup() {
//         const value = ref([1, 4])
//         const onUpdate = (val) => {
//           value.value = val
//         }
//         return {
//           value,
//           onUpdate
//         }
//       }
//     })
//     const wrapper = mount(Comp, {
//       global: {
//         components: {
//           ElTransfer
//         }
//       }
//     })
//     const transfer = wrapper.findComponent({ name: 'ElTransfer' }).vm
//     transfer.addToRight()
//     await nextTick()
//     const targetItems = [].slice.call(wrapper.findAll('.el-transfer__buttons + .el-transfer-panel .el-transfer-panel__body .el-checkbox__label span'))
//                         .map(item => item.text())
//     expect(targetItems).toEqual(['备选项 2', '备选项 3', '备选项 1', '备选项 4'])
//   })
// })
