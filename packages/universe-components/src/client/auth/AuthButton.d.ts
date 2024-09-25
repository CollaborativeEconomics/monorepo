import 'server-only';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
import React from 'react';
interface AuthButtonProps {
    method: AuthTypes;
    chain?: ChainSlugs;
    onClick: (method: AuthTypes, chain?: ChainSlugs) => void;
}
export declare function AuthButton({ method, chain, onClick, ...props }: AuthButtonProps): React.JSX.Element;
export {};
//# sourceMappingURL=AuthButton.d.ts.map