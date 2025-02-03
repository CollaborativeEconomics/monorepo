import { expect, test } from "@playwright/test"

test("homepage has expected content", async ({ page }) => {
  await page.goto("/")

  // Wait for the main content to be visible
  await expect(page.locator("body")).toBeVisible()

  // Basic check that we're on the homepage
  await expect(page).toHaveTitle(/Giving Universe/)
})
