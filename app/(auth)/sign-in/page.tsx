"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "@/components/ui/toast";
import { SignInSchema } from "@/Schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (!result || result.error) {
        toast.add({
          title: "Sign in failed",
          description: "Incorrect email or password.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Signed in",
        description: "Welcome back.",
        type: "success",
      });
      router.replace("/dashboard");
      router.refresh();
    } catch {
      toast.add({
        title: "Sign in failed",
        description: "Unable to sign in right now. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome back
          </h1>
          <p className="mb-4">Sign in to continue to Mystery Message</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field.Root name={field.name} invalid={fieldState.invalid}>
                <Field.Label
                  htmlFor="form-identifier"
                  className="mb-1 block text-sm font-medium"
                >
                  Email or username
                </Field.Label>
                <Input
                  {...field}
                  id="form-identifier"
                  type="text"
                  placeholder="you@example.com or username"
                  autoComplete="username"
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

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field.Root name={field.name} invalid={fieldState.invalid}>
                <Field.Label
                  htmlFor="form-password"
                  className="mb-1 block text-sm font-medium"
                >
                  Password
                </Field.Label>
                <Input
                  {...field}
                  id="form-password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center text-sm text-gray-600">
            <span>Do not have an account? </span>
            <Link
              href="/sign-up"
              className="font-semibold text-black underline-offset-4 transition-colors hover:text-gray-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;