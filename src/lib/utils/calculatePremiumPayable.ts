const calculateRiskScore = (riskPercentage?: number) => {
  return (riskPercentage || 0) / 100
}

export const calculatePremiumPayable = (
  coverageAmount?: number,
  durationInMonth?: number,
  riskPercentage?: number
) => {
  if (!coverageAmount || !durationInMonth) return undefined

  const riskScore = calculateRiskScore(riskPercentage)

  return Number.parseFloat(
    (coverageAmount * riskScore * (durationInMonth / 12)).toFixed(8)
  )
}
