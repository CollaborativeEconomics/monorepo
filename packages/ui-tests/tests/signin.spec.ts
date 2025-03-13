import { expect, test } from "@playwright/test"

test("Should navigate to signin page", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Sign in" }).click()
  await page.waitForURL(/^https:\/\/staging\.givebase\.cfce\.io\/signin$/)
  await expect(page).toHaveURL(/.*\/signin/)
})

test("Should display wallet login options", async ({ page }) => {
  await page.goto("/")
  // Navigate to signin page
  await page.getByRole("link", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/.*\/signin/)

  // Verify heading
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()

  // Verify wallet login buttons
  await expect(
    page.getByRole("button", { name: "Login with Metamask Wallet" }),
  ).toBeVisible()

  // Verify wallet icons are present
  await expect(page.getByAltText("Metamask Wallet icon")).toBeVisible()
})

// test("should sign in with metamask", async ({
//   page,
//   wallet
// }) => {

//   // Navigate to the homepage
//   await page.goto("/")
//   await page.getByRole("link", { name: "Sign in" }).click()
//   const signinPage = page.getByRole("heading", { name: "Sign in" })
//   console.log(await signinPage.textContent())
//   await expect(signinPage).toBeVisible()

//   // Click the connect button
//   await page.getByText("Login with Metamask Wallet").click()

//   await wallet.connect("alice", {})

//   await expect(page).toHaveURL(/.*\/profile.*/)

//   console.log(await page.content())

//   await expect(page.getByText("Connected Wallets")).toBeVisible()

//   // await page.pause()
//   // Verify the connected account address
//   // from seed
//   await expect(
//     page.getByText(`${wallet.address}`),
//   ).toBeVisible()
// })
