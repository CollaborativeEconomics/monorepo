import { getDonations, getStoryById } from "@cfce/database"
import { DateTime } from "luxon"
import Image from "next/image"
import Link from "next/link"
import ShareModal from "~/components/ShareModal"
import OrganizationAvatar from "~/components/organizationavatar"
import Title from "~/components/title"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { DateDisplay } from "~/components/ui/date-posted"
import Gallery from "~/components/ui/gallery"
import styles from "~/styles/dashboard.module.css"

async function getStoryData(id: string) {
  const story = await getStoryById(id)
  if (!story) throw new Error("Story not found")
  const media = story.media.map((it) => it.media) // flatten list
  if (story.image) {
    media.unshift(story.image) // main image to the top, if it exists
  }
  const donations = (await getDonations({ storyId: id })) || []
  const total = donations.length
    ? donations.reduce((sum, curr) => sum + Number(curr.usdvalue), 0)
    : 0
  return { story, media, donations, total }
}

export default async function Story({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { story, media, donations, total } = await getStoryData(id)

  function formatDate(dateString: string) {
    return DateTime.fromISO(dateString).toLocaleString({
      year: "2-digit",
      month: "numeric",
      day: "2-digit",
    })
  }

  return (
    <div className={styles.content}>
      <Title text="Impact Story" />
      <div className={styles.mainBox}>
        <Card className="flex flex-col overflow-hidden mb-8">
          <CardHeader className="flex-row justify-between">
            <DateDisplay timestamp={story.created} className="py-4" />
            <ShareModal />
          </CardHeader>
          <div className="px-2 -mt-2">
            <Gallery images={media} />
          </div>
          <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
            <h1 className="mt-4 text-4xl">{story.name}</h1>
            <p className="">{story.description}</p>
            <div className="flex flex-row justify-between border-t mt-4 pt-4">
              <div>
                <p className="mb-4 text-sm font-semibold">
                  <span>Posted in </span>
                  <span className="underline">
                    <a href={`/initiatives/${story.initiative.id}`}>
                      {story.initiative.title}
                    </a>
                  </span>
                </p>
                <Link href={`/organizations/${story.organization.id}`}>
                  <OrganizationAvatar
                    name={story.organization.name}
                    image={story.organization.image || undefined}
                  />
                </Link>
              </div>
              <div className="flex flex-col items-center">
                {story.initiative.category ? (
                  <>
                    <h1 className="text-sm">
                      {story.initiative.category?.title}
                    </h1>
                    <Image
                      src={story.initiative.category?.image || ""}
                      width={96}
                      height={96}
                      alt="Category"
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div>
              <h1 className="my-2">Donations</h1>
              <table className="w-full">
                <tbody className="border-t-2">
                  {donations?.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.created.toISOString())}</td>
                      <td>{item.wallet?.substr(0, 10)}</td>
                      <td align="right">{item.amount.toString()}</td>
                      <td align="right">{item.asset}</td>
                      <td align="right">{item.usdvalue.toString()}</td>
                      <td align="right">USD</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2">
                  <tr>
                    <td colSpan={5} align="right">
                      {total}
                    </td>
                    <td align="right">USD</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
