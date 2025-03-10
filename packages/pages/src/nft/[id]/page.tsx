import React from "react"

import appConfig, { chainConfig } from "@cfce/app-config"
import { OrganizationAvatar } from "@cfce/components/organization"
import { Card, CardContent } from "@cfce/components/ui"
import { getNFTById } from "@cfce/database"
import { ipfsCIDToUrl } from "@cfce/utils/client"
import Image from "next/image"
import Link from "next/link"
import NotFound from "../../not-found"

export default async function NFT(props: { params: Promise<{ id: string }> }) {
  const id = (await props.params).id
  const nft = await getNFTById(id)
  if (!nft) {
    return <NotFound />
  }
  //console.log('NFT', nft)
  const [contract, tokenId] = nft.tokenId.split(" ")
  const explorer = `${
    chainConfig.stellar.networks[
      appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network
    ].explorer
  }/contract/${contract}`
  const metalink = appConfig.apis.ipfs.gateway + nft.metadataUri.substr(5)

  return (
    <main className="flex min-h-screen flex-col items-stretch container mt-12 pt-24">
      <div className="flex flex-col lg:flex-row mt-12">
        {/* IMAGE */}
        <Card className="flex flex-col overflow-hidden max-w-full lg:max-w-[400px] xl:max-w-[500px] w-full mx-auto">
          <div className="">
            <Image
              src={ipfsCIDToUrl(nft.imageUri)}
              width={480}
              height={480}
              alt="Initiative"
              className="w-full"
            />
          </div>
          <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
            {nft.initiative && (
              <>
                <h1 className="mt-4 text-4xl">
                  <a href={`/initiatives/${nft.initiative.id}`}>
                    {nft.initiative.title}
                  </a>
                </h1>
                <p className="">{nft.initiative.description}</p>
              </>
            )}
            <div className="flex flex-row justify-between border-t mt-4 pt-4">
              <OrganizationAvatar organization={nft.organization} />
              {nft.initiative?.category && (
                <div className="flex flex-col items-center">
                  {nft.initiative.category ? (
                    <>
                      <h1 className="text-sm">
                        {nft.initiative.category?.title}
                      </h1>
                      {nft.initiative.category.image && (
                        <Image
                          src={nft.initiative.category.image}
                          width={96}
                          height={96}
                          alt="Category"
                        />
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* META */}
        <Card className="flex flex-col overflow-hidden max-w-full lg:max-w-[400px] xl:max-w-[500px] w-full mx-auto mt-12 lg:mt-0">
          <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
            <h1 className="mt-4 text-4xl">NFT Info</h1>
            <div className="flex flex-col justify-start border-t mt-4 pt-4">
              <p className="mt-4">
                <span className="inline-block w-32 text-slate-400 font-semibold">
                  Minted:
                </span>{" "}
                <span>{new Date(nft.created).toLocaleString()}</span>
              </p>
              <p className="mt-4">
                <span className="inline-block w-32 text-slate-400 font-semibold">
                  Chain:
                </span>{" "}
                <span>{nft.chainName}</span>
              </p>
              <p className="mt-4">
                <span className="inline-block w-32 text-slate-400 font-semibold">
                  Network:
                </span>{" "}
                <span>{nft.network}</span>
              </p>
              <p className="mt-4">
                <span className="inline-block w-32 text-slate-400 font-semibold">
                  Wallet:
                </span>{" "}
                <span>{`${nft.donorAddress.substr(0, 12)}...`}</span>
              </p>
              <p className="mt-4">
                <span className="inline-block w-32 text-slate-400 font-semibold">
                  Amount:
                </span>{" "}
                <span>
                  {`${nft.coinValue}`} {nft.coinSymbol}
                </span>
              </p>
              <p className="mt-4">
                <span className="inline-block w-32 text-slate-400 font-semibold">
                  USD Value:
                </span>{" "}
                <span>{`${nft.usdValue}`}</span>
              </p>
              <p className="mt-4">
                <span className="inline-block w-32 text-slate-400 font-semibold">
                  Token ID:
                </span>{" "}
                <span className="text-xl">{tokenId}</span>
              </p>
              <p className="mt-4">
                <span className="inline-block w-32 text-slate-400 font-semibold">
                  Contract:
                </span>{" "}
                <span>
                  <a href={explorer}>{`${contract.substr(0, 12)}...`}</a>
                </span>
              </p>
              <p className="mt-8 text-center">
                <Link href={metalink} className="rounded-lg border px-12 py-2">
                  SEE METADATA
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
