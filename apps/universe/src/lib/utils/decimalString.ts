export default function decimalString(num:number, decs=0): string{
  //if(!num){ return '0' }
  return new Intl.NumberFormat('en-us', { minimumFractionDigits:decs, maximumFractionDigits:decs }).format(num)
}
