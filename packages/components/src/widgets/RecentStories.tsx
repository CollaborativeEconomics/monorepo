import { StoryCardCompactVert } from "@cfce/components/story"
import { getStories } from "@cfce/database"

type Props = {
  userId?: string
  limit?: number
}

export async function RecentStories({ userId, limit = 5 }: Props) {
  let stories = (await getStories({ recent: limit, userId })) || []
  stories = JSON.parse(JSON.stringify(stories))

  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">
        {userId ? "My Recent Stories" : "Recent Stories"}
      </h1>
      <div>
        {stories?.length > 0 ? (
          stories.map((story) => (
            <div className="my-4" key={story.id}>
              <StoryCardCompactVert story={story} />
            </div>
          ))
        ) : (
          <div className="text-gray-300">
            {userId
              ? "No stories from initiatives you have supported"
              : "No stories available"}
          </div>
        )}
      </div>
    </div>
  )
}
