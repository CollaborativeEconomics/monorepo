'use client';
import type { NFTDataWithRelations } from '@cfce/database';
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface TableReceiptsProps {
  receipts: NFTDataWithRelations[];
}

export default function TableReceipts({ receipts }: TableReceiptsProps) {
  const router = useRouter();

  const [order, setOrder] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<NFTDataWithRelations>();

  const columns = [
    columnHelper.accessor('imageUri', {
      header: 'Image',
      cell: info =>
        info.getValue() ??
        `https://ipfs.filebase.io/ipfs/${info.getValue().substr(5)}`,
    }),
    columnHelper.accessor('initiative', {
      header: 'Initiative',
      cell: info => info.getValue()?.title ?? '',
    }),
    columnHelper.accessor('organization', {
      header: 'Organization',
      cell: info => info.getValue()?.name ?? '',
    }),
    columnHelper.accessor('coinValue', {
      header: 'Amount',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('coinSymbol', {
      header: 'Coin',
      cell: info => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data: receipts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const list = table.getRowModel().rows;

  function clicked(evt: React.MouseEvent) {
    const parent = (evt.target as HTMLElement).closest(
      '[data-id]',
    ) as HTMLElement | null;
    if (parent?.dataset.id) {
      const rowId = Number.parseInt(parent.dataset.id, 10);
      const { id: nftId } = receipts[rowId];
      console.log('CLICKED', rowId, nftId);
      console.log('DATA', receipts[rowId]);
      router.push(`/nft/${nftId}`);
    }
  }

  return (
    <Table id="table-nfts" className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : (
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody onClick={clicked}>
        {list.length > 0 ? (
          list.map(row => {
            return (
              <TableRow key={row.id} data-id={row.id}>
                {row.getVisibleCells().map(cell => {
                  //console.log('CELL', cell)
                  return (
                    <TableCell key={cell.id}>
                      {cell?.column?.id === 'imageUri' ? (
                        <Image
                          src={cell?.getValue() as string}
                          width={64}
                          height={64}
                          alt="NFT"
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </TableCell>
                  );
                })}
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
