"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { Controller, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "@/components/ui/toast";
import { SignUpSchema } from "@/Schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!debouncedUsername) {
      setUsernameMessage("");
      setIsCheckingUsername(false);
      return;
    }

    const controller = new AbortController();

    const checkUsernameUnique = async () => {
      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${encodeURIComponent(debouncedUsername)}`,
          { signal: controller.signal }
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingUsername(false);
        }
      }
    };

    void checkUsernameUnique();

    return () => controller.abort();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.add({
        title: response.data.message || "Account created successfully",
        description: "You can now sign in to continue.",
        type: "success",
        timeout: 5000,
      });
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Sign up failed",
        description: axiosError.response?.data.message ?? "Something went wrong.",
        type: "error",
        timeout: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field.Root name={field.name} invalid={fieldState.invalid}>
                <Field.Label
                  htmlFor="form-username"
                  className="mb-1 block text-sm font-medium"
                >
                  Username
                </Field.Label>
                <Input
                  {...field}
                  id="form-username"
                  placeholder="your_username"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  onChange={(event) => {
                    field.onChange(event);
                    setUsername(event.target.value);
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <Field.Description className="text-sm text-gray-500">
                  This is your public display name
                </Field.Description>
                {fieldState.error && (
                  <Field.Error match className="text-sm text-red-600">
                    {fieldState.error.message}
                  </Field.Error>
                )}
                {!fieldState.invalid && usernameMessage && (
                  <p className="text-sm text-gray-600">{usernameMessage}</p>
                )}
                {isCheckingUsername && (
                  <p className="text-sm text-gray-500">Checking username...</p>
                )}
              </Field.Root>                 
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field.Root name={field.name} invalid={fieldState.invalid}>
                <Field.Label
                  htmlFor="form-email"
                  className="mb-1 block text-sm font-medium"
                >
                  Email
                </Field.Label>
                <Input
                  {...field}
                  id="form-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
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
                  autoComplete="new-password"
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
            disabled={isSubmitting || isCheckingUsername}
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <div className="text-center text-sm text-gray-600">
            <span>Already have an account? </span>
            <Link
              href="/sign-in"
              className="font-semibold text-black underline-offset-4 transition-colors hover:text-gray-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;