import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { MagneticButton } from '@/components/MagneticButton';
import { getApiErrorMessage } from '@/lib/api';
import { login } from '../admin.api';

const loginSchema = z.object({
  password: z.string().min(1, 'Informe a senha.'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const reduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    const shouldFocusPassword =
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;

    if (!shouldFocusPassword) return;

    const frame = window.requestAnimationFrame(() => setFocus('password'));
    return () => window.cancelAnimationFrame(frame);
  }, [setFocus]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values.password);
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Não foi possível entrar.'));
    }
  });

  const passwordDescriptionIds = [
    errors.password ? 'password-error' : null,
    serverError ? 'login-server-error' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="min-w-0 w-full max-w-[25rem]"
    >
      <div className="mb-7 sm:mb-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-ink text-paper">
            <Icon name="lock" className="size-4" />
          </span>
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[0.58rem] tracking-[0.14em] text-fg-subtle uppercase">
            / admin
          </span>
        </div>
        <p className="mb-3 text-[0.68rem] font-semibold tracking-[0.16em] text-fg-subtle uppercase">
          Identidade requerida
        </p>
        <h1 className="max-w-[10ch] font-display text-[clamp(2rem,8.5vw,3.5rem)] leading-[0.94] font-semibold tracking-[-0.055em]">
          Entre na área privada.
        </h1>
        <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-fg-muted">
          Use sua senha pessoal para acessar a curadoria do portfólio.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[0.72rem] font-semibold tracking-[0.08em] text-fg uppercase"
            >
              Senha
            </label>
            <span className="inline-flex items-center gap-1.5 text-[0.68rem] text-fg-subtle">
              <Icon name="shield" className="size-3" />
              Acesso reservado
            </span>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              enterKeyHint="go"
              aria-invalid={Boolean(errors.password || serverError)}
              aria-describedby={passwordDescriptionIds || undefined}
              className="field min-h-13 border-line-strong pr-13 text-base sm:text-[0.9rem]"
              placeholder="Sua senha"
              {...register('password', {
                onChange: () => {
                  if (serverError) setServerError(null);
                },
              })}
            />
            <MagneticButton
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-1 inline-flex size-11 touch-manipulation items-center justify-center rounded-full text-fg-subtle transition-colors duration-200 -translate-y-1/2 hover:bg-bg-muted hover:text-fg"
            >
              <Icon name={showPassword ? 'eyeSlash' : 'eye'} className="size-[1.15rem]" />
            </MagneticButton>
          </div>

          {errors.password && (
            <p id="password-error" role="alert" className="text-[0.78rem] text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        <AnimatePresence initial={false}>
          {serverError && (
            <motion.p
              id="login-server-error"
              role="alert"
              initial={reduceMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="flex min-w-0 items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/8 px-4 py-3 text-[0.82rem] leading-snug break-words text-danger"
            >
              <Icon name="alert" className="mt-px size-4 shrink-0" />
              {serverError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="group min-h-13 w-full touch-manipulation"
        >
          {isSubmitting ? 'Verificando' : 'Entrar no painel'}
          {!isSubmitting && <Icon name="arrowUpRight" className="size-4" />}
        </Button>
      </form>

      <div className="mt-6 flex items-start gap-2.5 border-t border-line pt-4">
        <Icon name="lock" className="mt-px size-3.5 shrink-0 text-fg-subtle" />
        <p className="text-[0.72rem] leading-relaxed text-fg-subtle">
          Área não indexada e reservada ao administrador.
        </p>
      </div>
    </motion.div>
  );
}
