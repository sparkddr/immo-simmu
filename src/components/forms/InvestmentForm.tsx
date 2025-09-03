'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import InvestmentChart from '@/components/charts/InvestmentChart';

// Schéma pour le formulaire
const formSchema = z.object({
  // Coût du projet
  purchasePrice: z.number().min(10000).max(5000000),
  renovationWork: z.number().min(0).max(1000000),
  furnishing: z.number().min(0).max(100000),
  notaryFeesPercent: z.number().min(0).max(15),

  // Financement
  personalContribution: z.number().min(0),
  interestRate: z.number().min(0).max(15),
  loanDuration: z.number().min(5).max(30),

  // Revenus locatifs
  monthlyRent: z.number().min(200).max(10000),

  // Projection
  holdingPeriod: z.number().min(1).max(50),
  propertyAppreciation: z.number().min(-10).max(20),
});

type FormValues = z.infer<typeof formSchema>;

export default function InvestmentForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasePrice: 110000,
      renovationWork: 20000,
      furnishing: 7338,
      notaryFeesPercent: 7.5,
      personalContribution: 23844,
      interestRate: 3.4,
      loanDuration: 20,
      monthlyRent: 800,
      holdingPeriod: 10,
      propertyAppreciation: 3.4,
    },
  });

  const watchedValues = form.watch();

  // Frais de notaire calculés
  const notaryFees = Math.round(
    (watchedValues.purchasePrice * watchedValues.notaryFeesPercent) / 100,
  );

  // Calculs de base
  const totalProjectCost =
    watchedValues.purchasePrice +
    watchedValues.renovationWork +
    watchedValues.furnishing +
    notaryFees;
  const loanAmount = Math.max(
    0,
    totalProjectCost - watchedValues.personalContribution,
  );
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    watchedValues.interestRate,
    watchedValues.loanDuration,
  );
  const monthlyCashFlow = watchedValues.monthlyRent - monthlyPayment;
  const annualCashFlow = monthlyCashFlow * 12;
  const grossYield = ((watchedValues.monthlyRent * 12) / totalProjectCost) * 100;

  // Calculs avancés pour la projection
  const resalePrice =
    watchedValues.purchasePrice *
    Math.pow(
      1 + watchedValues.propertyAppreciation / 100,
      watchedValues.holdingPeriod,
    );
  const remainingLoan = calculateRemainingLoan(
    loanAmount,
    watchedValues.interestRate,
    watchedValues.loanDuration,
    watchedValues.holdingPeriod,
  );
  const totalCashFlowOverPeriod = annualCashFlow * watchedValues.holdingPeriod;
  const capitalGain = resalePrice - watchedValues.purchasePrice;

  // Trésorerie disponible = Prix de revente - Capital restant dû + Cash-flows cumulés
  const availableTreasury =
    resalePrice - remainingLoan + totalCashFlowOverPeriod;

  // Enrichissement net = Trésorerie disponible - Apport personnel
  const netEnrichment = availableTreasury - watchedValues.personalContribution;

  const enrichmentMultiplier =
    watchedValues.personalContribution > 0
      ? netEnrichment / watchedValues.personalContribution
      : 0;

  function calculateMonthlyPayment(
    amount: number,
    rate: number,
    years: number,
  ): number {
    if (amount <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) {
      return amount / numPayments;
    }
    return (
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  }

  function calculateRemainingLoan(
    principal: number,
    rate: number,
    totalYears: number,
    elapsedYears: number,
  ): number {
    if (principal <= 0 || elapsedYears >= totalYears) return 0;
    const monthlyRate = rate / 100 / 12;
    const elapsedPayments = elapsedYears * 12;
    const monthlyPayment = calculateMonthlyPayment(principal, rate, totalYears);

    let balance = principal;
    for (let i = 0; i < elapsedPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
    }
    return Math.max(0, balance);
  }

  function onSubmit(values: FormValues) {
    console.log('Données du formulaire:', values);
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Coût du projet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Coût du projet
              </CardTitle>
              <CardDescription>
                Définissez tous les coûts liés à votre investissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Prix de vente FAI: {formatCurrency(field.value)}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={50000}
                        max={500000}
                        step={5000}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="renovationWork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Travaux: {formatCurrency(field.value)}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100000}
                        step={1000}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnishing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ameublement: {formatCurrency(field.value)}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={30000}
                        step={500}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Frais de notaire uniquement (pourcentage) */}
              <FormField
                control={form.control}
                name="notaryFeesPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Frais de notaire: {formatPercentage(field.value)} ({
                        formatCurrency(notaryFees)
                      })
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={12}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Pourcentage appliqué sur le prix d&apos;achat.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Frais de notaire (calculés)</span>
                  <span>{formatCurrency(notaryFees)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Coût total du projet</span>
                  <span className="text-xl">
                    {formatCurrency(totalProjectCost)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Financement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Financement
              </CardTitle>
              <CardDescription>
                Configurez votre plan de financement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="personalContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apport: {formatCurrency(field.value)}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={totalProjectCost}
                        step={1000}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Montant emprunté: {formatCurrency(loanAmount)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Taux d&apos;intérêt: {formatPercentage(field.value)}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={8}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loanDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée du prêt: {field.value} ans</FormLabel>
                    <FormControl>
                      <Slider
                        min={5}
                        max={30}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Mensualité de crédit:</span>
                  <span className="font-semibold">
                    {formatCurrency(monthlyPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cash-flow mensuel:</span>
                  <span
                    className={`font-semibold ${
                      monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(monthlyCashFlow)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Revenus locatifs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏠 Revenus locatifs
              </CardTitle>
              <CardDescription>
                Estimez vos revenus locatifs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="monthlyRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loyer mensuel: {formatCurrency(field.value)}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={300}
                        max={2000}
                        step={25}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Rendement brut:</span>
                  <span className="font-semibold">
                    {formatPercentage(grossYield)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Revenus annuels:</span>
                  <span className="font-semibold">
                    {formatCurrency(watchedValues.monthlyRent * 12)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cash-flow annuel:</span>
                  <span
                    className={`font-semibold ${
                      annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(annualCashFlow)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Projection de rentabilité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Projection de rentabilité
              </CardTitle>
              <CardDescription>
                Projection sur la durée de détention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="holdingPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée de détention: {field.value} ans</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={30}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyAppreciation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Évolution annuelle du prix du bien: {formatPercentage(
                        field.value,
                      )}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Évolution annuelle moyenne du foncier constatée les 5
                      dernières années: {formatPercentage(4.0)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Résultats de projection */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Trésorerie disponible */}
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    {formatCurrency(availableTreasury)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Trésorerie disponible l&apos;année de revente
                  </div>
                </div>

                {/* Enrichissement net */}
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    {formatCurrency(netEnrichment)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Enrichissement net à {watchedValues.holdingPeriod} ans
                  </div>
                </div>

                {/* Coefficient d'enrichissement */}
                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-700 mb-2">
                    x {enrichmentMultiplier.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Coefficient d&apos;enrichissement
                  </div>
                </div>

                {/* Prix de revente */}
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {formatCurrency(resalePrice)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Prix de revente estimé
                  </div>
                </div>
              </div>

              {/* Détails supplémentaires */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Capital restant dû à la revente:</span>
                  <span className="font-semibold">
                    {formatCurrency(remainingLoan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Plus-value immobilière:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(capitalGain)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Cash-flow total sur {watchedValues.holdingPeriod} ans:
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(totalCashFlowOverPeriod)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Graphique d'évolution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Évolution en fonction des années
              </CardTitle>
              <CardDescription>
                Visualisation de l&apos;évolution de votre investissement sur 30
                ans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvestmentChart
                purchasePrice={watchedValues.purchasePrice}
                personalContribution={watchedValues.personalContribution}
                loanAmount={loanAmount}
                interestRate={watchedValues.interestRate}
                loanDuration={watchedValues.loanDuration}
                annualCashFlow={annualCashFlow}
                propertyAppreciation={watchedValues.propertyAppreciation}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Sauvegarder la simulation
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Réinitialiser
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
