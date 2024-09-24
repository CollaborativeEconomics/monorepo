'use client';

import { chainAtom, donationFormAtom } from '@cfce/utils';
import { useAtom } from 'jotai';
import { Switch } from '../ui/switch';

interface DonationAmountInputProps {
  className?: string;
}

export function DonationAmountInput({ className }: DonationAmountInputProps) {
  const [donationForm, setDonationForm] = useAtom(donationFormAtom);
  const [chainState] = useAtom(chainAtom);
  const { showUsd, amount } = donationForm;
  const { selectedToken } = chainState;

  return (
    <div className={`input-with-content ${className}`}>
      <div className="flex flex-row justify-between items-center mb-2">
        <label htmlFor="show-usd-toggle">USD</label>
        <Switch
          id="show-usd-toggle"
          valueBasis={!showUsd}
          handleToggle={() => {
            setDonationForm(draft => {
              draft.showUsd = !draft.showUsd;
              draft.date = new Date();
            });
          }}
        />
        <label>{selectedToken}</label>
      </div>
      <input
        type="text"
        id="amount"
        value={amount}
        onChange={({ target: { value } }) => {
          setDonationForm(draft => {
            draft.amount = Number.parseFloat(value);
            draft.date = new Date();
          });
        }}
      />
      <span>{showUsd ? '| USD' : `| ${selectedToken}`}</span>
    </div>
  );
}
