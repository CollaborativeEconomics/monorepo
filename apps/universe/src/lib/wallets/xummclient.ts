import { Xumm } from "xumm"

//console.log(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET, process.env.NEXT_PUBLIC_XUMM_API_KEY)

const XummClient = new Xumm(process.env.NEXT_PUBLIC_XUMM_API_KEY||'')

export default XummClient
