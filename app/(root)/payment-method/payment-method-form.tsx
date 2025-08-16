"use client";

import { FC, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { ArrowRight, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { paymentMethodSchema } from "@/lib/validators";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.action";

type PaymentMethodFormProps = {
  preferredPaymentMethod: string | null;
};

const PaymentMethodForm: FC<PaymentMethodFormProps> = ({
  preferredPaymentMethod,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);
      if (!res.success) {
        toast.error("Failed to update payment method");
        return;
      }
      router.push("/place-order");
    });
  };

  return (
    <div className="max-w-md space-y-4 mx-auto">
      <h1 className="mt-4 h2-bold">Payment Method</h1>
      <p className="text-sm text-muted-foreground">
        Please enter your payment method details below.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flrex-col space-y-2"
                    >
                      {PAYMENT_METHODS.map((paymentMethod) => (
                        <FormItem
                          key={paymentMethod}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={paymentMethod}
                              checked={field.value === paymentMethod}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {paymentMethod}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}{" "}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;
