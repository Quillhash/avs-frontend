const SECONDS_IN_YEAR = 31_536_000_000

const calculateDurationInMS = (durationInMonth: number) => {
  return durationInMonth * 30 * 24 * 60 * 60 * 1000
}

const calculateRiskScore = (securityPercentage?: number) => {
  return (100 - (securityPercentage || 0)) / 100
}

export const calculatePremiumPayable = (
  coverageAmount?: number,
  durationInMonth?: number,
  securityScore?: number
) => {
  if (!coverageAmount || !durationInMonth) return undefined

  const riskScore = calculateRiskScore(securityScore)
  const durationInMS = calculateDurationInMS(durationInMonth)

  return Number.parseFloat(
    (coverageAmount * riskScore * (durationInMS / SECONDS_IN_YEAR)).toFixed(8)
  )
}
