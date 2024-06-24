import Link, { LinkProps } from 'next/link'
import React from 'react'
import Card from './card'
import Icon from './icon'

interface TileTypes {
  text: string
  color?: string
  icon?: string
}

const Tile = ({ text, color, icon, href, ...props }: TileTypes & LinkProps) => (
  <Link href={href} {...props}>
    <Card style={color ? { backgroundColor: color } : {}} className="h-full p-4">
      <div className='h-full w-full flex flex-col justify-between items-center'>
        {icon ? (
          typeof icon === 'string' ? (
            <Icon className="m-2 !text-4xl self-center text-green-300" {...{ icon }} />
          ) : (
            icon
          )
        ) : null}
        <h4 className="self-center font-bold uppercase">{text}</h4>
      </div>
    </Card>
  </Link>
)

export default Tile
