export default function dateToPrisma(sdate: number | string | Date) {
  let date = new Date()
  let ret = null
  try {
    if (sdate instanceof Date) {
      date = sdate
    } else if (typeof sdate === 'string') {
      date = new Date(sdate)
    }
    //ret = date.toJSON().replace('T', ' ').substring(0, 19)
    ret = date.toISOString()
  } catch (ex) {
    console.error(ex)
  }
  return ret
}
