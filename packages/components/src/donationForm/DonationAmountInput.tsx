'use client';

import { chainAtom, donationFormAtom } from '@cfce/state';
import { useAtom } from 'jotai';
import React from 'react';
import { InputWithContent, Label } from '~/ui'; // Adjust the import path as necessary
import { Switch } from '~/ui/switch';

interface DonationAmountInputProps {
  className?: string;
  label?: string;
}

export function DonationAmountInput({
  className,
  label,
}: DonationAmountInputProps) {
  const [donationForm, setDonationForm] = useAtom(donationFormAtom);
  const [chainState] = useAtom(chainAtom);
  const { showUsd, amount } = donationForm;
  const { selectedToken } = chainState;

  return (
    <div className={`${className}`}>
      <div className="flex flex-row justify-between items-center mb-2">
        <Label>Amount</Label>{' '}
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
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label>{selectedToken}</label>
        </div>
      </div>
      <InputWithContent
        type="text"
        id="amount"
        value={amount.toString()}
        onChange={({ target: { value } }) => {
          setDonationForm(draft => {
            draft.amount = Number.parseFloat(value) || 0;
            draft.date = new Date();
          });
        }}
        text={showUsd ? '| USD' : `| ${selectedToken}`}
      />
    </div>
  );
}
