import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { getApiErrorMessage } from '@/lib/api';
import { login } from '../admin.api';

const loginSchema = z.object({
  password: z.string().min(1, 'Informe a senha.'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values.password);
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Nao foi possivel entrar.'));
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-sm"
    >
      <div className="panel p-8">
        <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-bg-subtle text-neon [box-shadow:var(--shadow-neon-border)]">
          <Icon name="lock" className="size-6" />
        </span>

        <h1 className="text-center font-display text-xl font-extrabold">Area administrativa</h1>
        <p className="mt-2 mb-6 text-center text-sm font-light text-fg-muted">
          Informe a senha para gerenciar os projetos.
        </p>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[0.8rem] font-medium text-fg-muted">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="rounded-lg border border-line bg-bg-subtle px-4 py-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-subtle focus:border-neon/50 focus:[box-shadow:var(--shadow-accent-border-soft)]"
              placeholder="Senha do administrador"
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="text-[0.8rem] text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="flex items-center gap-2 text-[0.8rem] text-danger">
              <Icon name="alert" className="size-4 shrink-0" />
              {serverError}
            </p>
          )}

          <Button type="submit" variant="primary" isLoading={isSubmitting} className="group w-full">
            Entrar
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
