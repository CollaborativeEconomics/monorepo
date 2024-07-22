import type { NextApiRequest, NextApiResponse } from "next"
import ipfsUpload from "utils/upload-ipfs"
import { getStoryById, updateStory } from "utils/registry"
import { BlockchainManager } from "@cfce/blockchain-tools"

export default async function Mint(req: NextApiRequest, res: NextApiResponse) {
  console.log("API MINTING NFT1155...")

  try {
    const { eventid } = req.query
    console.log("EVENT", eventid)
    if (!eventid) {
      console.log("Event id is required")
      return res.status(500).json({ error: "Event id is required" })
    }

    // Form data
    const created = new Date().toJSON().replace("T", " ").substring(0, 19)

    // Get event info
    const event = await getStoryById(eventid.toString())
    console.log("EVENT", event)
    if (!event) {
      return res.status(500).json({ error: "Event not found" })
    }

    // Save metadata
    const metadata = {
      mintedBy: "CFCE via Give",
      title: "Story NFT",
      created: created,
      organization: event.organization?.name,
      initiative: event.initiative?.title,
      event: event.name,
      description: event.description,
      image: event.image,
    }

    console.log("META", metadata)
    const fileId = `event-${event.id}` // unique file id
    const bytes = Buffer.from(JSON.stringify(metadata, null, 2))
    const cidMeta = await ipfsUpload(fileId, bytes, "text/plain")
    console.log("CID", cidMeta)
    if (!cidMeta || cidMeta.error) {
      return res.status(500).json({ error: "Error uploading metadata" })
    }
    const cid = cidMeta?.cid
    const uriMeta = `ipfs:${cid}`
    //const uriMeta = cidMeta?.url
    console.log("URI", uriMeta)

    // Mint NFT
    const contract = process.env.XINFIN_NFT1155_CONTRACT
    const address = process.env.XINFIN_MINTER_WALLET // Minter gets all story nfts
    const tokenId = `0x${event.id.replaceAll("-", "")}`
    const okMint =
      await BlockchainManager.getInstance().xinfin.server.mintNFT1155({
        contractId: contract,
        address,
        tokenId,
        uri: uriMeta,
        walletSeed: process.env.XINFIN_MINTER_SECRET,
      })
    console.log("Mint result", okMint)
    if (!okMint || "error" in okMint) {
      return res.status(500).json({ error: "Error minting NFT" })
    }

    // Update Event to Prisma
    const data = {
      tokenId: tokenId,
      metadata: uriMeta,
    }
    console.log("Event", data)
    const saved = await updateStory(event.id, data)
    console.log("Saved", saved?.success)
    if (saved.success) {
      console.log("Event saved in DB!")
    } else {
      console.error("Error updating event in DB!")
    }

    // Success
    console.log("Minting completed")
    console.log("RESULT", {
      success: true,
      image: event.image,
      metadata: uriMeta,
      tokenId: okMint.tokenId,
    })
    return res.status(200).json({
      success: true,
      image: event.image,
      metadata: uriMeta,
      tokenId: okMint.tokenId,
    })
  } catch (ex) {
    console.error(ex)
    return res.status(500).json({ success: false, error: ex.message })
  }
}
