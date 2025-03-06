import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login | APUDSI CMS',
  description: 'Login to your APUDSI CMS account',
};

export default function LoginPage() {
  return <LoginForm />;
}
