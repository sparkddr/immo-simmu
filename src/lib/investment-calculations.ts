import { InvestmentData, CalculationResults } from '@/types/investment';

/**
 * Calcule les métriques d'investissement immobilier
 */
export function calculateInvestmentMetrics(
  data: InvestmentData,
): CalculationResults {
  const { projectCost, financing, rentalIncome, projection } = data;

  // Coût total du projet
  const totalProjectCost =
    projectCost.purchasePrice +
    projectCost.renovationWork +
    projectCost.furnishing +
    projectCost.notaryFees +
    projectCost.masteosFees +
    projectCost.bankingFees +
    projectCost.brokerageFees;

  // Revenus et charges annuels
  const monthlyNetRent = rentalIncome.monthlyRent - rentalIncome.charges;
  const annualGrossRent = rentalIncome.monthlyRent * 12;
  const annualNetRent = monthlyNetRent * 12;

  // Charges annuelles totales (nouvelles charges ajoutées)
  const totalAnnualCharges =
    rentalIncome.taxeFonciere +
    rentalIncome.chargesAnnuelles +
    rentalIncome.assuranceProprietaire;

  // Revenus après déduction des nouvelles charges
  const annualNetRentAfterCharges = annualNetRent - totalAnnualCharges;

  // Application du taux de vacance et frais de gestion
  const effectiveAnnualRent =
    annualNetRentAfterCharges *
    (1 - rentalIncome.vacancy / 100) *
    (1 - rentalIncome.management / 100);

  // Mensualité de crédit
  let monthlyPayment = 0;
  if (!financing.isCashPurchase && financing.loanAmount > 0) {
    const monthlyRate = financing.interestRate / 100 / 12;
    const numberOfPayments = financing.loanDuration * 12;
    monthlyPayment =
      (financing.loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  // Cash-flow
  const monthlyCashFlow = effectiveAnnualRent / 12 - monthlyPayment;
  const annualCashFlow = monthlyCashFlow * 12;

  // Rendements
  const grossYield = (annualGrossRent / totalProjectCost) * 100;
  const netYield = (effectiveAnnualRent / totalProjectCost) * 100;

  // Prix de revente après appréciation
  const resalePrice =
    totalProjectCost *
    Math.pow(
      1 + projection.propertyAppreciation / 100,
      projection.holdingPeriod,
    );

  // Trésorerie disponible (cash-flow cumulé sur la période)
  const availableTreasury = annualCashFlow * projection.holdingPeriod;

  // Capital restant dû
  let remainingDebt = 0;
  if (!financing.isCashPurchase && financing.loanAmount > 0) {
    const monthlyRate = financing.interestRate / 100 / 12;
    const totalPayments = financing.loanDuration * 12;
    const paymentsMade = Math.min(projection.holdingPeriod * 12, totalPayments);

    if (paymentsMade < totalPayments) {
      remainingDebt =
        (financing.loanAmount *
          (Math.pow(1 + monthlyRate, totalPayments) -
            Math.pow(1 + monthlyRate, paymentsMade))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }
  }

  // Enrichissement net
  const netEnrichment =
    resalePrice -
    remainingDebt +
    availableTreasury -
    financing.personalContribution;
  const enrichmentMultiplier =
    financing.personalContribution > 0
      ? netEnrichment / financing.personalContribution
      : 0;

  return {
    totalProjectCost,
    monthlyPayment,
    monthlyCashFlow,
    annualCashFlow,
    grossYield,
    netYield,
    availableTreasury,
    netEnrichment,
    enrichmentMultiplier,
    resalePrice: projection.resalePrice || resalePrice,
  };
}

/**
 * Calcule le rendement net simplifié en pourcentage
 */
export function calculateNetYield(
  monthlyRent: number,
  totalProjectCost: number,
  taxeFonciere: number,
  chargesAnnuelles: number,
  assuranceProprietaire: number,
  vacancy: number = 0,
  management: number = 0,
): number {
  const annualGrossRent = monthlyRent * 12;
  const totalAnnualCharges =
    taxeFonciere + chargesAnnuelles + assuranceProprietaire;
  const annualNetRent = annualGrossRent - totalAnnualCharges;
  const effectiveAnnualRent =
    annualNetRent * (1 - vacancy / 100) * (1 - management / 100);

  return (effectiveAnnualRent / totalProjectCost) * 100;
}

/**
 * Calcule le cash-flow mensuel
 */
export function calculateMonthlyCashFlow(
  monthlyRent: number,
  monthlyLoanPayment: number,
  taxeFonciere: number,
  chargesAnnuelles: number,
  assuranceProprietaire: number,
  vacancy: number = 0,
  management: number = 0,
): number {
  const monthlyCharges =
    (taxeFonciere + chargesAnnuelles + assuranceProprietaire) / 12;
  const effectiveMonthlyRent =
    monthlyRent * (1 - vacancy / 100) * (1 - management / 100);

  return effectiveMonthlyRent - monthlyCharges - monthlyLoanPayment;
}
