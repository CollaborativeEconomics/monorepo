import { expect, test } from "@playwright/test"

test.describe("Initiative page", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(100000)
    await page.goto("/initiatives")
    // Wait for the main content to be visible
    await expect(page.locator("body")).toBeVisible()
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
    await expect(page.getByRole("img", { name: "IMG BG" }).first()).toBeVisible()
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

  test("should display search bar and filters", async ({ page }) => {
    await expect(page.getByPlaceholder("Search")).toBeVisible()

    // verify the category filter
    await expect(
      page.getByRole("button", { name: /Select category/i })
    ).toBeVisible()
    // await expect(
    //   page.getByRole("button", { name: /Select category/ }),
    // ).toBeVisible()

    // // verify the location filter
    // await expect(
    //   page.locator('div[role="button"]', { hasText: /Select location/ }),
    // ).toBeVisible()
    // await expect(
    //   page.getByRole("button", { name: /Select location/ }),
    // ).toBeVisible()

    // // verify the search button
    // await expect(page.getByRole("button", { name: /Search/ })).toBeVisible()
    // await expect(page.getByRole("button", { name: /Search/ })).toBeVisible()
  })

  test("should display initiative cards with correct information", async ({
    page,
  }) => {
    // Check first initiative card
    await expect(
      page.getByRole("heading", { name: "Buy a tree for children in need" }),
    ).toBeVisible()
    await expect(page.getByText("Everyone loves trees")).toBeVisible()
    await expect(page.getByText("$1,800 of 50,000 raised")).toBeVisible()
    await expect(page.getByText("45 Donors")).toBeVisible()
    await expect(page.getByText("3 Institutional Donors")).toBeVisible()
  })

  test("should navigate to initiative details when clicking card", async ({
    page,
  }) => {
    await page
      .getByRole("link", { name: "Buy a tree for children in need" })
      .click()
    await expect(page).toHaveURL(/.*\/initiatives\/.*$/)
  })

  test("should display organization info on initiative cards", async ({
    page,
  }) => {
    await expect(page.getByText("Environmental Non-Profit")).toBeVisible()
    await expect(page.getByRole("button", { name: "Donate" })).toBeVisible()
  })

  test("should toggle between light and dark themes", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: "Toggle theme" })
    await themeButton.click()
    // Add assertions for theme change visual verification
    await themeButton.click()
  })

  test("should display all search and filter elements", async ({ page }) => {
    // Check navigation tabs
    await expect(page.getByRole("link", { name: "Initiatives" })).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Organizations" }),
    ).toBeVisible()

    // Check search input
    const searchInput = page.getByPlaceholder("Search")
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toHaveAttribute("type", "search")

    // Check filter buttons
    await expect(
      page.getByRole("button", { name: /Select category/ }),
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: /Select location/ }),
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
  })

  test("should open category dialog when clicking category filter", async ({
    page,
  }) => {
    const categoryButton = page.getByRole("button", { name: /Select category/ })
    await categoryButton.click()
    await expect(page.getByRole("dialog")).toBeVisible()
  })

  test("should open location dialog when clicking location filter", async ({
    page,
  }) => {
    const locationButton = page.getByRole("button", { name: /Select location/ })
    await locationButton.click()
    await expect(page.getByRole("dialog")).toBeVisible()
  })

  test("should toggle between Initiatives and Organizations tabs", async ({
    page,
  }) => {
    // Click Organizations tab
    await page.getByRole("link", { name: "Organizations" }).click()
    await expect(page).toHaveURL(/.*\/organizations/)

    // Click Initiatives tab
    await page.getByRole("link", { name: "Initiatives" }).click()
    await expect(page).toHaveURL(/.*\/initiatives/)
  })

  test("should maintain filter state in URL", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search")
    await searchInput.fill("test")
    await page.getByRole("button", { name: "Search" }).click()

    // Verify URL contains search params
    await expect(page).toHaveURL(/.*[?&]search=test/)
  })
})
