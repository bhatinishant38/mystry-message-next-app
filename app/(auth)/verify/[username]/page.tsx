import { Suspense } from "react";
import VerifyForm from "./VerifyForm";

export default function VerifyPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense fallback={<VerifyPageFallback />}>
      {params.then(({ username }) => (
        <VerifyForm username={username} />
      ))}
    </Suspense>
  );
}

function VerifyPageFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md animate-pulse space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div className="mx-auto h-10 w-64 rounded bg-gray-200" />
        <div className="h-4 rounded bg-gray-200" />
        <div className="h-10 rounded bg-gray-200" />
        <div className="h-10 rounded bg-gray-300" />
      </div>
    </main>
  );
}
