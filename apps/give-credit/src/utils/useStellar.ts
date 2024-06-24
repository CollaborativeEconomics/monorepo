/*
import { useEffect } from 'react';
import StellarClient from 'stellar-sdk';

console.log('preparing stellar client', process.env.NEXT_PUBLIC_STELLAR_HORIZON||'');
const client = new StellarClient(process.env.NEXT_PUBLIC_STELLAR_HORIZON||'', {
  assumeOfflineAfterSeconds: 15,
  maxConnectionAttempts: 4,
  connectAttemptTimeoutSeconds: 10
});

const useStellar = () => {
  useEffect(() => {
    client.ready().then(() => {
      console.log('Stellar is Ready!');
    });
  }, []);
  return client;
};

export default useStellar;
*/