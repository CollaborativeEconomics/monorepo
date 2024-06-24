"use client"
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Card from './card'
import Icon from './icon'
import TextInput from './form/textinput'

interface DonationTierRowTypes {
  title: string;
  description?: string;
  image?: string;
  value: number;
  credit?: number;
  rate?: number;
  onClick: (num1:any, num2:any) => void;
  currency?: string;
  disabled?: boolean;
}

const DonationTierRow = ({
  title,
  image,
  value,
  credit,
  rate,
  currency,
  disabled,
  onClick,
  description
}: DonationTierRowTypes) => {
  // ref not working for some reason
  const minimum = 10
  const [message, setMessage] = useState('')
  const textInputRef = useRef(null)
  const { register, watch } = useForm({ defaultValues: { [title as string]: value } })
  const [amount] = watch([title as string])
  //const rate = 0.1285 // xlm/usd
  //const creditPerTon = 20 // usd/ton
  const amountPerTon = (credit||0) / (rate||1)
  //console.log('USD/TON', credit)
  //console.log('XLM/TON', amountPerTon)
  const offsetVal = amountPerTon>0 ? (value / amountPerTon).toFixed(2) : 0
  const [offset,setOffset] = useState(offsetVal)
  function updateOffset(event:any){
    const value = parseInt(event.target.value) || 0
    const final = amountPerTon>0 ? (value / amountPerTon).toFixed(2) : 0
    setOffset(final)
  }
  return (
    <>
      <div className="text-gray-400 mb-1 text-xs">{description}</div>
      <div className="mx-auto text-center">Your donation will offset {offset} tons of carbon</div>
      <Card className="w-full h-24 p-0 mb-4" key={title}>
        <div className="flex flex-row w-full h-full justify-between items-center">
          <div className="h-full flex flex-row items-center basis-24 aspect-square mr-2">
            <Image src={image||''} className="h-full" width={100} height={100} alt="" />
          </div>
          <TextInput
            ref={textInputRef}
            className="mt-0 mr-4 min-w-0"
            placeholder="0"
            type="number"
            register={register(title)}
            disabled={disabled}
            onChange={updateOffset}
          />
          <label className="mr-4 mb-0">{currency ?? 'XLM'}</label>
          <div
            onClick={() => { 
              if(amount<minimum){
                setMessage('Minimum amount of 10 XLM required')
                return
              }
              onClick(amount,credit)
            }}
            className="bg-green-700 self-stretch rounded-r-xl flex basis-24 flex-grow-0 justify-center items-center"
          >
            <Icon icon="arrow_forward" className="cursor-pointer" />
          </div>
        </div>
      </Card>
      <p className="my-2 text-center text-yellow-300">{message}</p>
    </>
  )
}

export default DonationTierRow

// textinput onFocus={() => textInputRef?.current?.select() }
