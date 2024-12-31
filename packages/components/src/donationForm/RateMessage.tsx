'use client';

import { chainAtom, donationFormAtom } from '@cfce/utils';
import { useAtom } from 'jotai';
import React from 'react';
import { Label } from '~/ui/label';

interface RateMessageProps {
  className?: string;
}

export function RateMessage({ className }: RateMessageProps) {
  const [donationForm] = useAtom(donationFormAtom);
  const [chainState] = useAtom(chainAtom);
  const { showUsd, amount } = donationForm;
  const { selectedToken, exchangeRate } = chainState;

  const rateMessage = React.useMemo(() => {
    if (typeof amount === 'undefined') {
      return `0 USD at ${exchangeRate.toFixed(2)} ${selectedToken}/USD`;
    }
    // show token amount under field
    if (showUsd) {
      return `${(+amount / exchangeRate).toFixed(2)} ${selectedToken} at ${exchangeRate.toFixed(2)} ${selectedToken}/USD`;
    }
    console.log("Exchange rate", exchangeRate);
    // show USD amount under field
    return `${(+amount * exchangeRate).toFixed(2)} USD at ${exchangeRate.toFixed(2)} ${selectedToken}/USD`;
  }, [exchangeRate, amount, showUsd, selectedToken]);

  return (
    <Label className={`block mt-2 text-right ${className}`}>
      {rateMessage}
    </Label>
  );
}
