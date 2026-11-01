"use client";

import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "@/components/ui/toast";
import { VerifySchema } from "@/Schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast.add({
        title: "Success",
        description: response.data.message,
        type: "success",
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Verification failed",
        description:
          axiosError.response?.data.message ?? "Something went wrong.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Verify Your Account
          </h1>
          <p className="mb-4">
            Enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field.Root name={field.name} invalid={fieldState.invalid}>
                <Field.Label
                  htmlFor="form-verification-code"
                  className="mb-1 block text-sm font-medium"
                >
                  Verification code
                </Field.Label>
                <Input
                  {...field}
                  id="form-verification-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="Enter your 6-digit code"
                  aria-invalid={fieldState.invalid}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
                {fieldState.error && (
                  <Field.Error match className="text-sm text-red-600">
                    {fieldState.error.message}
                  </Field.Error>
                )}
              </Field.Root>
            )}
          />

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Verifying..." : "Verify account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
