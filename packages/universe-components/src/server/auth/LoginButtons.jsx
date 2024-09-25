'use client';
import { loginOrCreateUserFromWallet } from '@cfce/utils';
import { signIn } from 'next-auth/react';
import { AuthButton } from '../../client/auth/AuthButton';
export default function LoginButtons({ chain, wallets }) {
    async function onLogin(method, chain) {
        console.log('LOGIN');
        switch (method) {
            case 'github':
                signIn('github');
                break;
            case 'google':
                signIn('google');
                break;
            default:
                if (!chain) {
                    throw new Error('No chain provided');
                }
                loginOrCreateUserFromWallet({ chain });
        }
    }
    return (<>
      {wallets.map(wallet => (<AuthButton onClick={onLogin} key={`auth-button-${chain}-${wallet}`} chain={chain} method={wallet}/>))}
    </>);
}
