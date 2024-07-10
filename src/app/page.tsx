import PriceForm from "@/components/forms/PriceForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  p-24">
      <h1 className="text-center text-2xl">Immo Simmulator</h1>
      <PriceForm/>
    </main>
  );
}
