/* ============================================================
   useToast — Simple toast notification composable
   ============================================================ */

import { ref } from 'vue'

const message = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

export function useToast() {
  function show(msg: string, duration = 2500) {
    clearTimeout(timer)
    message.value = msg
    timer = setTimeout(() => { message.value = '' }, duration)
  }

  return { message, show }
}
