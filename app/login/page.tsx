import { signInAction } from "@/app/lib/auth/actions";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <main
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#00101A" }}
    >
      <div
        className="w-full max-w-sm rounded-lg p-8"
        style={{ backgroundColor: "#001A2B", border: "1px solid #0e3a52" }}
      >
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Sign In
        </h1>

        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}

function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <form action={signInAction} className="flex flex-col gap-4">
      {/* Pass callbackUrl through to the server action for post-login redirect */}
      {callbackUrl && (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-gray-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="rounded px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: "#002233", border: "1px solid #0e3a52" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-gray-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="rounded px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: "#002233", border: "1px solid #0e3a52" }}
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded px-4 py-2 text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-75"
        style={{ backgroundColor: "#0070f3" }}
      >
        Sign In
      </button>
    </form>
  );
}
