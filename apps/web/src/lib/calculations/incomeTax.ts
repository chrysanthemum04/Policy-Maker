// Income Tax Calculation Logic for India

export interface TaxDeductions {
  section80C: number; // PPF, ELSS, LIC, etc. (max ₹1.5L)
  section80D: number; // Health insurance (max ₹25K/50K)
  section80G: number; // Donations
  hra: number; // House Rent Allowance
  lta: number; // Leave Travel Allowance
  standardDeduction: number; // ₹50K for salaried
  homeLoanInterest: number; // Section 24 (max ₹2L)
  nps: number; // Section 80CCD(1B) (max ₹50K)
}

export interface TaxCalculationInput {
  grossIncome: number;
  regime: 'old' | 'new';
  deductions?: TaxDeductions;
  age: 'below60' | '60to80' | 'above80';
}

export interface TaxCalculationResult {
  regime: 'old' | 'new';
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number; // Section 87A
  surcharge: number;
  cess: number; // 4% health and education cess
  totalTax: number;
  effectiveRate: number;
  takeHome: number;
  breakdown: TaxBracket[];
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  taxAmount: number;
}

// Old Tax Regime Slabs (FY 2025-26)
const OLD_REGIME_SLABS: TaxBracket[] = [
  { min: 0, max: 250000, rate: 0, taxAmount: 0 },
  { min: 250000, max: 500000, rate: 5, taxAmount: 0 },
  { min: 500000, max: 1000000, rate: 20, taxAmount: 0 },
  { min: 1000000, max: null, rate: 30, taxAmount: 0 },
];

// New Tax Regime Slabs (FY 2025-26)
const NEW_REGIME_SLABS: TaxBracket[] = [
  { min: 0, max: 300000, rate: 0, taxAmount: 0 },
  { min: 300000, max: 600000, rate: 5, taxAmount: 0 },
  { min: 600000, max: 900000, rate: 10, taxAmount: 0 },
  { min: 900000, max: 1200000, rate: 15, taxAmount: 0 },
  { min: 1200000, max: 1500000, rate: 20, taxAmount: 0 },
  { min: 1500000, max: null, rate: 30, taxAmount: 0 },
];

export function calculateIncomeTax(input: TaxCalculationInput): TaxCalculationResult {
  const { grossIncome, regime, deductions, age } = input;

  // Calculate total deductions (only for old regime)
  let totalDeductions = 0;
  if (regime === 'old' && deductions) {
    totalDeductions = Math.min(
      (deductions.section80C || 0) +
      (deductions.section80D || 0) +
      (deductions.section80G || 0) +
      (deductions.nps || 0),
      grossIncome
    );
    
    // Add HRA, LTA, Standard Deduction, Home Loan Interest
    totalDeductions += (deductions.hra || 0);
    totalDeductions += (deductions.lta || 0);
    totalDeductions += (deductions.standardDeduction || 50000); // Default ₹50K
    totalDeductions += Math.min(deductions.homeLoanInterest || 0, 200000); // Max ₹2L
  } else if (regime === 'new') {
    // New regime only gets standard deduction of ₹75K (Budget 2024)
    totalDeductions = 75000;
  }

  // Calculate taxable income
  const taxableIncome = Math.max(grossIncome - totalDeductions, 0);

  // Select slabs based on regime
  const slabs = regime === 'old' ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;

  // Calculate tax for each bracket
  let taxBeforeRebate = 0;
  const breakdown: TaxBracket[] = [];

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const min = slab.min;
    const max = slab.max || Infinity;

    if (taxableIncome > min) {
      const taxableInBracket = Math.min(taxableIncome, max) - min;
      const taxAmount = (taxableInBracket * slab.rate) / 100;
      
      breakdown.push({
        min: slab.min,
        max: slab.max,
        rate: slab.rate,
        taxAmount: taxAmount,
      });

      taxBeforeRebate += taxAmount;
    }
  }

  // Section 87A Rebate (for income up to ₹7L)
  let rebate = 0;
  if (taxableIncome <= 700000) {
    rebate = Math.min(taxBeforeRebate, regime === 'new' ? 25000 : 12500);
  }

  const taxAfterRebate = Math.max(taxBeforeRebate - rebate, 0);

  // Surcharge (for income above ₹50L)
  let surcharge = 0;
  if (grossIncome > 5000000 && grossIncome <= 10000000) {
    surcharge = taxAfterRebate * 0.10; // 10%
  } else if (grossIncome > 10000000 && grossIncome <= 20000000) {
    surcharge = taxAfterRebate * 0.15; // 15%
  } else if (grossIncome > 20000000 && grossIncome <= 50000000) {
    surcharge = taxAfterRebate * 0.25; // 25%
  } else if (grossIncome > 50000000) {
    surcharge = taxAfterRebate * 0.37; // 37%
  }

  // Health and Education Cess (4%)
  const cess = (taxAfterRebate + surcharge) * 0.04;

  // Total tax
  const totalTax = Math.round(taxAfterRebate + surcharge + cess);

  // Effective rate
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  // Take home
  const takeHome = grossIncome - totalTax;

  return {
    regime,
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate: Math.round(taxBeforeRebate),
    rebate: Math.round(rebate),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTax,
    effectiveRate: parseFloat(effectiveRate.toFixed(2)),
    takeHome,
    breakdown,
  };
}

export function compareRegimes(
  grossIncome: number,
  deductions: TaxDeductions,
  age: 'below60' | '60to80' | 'above80' = 'below60'
): {
  oldRegime: TaxCalculationResult;
  newRegime: TaxCalculationResult;
  recommendation: 'old' | 'new';
  savings: number;
} {
  const oldRegime = calculateIncomeTax({ grossIncome, regime: 'old', deductions, age });
  const newRegime = calculateIncomeTax({ grossIncome, regime: 'new', age });

  const recommendation = oldRegime.totalTax < newRegime.totalTax ? 'old' : 'new';
  const savings = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  return {
    oldRegime,
    newRegime,
    recommendation,
    savings,
  };
}
