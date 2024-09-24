'use client';

import { PAYMENT_STATUS, donationFormAtom } from '@cfce/utils';
import { useAtom } from 'jotai';
import React from 'react';
import { Button } from '../ui/button';

interface MintButtonProps {
  onClick: () => void;
}

export function MintButton({ onClick }: MintButtonProps) {
  const [donationForm] = useAtom(donationFormAtom);
  const { paymentStatus } = donationForm;

  const buttonProps = React.useMemo(() => {
    if (paymentStatus === PAYMENT_STATUS.sending) {
      return { disabled: true, text: 'Sending' };
    }
    if (paymentStatus === PAYMENT_STATUS.minting) {
      return { disabled: true, text: 'Minting' };
    }
    if (paymentStatus === PAYMENT_STATUS.minted) {
      return { disabled: true, text: 'Minted' };
    }
    if (paymentStatus === PAYMENT_STATUS.failed) {
      return { disabled: true, text: 'Failed' };
    }
    // status === ready
    return { disabled: false, text: 'Donate' };
  }, [paymentStatus]);

  return (
    <Button
      disabled={buttonProps.disabled}
      className="mt-6 mx-6 w-[250px] h-[50px] bg-lime-600 text-white text-lg hover:bg-green-600 hover:shadow-inner"
      onClick={onClick}
    >
      {buttonProps.text}
    </Button>
  );
}
