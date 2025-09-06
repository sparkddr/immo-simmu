export interface ProjectCost {
  purchasePrice: number; // Prix de vente FAI
  renovationWork: number; // Travaux
  furnishing: number; // Ameublement
  notaryFees: number; // Frais de notaire
  masteosFees: number; // Frais Masteos
  bankingFees: number; // Frais bancaires
  brokerageFees: number; // Frais de courtage
}

export interface Financing {
  personalContribution: number; // Apport personnel
  loanAmount: number; // Montant emprunté
  interestRate: number; // Taux d'intérêt (en %)
  loanDuration: number; // Durée du prêt (en années)
  isCashPurchase: boolean; // Achat 100% cash
}

export interface RentalIncome {
  monthlyRent: number; // Loyer mensuel
  charges: number; // Charges mensuelles
  vacancy: number; // Taux de vacance (en %)
  management: number; // Frais de gestion (en %)
  taxeFonciere: number; // Taxe foncière annuelle
  chargesAnnuelles: number; // Charges annuelles (copropriété, etc.)
  assuranceProprietaire: number; // Assurance propriétaire annuelle
}

export interface Projection {
  holdingPeriod: number; // Durée de détention (en années)
  propertyAppreciation: number; // Évolution annuelle du prix du bien (en %)
  rentIncrease: number; // Augmentation annuelle du loyer (en %)
  resalePrice: number; // Prix de revente estimé
}

export interface InvestmentData {
  projectCost: ProjectCost;
  financing: Financing;
  rentalIncome: RentalIncome;
  projection: Projection;
}

export interface CalculationResults {
  totalProjectCost: number; // Coût total du projet
  monthlyPayment: number; // Mensualité de crédit
  monthlyCashFlow: number; // Cash-flow mensuel
  annualCashFlow: number; // Cash-flow annuel
  grossYield: number; // Rendement brut
  netYield: number; // Rendement net
  availableTreasury: number; // Trésorerie disponible l'année de revente
  netEnrichment: number; // Enrichissement net à 10 ans
  enrichmentMultiplier: number; // Coefficient d'enrichissement
}
