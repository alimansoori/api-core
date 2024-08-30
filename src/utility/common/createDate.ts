export const createDate = () => {
  const date = new Date()
  const day = date.getDate() >= 10 ? `${date.getDate()}` : `0${date.getDate()}`
  const month = date.getMonth() + 1 >= 10 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`
  const year = date.getFullYear().toString()

  return year + '-' + month + '-' + day
}
