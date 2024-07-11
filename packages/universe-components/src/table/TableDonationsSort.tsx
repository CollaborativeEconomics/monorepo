"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { localDate } from '@/src/utils/date'
import { coinFromChain } from '@/src/utils/chain'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/src/components/ui/table"
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

type Donation = {
  id: string;
  created: Date;
  initiative: string;
  organization: string;
  amount: string;
  chain: string;
}

type Dictionary = { [key: string]: any }

export default function TableDonationsSort(props:any){
  const router = useRouter()
  const donations:[Dictionary] = props?.donations || []
  const recs = donations.map(rec => { 
    return {
      id: rec.id,
      created: rec.created,
      initiative: rec.initiative.title,
      organization: rec.organization.name,
      amount: rec.amount,
      chain: rec.chain
    }
  })

  const [order, setOrder] = useState('')
  const [data, setData] = useState(recs)
  const [sorting, setSorting] = useState<SortingState>([])

  const columnHelper = createColumnHelper<Donation>()

  const columns = [
    columnHelper.accessor("created", {
      header: "Date",
      cell: (info) => localDate(info.getValue().toString()),
    }),
    columnHelper.accessor("initiative", {
      header: "Initiative",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("organization", {
      header: "Organization",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("chain", {
      header: "Chain",
      cell: (info) => coinFromChain(info.getValue()).toUpperCase()
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  const list = table.getRowModel().rows

  function clicked(evt){
    const rowid = evt.target.parentNode.dataset.id
    const nftid = data[rowid].id
    console.log('CLICKED', rowid, nftid)
    console.log('DATA', data[rowid])
    router.push('/donations/'+nftid)
  }

  return (
    <Table id="table-donations" className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                ? null
                : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler()
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc : ' ↑',
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
        { list.length>0 ? list.map((row) => {
          return (
            <TableRow key={row.id} data-id={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                </TableCell>
              ))}
            </TableRow>
          )
        }) : (
          <TableRow>
            <TableCell className="col-span-5">No donations found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
