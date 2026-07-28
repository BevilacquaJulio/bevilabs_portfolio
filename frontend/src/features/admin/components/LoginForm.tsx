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
      className="mx-auto w-full max-w-[23rem]"
    >
      <div className="panel edge-top overflow-hidden p-8">
        <div className="mb-7 flex flex-col items-center text-center">
          {/* Sem glow em elemento com z-index negativo: ele ficaria atras do
              fundo do .panel, que nao cria stacking context proprio. O brilho
              vem do proprio box-shadow. */}
          <span className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-neon/20 bg-bg-subtle text-neon [box-shadow:0_0_0_1px_rgba(0,240,255,0.18),0_0_24px_rgba(0,240,255,0.22)]">
            <Icon name="lock" className="size-6" />
          </span>

          <h1 className="font-display text-xl font-extrabold tracking-[-0.02em]">
            Area administrativa
          </h1>
          <p className="mt-2 text-sm font-light text-fg-muted">
            Informe a senha para gerenciar os projetos.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[0.7rem] font-semibold tracking-[0.12em] text-fg-subtle uppercase"
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="field"
              placeholder="Senha do administrador"
              {...register('password')}
            />

            {errors.password && (
              <p id="password-error" role="alert" className="text-[0.78rem] text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-danger/25 bg-danger/8 px-3 py-2.5 text-[0.78rem] leading-snug text-danger"
            >
              <Icon name="alert" className="mt-px size-4 shrink-0" />
              {serverError}
            </motion.p>
          )}

          <Button type="submit" variant="primary" isLoading={isSubmitting} className="group w-full">
            Entrar
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
