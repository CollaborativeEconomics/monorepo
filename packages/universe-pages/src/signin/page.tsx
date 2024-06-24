"use client"
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link  from 'next/link'
import { getProviders, signIn } from "next-auth/react"
import { isConnected, requestAccess } from "@stellar/freighter-api"
import { ConfigContext } from '@/components/config' 
import ButtonWallet from '@/components/ButtonWallet'
import { fetchApi, postApi } from '@/utils/api'


export default function Signin() {
  // @ts-ignore: Typescript sucks donkey balls
  const {config, setConfig} = useContext(ConfigContext)
  console.log('CONFIG INDEX', config)
  const router = useRouter()
  const [loginText, setLoginText] = useState(config?.user=='' ? 'LOGIN' : 'PROFILE '+config.wallet.substr(0,10))
  const [logged, setLogged] = useState(config.user!=='')
  const [userId, setUserId] = useState(config.user)

  async function onLogin(){
    console.log('LOGIN')
    if(!logged){
      requestAccess().then(address=>{
        console.log('Wallet', address)
        const chainName = 'Stellar'
        const chainid   = '0'
        const network   = 'testnet'
        const currency  = 'XLM'
        setLogged(true)
        setLoginText('WALLET '+address.substr(0,10)+'...')
        fetch('/api/users?wallet='+address).then(res=>{
          res.json().then(async data=>{
            const user = data.result
            //console.log('User', user)
            if(user){
              console.log('UserId', user.id)
              setUserId(user.id)
              setConfig({...config, wallet:address, user:user.id})
              const callbackUrl = '/profile/'+user.id
              await signIn(chainName, {callbackUrl, address, chainName, chainid, network, currency})
              //router.push('/profile/'+user.id)
            } else {
              const body = JSON.stringify({
                name: 'Anonymous', 
                wallet: address,
                wallets:{
                  create:{
                    address: address,
                    chain: 'Stellar'
                  }
                }
              })
              fetch('/api/users', {method:'POST', headers: { 'Content-Type': 'application/json' }, body}).then(rex=>{
                rex.json().then(async newUser=>{
                  const userInfo = newUser.data
                  console.log('NEWUSER', userInfo)
                  if(!userInfo){
                    console.log('Error creating user')
                  } else {
                    const callbackUrl = '/profile/'+userInfo.id
                    await signIn(chainName, {callbackUrl, address, chainName, chainid, network, currency})
                    //router.push('/profile/'+userInfo.id)
                  }
                })
              })
            }
          })
        })
      })
    } else {
      if(userId){
        router.push('/profile/'+userId)
      }
    }
  }
  
  return (
      <div className="w-[500px] mt-48 p-12 mx-auto rounded-xl border">
        <div className="mt-5">
          <div className="text-center flex flex-col justify-center items-center">
            <ButtonWallet text="Freighter" icon="freighter.png" href="https://freighter.app" className="w-[200px]" />
            <li className="list-none my-4">
              <p className="text-xl mt-4">We use Freighter wallet for Soroban Network</p>
              <p>Download <Link href={'https://www.freighter.app/'} target="_blank">Freighter</Link> wallet</p>
            </li>
            <div className="mt-5 w-full">
              <button className="w-full py-3 rounded border bg-blue-600 hover:bg-blue-500 text-white" onClick={onLogin}>{loginText}</button>
            </div>
            <p className="text-sm text-slate-400 mt-8">You will need to have XLM in a wallet that supports Soroban Network, such as Freighter.  Freighter is a secure, non-custodial, end-to-end encrypted, blockchain wallet. You can learn more in their website.</p>
          </div>
        </div>
      </div>
  )
}
