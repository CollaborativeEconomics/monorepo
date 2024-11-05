import { signIn } from '@cfce/utils';
import { BaseLoginButton } from './BaseLoginButton';

interface GithubLoginButtonProps {
  className?: string;
}

export function GithubLoginButton({ className }: GithubLoginButtonProps) {
  async function githubLogin() {
    'use server';
    await signIn('github');
  }

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
