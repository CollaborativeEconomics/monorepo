import upload from '@/libs/nft/upload'
import mint from '@/libs/nft/mint'
import fetchLedger from '@/libs/server/fetchLedger'
import { newUser, newUserWallet, getUserByWallet, getOrganizationById, getInitiativeById, createNFT } from '@/utils/registry'
import {init, runHook, Triggers} from '@cfce/registry-hooks'

// Initialize the hook package
init({
  registryApiKey:  process.env.CFCE_REGISTRY_API_KEY || '',
  registryBaseUrl: process.env.CFCE_REGISTRY_API_URL || ''
})


/*
function getTagFromMemo(memo){
  if(!memo) return ''
  const parts = memo.split(':')  // tag:84
  if(parts.length>1){
    return parts[1]
  }
  return ''
}
*/

// FOR TESTING ONLY - REMOVE WHEN READY
// api/nft/mint
//export async function GET(request: Request) {
//  const contractId = 'CBZ6RVZUN3P57LWI6LJTG4BM5NV5RGCROD6UHRPZEJYSFSJG5BBROLYN'
//  const donor = 'GAU2AJNUVZ47Q4ZJUVAOQFLN3EE3XJUTV34N2EXGKXRBFZ2MWCN2TZGO'
//  const uriMeta  = 'ipfs:QmimgvsGUGykGyDqjL6zjbKjtqNntYZqNzQrFa6UnyZF1n'
//  const result = await mint(contractId, donor, uriMeta)
//  console.log('RESMINT', result)
//  return Response.json(result)
//}

// POST /api/nft/mint {paymentId}
// On donation:
//   Upload metadata to permanent storage
//   Mint nft with uri:metadata and get token Id
//   Send tokenId to client
export async function POST(request: Request) {
  try {
    const body:any = await request.json()
    const {txid, initid, donor, destin, amount, rate} = body
    console.log('BODY', txid, initid, donor, destin, amount, rate)

    // Get tx info
    const txInfo = await fetchLedger('/transactions/'+txid)
    if(!txInfo || txInfo.status==404) {
      console.log('ERROR', 'Transaction not found')
      return Response.json({ error: 'Transaction info not found' }, {status:500})
    }
    if(!txInfo.successful) {
      console.log('ERROR', 'Transaction not valid')
      return Response.json({ error: 'Transaction not valid' }, {status:500})
    }
    //console.log('TXINFO', txInfo)
    const page = BigInt(txInfo.paging_token) + BigInt(1)
    const opid = page.toString()
    //const tag  = getTagFromMemo(txInfo.memo)

    // Get op info
    const opInfo = await fetchLedger('/operations/'+opid)
    //console.log('OPINFO', opInfo)
    if(!opInfo || opInfo?.status==404) {
      console.log('ERROR', 'Operation not found')
      return Response.json({ error: 'Operation info not found' }, {status:500})
    }
    if(!opInfo?.transaction_successful) {
      console.log('ERROR', 'Transaction not valid')
      return Response.json({ error: 'Transaction not valid' }, {status:500})
    }
    if(donor!==opInfo?.source_account){
      return Response.json({ error: 'Transaction not valid, wrong sender' }, {status:500})
    }
    //if(destin!==opInfo.to){
    //  return Response.json({ error: 'Transaction not valid, wrong receiver' })
    //}

    // Get organization from initid

    // Form data
    const created = new Date().toJSON().replace('T', ' ').substr(0, 19)
    //const donorAddress = opInfo.from
    //const organizationAddress = opInfo.to
    //let organizationId = ''
    //let organizationName = ''

    // Get user data
    console.log('Donor', donor)
    let userInfo = await getUserByWallet(donor) // Should exist user by now
    //console.log('USER', userInfo)
    const userId = userInfo?.id || ''
    if(!userId){
      console.log('ERROR', 'User not found')
      return Response.json({error:'User not found'}, {status:500})
    }

    // Get initiative info
    const initiative = await getInitiativeById(initid)
    //console.log('INITIATIVE', initiative)
    if(!initiative || initiative?.error) {
      console.log('ERROR', 'Initiative not found')
      return Response.json({ error: 'Initiative info not found' }, {status:500})
    }
    const initiativeId = initiative?.id || ''
    const initiativeName = initiative?.title || 'Direct Donation'

    // Get organization info
    const organization = await getOrganizationById(initiative?.organizationId)
    //console.log('ORGANIZATION', organization)
    if(!organization || organization?.error) {
      console.log('ERROR', 'Organization not found')
      return Response.json({ error: 'Organization info not found' }, {status:500})
    }
    const organizationId = organization?.id
    console.log(organizationId);
    const organizationName = organization?.name

    //const amount = opInfo.amount
    const amountCUR = (+amount).toFixed(4)
    const amountUSD = (+amount * rate).toFixed(4)
    const coinCode = 'XLM'
    const coinIssuer = 'Stellar'

    // runHook takes 3 params. 1. The Trigger name 2. The organizations to check and 3. Additional data that can be used by the the hook
    const extraMetadata = await runHook(Triggers.addMetadataToNFTReceipt, `${organizationId}`, {userId: `${userId}`, donor: `${donor}`, amountUSD: `${amountUSD}`});
    console.log('EXTRA:', extraMetadata);

    //if (opInfo?.asset_type !== 'native') {
    //  amountUSD = '0'
    //  coinCode = opInfo?.asset_code
    //  coinIssuer = opInfo?.asset_issuer
    //}

    let offsetVal = 0
    let offsetTxt = '0 Tons'
    console.log('CREDIT', initiative?.credits)
    if(initiative?.credits?.length > 0){
      const creditVal = initiative?.credits[0].value || 0
      const creditTon = creditVal / (rate||1)
      offsetVal = creditTon>0 ? (+amountUSD / creditTon) : 0
      if(offsetVal<0.00005){ offsetVal = 0.0001 } // Round up
      offsetTxt = offsetVal.toFixed(4) + ' Tons'
      console.log('CREDITVAL', creditVal)
      console.log('CREDITTON', creditTon)
      console.log('OFFSETVAL', offsetVal)
      console.log('OFFSETTXT', offsetTxt)
    }

    const uriImage = initiative?.imageUri || 'ipfs:QmZWgvsGUGykGyDqjL6zjbKjtqNntYZqNzQrFa6UnyZF1n'
    //const uriImage = 'ipfs:QmdmPTsnJr2AwokcR1QC11s1T3NRUh9PK8jste1ngnuDzT' // thank you NFT
    //let uriImage = 'https://ipfs.io/ipfs/bafybeihfgwla34hifpekxjpyga4bibjj3m37ul5j77br7q7vr4ajs4rgiq' // thank you NFT

    // Save metadata
    const metadata = {
      creditValue: offsetTxt,
      ...(extraMetadata?.output ?? {}),
      mintedBy: 'CFCE via GiveCredit',
      created: created,
      donorAddress: donor,
      organization: organizationName,
      initiative: initiativeName,
      image: uriImage,
      network: process.env.NEXT_PUBLIC_STELLAR_NETWORK||'unknown',
      coinCode: coinCode,
      coinIssuer: coinIssuer,
      coinValue: amountCUR,
      usdValue: amountUSD,
      operation: opid,
    }

    console.log('META', metadata)
    const fileId = 'meta-' + opid // unique file id
    const bytes = Buffer.from(JSON.stringify(metadata, null, 2))
    const cidMeta = await upload(fileId, bytes, 'text/plain')
    console.log('CID', cidMeta)
    if (!cidMeta || (typeof cidMeta !== 'string' && cidMeta.error)) {
      return Response.json({ error: 'Error uploading metadata' }, {status:500})
    }
    const uriMeta = 'ipfs:' + cidMeta
    //let uriMeta = process.env.IPFS_GATEWAY_URL + cidMeta
    console.log('META URI', uriMeta)

    // Mint NFT
    const contractId = initiative.contractnft
    const resMint = await mint(contractId, donor, uriMeta)   //// <<<<<<<< FIX
    console.log('RESMINT', resMint)
    if (!resMint) {
      return Response.json({ error: 'Error minting NFT' }, {status:500})
    }
    if (resMint?.error) {
      return Response.json({ error: resMint?.error }, {status:500})
    }
    const tokenId = resMint?.tokenId
    const offerId = '' // no need for offers in soroban

    // Save NFT data to Prisma
    const data = {
      created: new Date(),
      donorAddress: donor,
      userId: userId,
      organizationId: organizationId,
      initiativeId: initiativeId,
      metadataUri: uriMeta,
      imageUri: uriImage,
      coinNetwork: process.env.NEXT_PUBLIC_STELLAR_NETWORK||'',
      coinSymbol: coinCode,
      coinLabel: coinIssuer,
      coinValue: amountCUR,
      usdValue: amountUSD,
      tokenId: tokenId,
      offerId: offerId,
      status: 1
    }

    console.log('NftData', data)
    const saved = await createNFT(data)
    console.log('Saved', saved)
    if (saved?.success) {
      console.log('NFT saved in DB!')
    } else {
      console.error('Error saving NFT in DB!')
    }

    // Success
    console.log('Minting completed')
    const result = {
      success:  true,
      image:    uriImage,
      metadata: uriMeta,
      tokenId:  tokenId,
      offerId:  offerId
    }
    console.log('RESULT', result)
    return Response.json(result)
  } catch (ex:any) {
    console.error(ex)
    return Response.json({ success: false, error: ex.message }, {status:500})
  }
}
