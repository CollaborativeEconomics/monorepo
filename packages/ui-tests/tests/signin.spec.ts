// import { expect, test } from "@playwright/test"
import { testWithSynpress } from "@synthetixio/synpress"
import {
  MetaMask,
  metaMaskFixtures,
  unlockForFixture,
} from "@synthetixio/synpress/playwright"
import basicSetup from "../wallet-setup/basic.setup.js"

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const expect = test.expect

test.describe("Signin", () => {
  test.beforeEach(async ({ page }) => {
    //   test.setTimeout(100000)
    await page.goto("/")
    //   // Wait for the main content to be visible
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

  test("should sign in with metamask", async ({
    context,
    page,
    extensionId,
  }) => {
    const metamask = new MetaMask(
      context,
      page,
      basicSetup.walletPassword,
      extensionId,
    )

    // Navigate to the homepage
    await page.getByRole("link", { name: "Sign in" }).click()

    // Click the connect button
    await page.getByText("Login with Metamask Wallet").click()

    // Connect MetaMask to the dapp
    await metamask.connectToDapp()

    await expect(page).toHaveURL(/.*\/profile.*/)

    console.log(await page.content())

    await expect(page.getByText("Connected Wallets")).toBeVisible()

    // await page.pause()
    // Verify the connected account address
    // from seed
    await expect(
      page.getByText("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"),
    ).toBeVisible()
  })
})
