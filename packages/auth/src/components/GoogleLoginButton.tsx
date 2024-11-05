import { signIn } from '../nextAuth';
import { BaseLoginButton } from './BaseLoginButton';

interface GoogleLoginButtonProps {
  className?: string;
}

export function GoogleLoginButton({ className }: GoogleLoginButtonProps) {
  async function googleLogin() {
    'use server';
    await signIn('google');
  }

  return (
    <form action={googleLogin}>
      <BaseLoginButton
        type="submit"
        icon="/images/google.svg"
        name="Google"
        className={className}
      />
    </form>
  );
}
