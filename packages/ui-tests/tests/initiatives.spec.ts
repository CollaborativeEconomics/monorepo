import { expect, test } from "../fixtures"

test.describe("Initiative page", () => {
  const BASE_URL = "https://staging.giving-universe.org"

  test.beforeEach(async ({ page }) => {
    // test.setTimeout(100000)
    await page.goto(`${BASE_URL}/initiatives`)
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
    await expect(
      page.getByText(/\$\d+,\d+ of \d+,\d+ raised/).first(),
    ).toBeVisible()
    await expect(page.getByText(/\d+ Donors/).first()).toBeVisible()
    // Verify that at least one initiative image is visible
    await expect(
      page.getByRole("img", { name: "IMG BG" }).first(),
    ).toBeVisible()
    await expect(
      page.getByRole("img", { name: "IMG BG" }).first(),
    ).toBeVisible()
  })

  test("should have progress bars with correct values", async ({ page }) => {
    // Find all progress bar elements
    const progressBars = page.locator(
      '[role="progressbar"], .progress-bar, .progress',
    )

    // Verify at least one progress bar exists
    expect(await progressBars.count()).toBeGreaterThan(0)

    // Test Green Blockchain initiative which has high progress (70%)
    const greenBlockchainCard = page
      .locator("h3", { hasText: "Green Blockchain" })
      .locator("xpath=../../../..")
    const greenBlockchainProgressBar = greenBlockchainCard
      .locator('[role="progressbar"], .progress-bar, .progress')
      .first()

    // Verify the progress bar is visible
    await expect(greenBlockchainProgressBar).toBeVisible()

    // Check if the progress bar has the correct style or attributes
    // This could be checking the width style or aria attributes
    const progressStyle = await greenBlockchainProgressBar.getAttribute("style")
    if (progressStyle) {
      // The Green Blockchain initiative has ~70% progress
      expect(progressStyle).toContain("width")

      // Extract the width percentage and verify it's around 70%
      const widthMatch = progressStyle.match(/width:\s*(\d+(\.\d+)?)%/)
      if (widthMatch) {
        const widthPercentage = Number.parseFloat(widthMatch[1])
        expect(widthPercentage).toBeGreaterThan(65)
        expect(widthPercentage).toBeLessThan(75)
      }
    }

    // Alternative check using aria attributes
    const ariaValueNow =
      await greenBlockchainProgressBar.getAttribute("aria-valuenow")
    const ariaValueMax =
      await greenBlockchainProgressBar.getAttribute("aria-valuemax")

    if (ariaValueNow && ariaValueMax) {
      const percentage =
        (Number.parseFloat(ariaValueNow) / Number.parseFloat(ariaValueMax)) *
        100
      expect(percentage).toBeGreaterThan(65)
      expect(percentage).toBeLessThan(75)
    }
  })

  test("Navigation to individual initiative page works", async ({ page }) => {
    // Click the donate button
    await page
      .getByRole("link", { name: "Sustainable Development Goals" })
      .locator("xpath=../..")
      .getByRole("button", { name: "Donate" })
      .click()

    await page.waitForURL(
      /^https:\/\/staging\.giving-universe\.org\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    await expect(page).toHaveURL(
      /^https:\/\/staging\.giving-universe\.org\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )
  })

  test("initiative progress indicators work", async ({ page }) => {
    // Test visual progress bar if it exists
    const progressBar = page.locator(
      '.progress-bar, [role="progressbar"], progress, .progress',
    )
    if ((await progressBar.count()) > 0) {
      // Verify progress bar is visible
      await expect(progressBar.first()).toBeVisible()

      // Check if progress bar has appropriate aria attributes
      const hasAriaValueNow =
        (await progressBar.first().getAttribute("aria-valuenow")) !== null
      if (hasAriaValueNow) {
        const valueNow = await progressBar.first().getAttribute("aria-valuenow")
        const valueMax = await progressBar.first().getAttribute("aria-valuemax")

        // Verify that aria values are numbers
        expect(Number(valueNow)).not.toBeNaN()
        expect(Number(valueMax)).not.toBeNaN()

        // Verify that progress percentage is calculated correctly
        if (valueNow && valueMax) {
          const percentage = Math.round(
            (Number(valueNow) / Number(valueMax)) * 100,
          )
          // Check if the percentage is displayed somewhere
          const percentageText = page.getByText(`${percentage}%`)
          if ((await percentageText.count()) > 0) {
            await expect(percentageText).toBeVisible()
          }
        }
      }
    }
  })

  test("filter functionality works correctly", async ({ page }) => {
    // Test category filter
    const categoryButton = page.locator('[role="combobox"]').first()
    await categoryButton.click()
    await expect(page.getByRole("dialog")).toBeVisible()

    // Test location filter
    const locationButton = page.locator('[role="combobox"]').nth(1)
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
      /^https:\/\/staging\.giving-universe\.org\/initiatives\?.*$/,
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
      /^https:\/\/staging\.giving-universe\.org\/organizations$/,
    )
    await expect(page).toHaveURL(/.*\/organizations/)

    // Click Initiatives tab
    await page.getByRole("link", { name: "Initiatives" }).click()
    await page.waitForURL(
      /^https:\/\/staging\.giving-universe\.org\/initiatives$/,
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
      /^https:\/\/staging\.giving-universe\.org\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    // Verify we're on the initiative detail page
    await expect(page).toHaveURL(
      /^https:\/\/staging\.giving-universe\.org\/initiatives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    // Verify donation form elements are present
    await expect(
      page.getByText(/donate|contribution|support/i).first(),
    ).toBeVisible()

    // Check for donation amount input or options
    const donationAmountExists =
      (await page
        .locator(
          'input[type="number"], [data-testid="donation-amount"], button:has-text("$")',
        )
        .count()) > 0
    expect(donationAmountExists).toBeTruthy()
  })
})
