// Client side utils

// Quickly get an element by id
export function $(id:string){
  return document.getElementById(id)
}

// Quickly assign text to any html element or enable/disable if val is bool
export function $$(id:string, val:string, off?:boolean|undefined){
  const obj = document.getElementById(id)
  if(!obj){ return }
  obj.innerHTML = val || '&nbsp;'
  if(typeof(off)!='undefined'){
    if(off){
      obj.setAttribute('disabled', 'true')
    } else {
      obj.removeAttribute('disabled')
    }
  }
}

// Quickly set message element to inform user of events and states
export function setMessage(text:string='', warn:boolean|undefined=false){
  const obj = document.getElementById('message')
  if(!obj){ return }
  if(warn){ text = `<warn>${text}</warn>` }
  obj.innerHTML = text
}

export function getNetwork(net:string){
  return net=='pubnet'?'Mainnet':'Testnet'
}

export function setCookie(name:string, value='', days=0) {
  var expires = ''
  if(days) {
    var date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  let path = '; path=/'
  //document.cookie = `${name}=${value}${expires}${path}`
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

export function getCookie(name:string) {
  let value = null
  var nameEQ = name + "="
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') { c = c.substring(1, c.length) }
    if (c.indexOf(nameEQ) == 0) { value = c.substring(nameEQ.length, c.length); break }
  }
  return value
}

export function copyToClipboard(text:string) {
  navigator.clipboard.writeText(text).then(function() {
    console.log('Copying to clipboard was successful!')
  }, function(err) {
    console.error('Could not copy to clipboard:', err)
  })
}

