export const fetchIpfsData = async (ipfsHash: string) => {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
      if (!response.ok) throw new Error("Failed to fetch IPFS data");
      return JSON.parse(await response.text());
    } catch (error) {
      console.error("Error fetching IPFS data:", error);
      return null;
    }
  }