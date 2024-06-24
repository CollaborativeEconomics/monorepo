import Link from "next/link"
import Image from "next/image"
import OrganizationAvatar from '@/components/OrganizationAvatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import NotFound  from '@/components/NotFound'
import { getNFTById } from '@/utils/registry'

export default async function NFT(props: {params:{id:string}}) {
  const id = props.params.id
  const nft = await getNFTById(id)
  if(!nft){ return <NotFound /> }
  //console.log('NFT', nft)
  const imgsrc = process.env.IPFS_GATEWAY_URL + nft.imageUri.substr(5)
  const [contract, tokenId] = nft.tokenId.split(' ')
  const explorer = process.env.NEXT_PUBLIC_STELLAR_EXPLORER + '/contract/'+contract
  const metalink = process.env.IPFS_GATEWAY_URL + nft.metadataUri.substr(5)

  return (
    <main className="flex min-h-screen flex-col items-stretch container mt-12 pt-24">
      <div className="flex flex-col lg:flex-row mt-12">

        {/* IMAGE */}
        <Card className="flex flex-col overflow-hidden max-w-full lg:max-w-[400px] xl:max-w-[500px] w-full mx-auto">
          <div className="">
            <Image src={imgsrc} width={480} height={480} alt="Initiative" className="w-full" />
          </div>
          <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
            <h1 className="mt-4 text-4xl"><a href={'/initiatives/'+nft.initiative.id}>{nft.initiative.title}</a></h1>
            <p className="">{nft.initiative.description}</p>
            <div className="flex flex-row justify-between border-t mt-4 pt-4">
              <div>
                <Link href={'/organizations/'+nft.organization.id}>
                  <OrganizationAvatar name={nft.organization.name} image={nft.organization.image} />
                </Link>
              </div>
              <div className="flex flex-col items-center">
                {nft.initiative.category ?
                  <>
                    <h1 className="text-sm">{nft.initiative.category?.title}</h1>
                    <Image src={nft.initiative.category?.image} width={96} height={96} alt="Category" />
                  </>
                :
                  <></>
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* META */}
        <Card className="flex flex-col overflow-hidden max-w-full lg:max-w-[400px] xl:max-w-[500px] w-full mx-auto mt-12 lg:mt-0">
          <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
            <h1 className="mt-4 text-4xl">NFT Info</h1>
            <div className="flex flex-col justify-start border-t mt-4 pt-4">
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Minted:</label> <span>{new Date(nft.created).toLocaleString()}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Chain:</label> <span>{nft.coinLabel}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Network:</label> <span>{nft.coinNetwork}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Wallet:</label> <span>{nft.donorAddress.substr(0,12)+'...'}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Amount:</label> <span>{nft.coinValue} {nft.coinSymbol}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">USD Value:</label> <span>{nft.usdValue}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Token ID:</label> <span className="text-xl">{tokenId}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Contract:</label> <span><a href={explorer}>{contract.substr(0,12)+'...'}</a></span>
              </p>
              <p className="mt-8 text-center">
                <Link href={metalink} className="rounded-lg border px-12 py-2">SEE METADATA</Link>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
