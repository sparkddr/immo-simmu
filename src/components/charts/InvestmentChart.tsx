'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface InvestmentChartProps {
  purchasePrice: number;
  personalContribution: number;
  loanAmount: number;
  interestRate: number;
  loanDuration: number;
  annualCashFlow: number;
  propertyAppreciation: number;
}

export default function InvestmentChart({
  purchasePrice,
  personalContribution,
  loanAmount,
  interestRate,
  loanDuration,
  annualCashFlow,
  propertyAppreciation,
}: InvestmentChartProps) {
  // Fonction pour calculer le capital restant dû
  function calculateRemainingLoan(
    principal: number,
    rate: number,
    totalYears: number,
    elapsedYears: number,
  ): number {
    if (principal <= 0 || elapsedYears >= totalYears) return 0;
    const monthlyRate = rate / 100 / 12;
    const elapsedPayments = elapsedYears * 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalYears * 12)) /
      (Math.pow(1 + monthlyRate, totalYears * 12) - 1);

    let balance = principal;
    for (let i = 0; i < elapsedPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
    }
    return Math.max(0, balance);
  }

  // Générer les données pour le graphique (1 à 30 ans)
  const chartData = [];
  for (let year = 1; year <= 30; year++) {
    const propertyValue =
      purchasePrice * Math.pow(1 + propertyAppreciation / 100, year);
    const remainingLoan = calculateRemainingLoan(
      loanAmount,
      interestRate,
      loanDuration,
      year,
    );
    const totalCashFlow = annualCashFlow * year;
    const availableTreasury = propertyValue - remainingLoan + totalCashFlow;
    const netEnrichment = availableTreasury - personalContribution;

    chartData.push({
      year,
      propertyValue: Math.round(propertyValue),
      availableTreasury: Math.round(availableTreasury),
      netEnrichment: Math.round(netEnrichment),
    });
  }

  const formatTooltip = (value: number, name: string) => {
    const labels: { [key: string]: string } = {
      propertyValue: 'Prix du bien',
      availableTreasury: 'Trésorerie disponible',
      netEnrichment: 'Enrichissement net',
    };
    return [formatCurrency(value), labels[name] || name];
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            label={{ value: 'Années', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            label={{ value: 'Valeur (€)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(year) => `Année ${year}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="propertyValue"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Prix du bien"
            dot={{ fill: '#3b82f6' }}
          />
          <Line
            type="monotone"
            dataKey="availableTreasury"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Trésorerie disponible"
            dot={{ fill: '#8b5cf6' }}
          />
          <Line
            type="monotone"
            dataKey="netEnrichment"
            stroke="#10b981"
            strokeWidth={2}
            name="Enrichissement net"
            dot={{ fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
