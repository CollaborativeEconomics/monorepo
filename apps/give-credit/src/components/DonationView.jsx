"use client"
import { useState, createContext } from 'react'
import DonationForm from '@/src/components/DonationForm'
import NFTReceipt from '@/src/components/NFTReceipt'

export const DonationContext = createContext() // For use in NFTReceipt component

export default function DonationView({initiative, receipt, rate, carbon}){
  const [donation, setDonation] = useState(receipt)

  return (
    <DonationContext.Provider value={{donation, setDonation}}>
      <div className="flex flex-col lg:flex-row flex-nowrap gap-10 items-start">
        <div className="w-full lg:w-[60%]">
          <DonationForm initiative={initiative} rate={rate} carbon={carbon} />
        </div>
        <div className="lg:w-[40%]">
          <NFTReceipt data={donation} />
        </div>
      </div>
    </DonationContext.Provider>
  )
}
