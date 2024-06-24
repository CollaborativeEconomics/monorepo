export function getExtension(mime){
  let ext = ''
  switch (mime) {
    case 'application/pdf':
      ext = '.pdf'
      break
    case 'audio/mpeg':
    case 'audio/mp3':
      ext = '.mp3'
      break
    case 'image/jpg':
    case 'image/jpeg':
      ext = '.jpg'
      break
    case 'image/png':
      ext = '.png'
      break
    case 'image/webp':
      ext = '.webp'
      break
    case 'video/mp4':
      ext = '.mp4'
      break
    case 'video/mpeg':
      ext = '.mpeg'
      break
    case 'video/webm':
      ext = '.webm'
      break
  }
  return ext
}

export function getImageExtension(mime){
  let ext = ''
  switch (mime) {
    case 'image/jpg':
    case 'image/jpeg':
      ext = '.jpg'
      break
    case 'image/png':
      ext = '.png'
      break
    case 'image/webp':
      ext = '.webp'
      break
  }
  return ext
}

export function getMediaExtension(mime){
  let ext = ''
  switch (mime) {
    case 'application/pdf':
      ext = '.pdf'
      break
    case 'audio/mpeg':
    case 'audio/mp3':
      ext = '.mp3'
      break
    case 'video/mp4':
      ext = '.mp4'
      break
    case 'video/mpeg':
      ext = '.mpeg'
      break
    case 'video/webm':
      ext = '.webm'
      break
  }
  return ext
}
