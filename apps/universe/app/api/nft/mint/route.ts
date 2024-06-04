import Chains from '@/lib/chains/server/apis'
import uploadToIPFS from '@/lib/utils/uploadToIPFS'
import { getOrganizationsByWallet, getInitiativeByTag, getUserByWallet, createNFT } from '@/lib/utils/registry'

interface transactionInfo {
  success?: boolean
  error?: string
  account?: string
  destination?: string
  destinationTag?: string
  amount?: string
}


// RIPPLE: Currency code to name
// Converts currency code from tx info to verify it's Messenger token
// hexToStr('014D534E47523100000000000000000000000000') -> MSNGR1
function currencyHexToStr(hex:string) {
  return Buffer.from(hex, 'hex').toString().trim().replace(/\0/g, '')
}

// POST /api/nft/mint {paymentId}
// On donation:
//   Upload metadata to permanent storage
//   Mint nft with uri:metadata and get token Id
//   Create offer Id for NFT transfer
//   Send tokenId, offerId to client

export async function POST(request: Request) {
  console.log('API MINTING...')

  try {
    const body:any = await request.json()
    const {chain, txid, itag, rate}:{chain:string, txid:string, itag:string, rate:number} = body
    console.log('CHAIN', chain)
    console.log('TXID', txid)
    console.log('INIT', itag)
    console.log('USD', rate)

    if(!chain || !txid){
      return Response.json({ error: 'Required chain and txid are missing' }, {status:400})
    }

    // Get tx info
    const txInfo = await Chains[chain].getTransactionInfo(txid)
    console.log('TXINFO', txInfo)
    if(!txInfo){
      return Response.json({ error: 'Transaction not found' }, {status:404})
    }
    if ('error' in txInfo) {
      console.log('ERROR', txInfo.error)
      return Response.json({ error: txInfo.error }, {status:500})
    }
    //return Response.json({ success: true, image: 'uriImage', metadata: 'uriMeta', tokenId: '123456', offerId: '123457'})

    // Form data
    const created = new Date().toJSON().replace('T', ' ').substring(0, 19)
    const donorAddress = txInfo.account || ''
    const user = await getUserByWallet(donorAddress)
    const userId = user?.id || ''

    let organizationId = ''
    let organizationName = ''
    let organizationAddress = ''
    let initiativeTag = 0
    if ('destination' in txInfo) {
      organizationAddress = txInfo.destination
    }
    if ('destinationTag' in txInfo) {
      //initiativeId = BigInt(txInfo.destinationTag).toString(16)
      initiativeTag = parseInt(txInfo.destinationTag) || 0
    } else {
      initiativeTag = parseInt(itag) || 0
    }

    // Get org data
    const result = await getOrganizationsByWallet(organizationAddress)
    //console.log('ORG', result)
    if (result.length > 0) {
      organizationId = result[0].id
      organizationName = result[0].name
    } else {
      console.log('Organization not found', result?.error)
      return Response.json({ error: 'Organization not found' }, {status:500})
    }

    // Get initiative info
    let initiative = null
    let initiativeId = '0'
    let initiativeTitle = 'Direct donation'
    if(initiativeTag){
      initiative = await getInitiativeByTag(initiativeTag.toString())
      console.log('INITIATIVE', initiative)
      if(initiative) {
        initiativeId = initiative.id
        initiativeTitle = initiative.title
      }
    }

    const network  = Chains[chain].network
    const currency = Chains[chain].coinSymbol

    let amount = parseFloat(txInfo.amount) || 0.0
    let amountCUR = amount.toFixed(4)
    let amountUSD = (amount * rate).toFixed(4)
    let coinName = currency
    let coinIssuer = ''

    let nftTaxon = 123456000 // Constant integer to group all similar NFTs
    let uriImage = 'ipfs:QmPnrPThofLVGbcJZUfRiHVuDxmHknAHBJsGaSnxfgeWwP' // thank you NFT
    if(initiative?.imageUri){
      uriImage = initiative.imageUri
    }

    // Save metadata
    const metadata = {
      mintedBy: 'CFCE via Give',
      created: created,
      donorAddress: donorAddress,
      organization: organizationName,
      initiative: initiativeTitle,
      image: uriImage,
      blockchain: chain,
      network: network,
      currency: coinName,
      issuer: coinIssuer,
      amount: amountCUR,
      usdValue: amountUSD
    }
    //if(coinIssuer){ metadata.issuer = coinIssuer }
    console.log('META', metadata)
    const fileId = 'meta-' + txid // unique file id
    const bytes = Buffer.from(JSON.stringify(metadata, null, 2))
    const cidMeta = await uploadToIPFS(fileId, bytes, 'text/plain')
    console.log('CID', cidMeta)
    if (!cidMeta || cidMeta.error) {
      return Response.json({ error: 'Error uploading metadata' }, {status:500})
    }
    const cid = cidMeta?.result
    const uriMeta = 'ipfs:' + cid
    //let uriMeta = process.env.IPFS_GATEWAY_URL + cidMeta
    console.log('URI', uriMeta)

    // Mint NFT
    const okMint = await Chains[chain].mintNFT(uriMeta, donorAddress)
    //const okMint = await Chains[chain].mintNFT('ipfs:123456', 'GAU2AJNUVZ47Q4ZJUVAOQFLN3EE3XJUTV34N2EXGKXRBFZ2MWCN2TZGO')
    //console.log('Mint result', okMint)
    //return Response.json(okMint)
    
    if (!okMint || okMint.error) {
      return Response.json({ error: 'Error minting NFT' }, {status:500})
    }
    const tokenId = okMint?.tokenId

    // Save NFT data to Prisma
    const data = {
      created: new Date(),
      userId: userId,
      donorAddress: donorAddress,
      organizationId: organizationId,
      initiativeId: initiativeId,
      metadataUri: uriMeta,
      imageUri: uriImage,
      coinLabel: chain,
      coinNetwork: network,
      coinSymbol: coinName,
      coinValue: amountCUR,
      usdValue: amountUSD,
      tokenId: tokenId,
      offerId: '',
      status: 0
    }
    console.log('NftData', data)
    const saved = await createNFT(data)
    console.log('Saved', saved?.success)
    if (saved.success) {
      console.log('NFT saved in DB!')
    } else {
      console.error('Error saving NFT in DB!')
    }

    // Success
    console.log('Minting completed')
    console.log('RESULT', {
      success: true,
      image: uriImage,
      metadata: uriMeta,
      tokenId: tokenId
    })
    return Response.json({
      success: true,
      image: uriImage,
      metadata: uriMeta,
      tokenId: tokenId
    })
  } catch (ex:any) {
    console.error(ex)
    return Response.json({ success: false, error: ex.message }, {status:500})
  }
}
