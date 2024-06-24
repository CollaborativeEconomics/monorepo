import Link from "next/link"
import Image from "next/image"
import OrganizationAvatar from '@/components/OrganizationAvatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import NotFound  from '@/components/NotFound'
import { getDonationById } from '@/utils/registry'

export default async function NFT(props: {params:{id:string}}) {
  const id = props.params.id
  const donation = await getDonationById(id)
  if(!donation){ return <NotFound /> }
  //console.log('Donation', donation)
  const imgsrc = donation.initiative.defaultAsset

  return (
    <main className="flex min-h-screen flex-col items-stretch container mt-12 pt-24">
      <div className="flex flex-col lg:flex-row mt-12">

        {/* IMAGE */}
        <Card className="flex flex-col overflow-hidden max-w-full lg:max-w-[400px] xl:max-w-[500px] w-full mx-auto">
          <div className="">
            <Image src={imgsrc} width={500} height={500} alt="Initiative" className="w-full" />
          </div>
          <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
            <h1 className="mt-4 text-4xl"><a href={'/initiatives/'+donation.initiative.id}>{donation.initiative.title}</a></h1>
            <p className="">{donation.initiative.description}</p>
            <div className="flex flex-row justify-between border-t mt-4 pt-4">
              <div>
                <Link href={'/organizations/'+donation.organization.id}>
                  <OrganizationAvatar name={donation.organization.name} image={donation.organization.image} />
                </Link>
              </div>
              <div className="flex flex-col items-center">
                {donation.initiative.category ?
                  <>
                    <h1 className="text-sm">{donation.initiative.category?.title}</h1>
                    <Image src={donation.initiative.category?.image} width={96} height={96} alt="Category" />
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
            <h1 className="mt-4 text-4xl">Donation Info</h1>
            <div className="flex flex-col justify-start border-t mt-4 pt-4">
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Date:</label> <span>{new Date(donation.created).toLocaleString()}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Payment:</label> <span>{donation.paytype}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Chain:</label> <span>{donation.chain}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Network:</label> <span>{donation.network}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Wallet:</label> <span>{donation.wallet.substr(0,12)+'...'}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">Amount:</label> <span>{donation.amount} {donation.asset}</span>
              </p>
              <p className="mt-4">
                <label className="inline-block w-32 text-slate-400 font-semibold">USD Value:</label> <span>{donation.usdvalue}</span>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
