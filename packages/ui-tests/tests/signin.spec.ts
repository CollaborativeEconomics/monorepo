import { expect, test } from "@playwright/test"

const BASE_URL = "https://staging.giving-universe.org"

test("Should navigate to signin page", async ({ page }) => {
  await page.goto(BASE_URL)
  await page.getByRole("link", { name: "Sign In" }).click()
  await page.waitForURL(`${BASE_URL}/signin`)
  await expect(page).toHaveURL(`${BASE_URL}/signin`)
})

test("Should display wallet login options", async ({ page }) => {
  await page.goto(BASE_URL)
  // Navigate to signin page
  await page.getByRole("link", { name: "Sign In" }).click()
  await expect(page).toHaveURL(`${BASE_URL}/signin`)

  // Verify heading
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()

  // Verify all wallet login buttons
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

// test("should sign in with metamask", async ({
//   page,
//   wallet
// }) => {

//   // Navigate to the homepage
//   await page.goto(BASE_URL)
//   await page.getByRole("link", { name: "Sign In" }).click()
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
