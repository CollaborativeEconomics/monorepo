'use client';
import type { DonationWithRelations } from '@cfce/database';
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface DonationsTableSortableProps {
  donations?: DonationWithRelations[];
}

export default function DonationsTableSortable(
  props: DonationsTableSortableProps,
) {
  const router = useRouter();
  const donations = props?.donations || [];

  const [order, setOrder] = useState('');
  // const [data, setData] = useState(recs);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<DonationWithRelations>();

  const columns = [
    columnHelper.accessor('created', {
      header: 'Date',
      cell: info => info.getValue().toString(), // TODO: format nicer
    }),
    columnHelper.accessor('initiative', {
      header: 'Initiative',
      cell: info => info.getValue()?.title ?? '',
    }),
    columnHelper.accessor('organization', {
      header: 'Organization',
      cell: info => info.getValue()?.name ?? '',
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('chain', {
      header: 'Chain',
      cell: info => info.getValue(), // TODO: format nicer
    }),
  ];

  const table = useReactTable({
    data: donations,
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
      const { id: nftId } = donations[rowId];
      console.log('CLICKED', rowId, nftId);
      console.log('DATA', donations[rowId]);
      router.push(`/donations/${nftId}`);
    }
  }

  return (
    <Table id="table-donations" className="w-full">
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
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell className="col-span-5">No donations found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
