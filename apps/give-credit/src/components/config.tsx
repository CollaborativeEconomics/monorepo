"use client"
import { createContext, useState } from 'react'

const settings = {
  name: 'Give Credits',
  version: '1.0',
  theme: 'light',
  wallet: '',
  user: ''
}

export const ConfigContext = createContext(settings)

export function ConfigProvider(props:any) {
  const children = props.children
  const [config, setConfig] = useState(settings)

  return (
    // @ts-ignore: Typescript sucks donkey balls
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}
