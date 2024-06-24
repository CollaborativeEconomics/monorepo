export default function timeAgo(sdate:string) {
  var now  = new Date()
  var date = new Date(sdate)
  var seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  var interval = seconds / 31536000
  if (interval > 1) {
    let n = Math.floor(interval)
    return  n + ' year' + (n==1?'':'s') + ' ago'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    let n = Math.floor(interval)
    return n + ' month' + (n==1?'':'s') + ' ago'
  }
  interval = seconds / 86400
  if (interval > 1) {
    let n = Math.floor(interval)
    return n + ' day' + (n==1?'':'s') + ' ago'
  }
  interval = seconds / 3600
  if (interval > 1) {
    let n = Math.floor(interval)
    return n + ' hour' + (n==1?'':'s') + ' ago'
  }
  interval = seconds / 60
  if (interval > 1) {
    let n = Math.floor(interval)
    return n + ' minute' + (n==1?'':'s') + ' ago'
  }
  interval = seconds
  let n = Math.floor(interval)
  if(n==0){ return 'seconds' }
  return n + ' second' + (n==1?'':'s') + ' ago'
}