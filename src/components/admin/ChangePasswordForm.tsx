import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function ChangePasswordForm() {
  const [form, setForm] = useState({
    newPassword: '',
    confirm: '',
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(form.newPassword);
  const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['bg-destructive', 'bg-destructive', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: form.newPassword });
      if (error) throw error;
      toast.success('Password updated successfully');
      setDone(true);
      setForm({ newPassword: '', confirm: '' });
      setTimeout(() => setDone(false), 4000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
        <KeyRound className="size-5 text-muted-foreground shrink-0" />
        <p className="text-sm font-body text-muted-foreground leading-relaxed">
          Your password is managed by Supabase Auth. After changing it, you'll automatically stay logged in.
        </p>
      </div>

      {done && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
          <ShieldCheck className="size-4 shrink-0" />
          <p className="text-sm font-body font-medium">Password changed successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">New Password</Label>
          <div className="relative">
            <Input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
              className="font-body pr-10"
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {/* Strength bar */}
          {form.newPassword.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? strengthColor : 'bg-border'}`}
                  />
                ))}
              </div>
              <p className={`text-[11px] font-body ${strengthColor.replace('bg-', 'text-')}`}>
                {strengthLabel}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Confirm New Password</Label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              className={`font-body pr-10 ${form.confirm && form.confirm !== form.newPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              placeholder="Repeat new password"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.confirm && form.confirm !== form.newPassword && (
            <p className="text-[11px] font-body text-destructive">Passwords do not match</p>
          )}
        </div>

        <Button
          type="submit"
          className="font-body"
          disabled={saving || !form.newPassword || !form.confirm}
        >
          {saving && <Loader2 className="size-4 animate-spin mr-2" />}
          <KeyRound className="size-4 mr-1" />
          Update Password
        </Button>
      </form>
    </div>
  );
}
