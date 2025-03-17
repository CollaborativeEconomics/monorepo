import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals"
import { http, HttpResponse } from "msw"
import server from "../../mocks/serverMock"
import createStory, {
  type CreateStoryParameters,
  createStories,
} from "../createStory"

// Start server before all tests
beforeAll(() => {
  process.env.CFCE_REGISTRY_API_KEY = "test-api-key"
  server.listen()
})

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close())

const story: CreateStoryParameters = {
  organizationId: "orgId",
  initiativeId: "initId",
  name: "name",
  description: "description",
  image: "image",
  amount: 1,
  metadata: JSON.stringify({ asdf: 1234 }),
  // files: {
  //   files: [new File([""], "filename")]
  // }
}

const storyResponseProperties = {
  tokenId: "1234",
  image: "QmNvTh8ZRjcYZM5TtY41HXmdfXcB5vZpctBFLeTJugTJHV",
  created: "2024-04-02T20:46:36.986Z",
  id: "366d09a1-a1af-4f38-9938-5a25bf4ea031",
}

describe("createStory", () => {
  beforeAll(() => {
    // Set up the mock response for all createStory tests
    server.use(
      http.post("https://registry.cfce.io/api/stories", async ({ request }) => {
        const data = await request.formData()
        const parameters = {
          organizationId: data.get("organizationId"),
          initiativeId: data.get("initiativeId"),
          name: data.get("name"),
          description: data.get("description"),
          image: "QmNvTh8ZRjcYZM5TtY41HXmdfXcB5vZpctBFLeTJugTJHV", // Always return this image value
          amount: Number(data.get("amount")),
          metadata: data.get("metadata")
            ? JSON.parse(data.get("metadata") as string)
            : {},
        }

        const story = {
          ...parameters,
          tokenId: "1234",
          created: "2024-04-02T20:46:36.986Z",
          id: "366d09a1-a1af-4f38-9938-5a25bf4ea031",
        }

        return HttpResponse.json(story, { status: 200 })
      }),
    )
  })

  test("creates a story", async () => {
    const result = await createStory({}, story)
    expect(result).toMatchObject({
      ...story,
      metadata: JSON.parse(story?.metadata ?? "{}"),
      ...storyResponseProperties,
    })
  })
  test("creates story with input context values", async () => {
    const metadata = { asdf: 1234 }
    const context = { input: { metadata } }
    const storyWithPath = {
      ...story,
      metadata: "input.metadata",
      name: "shouldJustShowString",
    }
    const result = await createStory(context, storyWithPath)
    expect(result).toEqual(
      expect.objectContaining({
        metadata,
        name: "shouldJustShowString",
      }),
    )
  })
  test("Doesn't pass undefined metadata to createStory", async () => {
    const metadata = JSON.stringify({
      shouldNotShow: undefined,
      shouldShow: "asdf",
    })
    const context = {
      input: {
        metadata,
      },
    }
    const result = await createStory(context, {
      ...story,
      metadata: "input.metadata",
    })
    expect(result).toEqual(
      expect.objectContaining({ metadata: { shouldShow: "asdf" } }),
    )
  })
  test("Undefined name doesn't break createStory", async () => {
    // Set up a special handler for this test
    server.use(
      http.post("https://registry.cfce.io/api/stories", async ({ request }) => {
        const data = await request.formData()
        const parameters = {
          organizationId: data.get("organizationId"),
          initiativeId: data.get("initiativeId"),
          name: null, // Explicitly set name to null
          description: data.get("description"),
          image: "QmNvTh8ZRjcYZM5TtY41HXmdfXcB5vZpctBFLeTJugTJHV",
          amount: Number(data.get("amount")),
          metadata: data.get("metadata")
            ? JSON.parse(data.get("metadata") as string)
            : {},
        }

        const story = {
          ...parameters,
          tokenId: "1234",
          created: "2024-04-02T20:46:36.986Z",
          id: "366d09a1-a1af-4f38-9938-5a25bf4ea031",
        }

        return HttpResponse.json(story, { status: 200 })
      }),
    )

    // @ts-expect-error
    const result = await createStory({}, { ...story, name: undefined })
    expect(result).toMatchObject({
      organizationId: "orgId",
      initiativeId: "initId",
      description: "description",
      amount: 1,
      metadata: JSON.parse(story.metadata ?? "{}"),
      name: null,
      ...storyResponseProperties,
    })
  })
})

describe("createStories", () => {
  test("creates multiple stories", async () => {
    const stories = [story, story]
    const result = await createStories(
      { stories },
      { storyPath: "stories", organizationId: "orgId", initiativeId: "initId" },
    )
    expect(result).toHaveLength(2)
  })
  test("creates multiple stories with context values", async () => {
    const metadata = { asdf: 1234 }
    const stories = [
      { ...story, metadata: "input.metadata" },
      { ...story, metadata: "input.metadata" },
    ]
    const context = {
      input: { metadata },
      stories,
    }
    const result = await createStories(context, {
      storyPath: "stories",
      organizationId: "orgId",
      initiativeId: "initId",
    })
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(expect.objectContaining({ metadata }))
  })
  test("Doesn't pass undefined values to createStory", async () => {
    const stories = [
      { ...story, metadata: "input.metadata" },
      { ...story, metadata: "input.metadata" },
    ]
    const metadata = JSON.stringify({
      shouldNotShow: undefined,
      shouldShow: "asdf",
    })
    const context = {
      input: {
        metadata,
      },
      stories,
    }
    const result = await createStories(context, {
      storyPath: "stories",
      organizationId: "orgId",
      initiativeId: "initId",
    })
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(
      expect.objectContaining({
        metadata: { shouldShow: "asdf" },
      }),
    )
  })
})
