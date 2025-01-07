import { githubLogin } from '../actions';
import { BaseLoginButton } from './BaseLoginButton';

interface GithubLoginButtonProps {
  className?: string;
}

export function GithubLoginButton({ className }: GithubLoginButtonProps) {
  return (
    <form action={githubLogin}>
      <BaseLoginButton
        type="submit"
        icon="/images/github-mark.svg"
        name="GitHub"
        className={className}
      />
    </form>
  );
}
