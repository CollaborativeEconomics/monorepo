import { expect, test } from "../fixtures";

test.describe("Initiative page", () => {
  test.beforeEach(async ({ page }) => {
    // test.setTimeout(100000)
    await page.goto("/initiatives")
    // Wait for the main content to be visible
    await expect(page.locator("body")).toBeVisible()
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle")
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle")
  })

  test("should handle search input", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search")
    await searchInput.fill("test search")
    await searchInput.press("Enter")
    // Add assertions for search results

    await expect(page.getByText("No initiatives found")).toBeVisible()
  })

  test("displays initiative content correctly", async ({ page }) => {
    // Verify initiative header content
    await expect(
      page.getByRole("link", { name: "Sustainable Development Goals" }),
    ).toBeVisible()

    // Verify initiative details
    await expect(page.getByText("80 donors")).toBeVisible()

    // verify the initiative description
    await expect(page.getByText("Everyone loves trees")).toBeVisible()

    // Verify that at least one initiative image is visible
    await expect(
      page.getByRole("img", { name: "IMG BG" }).first(),
    ).toBeVisible()
    await expect(
      page.getByRole("img", { name: "IMG BG" }).first(),
    ).toBeVisible()
  })

  test("Navigation to individual initiative page works", async ({ page }) => {
    // Click the donate button
    await page
      .getByRole("link", { name: "Sustainable Development Goals" })
      .locator("xpath=../..")
      .getByRole("button", { name: "Donate" })
      .click()

    await page.waitForURL(
      /^http:\/\/localhost:3000\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    await expect(page).toHaveURL(
      /^http:\/\/localhost:3000\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )
  })

  test("initiative progress indicators work", async ({ page }) => {
    // Verify progress elements
    await expect(page.getByText("$2,450 of 120,000 raised")).toBeVisible()

    // Verify donor stats
    await expect(page.getByText("80 donors")).toBeVisible()
    await expect(page.getByText("0 Institutional Donors").first()).toBeVisible()
  })

  test("filter functionality works correctly", async ({ page }) => {
    // Test category filter
    const categoryButton = await page.locator('[role="combobox"]').first()
    console.log(categoryButton)
    await categoryButton.click()
    await expect(page.getByRole("dialog")).toBeVisible()

    // Test location filter
    const locationButton = await page.locator('[role="combobox"]').nth(1)
    await locationButton.click()
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nigeria" }),
    ).toBeVisible()
  })

  test("search functionality works correctly", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search")

    // Test empty search
    await searchInput.fill("")
    await page.getByRole("button", { name: "Search" }).click()
    await expect(
      page.getByRole("link", { name: "Sustainable Development Goals" }),
    ).toBeVisible()

    // Test search with results
    await searchInput.fill("whales")
    await page.getByRole("button", { name: "Search" }).click()
    await expect(
      page.getByRole("link", { name: "Save the whales", exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Save the whales in need" }),
    ).toBeVisible()

    // Test search with no results
    await searchInput.fill("nonexistent initiative")
    await page.getByRole("button", { name: "Search" }).click()
    await expect(page.getByText("No initiatives found")).toBeVisible()
  })

  test("displays initiative cards correctly", async ({ page }) => {
    // Verify initiative card content
    await expect(
      page.getByRole("link", { name: "Sustainable Development Goals" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Save the whales", exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Save the whales in need" }),
    ).toBeVisible()

    // Verify initiative details are displayed
    await expect(page.getByText("80 donors")).toBeVisible()
    await expect(page.getByText("Everyone loves whales")).toBeVisible()

    // Verify initiative images
    await expect(
      page.getByRole("img", { name: "IMG BG" }).first(),
    ).toBeVisible()

    // Verify initiative details are displayed
    await expect(page.getByText("80 donors")).toBeVisible()
    await expect(page.getByText("Everyone loves whales")).toBeVisible()

    // Verify initiative images
    await expect(
      page.getByRole("img", { name: "IMG BG" }).first(),
    ).toBeVisible()
  })

  test("should maintain filter state in URL", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search")
    await searchInput.fill("test")
    await page.getByRole("button", { name: "Search" }).click()

    await page.waitForURL(/^http:\/\/localhost:3000\/initiatives\?.*$/)

    // Verify URL contains search params
    await expect(page).toHaveURL(/.*[?&]query=test/)
  })

  test("should toggle between Initiatives and Organizations tabs", async ({
    page,
  }) => {
    // Click Organizations tab
    await page.getByRole("link", { name: "Organizations" }).click()
    await page.waitForURL(/^http:\/\/localhost:3000\/organizations$/)
    await expect(page).toHaveURL(/.*\/organizations/)

    // Click Initiatives tab
    await page.getByRole("link", { name: "Initiatives" }).click()
    await page.waitForURL(/^http:\/\/localhost:3000\/initiatives$/)
    await expect(page).toHaveURL(/.*\/initiatives/)
  })
})
