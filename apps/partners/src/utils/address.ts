export function cleanAddress(addr: string) {
  if (addr.startsWith("ethereum:")) {
    return addr.replace(/^ethereum:/, "").split("@")[0]
  }
  if (addr.includes("@")) {
    return addr.split("@")[0]
  }
  // If the address is already clean, return it as is
  return addr
}
