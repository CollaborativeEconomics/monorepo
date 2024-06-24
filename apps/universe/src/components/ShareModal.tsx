// https://tailwindcomponents.com/component/share-modal

'use client'
import Link from "next/link"
import { useEffect, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Share as IconShare, Facebook, Instagram, Twitter, Send as Telegram, MessageCircle as Whatsapp } from 'lucide-react'
import copy from 'clipboard-copy'

export default function ShareModal() {
  const url = typeof window !== "undefined" ? window.location.href : 'https://giving-universe.org'
  const shareFacebook  = 'https://web.facebook.com/sharer.php?u='+url
  const shareTwitter   = 'https://twitter.com/intent/tweet?text=GivingUniverse&url='+url
  const shareInstagram = 'https://www.instagram.com/?url='+url
  const shareWhatsapp  = 'https://wa.me/?text='+url
  const shareTelegram  = 'https://telegram.me/share/url?text=GivingUniverse&url='+url

  const [open, setOpen] = useState(false)
  const [button, setButton] = useState('COPY')

  function copyToClipboard(url:string) {
    copy(url).then(() => {
      console.log('COPIED')
      setButton('COPIED')
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex Button text-slate-500"><span className="mr-2">Share</span><IconShare /></button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-center">
          <div className="w-full mx-0 p-0 rounded-xl">
            <div className="my-4">
              <p className="text-sm">Share this link via</p>
              <div className="flex justify-around my-4">
                {/* FACEBOOK */}
                <div className="border hover:bg-[#1877f2] w-12 h-12 fill-[#1877f2] hover:fill-white border-blue-200 rounded-full flex items-center justify-center shadow-xl hover:shadow-blue-500/50 cursor-pointer">
                  <Link href={shareFacebook}>
                    <Facebook />
                  </Link>
                </div>
                {/* TWITTER */}
                <div className="border hover:bg-[#1d9bf0] w-12 h-12 fill-[#1d9bf0] hover:fill-white border-blue-200 rounded-full flex items-center justify-center shadow-xl hover:shadow-sky-500/50 cursor-pointer">
                  <Link href={shareTwitter}>
                    <Twitter />
                  </Link>
                </div>
                {/* INSTAGRAM */}
                <div className="border hover:bg-[#bc2a8d] w-12 h-12 fill-[#bc2a8d] hover:fill-white border-pink-200 rounded-full flex items-center justify-center shadow-xl hover:shadow-pink-500/50 cursor-pointer">
                  <Link href={shareInstagram}>
                    <Instagram />
                  </Link>
                </div>
                {/* WHATSAPP */}
                <div className="border hover:bg-[#25D366] w-12 h-12 fill-[#25D366] hover:fill-white border-green-200 rounded-full flex items-center justify-center shadow-xl hover:shadow-green-500/50 cursor-pointer">
                  <Link href={shareWhatsapp}>
                    <Whatsapp />
                  </Link>
                </div>
                {/* TELEGRAM */}
                <div className="border hover:bg-[#229ED9] w-12 h-12 fill-[#229ED9] hover:fill-white border-sky-200 rounded-full flex items-center justify-center shadow-xl hover:shadow-sky-500/50 cursor-pointer">
                  <Link href={shareTelegram}>
                    <Telegram />
                  </Link>
                </div>
              </div>
              {/* COPY */}
              <p className="text-sm">Or copy link</p>
              <div className="flex flex-col justify-between items-center mt-4 py-0">
                <input id="copyurl" className="w-full outline-none border-0 bg-transparent text-sm" type="text" placeholder="link" value={url} readOnly />
                <button className="bg-indigo-500 text-white rounded text-sm py-2 px-5 mt-2 hover:bg-indigo-600" onClick={(evt)=>{copyToClipboard(url)}}>{button}</button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
