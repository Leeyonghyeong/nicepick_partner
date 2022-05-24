export const convertDate = (date: Date): string => {
  const messageDate = new Date(date)

  const ampm = messageDate.getHours() >= 12 ? '오후' : '오전'

  const hour =
    ampm === '오전'
      ? messageDate.getHours() === 0
        ? '12'
        : messageDate.getHours()
      : messageDate.getHours() > 12
      ? messageDate.getHours() - 12
      : messageDate.getHours()

  const minute =
    messageDate.getMinutes() < 10
      ? '0' + messageDate.getMinutes()
      : messageDate.getMinutes()

  return ampm + ' ' + hour + ':' + minute
}

export const compareDate = (
  currentDate: Date,
  beforeDate: Date,
  index: number
): boolean => {
  if (index === 0) {
    return true
  } else {
    const current = new Date(currentDate)
    const before = new Date(beforeDate)

    const calcCurrentDate =
      current.getFullYear() + current.getMonth() + current.getDate()
    const calcBeforeDate =
      before.getFullYear() + before.getMonth() + before.getDate()
    const calcDate = calcCurrentDate - calcBeforeDate

    if (calcDate === 0) {
      return false
    } else {
      return true
    }
  }
}

export const chatDateString = (date: Date): string => {
  const chatDate = new Date(date)

  const weekArr: string[] = ['일', '월', '화', '수', '목', '금', '토']

  const year = chatDate.getFullYear()
  const month =
    chatDate.getMonth() + 1 < 10
      ? '0' + (chatDate.getMonth() + 1)
      : chatDate.getMonth() + 1
  const dayOfMonth =
    chatDate.getDate() < 10 ? '0' + chatDate.getDate() : chatDate.getDate()
  const dayOfWeek = weekArr[chatDate.getDay()]

  return year + '. ' + month + '. ' + dayOfMonth + ' (' + dayOfWeek + ')'
}

export const calcDate = (date: Date): string => {
  const today = new Date()
  const chatDate = new Date(date)

  const calcTodayDate = today.getFullYear() + today.getMonth() + today.getDate()
  const calcChatDate =
    chatDate.getFullYear() + chatDate.getMonth() + chatDate.getDate()

  const calcDate = calcTodayDate - calcChatDate

  if (today.getFullYear() === chatDate.getFullYear()) {
    if (calcDate === 0) {
      return convertDate(date)
    } else {
      return chatDate.getMonth() + 1 + '월 ' + chatDate.getDate() + '일'
    }
  } else {
    return (
      chatDate.getFullYear +
      '. ' +
      chatDate.getMonth() +
      1 +
      '. ' +
      chatDate.getDate()
    )
  }
}
