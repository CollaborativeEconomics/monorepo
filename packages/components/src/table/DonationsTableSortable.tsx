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
import Image from 'next/image';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/ui/table';

interface DonationsTableSortableProps {
  donations?: DonationWithRelations[];
}

type Donation = {
  id: string
  created: Date
  initiative?: string
  organization?: string
  amount: number
  chain?: string
  storyId?: string
  image?: string
  impactScore?: string
  impactLabel?: string
  impact?: string
}

function money(amount:number){
  return '$'+amount.toFixed(2)
}

function localDate(sdate:string){
  return new Date(sdate).toLocaleString()
}

export default function DonationsTableSortable(
  props: DonationsTableSortableProps,
) {
  const router = useRouter();
  const donations = props?.donations || [];

  const recs:Donation[] = donations.map(rec => { 
    const unitValue = rec.impactlinks.length > 0 ? (rec.impactlinks[0].story?.unitvalue||0) : 0
    let impactScore = ''
    if(unitValue>0){
      impactScore = Math.ceil(Number(rec.amount) / unitValue).toString()
    }
    const unitLabel = rec.impactlinks.length > 0 ? (rec.impactlinks[0].story?.unitlabel||'') : ''
    let impactLabel = unitLabel
    if(unitLabel){
      impactLabel = unitLabel + (impactScore == '1' ? '' : 's')
    }
    //console.log('UNITS', unitValue, unitLabel)
    console.log('IMPACT', impactScore, impactLabel)
    const item = {
      id: rec.id,
      created: rec.created,
      initiative: rec.initiative?.title || 'No name',
      organization: rec.organization?.name || 'No name',
      amount: Number(rec.usdvalue),
      chain: rec.chain || 'N/A',
      storyId: rec.storyId || '',
      image: rec.storyId ? '/media/icon-story.svg' : '',
      impactScore,
      impactLabel,
      impact: `${impactScore} ${impactLabel}`
    }
    return item
  })

  const [data, setData] = useState(recs)
  const [order, setOrder] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  //const columnHelper = createColumnHelper<DonationWithRelations>();
  const columnHelper = createColumnHelper<Donation>();

  const columns = [
    columnHelper.accessor('created', {
      header: 'Date',
      cell: info => {
        const date = new Date(info.getValue());
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }).format(date);
      },
    }),
    columnHelper.accessor('initiative', {
      header: 'Initiative',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('organization', {
      header: 'Organization',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => money(info.getValue()),
    }),
    columnHelper.accessor('chain', {
      header: 'Chain',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('impact', {
      header: 'Impact',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('image', {
      header: '',
      cell: info => info.getValue()
    })
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const list = table.getRowModel().rows;

  function clicked(evt: React.MouseEvent) {
    if(list.length<1){ return }
    const parent = (evt.target as HTMLElement).closest(
      '[data-id]',
    ) as HTMLElement | null;
    if (parent?.dataset?.id) {
      const rowId = Number.parseInt(parent.dataset.id, 10);
      const { id: nftId } = data[rowId];
      console.log('CLICKED', rowId, nftId);
      console.log('DATA', data[rowId]);
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
                {row.getVisibleCells().map(cell => {
                  const align = cell?.column?.id == 'amount' ? 'text-right' : ''
                  return (
                    <TableCell key={cell.id} className={align}>
                      { (cell?.column?.id=='image' && cell?.getValue()!='')
                        ? (<Image src={cell?.getValue() as string} width={20} height={20} alt="NFT" />)
                        : flexRender(cell.column.columnDef.cell, cell.getContext())
                      }
                    </TableCell>
                  )}
                )}
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
