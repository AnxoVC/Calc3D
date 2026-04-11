export interface CalculationInputs {
  weightG: number
  pricePerKg: number
  spoolWeightG: number
  timeHours: number
  wattage: number
  kwhPrice: number
  amortizationPerHour?: number
  laborPerHour?: number
  laborTimeHours?: number
  marginPercent?: number
}

export interface CalculationResult {
  materialCost: number
  electricityCost: number
  amortizationCost: number
  laborCost: number
  subtotal: number
  margin: number
  total: number
}

export function calculate(inputs: CalculationInputs): CalculationResult {
  const {
    weightG,
    pricePerKg,
    timeHours,
    wattage,
    kwhPrice,
    amortizationPerHour = 0,
    laborPerHour = 0,
    laborTimeHours,
    marginPercent = 0,
  } = inputs

  const materialCost = (weightG / 1000) * pricePerKg
  const electricityCost = (wattage / 1000) * timeHours * kwhPrice
  const amortizationCost = amortizationPerHour * timeHours
  const laborCost = laborPerHour * (laborTimeHours !== undefined ? laborTimeHours : timeHours)

  const subtotal = materialCost + electricityCost + amortizationCost + laborCost
  const margin = subtotal * (marginPercent / 100)
  const total = subtotal + margin

  return {
    materialCost: round(materialCost),
    electricityCost: round(electricityCost),
    amortizationCost: round(amortizationCost),
    laborCost: round(laborCost),
    subtotal: round(subtotal),
    margin: round(margin),
    total: round(total),
  }
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000
}
