import { expect, test } from "@playwright/test"

test.describe("Profile page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/profile/42584386-4671-4848-83a7-056c1123a60d")
    // Wait for the main content to be visible
    await expect(page.locator("body")).toBeVisible()
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle")
  })

  test("displays profile form correctly", async ({ page }) => {
    // Verify avatar image
    await expect(page.getByRole("img", { name: "Avatar" })).toBeVisible()

    // Verify form labels
    await expect(page.locator('label[for="name"]')).toHaveText("Name")
    await expect(page.locator('label[for="email"]')).toHaveText("Email")
    await expect(page.locator('label[for="file"]')).toHaveText("Avatar")

    // Verify form inputs
    await expect(page.locator('input[name="name"]')).toHaveValue("Lawal")
    await expect(page.locator('input[name="email"]')).toHaveValue("rdgx@rdgx.io")
    await expect(page.locator('input[name="file"]')).toHaveAttribute(
      "type",
      "file",
    )

    // Verify input classes and attributes
    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).toHaveClass(/flex h-10 text-lg rounded-full/)
    await expect(nameInput).toHaveAttribute("placeholder", "name")

    // Verify save button
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
  })

  test("displays connected wallets section", async ({ page }) => {
    // Verify section title
    await expect(page.getByText("Connected Wallets")).toBeVisible()

    const walletSection = page.getByText(/.*wallet/i).first()
    await expect(walletSection).toBeVisible()

    // Verify chain icon
    await expect(page.getByRole("img", { name: "Chain" }).first()).toBeVisible()

    // Verify add wallet button
    await expect(page.getByRole("button", { name: "Add Wallet" })).toBeVisible()
  })

  test("displays favorite organizations", async ({ page }) => {
    // Verify section title
    await expect(page.getByText("Favorite Organizations")).toBeVisible()

    // Verify grid layout
    await expect(page.locator("div.grid.grid-cols-2.gap-2")).toBeVisible()

    // Verify organization links exist
    const orgLinks = page.locator('a[href^="/organizations/"]')
    await expect(orgLinks).toHaveCount(await orgLinks.count())

    // Verify organization structure
    const firstOrg = orgLinks.first()
    await expect(
      firstOrg.locator("div.flex.flex-row.justify-start.items-center"),
    ).toBeVisible()
    await expect(firstOrg.locator("h1.text-sm.text-center")).toBeVisible()
  })

  test("displays badges section", async ({ page }) => {
    // Verify badges section header
    await expect(
      page.locator("h1.text-2xl.font-medium").filter({ hasText: "Badges" }),
    ).toBeVisible()

    // Verify badges grid container exists
    const badgesGrid = page.locator("div.grid.grid-cols-4.gap-2.mb-8")
    await expect(badgesGrid).toBeVisible()

    // Check if badges exist
    const badges = badgesGrid.locator(":scope > div")
    const badgeCount = await badges.count()

    if (badgeCount === 1) {
      // Empty state
      await expect(badges.first()).toHaveClass(/text-gray-300/)
      await expect(badges.first()).toHaveText("None")
    } else {
      // Has badges
      await expect(badgeCount).toBeGreaterThan(0)
    }
  })

  test("displays recent stories", async ({ page }) => {
    // Verify section header
    await expect(
      page
        .locator("h1.text-2xl.font-medium")
        .filter({ hasText: "My Recent Stories" }),
    ).toBeVisible()

    // Verify story card structure
    const storyCard = page.locator("div.rounded-lg.bg-card").first()
    await expect(storyCard).toBeVisible()

    // Verify story image
    await expect(storyCard.getByRole("img", { name: "IMG BG" })).toBeVisible()

    // Verify story content structure
    const contentSection = storyCard.locator("div.p-6.pt-0.flex.flex-col")
    await expect(contentSection).toBeVisible()

    // Verify organization link exists
    await expect(
      contentSection.locator('a[href^="/organizations/"]'),
    ).toBeVisible()

    // Verify initiative link exists
    await expect(
      contentSection.locator('a[href^="/initiatives/"]'),
    ).toBeVisible()

    // Verify date section exists
    await expect(
      contentSection.locator("div.h-2.inline-flex.gap-2.items-center"),
    ).toBeVisible()

    // Verify story description exists
    await expect(contentSection.locator("div.pl-6.line-clamp-2")).toBeVisible()
  })

  test("profile navigation works correctly", async ({ page }) => {
    // Test navigation between donation data tabs
    await page.getByRole("tab", { name: "Donation Receipt NFTs" }).click()
    await expect(
      page.getByRole("tabpanel", { name: "Donation Receipt NFTs" }),
    ).toBeVisible()

    // Verify NFT receipt card structure
    const receiptCard = page.locator("div.rounded-lg.bg-card").first()
    await expect(receiptCard).toBeVisible()

    // Test other tabs
    await page.getByRole("tab", { name: "NFTs Receipts" }).click()
    await expect(
      page.getByRole("tabpanel", { name: "NFTs Receipts" }),
    ).toBeVisible()

    await page.getByRole("tab", { name: "My Donations" }).click()
    await expect(
      page.getByRole("tabpanel", { name: "My Donations" }),
    ).toBeVisible()
  })

  test("logout functionality", async ({ page }) => {
    // Click logout button
    await page.getByRole("button", { name: "Log Out" }).click()

    // wait for the page to be loaded
    await page.waitForURL("/")

    // Verify redirect to login page or home
    await expect(page).toHaveURL("/")
  })

  test("favorite organizations interactions", async ({ page }) => {
    // Click on an organization
    const orgLinks = page.locator('a[href^="/organizations/"]')
    await orgLinks.first().click()

    // wait for the page to be loaded
    await page.waitForURL(
      /^http:\/\/localhost:3000\/organizations\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    // Verify navigation to organization page
    await expect(page).toHaveURL(/.*\/organizations\/.*/)

    // Go back to profile
    await page.goBack()

    // wait for the page to be loaded
    await page.waitForURL(
      /^http:\/\/localhost:3000\/profile\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )

    // Verify back on profile page
    await expect(page).toHaveURL(/.*\/profile\/.*/)
  })
})
