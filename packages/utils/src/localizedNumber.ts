export default function localizedNumber(num: number, decs = 0) {
  //if(!num){ return '0' }
  return new Intl.NumberFormat("en-us", {
    minimumFractionDigits: decs,
    maximumFractionDigits: decs,
  }).format(num)
}
