/**
 * Sign in form component
 * Client Component with form validation using react-hook-form and Zod
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInSchema, type SignInInput } from '@/lib/validation/auth';
import { storeAuthTokens } from '@/actions/auth';
import { signInClient, checkAuthStatusClient } from '@/lib/auth/cognito-client';
import { configureAmplify } from '@/lib/amplify/config';
import { RoutePath } from '@/lib/routes/RoutePath';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getCognitoErrorMessage } from '@/lib/utils/auth-errors';

// Configure Amplify on client side
if (typeof window !== 'undefined') {
  configureAmplify();
}

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Check if user is already authenticated on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const authStatus = await checkAuthStatusClient();
        if (authStatus) {
          // User is already authenticated, redirect based on role
          const redirectUrl =
            authStatus.userRole === 'TEACHER'
              ? RoutePath.grades.my
              : RoutePath.grades.base;
          router.push(redirectUrl);
          router.refresh();
        }
      } catch (error) {
        // User is not authenticated, continue showing the form
        console.error('Error checking auth status:', error);
      }
    }

    checkAuth();
  }, [router]);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInInput) {
    startTransition(async () => {
      try {
        // Check if user is already authenticated before attempting sign in
        const authStatus = await checkAuthStatusClient();
        if (authStatus) {
          // User is already authenticated, store tokens and redirect
          const storeResult = await storeAuthTokens({
            idToken: authStatus.idToken,
            accessToken: authStatus.accessToken,
            refreshToken: authStatus.refreshToken,
            userRole: authStatus.userRole,
          });

          if (storeResult && storeResult.success) {
            toast.success('Вы уже авторизованы!');
            router.push(storeResult.redirectUrl);
            router.refresh();
            return;
          }
        }

        // 1. Sign in on client side (uses Amplify Auth)
        const signInResult = await signInClient(data.email, data.password);

        if (!signInResult.success) {
          toast.error(signInResult.error || 'Ошибка входа. Попробуйте еще раз.');
          return;
        }

        // 2. Store tokens in HttpOnly cookies via Server Action
        const storeResult = await storeAuthTokens({
          idToken: signInResult.data.idToken,
          accessToken: signInResult.data.accessToken,
          refreshToken: signInResult.data.refreshToken,
          userRole: signInResult.data.userRole,
        });

        if (!storeResult || !storeResult.success) {
          toast.error(storeResult?.error || 'Ошибка сохранения токенов. Попробуйте еще раз.');
          return;
        }

        // 3. Redirect on client side
        toast.success('Вход выполнен успешно!');
        router.push(storeResult.redirectUrl);
        router.refresh(); // Refresh to update server components
      } catch (error) {
        console.error('Sign in error:', error);
        const errorMessage = getCognitoErrorMessage(error);
        toast.error(errorMessage);
      }
    });
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email адрес</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Введите ваш email"
                    autoComplete="email"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Введите пароль"
                    autoComplete="current-password"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход...
              </>
            ) : (
              'Войти в систему'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

