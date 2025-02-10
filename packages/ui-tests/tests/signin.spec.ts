import { expect, test } from "@playwright/test"

test.describe("Signin", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(100000)
    await page.goto("/")
    // Wait for the main content to be visible
    await expect(page.locator("body")).toBeVisible()
  })

  test("Should navigate to signin page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click()
    await page.waitForURL(/^http:\/\/localhost:3000\/signin$/)
    await expect(page).toHaveURL(/.*\/signin/)
  })

  test("Should display wallet login options", async ({ page }) => {
    // Navigate to signin page
    await page.getByRole("link", { name: "Sign in" }).click()
    await expect(page).toHaveURL(/.*\/signin/)

    // Verify heading
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()

    // Verify wallet login buttons
    await expect(
      page.getByRole("button", { name: "Login with Freighter Wallet" }),
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Login with Metamask Wallet" }),
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Login with Xaman Wallet" }),
    ).toBeVisible()

    // Verify wallet icons are present
    await expect(page.getByAltText("Freighter Wallet icon")).toBeVisible()
    await expect(page.getByAltText("Metamask Wallet icon")).toBeVisible()
    await expect(page.getByAltText("Xaman Wallet icon")).toBeVisible()
  })
})
