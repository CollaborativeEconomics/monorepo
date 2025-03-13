import { expect, test } from "@playwright/test"

test.describe("Homepage", () => {
  const BASE_URL = "https://staging.giving-universe.org"

  test.beforeEach(async ({ page }) => {
    //   test.setTimeout(100000)
    await page.goto(BASE_URL)
    //   // Wait for the main content to be visible
    await expect(page.locator("body")).toBeVisible()
  })

  test("has expected title and meta content", async ({ page }) => {
    // Basic check that we're on the homepage
    await expect(page).toHaveTitle("Giving Universe (Staging)")

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
    const headerLogo = header.getByRole("link", { name: /giving universe/i })
    await expect(headerLogo).toBeVisible()

    // Check main nav links
    const navLinks = page.locator("nav").getByRole("link")
    await expect(navLinks).toHaveCount(1)

    // Check Sign In link
    await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible()
  })

  test("hero section content", async ({ page }) => {
    // Check main heading
    await expect(
      page.getByRole("heading", {
        name: "Blockchain-driven philanthropy for a transparent world",
      }),
    ).toBeVisible()

    // Check hero text content
    await expect(
      page.getByText(
        "With the increased transparency that blockchain donations provide",
      ),
    ).toBeVisible()
  })

  test("initiative cards are displayed", async ({ page }) => {
    // Check for specific initiative titles
    const initiatives = [
      "Dubuque Harm Reduction office fundraiser",
      "Feed indigenous people",
      "Feed the homeless",
      "Feed the poor",
      "Green Blockchain",
      "Hurricane Beryl",
    ]

    for (const initiative of initiatives) {
      await expect(
        page.getByRole("link", { name: new RegExp(initiative, "i") }),
      ).toBeVisible()
    }
  })

  test("donor section content", async ({ page }) => {
    // Check "Become a Donor" section
    await expect(
      page.getByRole("heading", { name: "Become a Donor" }),
    ).toBeVisible()

    await expect(
      page.getByText(
        "Find causes you care about that are making a real difference",
      ),
    ).toBeVisible()

    // Check action buttons
    await expect(
      page.getByRole("link", { name: "Find Organizations" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Find Initiatives" }),
    ).toBeVisible()
  })

  test("crypto donations section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Start Accepting Crypto Donations" }),
    ).toBeVisible()

    await expect(
      page.getByText("Digital currencies are the future of commerce"),
    ).toBeVisible()

    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible()
  })

  test("how it works section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "How it works" }),
    ).toBeVisible()

    const sections = [
      "Donate to community causes you care about",
      "Receive personalized, tax-deductible NFT Receipts",
      "NFTs tell the story of your impact",
    ]

    for (const section of sections) {
      await expect(page.getByRole("heading", { name: section })).toBeVisible()
    }
  })

  test("footer content", async ({ page }) => {
    const footer = page.getByRole("contentinfo")

    // Check organization name
    await expect(
      footer.getByText("by Center For Collaborative Economics"),
    ).toBeVisible()

    // Know Us section
    const knowUsLinks = [
      "Our Mission",
      "Our Partners",
      "Privacy Policy",
      "Terms and Conditions",
    ]

    for (const link of knowUsLinks) {
      await expect(footer.getByRole("link", { name: link })).toBeVisible()
    }

    // Follow Us section
    const socialLinks = ["Discord", "Twitter", "Facebook", "Instagram"]

    for (const social of socialLinks) {
      await expect(footer.getByRole("link", { name: social })).toBeVisible()
    }
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

  test("initiative cards carousel functionality", async ({ page }) => {
    // Check carousel exists
    const carousel = page.locator(".swiper")
    await expect(carousel).toBeVisible()

    // Check initiative cards within carousel
    const initiativeCards = page.locator(".swiper-wrapper > .swiper-slide")
    const count = await initiativeCards.count()
    expect(count).toBeGreaterThan(0)

    // Store first visible initiative title
    const firstSlide = page.locator(".swiper-slide-active")
    await expect(firstSlide).toBeVisible()
    const firstInitiativeTitle = await firstSlide.textContent()

    // Test carousel navigation
    const nextButton = page.locator(".swiper-button-next")
    await expect(nextButton).toBeVisible()
    await nextButton.click()
    await page.waitForTimeout(1000) // Increase timeout for slide transition

    // Verify carousel navigated by checking active slide changed
    const newActiveSlide = page.locator(".swiper-slide-active")
    await expect(newActiveSlide).toBeVisible()
    const newInitiativeTitle = await newActiveSlide.textContent()
    expect(newInitiativeTitle).not.toBe(firstInitiativeTitle)

    // Check pagination exists
    const pagination = page.locator(".swiper-pagination")
    await expect(pagination).toBeVisible()

    // Test previous navigation
    const prevButton = page.locator(".swiper-button-prev")
    await expect(prevButton).toBeVisible()
    await prevButton.click()
    await page.waitForTimeout(1000) // Wait for slide transition

    // Verify we returned to the first slide
    const returnedSlide = page.locator(".swiper-slide-active")
    await expect(returnedSlide).toBeVisible()
    const returnedTitle = await returnedSlide.textContent()
    expect(returnedTitle).toBe(firstInitiativeTitle)
  })

  test("initiative cards detailed content", async ({ page }) => {
    // Check first initiative's complete content
    const firstInitiative = page.locator(".swiper-slide").first()

    // Check image
    await expect(firstInitiative.locator("img")).toBeVisible()
    await expect(firstInitiative.locator("img")).toHaveAttribute(
      "alt",
      /initiative image/i,
    )

    // Check description
    await expect(
      firstInitiative.getByText(/Sustainable Development Goals/).first(),
    ).toBeVisible()

    // Test navigation to initiative page
    const initiativeLink = firstInitiative.getByRole("link")
    const href = await initiativeLink.getAttribute("href")
    await initiativeLink.click()
    await page.waitForURL(/\/initiatives\//)
    await expect(page).toHaveURL(href ?? "")

    // Go back to homepage
    await page.goto(BASE_URL)
  })

  test("how it works section detailed content", async ({ page }) => {
    // First verify the main heading
    const howItWorksHeading = page.getByRole("heading", {
      name: "How it works",
    })
    await expect(howItWorksHeading).toBeVisible()

    // Get the how it works container
    const howItWorksSection = page.locator("main > section", {
      has: howItWorksHeading,
    })

    // Verify each instruction section by headings and descriptions
    const sections = [
      {
        heading: "Donate to community causes you care about",
        description:
          "Find organizations working on the sustainable development goals that you care most about",
      },
      {
        heading: "Receive personalized, tax-deductible NFT Receipts",
        description:
          "Whenever you donate, you receive a personalzed tax-deductible NFT receipt",
      },
      {
        heading: "NFTs tell the story of your impact",
        description:
          "Non-profits publish and distribute their progress as Story NFTs",
      },
    ]

    for (const section of sections) {
      // Check heading
      await expect(
        page.getByRole("heading", { name: section.heading }),
      ).toBeVisible()

      // Check description text
      await expect(page.getByText(section.description)).toBeVisible()
    }
  })

  test("crypto donations section detailed content", async ({ page }) => {
    // First find the section by its heading
    const heading = page.getByRole("heading", {
      name: "Start Accepting Crypto Donations",
    })
    await expect(heading).toBeVisible()

    // Get the section containing the heading
    const section = heading.locator("../..")

    // Check main content text - without relying on specific region role
    await expect(
      page.getByText("Digital currencies are the future of commerce"),
    ).toBeVisible()
    await expect(page.getByText("Future-proof your non-profit")).toBeVisible()
    await expect(
      page.getByText("free of the tedium of grant-writing"),
    ).toBeVisible()

    // Check sign up button exists
    const signUpLink = page.getByRole("link", { name: "Sign Up" })
    await expect(signUpLink).toBeVisible()

    // Check the URL pattern
    const href = await signUpLink.getAttribute("href")
    expect(href).toMatch("https://cfce.io/contact/")
  })
})
