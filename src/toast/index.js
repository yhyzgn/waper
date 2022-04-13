import {ElMessage, ElMessageBox} from 'element-plus'

export const toast = {
  success: msg => {
    console.log(msg)
    ElMessage.success({
      message: msg,
      offset: 80
    })
  },
  warning: msg => {
    ElMessage.warning({
      message: msg,
      offset: 80
    })
  },
  error: msg => {
    ElMessage.error({
      message: msg,
      offset: 80
    })
  },
  nextOrBack: (isCreateMode, router, thenCallback) => {
    if (isCreateMode) {
      ElMessageBox.confirm('保存成功', {
        type: 'success',
        confirmButtonText: '继续添加',
        cancelButtonText: '返回列表',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false
      }).then(() => {
        // 继续
        thenCallback()
      }).catch(() => {
        // 返回列表页
        router.back()
      })
    } else {
      // 编辑模式，直接返回列表页
      toast.success('保存成功')
      router.back()
    }
  }
}
