import React, { forwardRef, HTMLProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
//import Image from 'next/image';

interface FileProps {
  id?: string;
  source?: string;
  className?: string;
  width?: number;
  height?: number;
  register: UseFormRegisterReturn;
}

function onPreviewFile(event, imgId){
  console.log('PREVIEW!', event)
  const file = event?.target?.files[0];
  if(!file){ return }
  const reader = new FileReader();
  reader.onload = function(e) {
    //console.log('READER!', e)
    const img = document.getElementById(imgId) as HTMLInputElement
    img.setAttribute('src', e.target.result.toString())
  }
  reader.readAsDataURL(file);
}

const FileView = forwardRef(
  (
    {
      id,
      source,
      className,
      width,
      height,
      register,
      ...props
    }: FileProps & HTMLProps<HTMLInputElement>,
    ref
  ) => {
    if(!width){ width = 250 }
    if(!height){ height = 250 }
    const style = 'mx-auto' // w-64 h-64
    //console.log('WxH', width, height, id)
    const imgId = 'file-upload-'+id
    const size = `w-[${width}px] h-[${height}px]`
    return (
    <div className={`relative ${size} m-4 ${className ?? ''}`} >
      <input type="file" id={id} ref={ref} {...props} {...register} onChange={(event)=>onPreviewFile(event, imgId)} className="block absolute top-0 left-0 w-full h-full opacity-0 z-10 cursor-pointer" />
      <img id={imgId} className={style} src={source} width={width+'px'} height={height+'px'} alt="profile picture" />
    </div>
  )}
);

FileView.displayName = 'FileView';

export default FileView;
