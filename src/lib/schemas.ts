import { z } from 'zod';

export const projectCostSchema = z.object({
  purchasePrice: z
    .number()
    .min(10000, { message: "Le prix d'achat doit être supérieur à 10 000€" })
    .max(5000000, { message: "Le prix d'achat ne peut excéder 5 000 000€" }),
  renovationWork: z
    .number()
    .min(0, { message: 'Les travaux ne peuvent être négatifs' })
    .max(1000000, { message: 'Les travaux ne peuvent excéder 1 000 000€' }),
  furnishing: z
    .number()
    .min(0, { message: "L'ameublement ne peut être négatif" })
    .max(100000, { message: "L'ameublement ne peut excéder 100 000€" }),
  notaryFees: z
    .number()
    .min(0, { message: 'Les frais de notaire ne peuvent être négatifs' }),
  masteosFees: z
    .number()
    .min(0, { message: 'Les frais Masteos ne peuvent être négatifs' }),
  bankingFees: z
    .number()
    .min(0, { message: 'Les frais bancaires ne peuvent être négatifs' }),
  brokerageFees: z
    .number()
    .min(0, { message: 'Les frais de courtage ne peuvent être négatifs' }),
});

export const financingSchema = z.object({
  personalContribution: z
    .number()
    .min(0, { message: "L'apport ne peut être négatif" }),
  loanAmount: z
    .number()
    .min(0, { message: 'Le montant emprunté ne peut être négatif' }),
  interestRate: z
    .number()
    .min(0.1, { message: "Le taux d'intérêt doit être supérieur à 0.1%" })
    .max(15, { message: "Le taux d'intérêt ne peut excéder 15%" }),
  loanDuration: z
    .number()
    .min(5, { message: 'La durée minimum est de 5 ans' })
    .max(30, { message: 'La durée maximum est de 30 ans' }),
  isCashPurchase: z.boolean(),
});

export const rentalIncomeSchema = z.object({
  monthlyRent: z
    .number()
    .min(200, { message: 'Le loyer doit être supérieur à 200€' })
    .max(10000, { message: 'Le loyer ne peut excéder 10 000€' }),
  charges: z
    .number()
    .min(0, { message: 'Les charges ne peuvent être négatives' }),
  vacancy: z
    .number()
    .min(0, { message: 'Le taux de vacance ne peut être négatif' })
    .max(50, { message: 'Le taux de vacance ne peut excéder 50%' }),
  management: z
    .number()
    .min(0, { message: 'Les frais de gestion ne peuvent être négatifs' })
    .max(30, { message: 'Les frais de gestion ne peuvent excéder 30%' }),
  taxeFonciere: z
    .number()
    .min(0, { message: 'La taxe foncière ne peut être négative' })
    .max(10000, { message: 'La taxe foncière ne peut excéder 10 000€' }),
  chargesAnnuelles: z
    .number()
    .min(0, { message: 'Les charges annuelles ne peuvent être négatives' })
    .max(20000, { message: 'Les charges annuelles ne peuvent excéder 20 000€' }),
  assuranceProprietaire: z
    .number()
    .min(0, { message: 'L\'assurance propriétaire ne peut être négative' })
    .max(5000, { message: 'L\'assurance propriétaire ne peut excéder 5 000€' }),
});

export const projectionSchema = z.object({
  holdingPeriod: z
    .number()
    .min(1, { message: 'La durée de détention minimum est de 1 an' })
    .max(50, { message: 'La durée de détention maximum est de 50 ans' }),
  propertyAppreciation: z
    .number()
    .min(-10, { message: "L'évolution ne peut être inférieure à -10%" })
    .max(20, { message: "L'évolution ne peut excéder 20%" }),
  rentIncrease: z
    .number()
    .min(0, { message: "L'augmentation du loyer ne peut être négative" })
    .max(15, { message: "L'augmentation du loyer ne peut excéder 15%" }),
  resalePrice: z
    .number()
    .min(0, { message: 'Le prix de revente ne peut être négatif' }),
});

export const investmentSchema = z.object({
  projectCost: projectCostSchema,
  financing: financingSchema,
  rentalIncome: rentalIncomeSchema,
  projection: projectionSchema,
});
