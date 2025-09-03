import InvestmentForm from '@/components/forms/InvestmentForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-center text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Simulateur d&apos;Investissement Immobilier
        </h1>
        <InvestmentForm />
      </div>
    </main>
  );
}
