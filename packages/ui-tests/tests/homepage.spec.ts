import { expect, test } from "../fixtures";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    //   test.setTimeout(100000)
    await page.goto("/")
    //   // Wait for the main content to be visible
    await expect(page.locator("body")).toBeVisible()
  })

  test("has expected title and meta content", async ({ page }) => {
    // Basic check that we're on the homepage
    await expect(page).toHaveTitle("Give Base (Staging)")

    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute(
      "content",
      "Watch your donations make an impact",
    )
  })

  test("displays main navigation elements", async ({ page }) => {
    // Check header navigation
    const header = page.locator("header")
    await expect(header).toBeVisible()

    // Check logo - make it more specific by looking within the header
    const headerLogo = header.getByRole("link", { name: /give base/i })
    await expect(headerLogo).toBeVisible()

    // Check main nav links
    const navLinks = page.locator("nav").getByRole("link")
    await expect(navLinks).toHaveCount(1)
  })

  test("hero section content and interactions", async ({ page }) => {
    // Check main headings
    await expect(
      page.getByRole("heading", { name: "Blockchain-driven" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Donate to community causes" }),
    ).toBeVisible()

    // Check hero text content
    await expect(page.getByText("Find organizations working on")).toBeVisible()

    // Check Find Organizations button
    const findOrgButton = page
      .getByRole("link", {
        name: "Find Organizations",
      })
      .filter({ hasText: /^Find Organizations$/ })

    await expect(findOrgButton).toBeVisible()
    await expect(findOrgButton).toHaveAttribute("href", "/organizations")

    // Test navigation
    await findOrgButton.click()
    await page.waitForURL(/^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/organizations$/)
    await expect(page).toHaveURL(/.*\/organizations/)

    // Go back to homepage
    await page.goto("/")
    await expect(page).toHaveURL("/")

    // Check Find Initiatives button
    const findInitiativesButton = page
      .getByRole("link", {
        name: "Find Initiatives",
      })
      .filter({ hasText: /^Find Initiatives$/ })

    await expect(findInitiativesButton).toBeVisible()
    await expect(findInitiativesButton).toHaveAttribute("href", "/initiatives")

    // Test navigation
    await findInitiativesButton.click()
    await page.waitForURL(/^https:\/\/give-base-git-kuyawa-partners-login-cfce.vercel.app\/initiatives$/)
    await expect(page).toHaveURL(/.*\/initiatives/)

    // Verify we're on the initiatives page by checking for specific content
    await expect(page.getByRole("link", { name: "Initiatives" })).toBeVisible()
  })

  test("carousel functionality", async ({ page }) => {
    // Check carousel exists
    const carousel = page.locator(".swiper")
    await expect(carousel).toBeVisible()

    // Test carousel navigation
    const nextButton = page.locator(".swiper-button-next")
    await expect(nextButton).toBeVisible()
    await nextButton.click()

    // Check pagination
    const pagination = page.locator(".swiper-pagination")
    await expect(pagination).toBeVisible()
  })

  test("navigation and authentication links", async ({ page }) => {
    // Check auth links
    await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible()

    // Check main navigation links
    await expect(
      page.getByRole("link", { name: "Find Organizations" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Find Initiatives" }),
    ).toBeVisible()
  })

  test("footer links and content", async ({ page }) => {
    const footer = page.getByRole("contentinfo")

    // Know Us section
    await expect(
      footer.getByRole("heading", { name: "Know Us:" }),
    ).toBeVisible()

    // Check footer links
    const footerLinks = [
      "Our Mission",
      "Our Partners",
      "Privacy Policy",
      "Terms and Conditions",
    ]

    for (const linkText of footerLinks) {
      await expect(footer.getByRole("link", { name: linkText })).toBeVisible()
    }

    // Check footer logo
    await expect(
      footer.getByRole("link", { name: "Give Base (Staging) logo" }),
    ).toBeVisible()
  })

  test("theme toggle functionality", async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.getByRole("button", { name: "Toggle theme" })
    await expect(themeToggle).toBeVisible()

    // Click theme toggle and wait for menu to be attached to DOM
    await themeToggle.click()
    await page.waitForSelector('[role="menuitem"]', { state: "attached" })

    // Check all theme options are present and wait for them to be stable
    const lightOption = page.getByRole("menuitem", { name: "Light" })
    const darkOption = page.getByRole("menuitem", { name: "Dark" })
    const systemOption = page.getByRole("menuitem", { name: "System" })

    await expect(lightOption).toBeVisible()
    await expect(darkOption).toBeVisible()
    await expect(systemOption).toBeVisible()

    // Click on dark theme and wait for the change
    await darkOption.click()
    await expect(page.locator("html")).toHaveClass(/dark/)

    // Open menu again for light theme selection
    await themeToggle.click()
    await page.waitForSelector('[role="menuitem"]', { state: "attached" })

    // Select light theme and wait for the change
    await lightOption.click()
    await page.waitForTimeout(500) // Add small delay for theme change
    await expect(page.locator("html")).not.toHaveClass(/dark/)
  })

  test("key features section content", async ({ page }) => {
    // NFT Receipts section
    await expect(
      page.getByText("Receive personalized, tax-deductible NFT Receipts", {
        exact: false,
      }),
    ).toBeVisible()

    await expect(
      page.getByRole("heading", { name: "NFTs tell the story of your" }),
    ).toBeVisible()
  })

  test("donor registration section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Become a Donor" }),
    ).toBeVisible()

    await expect(page.getByText("Find causes you care about")).toBeVisible()
  })

  test("error handling", async ({ page }) => {
    // Check if error button exists when there are errors
    const errorButton = page.getByRole("button", { name: "Hide Errors" })
    if (await errorButton.isVisible()) {
      await errorButton.click()
      // Verify errors are hidden
      await expect(errorButton).not.toBeVisible()
    }
  })

  test("responsive layout", async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator("header")).toBeVisible()

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator("header")).toBeVisible()

    // Test desktop view
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(page.locator("header")).toBeVisible()
  })
})

// test("displays featured causes section", async ({ page }) => {
//   const featuredSection = page.getByRole("region", {
//     name: /featured causes/i,
//   })
//   await expect(featuredSection).toBeVisible()

//   // Check for cause cards
//   const causeCards = page.locator('[data-testid="cause-card"]')
//   await expect(causeCards).toHaveCount(3) // Adjust count based on actual number of featured causes
// })

// test("has working donation flow initiation", async ({ page }) => {
//   // Click donate button
//   const donateButton = page.getByRole("button", { name: /donate/i })
//   await donateButton.click()

//   // Check if donation form appears
//   const donationForm = page.locator('[data-testid="donation-form"]')
//   await expect(donationForm).toBeVisible()
// })

// test("has working navigation links", async ({ page }) => {
//   // Test each nav link
//   const navLinks = page.locator("nav").getByRole("link")

//   // Get all hrefs
//   const hrefs = await navLinks.evaluateAll((links) =>
//     links.map((link) => link.getAttribute("href")),
//   )

//   // Check each link navigates correctly
//   for (const href of hrefs) {
//     if (href && !href.startsWith("http")) {
//       // Only test internal links
//       await page.click(`nav a[href="${href}"]`)
//       await expect(page).toHaveURL(new RegExp(href))
//       await page.goto("/") // Go back to homepage
//     }
//   }
// })
// })
