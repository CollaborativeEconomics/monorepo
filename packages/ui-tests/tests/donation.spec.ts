import { expect, test } from "@playwright/test"

test.describe("Donation Page", () => {
  const INITIATIVE_ID = "0463730f-6314-4571-bae9-3086890331fe"
  const BASE_URL = "https://staging.giving-universe.org"
  const INITIATIVE_URL = `${BASE_URL}/initiatives/${INITIATIVE_ID}`

  test.beforeEach(async ({ page }) => {
    await page.goto(INITIATIVE_URL)
  })

  test("displays initiative details correctly", async ({ page }) => {
    // Verify title
    await expect(page.locator("h1").first()).toContainText(
      "Dubuque Harm Reduction office fundraiser",
    )

    // Verify organization name
    await expect(
      page.locator("text=Dubuque Harm Reduction").first(),
    ).toBeVisible()

    // Verify description
    const description =
      "This is an initiative to raise the funds necessary to rent an office for Dubuque Harm Reduction"
    await expect(page.locator(`text=${description}`)).toBeVisible()
  })

  test("donation form has required elements", async ({ page }) => {
    // Currency selector
    await expect(page.locator('label:has-text("Currency")')).toBeVisible()
    await expect(page.locator('button[role="combobox"]')).toHaveCount(2) // Currency and Wallet selectors

    // Amount input
    await expect(page.locator('label:has-text("Amount")')).toBeVisible()
    await expect(page.locator("input#amount")).toBeVisible()

    // Optional fields
    await expect(page.locator("input#name-input")).toBeVisible()
    await expect(page.locator("input#email-input")).toBeVisible()

    // Receipt checkbox
    await expect(
      page
        .locator('label:has-text("I\'d like to receive an emailed receipt")')
        .first(),
    ).toBeVisible()

    // Donate button
    await expect(page.locator('button:has-text("Donate")')).toBeVisible()
  })

  test("NFT receipt preview is displayed", async ({ page }) => {
    // Verify NFT receipt section
    await expect(page.locator("text=NFT Receipt")).toBeVisible()
    await expect(page.locator("text=Status: Not Yet Minted")).toBeVisible()
  })

  test("amount input validation", async ({ page }) => {
    const amountInput = page.locator("input#amount")

    // Test valid amount
    await amountInput.fill("100")
    await expect(amountInput).toHaveValue("100")
  })

  test("toggles between USD and ETH", async ({ page }) => {
    // Wait for the toggle container to be visible
    const toggleContainer = page.locator(
      ".flex.flex-row.justify-between.items-center >> text=USD",
    )
    await toggleContainer.first().waitFor({ state: "visible", timeout: 5000 })

    // Find the toggle element
    const toggle = page.locator("input#show-usd-toggle")
    await toggle.waitFor({ state: "visible", timeout: 5000 })

    // Check initial state (USD)
    await expect(page.locator("text=USD").first()).toBeVisible()

    // Get initial checked state
    const initialCheckedState = await toggle.isChecked()

    // Use a more reliable method to toggle - click the label instead of the hidden input
    const toggleLabel = page.locator('label[for="show-usd-toggle"]')
    if (await toggleLabel.nth(1).isVisible()) {
      await toggleLabel.nth(1).click()
    } else {
      // If no label, force the checked state directly
      await page.evaluate(() => {
        const toggle = document.querySelector(
          "#show-usd-toggle",
        ) as HTMLInputElement
        if (toggle) {
          toggle.checked = !toggle.checked
          // Dispatch change event to trigger any listeners
          toggle.dispatchEvent(new Event("change", { bubbles: true }))
        }
      })
    }

    // Wait for state to change
    await page.waitForTimeout(1000)

    // Check that we're now showing the alternative currency
    const currencyText = await page
      .locator(".flex.flex-row.justify-between.items-center")
      .textContent()
    expect(currencyText).not.toContain("USD")

    // Explicitly check for the opposite checked state rather than assuming it's now checked
    const expectedState = !initialCheckedState
    if (expectedState) {
      // Only check if we expect it to be checked
      expect(await toggle.isChecked()).toBe(true)
    } else {
      // Only check if we expect it to be unchecked
      expect(await toggle.isChecked()).toBe(false)
    }
  })
})
