import axios from 'axios';
import { setSession } from '@/lib/auth-store';

type TokenPair = { accessToken: string; refreshToken: string; tokenType: 'Bearer' };

const baseURL = import.meta.env.VITE_API_URL || '/api';

/** Login usa axios cru: o interceptor de refresh nao deve rodar aqui. */
export async function login(password: string): Promise<void> {
  const { data } = await axios.post<TokenPair>(`${baseURL}/auth/login`, { password });
  setSession(data);
}
