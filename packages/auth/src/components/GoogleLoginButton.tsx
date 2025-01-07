import { googleLogin } from '../actions';
import { BaseLoginButton } from './BaseLoginButton';

interface GoogleLoginButtonProps {
  className?: string;
}

export function GoogleLoginButton({ className }: GoogleLoginButtonProps) {
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
