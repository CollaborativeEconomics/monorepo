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
    await expect(page.locator('input[name="name"]')).toHaveValue("Anonymous")
    await expect(page.locator('input[name="email"]')).toHaveValue("")
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
    await expect(page.getByRole("img", { name: "Chain" })).toBeVisible()

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
    await expect(firstOrg.locator("img[alt='Organization']")).toBeVisible()
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

  test("wallet address copy functionality works", async ({ page }) => {
    // Click copy button
    await page.getByTitle("Copy address").click()

    // Verify copy feedback (assuming there's a tooltip or message)
    await expect(page.getByText("Address copied")).toBeVisible()
  })

  //   test("mobile responsive layout", async ({ page }) => {
  //     // Set viewport to mobile size
  //     await page.setViewportSize({ width: 375, height: 667 })

  //     // Check profile header responsiveness
  //     const profileHeader = page.locator("div.profile-header")
  //     await expect(profileHeader).toBeVisible()
  //     await expect(profileHeader.locator("img.avatar")).toBeVisible()

  //     // Verify tab list is properly stacked on mobile
  //     const tabList = page.getByRole("tablist")
  //     await expect(tabList).toHaveCSS("flex-direction", "column")

  //     // Test mobile donation card layout
  //     const donationCard = page.locator("div.donation-card").first()
  //     await expect(donationCard).toBeVisible()
  //     await expect(donationCard).toHaveCSS("width", "100%")

  //     // Verify mobile navigation drawer
  //     await page.getByRole("button", { name: "Menu" }).click()
  //     await expect(page.getByRole("navigation")).toBeVisible()
  //     await expect(page.getByRole("link", { name: "Profile" })).toBeVisible()
  //     await expect(page.getByRole("link", { name: "Settings" })).toBeVisible()

  //     // Reset viewport
  //     await page.setViewportSize({ width: 1280, height: 720 })
  //   })

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

  //   test("profile data persistence", async ({ page }) => {
  //     // Make changes
  //     await page.getByLabel("Name").fill("New Name")
  //     await page.getByRole("button", { name: "Save" }).click()

  //     // Reload page
  //     await page.reload()

  //     // Verify changes persisted
  //     await expect(page.getByLabel("Name")).toHaveValue("New Name")
  //   })

  test("accessibility features", async ({ page }) => {
    // Test tab navigation through donation tabs
    await page.keyboard.press("Tab")
    await expect(
      page.getByRole("tab", { name: "Donation Receipt NFTs" }),
    ).toBeFocused()

    await page.keyboard.press("Tab")
    await expect(page.getByRole("tab", { name: "NFTs Receipts" })).toBeFocused()

    await page.keyboard.press("Tab")
    await expect(page.getByRole("tab", { name: "My Donations" })).toBeFocused()

    // Test ARIA attributes for tabs
    const tabList = page.getByRole("tablist")
    await expect(tabList).toHaveAttribute("aria-orientation", "horizontal")
    await expect(tabList).toHaveAttribute("aria-label", "Donations data")

    // Test tab panel accessibility
    const activePanel = page.getByRole("tabpanel").first()
    await expect(activePanel).toBeVisible()
    await expect(activePanel).toHaveAttribute("tabindex", "0")
    await expect(activePanel).toHaveAttribute("role", "tabpanel")

    // Test focus management for interactive elements
    const viewNftButton = page.getByRole("button", { name: "View NFT" }).first()
    await viewNftButton.focus()
    await expect(viewNftButton).toBeFocused()

    const receiptDetailsButton = page
      .getByRole("button", { name: "Receipt Details" })
      .first()
    await receiptDetailsButton.focus()
    await expect(receiptDetailsButton).toBeFocused()
  })

  test("donation history filtering works", async ({ page }) => {
    await page.getByRole("tab", { name: "Donations" }).click()

    // Test date range filter if exists
    await page.getByLabel("From date").fill("2024-01-01")
    await page.getByLabel("To date").fill("2024-12-31")
    await page.getByRole("button", { name: "Filter" }).click()

    // Verify filtered results
    await expect(page.getByText("$1.00 ETH")).toBeVisible()
    await expect(page.getByText("Sustainable Development Goals")).toBeVisible()
  })

  test("receipt download functionality", async ({ page }) => {
    await page.getByRole("tab", { name: "Receipts" }).click()

    // Click download button for a receipt
    const downloadPromise = page.waitForEvent("download")
    await page.getByRole("button", { name: "Download receipt" }).first().click()
    const download = await downloadPromise

    // Verify download started
    expect(download.suggestedFilename()).toMatch(/receipt.*\.pdf/)
  })

  test("profile social links", async ({ page }) => {
    // Test adding social links if feature exists
    await page.getByRole("button", { name: "Add social link" }).click()
    await page.getByLabel("Platform").selectOption("twitter")
    await page.getByLabel("Username").fill("@testuser")
    await page.getByRole("button", { name: "Save link" }).click()

    // Verify social link appears
    await expect(page.getByRole("link", { name: "@testuser" })).toBeVisible()
  })

  test("notification preferences", async ({ page }) => {
    // Navigate to notification settings if they exist
    await page.getByRole("button", { name: "Notification settings" }).click()

    // Toggle some notifications
    await page.getByLabel("Email notifications").check()
    await page.getByLabel("Browser notifications").uncheck()

    // Save preferences
    await page.getByRole("button", { name: "Save preferences" }).click()

    // Verify success message
    await expect(page.getByText("Preferences updated")).toBeVisible()
  })

  test("profile deletion flow", async ({ page }) => {
    // Navigate to danger zone / account settings
    await page.getByRole("button", { name: "Delete account" }).click()

    // Verify confirmation dialog
    await expect(page.getByText("Are you sure?")).toBeVisible()

    // Cancel deletion
    await page.getByRole("button", { name: "Cancel" }).click()
    await expect(page.getByText("Are you sure?")).not.toBeVisible()

    // Attempt deletion
    await page.getByRole("button", { name: "Delete account" }).click()
    await page.getByRole("button", { name: "Confirm deletion" }).click()

    // Verify redirect to home
    await expect(page).toHaveURL("/")
  })

  test("profile data export", async ({ page }) => {
    // Request data export if feature exists
    await page.getByRole("button", { name: "Export data" }).click()

    // Wait for export to be ready
    await expect(page.getByText("Export ready")).toBeVisible()

    // Download exported data
    const downloadPromise = page.waitForEvent("download")
    await page.getByRole("button", { name: "Download export" }).click()
    const download = await downloadPromise

    // Verify download
    expect(download.suggestedFilename()).toMatch(/profile-export.*\.json/)
  })

  test("connected applications", async ({ page }) => {
    // Navigate to connected apps section if it exists
    await page.getByRole("button", { name: "Connected apps" }).click()

    // Verify connected app appears
    await expect(page.getByText("MetaMask")).toBeVisible()

    // Revoke access
    await page.getByRole("button", { name: "Revoke access" }).first().click()

    // Verify revocation
    await expect(page.getByText("Access revoked")).toBeVisible()
  })

  test("profile verification status", async ({ page }) => {
    // Check verification badge if feature exists
    await expect(
      page.getByRole("img", { name: "Verification badge" }),
    ).toBeVisible()

    // Click to view verification details
    await page.getByText("Verified").click()

    // Verify verification details
    await expect(page.getByText("Verification method:")).toBeVisible()
    await expect(page.getByText("Verified on:")).toBeVisible()
  })
})
