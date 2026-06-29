import { Lock } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Props = {
  onLogin: (username: string, password: string) => Promise<void>;
};

export function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('mediscan-local');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-ink dark:bg-zinc-950 dark:text-zinc-100">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-md bg-clinical p-2 text-white"><Lock size={20} /></div>
          <div>
            <h1 className="text-xl font-semibold">MediScan AI</h1>
            <p className="text-sm text-zinc-500">Local offline access</p>
          </div>
        </div>
        <label className="text-sm font-medium">Username</label>
        <input className="mt-1 w-full rounded-md border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label className="mt-4 block text-sm font-medium">Password</label>
        <input className="mt-1 w-full rounded-md border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mt-3 text-sm text-alert">{error}</p>}
        <button className="mt-5 w-full rounded-md bg-clinical px-4 py-2 font-medium text-white">Sign in</button>
      </form>
    </main>
  );
}
