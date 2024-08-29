import type { NFTDataWithRelations } from '@cfce/database';
import Image from 'next/image';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface ReceiptTableProps {
  receipts?: NFTDataWithRelations[];
}
export default function ReceiptTable({ receipts }: ReceiptTableProps) {
  return (
    <Table id="table-nfts" className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Initiative</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Coin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts?.length ? (
          receipts.map(item => {
            const image = item.imageUri.startsWith('ipfs')
              ? `https://ipfs.filebase.io/ipfs/${item.imageUri.substr(5)}`
              : item.imageUri;
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Image src={image} width={64} height={64} alt="NFT" />
                </TableCell>
                <TableCell>{item?.initiative?.title}</TableCell>
                <TableCell>{item?.organization?.name}</TableCell>
                <TableCell>{`${item.coinValue}`}</TableCell>
                <TableCell>{item.coinSymbol}</TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell className="col-span-5">No receipts found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
