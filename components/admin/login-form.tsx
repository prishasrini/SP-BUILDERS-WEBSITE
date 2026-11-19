'use client';

import { useActionState } from 'react';
import { Lock } from 'lucide-react';
import { login } from '@/app/admin/actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return <form className="admin-card admin-login" action={action}>
    <span className="admin-login-icon"><Lock size={22} aria-hidden="true" /></span>
    <h1>SP Builders admin</h1>
    <p>Log in to edit the website text and projects.</p>
    <label htmlFor="password">Password</label>
    <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
    {state?.error && <p className="admin-error" role="alert">{state.error}</p>}
    <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>{pending ? 'Checking…' : 'Log in'}</button>
  </form>;
}
