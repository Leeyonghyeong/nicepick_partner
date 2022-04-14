import Swal, { SweetAlertPosition, SweetAlertResult } from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  timer: 2000,
})

const toastAlert = (
  msg: string,
  timer = 2000,
  position: SweetAlertPosition = 'bottom'
) => {
  Toast.fire({
    html: msg,
    background: 'rgb(0, 0, 0, 0.8)',
    color: '#fff',
    timer,
    position,
  })
}

const confirmAlert = (msg: string): Promise<SweetAlertResult<boolean>> => {
  return Swal.fire({
    text: msg,
    confirmButtonText: '확인',
    confirmButtonColor: '#1569ff',
    showCancelButton: true,
    cancelButtonText: '취소',
    cancelButtonColor: '#fa5252',
    allowOutsideClick: false,
  })
}

const checkAlert = (msg: string): Promise<SweetAlertResult<boolean>> => {
  return Swal.fire({
    text: msg,
    confirmButtonText: '확인',
    confirmButtonColor: '#1569ff',
    allowOutsideClick: false,
  })
}

export { toastAlert, confirmAlert, checkAlert }
