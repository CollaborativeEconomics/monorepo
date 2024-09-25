import 'server-only';
import { authConfig } from '@cfce/utils';
import React from 'react';
import { Button } from '../../ui/button';
export function AuthButton({ method, chain, onClick, ...props }) {
    const config = authConfig[method];
    return (<Button onClick={() => onClick(method, chain)} {...props}>
      <img src={config.icon} alt={`${config.name} Login Button`}/>{' '}
      {config.name}
    </Button>);
}
