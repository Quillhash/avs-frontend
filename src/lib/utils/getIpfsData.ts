export const fetchIpfsData = async (ipfsHash: string) => {
  try {
    const response = await fetch(getIpfsLink(ipfsHash))
    if (!response.ok) throw new Error("Failed to fetch IPFS data")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching IPFS data:", error)
    return null
  }
}

const getIpfsLink = (ipfsHash: string) => {
  return `https://ipfs.io/ipfs/${ipfsHash}`
}
