import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { newUser, getUserByWallet } from '@/lib/utils/registry'
import { anonymousUser } from '@/lib/utils/api'

interface Credentials {
  address:  string
  chain:    string
  chainid:  string
  network:  string
  currency: string
}

interface Users {
  id: string
  name?: string
  email?: string
  image?: string
  address?: string
  chain?: string
  chainid?: string
  network?: string
  currency?: string
}

async function getUserByCredentials(credentials:Credentials){
  try {
    let user = await getUserByWallet(credentials?.address||'')
    if(!user || user?.error){
      const anon = anonymousUser(credentials?.address, credentials?.chain)
      user = await newUser(anon)
      console.log('NEW USER', user)
    }
    const info = {
      id:       user?.id,
      name:     user?.name  || 'Anonymous',
      email:    user?.email || '',
      image:    user?.image || '/media/nopic.png',
      address:  credentials?.address||'',
      chain:    credentials?.chain||'',
      chainid:  credentials?.chainid||'',
      network:  credentials?.network||'',
      currency: credentials?.currency||''
    }
    return info
  } catch(ex:any) {
    console.error('ERROR:', ex)
    return null
  }
}

const credentials = {
  //id:      {label:'id',     type:'text'},
  address:  {label:'address', type:'text'},
  chain:    {label:'chain',   type:'text'},
  chainid:  {label:'chainid', type:'text'},
  network:  {label:'network', type:'text'},
  currency: {label:'currency',type:'text'}
}

const authorize = async (credentials:any) => {
  try {
    const user = await getUserByCredentials(credentials)
    return user
  } catch (ex:any) {
    console.error('ERROR:', ex)
    return null
  }
}

const providers = [
  CredentialsProvider({
    id: 'Arbitrum',
    name: 'Arbitrum - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Avalanche',
    name: 'Avalanche - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Base',
    name: 'Base - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Binance',
    name: 'Binance - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Celo',
    name: 'Celo - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'EOS',
    name: 'EOS - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Ethereum',
    name: 'Ethereum - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'EthereumUSDC',
    name: 'Ethereum (USDC) - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'EthereumUSDT',
    name: 'Ethereum (USDT)- Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Filecoin',
    name: 'Filecoin - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Flare',
    name: 'Flare - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Optimism',
    name: 'Optimism - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Polygon',
    name: 'Polygon - Metamask',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'Stellar',
    name: 'Stellar - Lobstr',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'XRPL',
    name: 'XRPL - Xaman',
    credentials,
    authorize
  }),
  CredentialsProvider({
    id: 'XDC',
    name: 'XDC - Metamask',
    credentials,
    authorize
  })
]

const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signin'
  },
  providers,
  callbacks: {
    async jwt(args) {
      const { token, user, account, profile, isNewUser, trigger, session } = args
      if(account){
        token.userid   = account?.providerAccountId || ''
        token.address  = user?.address  || ''
        token.chain    = account?.provider || ''
        token.chainid  = user?.chainid  || ''
        token.network  = user?.network  || ''
        token.currency = user?.currency || ''
        //token.image    = user?.image    || ''
        //token.name     = user?.name     || ''
        //token.email    = user?.email    || ''
      }
      if(trigger=='update' && session){
        token.name    = session?.name  || ''
        token.email   = session?.email || ''
        token.picture = session?.image || '/media/nopic.png'
        //token.image   = session?.image || '/media/nopic.png'
      }
      return token
    },
    async session(args) {
      const { session, token, user } = args
      // Send properties to the client
      session.userid     = (token?.userid   as string) || ''
      session.address    = (token?.address  as string) || ''
      session.chain      = (token?.chain    as string) || ''
      session.chainid    = (token?.chainid  as string) || ''
      session.network    = (token?.network  as string) || ''
      session.currency   = (token?.currency as string) || ''
      if(!session?.user) { session.user = {} }
      session.user.name  = (token?.name     as string) || ''
      session.user.email = (token?.email    as string) || ''
      session.user.image = (token?.picture  as string) || ''
      //session.decimals = (token?.decimals as string) || ''
      //session.wallet = (token?.wallet as string) || ''
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
