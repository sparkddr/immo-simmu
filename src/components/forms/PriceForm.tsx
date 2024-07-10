'use client'
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { z } from "zod" 


export default function PriceForm  () {


const formSchema = z.object({
    price: z.number().min(4, {message : "Merci de renseigner un montant superieur à 1000€"}).max(20),
})

const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 0,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }


    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Coût du projet</Label>
            <Input></Input>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coût du projet</FormLabel>
              <FormControl>
                <Input placeholder="200000" {...field} />
              </FormControl>
              <FormDescription>
                Veuillez renseigner le montant total du projet.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
        </div>
    );

}


