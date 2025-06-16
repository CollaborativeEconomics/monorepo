import { get } from "lodash"

import appConfig from "@cfce/app-config"
import type { ActionContext } from "@cfce/types"

export interface Story {
  id?: string
  created: string
  name: string
  description: string
  image: string
  organizationId: string
  initiativeId: string
  amount?: number
  tokenId?: string
  metadata?: Record<string, string | number | boolean | null>
}

export interface CreateStoryParameters {
  organizationId: string
  initiativeId: string
  name: string
  description: string
  image: string
  // how many tokens to mint in set, default = 0
  amount?: number
  // path to object, or stringified object
  metadata?: string
  files?: {
    files: File[]
  }
}

const createStory = async (
  context: ActionContext,
  params: CreateStoryParameters,
) => {
  const ApiKey = process.env.CFCE_REGISTRY_API_KEY
  if (!ApiKey) {
    throw new Error("CFCE_REGISTRY_API_KEY is not set")
  }
  const url = new URL(`${appConfig.apis.registry.apiUrl}/stories`)
  const {
    organizationId,
    initiativeId,
    name,
    description,
    image,
    amount,
    metadata,
    files,
  } = params
  const { files: filesList } = files || { files: [] }
  const formData = new FormData()

  const appendToFormData = (key: string, pathOrValue: string) => {
    let contextValueOrValue = get(context, pathOrValue, pathOrValue)
    switch (typeof contextValueOrValue) {
      case "undefined":
        contextValueOrValue = undefined
        break
      case "object":
        contextValueOrValue = JSON.stringify(contextValueOrValue)
        formData.set(key, contextValueOrValue as string)
        break
      default:
        formData.set(key, contextValueOrValue as string)
    }
  }

  appendToFormData("organizationId", organizationId)
  appendToFormData("initiativeId", initiativeId)
  appendToFormData("name", name)
  appendToFormData("description", description)
  appendToFormData("image", image)

  if (amount) {
    appendToFormData("amount", amount.toString())
  }
  if (metadata) {
    appendToFormData("metadata", metadata)
  }
  for (const file of filesList) {
    formData.append("files", file)
  }

  console.log(`fetching ${url} with ${formData}`)

  // Let MSW handle the API call in tests
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": ApiKey,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to create story")
  }

  return response.json()
}

export interface CreateStoriesParameters {
  organizationId: string
  initiativeId: string
  storyPath: string
}

const createStories = async (
  context: ActionContext,
  params: CreateStoriesParameters,
) => {
  const { organizationId, initiativeId, storyPath } = params

  const storiesData = get(context, storyPath)

  // Ensure stories is an array and has the correct type
  const stories = Array.isArray(storiesData)
    ? (storiesData as CreateStoryParameters[])
    : ([] as CreateStoryParameters[])

  const results = await Promise.all(
    stories.map((story) =>
      createStory(context, { ...story, organizationId, initiativeId }),
    ),
  )

  return results
}

export { createStories }

export default createStory
