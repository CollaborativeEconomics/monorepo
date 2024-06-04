import { expect, test, describe, beforeAll, afterEach, afterAll } from "bun:test";
import createStory, { CreateStoryParameters, createStories } from "../createStory";

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
};

const storyResponseProperties = {
  tokenId: "1234",
  image: "QmNvTh8ZRjcYZM5TtY41HXmdfXcB5vZpctBFLeTJugTJHV",
  created: "2024-04-02T20:46:36.986Z",
  id: "366d09a1-a1af-4f38-9938-5a25bf4ea031",
}

describe("createStory", async () => {
  test("creates a story", async () => {
    const result = await createStory({}, story);
    expect(result).toMatchObject({ ...story, metadata: JSON.parse(story.metadata), ...storyResponseProperties })
  })
  test("creates story with input context values", async () => {
    const metadata = { asdf: 1234 };
    const context = { input: { metadata } }
    const storyWithPath = {
      ...story,
      metadata: "input.metadata",
      name: "shouldJustShowString",
    }
    const result = await createStory(context, storyWithPath);
    expect(result).toEqual(expect.objectContaining({
      metadata,
      name: "shouldJustShowString"
    }))
  })
  test("Doesn't pass undefined metadata to createStory", async () => {
    const metadata = JSON.stringify({
      shouldNotShow: undefined,
      shouldShow: "asdf"
    })
    const context = {
      input: {
        metadata
      }
    }
    const result = await createStory(context, { ...story, metadata: "input.metadata" });
    expect(result).toEqual(
      expect.objectContaining(
        { metadata: { shouldShow: "asdf" } }
      )
    );
  })
  test("Undefined name doesn't break createStory", async () => {
    // @ts-expect-error
    const result = await createStory({}, { ...story, name: undefined });
    expect(result).toMatchObject({ ...story, metadata: story.metadata ? JSON.parse(story.metadata) : undefined, name: null, ...storyResponseProperties })
  })
})

describe("createStories", async () => {
  test("creates multiple stories", async () => {
    const stories = [story, story];
    const result = await createStories({ stories }, { storyPath: 'stories', organizationId: "orgId", initiativeId: "initId" });
    expect(result).toHaveLength(2);
  })
  test("creates multiple stories with context values", async () => {
    const metadata = { asdf: 1234 };
    const stories = [
      { ...story, metadata: "input.metadata" },
      { ...story, metadata: "input.metadata" },
    ];
    const context = {
      input: { metadata },
      stories
    }
    const result = await createStories(context, { storyPath: 'stories', organizationId: "orgId", initiativeId: "initId" });
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({ metadata }));
  })
  test("Doesn't pass undefined values to createStory", async () => {
    const stories = [
      { ...story, metadata: "input.metadata" },
      { ...story, metadata: "input.metadata" },
    ];
    const metadata = JSON.stringify({
      shouldNotShow: undefined,
      shouldShow: "asdf"
    })
    const context = {
      input: {
        metadata
      },
      stories
    }
    const result = await createStories(context, { storyPath: 'stories', organizationId: "orgId", initiativeId: "initId" });
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(
      expect.objectContaining(
        {
          metadata: { shouldShow: "asdf" }
        }
      )
    );
  })
})