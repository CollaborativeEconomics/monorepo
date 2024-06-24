'use client'
import { useState } from 'react'
import { coinFromChain } from '@/lib/utils/chain'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { title } from 'process'

interface Donation {
  id: string
  created: Date
  initiative: {
    title: string
  }
  organization: {
    name: string
  }
  amount: string
  chain: string
}

interface DonationHeader extends Omit<Donation, 'initiative' | 'organization'> {
  initiative: string
  organization: string
}

type Dictionary = { [key: string]: any }

export default function TableDonationsSort(props: Dictionary) {
  const donations: Donation[] = props?.donations || []

  const records = donations.map((rec) => {
    return {
      id: rec.id,
      created: rec.created,
      initiative: rec.initiative.title,
      organization: rec.organization.name,
      amount: rec.amount,
      chain: rec.chain,
    }
  })

  const [data, setData] = useState(records)
  const [sorting, setSorting] = useState<SortingState>([])

  const columnHelper = createColumnHelper<DonationHeader>()

  const columns = [
    columnHelper.accessor('created', {
      header: 'Date',
      cell: (info) => new Date(info.getValue().toString()).toLocaleString(),
    }),
    columnHelper.accessor('initiative', {
      header: 'Initiative',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('organization', {
      header: 'Organization',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('chain', {
      header: 'Chain',
      cell: (info) => coinFromChain(info.getValue()).toUpperCase(),
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const donationRows = table.getRowModel().rows

  const NoRows = () => {
    return (
      <TableRow>
        <TableCell className="col-span-5">No donations found</TableCell>
      </TableRow>
    )
  }

  const AllRows = () => {
    return donationRows.map((row) => {
      return (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      )
    })
  }

  return (
    <Table id="table-donations" className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
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
                      header.getContext()
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
      <TableBody>{donationRows.length ? <AllRows /> : <NoRows />}</TableBody>
    </Table>
  )
}
