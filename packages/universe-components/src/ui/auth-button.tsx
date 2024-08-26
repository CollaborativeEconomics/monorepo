import type { ChainSlugs } from '@cfce/blockchain-tools';
import { type AuthTypes, authConfig } from '@cfce/utils';
import React from 'react';
import { Button } from './button';

// TODO: extend with html button props, for some reason it was causing problems.
interface AuthButtonProps {
  method: AuthTypes;
  chain?: ChainSlugs;
  onClick: (method: AuthTypes, chain?: ChainSlugs) => void;
}

export function AuthButton({
  method,
  chain,
  onClick,
  ...props
}: AuthButtonProps) {
  const config = authConfig[method];
  return (
    <Button onClick={() => onClick(method, chain)} {...props}>
      <img src={config.icon} alt={`${config.name} Login Button`} />{' '}
      {config.name}
    </Button>
  );
}
