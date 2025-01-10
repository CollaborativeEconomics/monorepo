import {
  chainConfig,
  getChainConfigurationByName,
} from '@cfce/blockchain-tools';
import type {
  DonationWithRelations,
  NFTDataWithRelations,
} from '@cfce/database';
import { type Chain, ChainNames } from '@cfce/types';
import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';
import { Badge } from '~/ui/badge';
import { Button } from '~/ui/button';
import { Card, CardContent, CardFooter } from '~/ui/card';

// interface ReceiptNFTCardProps {
// onViewNFT: () => void;
// onViewDetails: () => void;
// }

export const ReceiptNFTCard: React.FC<
  NFTDataWithRelations
  //  & ReceiptNFTCardProps
> = ({
  created,
  donorAddress,
  userId,
  organizationId,
  initiativeId,
  metadataUri,
  imageUri,
  coinNetwork,
  coinLabel, // TODO: I think this is wrong sometimes (at least it is in the DB)
  coinSymbol,
  coinValue,
  usdValue,
  tokenId,
  offerId,
  status,
  donationId,
  user,
  initiative,
  organization,
  // onViewNFT,
  // onViewDetails,
}) => {
  if (!coinLabel) return <div>No chain</div>;
  const isChain = (chain: string): chain is Chain => {
    return ChainNames.some(c => c === chain);
  };
  if (!isChain(coinLabel)) {
    return null;
  }
  const chainDetails = getChainConfigurationByName(coinLabel);
  return (
    <div>
      <span className="text-sm text-muted-foreground">
        {format(created, 'MMM d, yyyy')}
      </span>
      <Card className="w-full max-w-[400px] border-1 shadow-xl">
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{initiative?.title}</h3>
          </div>

          {/* Initiative Image */}
          {initiative?.defaultAsset && (
            <div className="relative w-full h-[200px]">
              <Image
                src={initiative?.defaultAsset}
                alt={initiative?.title ?? 'Initiative Image'}
                fill
                className="rounded-md object-cover"
              />
            </div>
          )}

          {/* Organization Info */}
          <div className="flex items-center gap-2">
            {organization?.image && (
              <div className="relative w-8 h-8">
                <Image
                  src={organization?.image}
                  alt={organization?.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col align-start">
              <span className="text-sm">{organization?.name}</span>
              <Badge variant="secondary" className="text-xs">
                501(c)(3)
              </Badge>
            </div>
          </div>

          {/* Donation Details */}
          <div className="flex flex-row justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image
                  src={chainDetails.icon}
                  alt={chainDetails.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm">{chainDetails.name}</span>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Number(usdValue).toFixed(2)} USD
              </p>
              <p className="text-sm text-muted-foreground">
                {Number(coinValue)} {coinSymbol}
              </p>
            </div>
          </div>
        </CardContent>

        {/* <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="default" className="flex-1" onClick={onViewNFT}>
          View NFT
        </Button>
        <Button variant="outline" className="flex-1" onClick={onViewDetails}>
          Receipt Details
        </Button>
      </CardFooter> */}
      </Card>
    </div>
  );
};
