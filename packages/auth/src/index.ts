import {
  createNewUser,
  githubLogin,
  googleLogin,
  signOutAction,
} from "./actions"
import { AuthButton } from "./components"
import { LogoutButton } from "./components"
import { auth, authOptions, handlers, signIn, signOut } from "./nextAuth"

export {
  createNewUser,
  AuthButton,
  LogoutButton,
  authOptions,
  auth,
  handlers,
  signIn,
  signOut,
  signOutAction,
  googleLogin,
  githubLogin,
}
