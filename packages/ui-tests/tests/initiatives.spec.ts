import { expect, test } from "../fixtures"

test.describe("Initiative page", () => {
  test.beforeEach(async ({ page }) => {
    // test.setTimeout(100000)
    await page.goto("/initiatives")
    // Wait for the main content to be visible
    await expect(page.locator("body")).toBeVisible()
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
    await expect(page.getByText("54 donors")).toBeVisible()

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
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    await expect(page).toHaveURL(
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
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

    await page.waitForURL(
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives\?.*$/,
    )

    // Verify URL contains search params
    await expect(page).toHaveURL(/.*[?&]query=test/)
  })

  test("should toggle between Initiatives and Organizations tabs", async ({
    page,
  }) => {
    // Click Organizations tab
    await page.getByRole("link", { name: "Organizations" }).click()
    await page.waitForURL(
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/organizations$/,
    )
    await expect(page).toHaveURL(/.*\/organizations/)

    // Click Initiatives tab
    await page.getByRole("link", { name: "Initiatives" }).click()
    await page.waitForURL(
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives$/,
    )
    await expect(page).toHaveURL(/.*\/initiatives/)
  })

  test("should handle pagination if available", async ({ page }) => {
    // Check if pagination exists
    const paginationExists =
      (await page.locator('.pagination, [aria-label="Pagination"]').count()) > 0

    if (paginationExists) {
      // Get the initial initiatives
      const initialInitiatives = await page
        .locator('[data-testid="initiative-card"], .initiative-card')
        .allInnerTexts()

      // Click on the next page button if it exists
      const nextButton =
        page.getByRole("button", { name: /next/i }) ||
        page.locator('[aria-label="Next page"]') ||
        page.locator(".pagination").getByText("›")

      if ((await nextButton.count()) > 0 && (await nextButton.isEnabled())) {
        await nextButton.click()

        // Wait for page to load
        await page.waitForLoadState("networkidle")

        // Get the new initiatives
        const newInitiatives = await page
          .locator('[data-testid="initiative-card"], .initiative-card')
          .allInnerTexts()

        // Verify that the initiatives have changed
        expect(initialInitiatives).not.toEqual(newInitiatives)

        // Verify URL contains page parameter
        await expect(page).toHaveURL(/.*[?&]page=/)
      }
    }
  })

  test("should allow sorting initiatives if available", async ({ page }) => {
    // Check if sort dropdown exists
    const sortDropdown = page.locator(
      '[aria-label="Sort by"], [data-testid="sort-dropdown"]',
    )
    const sortExists = (await sortDropdown.count()) > 0

    if (sortExists) {
      // Click on sort dropdown
      await sortDropdown.click()

      // Select a different sort option (e.g., "Most recent" or "Most funded")
      const sortOption = page
        .getByRole("option", { name: /most recent|most funded|alphabetical/i })
        .first()

      if ((await sortOption.count()) > 0) {
        const optionText = await sortOption.textContent()
        await sortOption.click()

        // Wait for page to load
        await page.waitForLoadState("networkidle")

        // Verify URL contains sort parameter
        await expect(page).toHaveURL(/.*[?&]sort=/)

        // Verify the selected sort option is displayed
        await expect(sortDropdown).toContainText(optionText || "")
      }
    }
  })

  test("donation button should lead to donation form", async ({ page }) => {
    // Find the first initiative card with a donate button
    const donateButton = page
      .getByRole("link", { name: "Sustainable Development Goals" })
      .locator("xpath=../..")
      .getByRole("button", { name: "Donate" })

    // Verify donate button is visible
    await expect(donateButton).toBeVisible()

    // Click the donate button
    await donateButton.click()

    // Wait for navigation to complete
    await page.waitForURL(
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    // Verify we're on the initiative detail page
    await expect(page).toHaveURL(
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    // Verify donation form elements are present
    await expect(page.getByText(/donate|contribution|support/i)).toBeVisible()

    // Check for donation amount input or options
    const donationAmountExists =
      (await page
        .locator(
          'input[type="number"], [data-testid="donation-amount"], button:has-text("$")',
        )
        .count()) > 0
    expect(donationAmountExists).toBeTruthy()
  })

  test("initiative details page should display complete information", async ({
    page,
  }) => {
    // Navigate to a specific initiative by clicking on its title
    await page
      .getByRole("link", { name: "Sustainable Development Goals" })
      .click()

    // Wait for navigation to complete
    await page.waitForURL(
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    // Verify initiative title is displayed
    await expect(
      page.getByRole("heading", { name: "Sustainable Development Goals" }),
    ).toBeVisible()

    // Verify initiative image is displayed
    await expect(page.getByRole("img").first()).toBeVisible()

    // Verify initiative description is displayed
    await expect(page.getByText(/Everyone loves trees/)).toBeVisible()

    // Verify progress information is displayed
    await expect(page.getByText(/\$[0-9,]+ of [0-9,]+ raised/)).toBeVisible()

    // Verify donor information is displayed
    await expect(page.getByText(/donors/)).toBeVisible()

    // Check for sharing functionality
    const sharingExists =
      (await page
        .locator(
          '[aria-label="Share"], button:has-text("Share"), [data-testid="share-button"]',
        )
        .count()) > 0

    if (sharingExists) {
      const shareButton = page
        .locator(
          '[aria-label="Share"], button:has-text("Share"), [data-testid="share-button"]',
        )
        .first()
      await shareButton.click()

      // Verify sharing options are displayed
      const sharingOptionsVisible =
        (await page
          .locator(
            '[aria-label="Share on Facebook"], [aria-label="Share on Twitter"], [aria-label="Copy link"]',
          )
          .count()) > 0
      expect(sharingOptionsVisible).toBeTruthy()
    }

    // Verify back to initiatives link exists
    const backLink = page.getByRole("link", {
      name: /back|initiatives|all initiatives/i,
    })
    await expect(backLink).toBeVisible()

    // Test navigation back to initiatives page
    await backLink.click()
    await page.waitForURL(
      /^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives/,
    )
    await expect(page).toHaveURL(/.*\/initiatives/)
  })
})
