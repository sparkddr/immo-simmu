"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMemo } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateNetYield, calculateMonthlyCashFlow } from "@/lib/investment-calculations";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

export default function PriceForm() {
    const formSchema = z.object({
        price: z
            .number()
            .min(4, { message: "Merci de renseigner un montant superieur à 1000€" })
            .max(20),
        rent: z
            .number()
            .min(2, { message: "Merci de renseigner un montant superieur à 10€" })
            .max(20),
        taxeFonciere: z
            .number()
            .min(0, { message: "La taxe foncière ne peut être négative" })
            .max(10000, { message: "La taxe foncière ne peut excéder 10 000€" }),
        chargesAnnuelles: z
            .number()
            .min(0, { message: "Les charges annuelles ne peuvent être négatives" })
            .max(20000, { message: "Les charges annuelles ne peuvent excéder 20 000€" }),
        assuranceProprietaire: z
            .number()
            .min(0, { message: "L'assurance propriétaire ne peut être négative" })
            .max(5000, { message: "L'assurance propriétaire ne peut excéder 5 000€" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: 0,
            rent: 0,
            taxeFonciere: 0,
            chargesAnnuelles: 0,
            assuranceProprietaire: 0,
        },
    });

    const formValues = form.watch();

    const calculatedResults = useMemo(() => {
        if (!formValues.price || !formValues.rent) {
            return null;
        }

        const netYield = calculateNetYield(
            formValues.rent,
            formValues.price,
            formValues.taxeFonciere || 0,
            formValues.chargesAnnuelles || 0,
            formValues.assuranceProprietaire || 0
        );

        const monthlyCashFlow = calculateMonthlyCashFlow(
            formValues.rent,
            0, // Pas de crédit pour ce calcul simplifié
            formValues.taxeFonciere || 0,
            formValues.chargesAnnuelles || 0,
            formValues.assuranceProprietaire || 0
        );

        return {
            netYield,
            monthlyCashFlow,
            annualCashFlow: monthlyCashFlow * 12,
            grossYield: ((formValues.rent * 12) / formValues.price) * 100
        };
    }, [formValues]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div className="grid w-full max-w-4xl mx-auto gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du bien</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Coût du projet</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="200000" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Veuillez renseigner le montant total du projet.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loyer mensuel du bien</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="800" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Montant du loyer mensuel hors charges.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="taxeFonciere"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Taxe foncière annuelle</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1200" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Montant annuel de la taxe foncière.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="chargesAnnuelles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Charges annuelles</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="800" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Charges de copropriété et autres frais annuels.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="assuranceProprietaire"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assurance propriétaire annuelle</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="300" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Coût annuel de l&apos;assurance propriétaire non occupant.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {calculatedResults && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Résultats de simulation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Rendement brut</p>
                                    <p className="text-lg font-semibold">
                                        {formatPercentage(calculatedResults.grossYield)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Rendement net</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        {formatPercentage(calculatedResults.netYield)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="border-t pt-4">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Cash-flow mensuel</span>
                                        <span className={`font-medium ${calculatedResults.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(calculatedResults.monthlyCashFlow)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Cash-flow annuel</span>
                                        <span className={`font-medium ${calculatedResults.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(calculatedResults.annualCashFlow)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
