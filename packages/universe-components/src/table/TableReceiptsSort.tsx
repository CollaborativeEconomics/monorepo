"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
//import { ChevronUp, ChevronDown } from 'lucide-react'
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

type Receipt = {
  id: string;
  image: string;
  imageUri: string;
  initiative: string;
  organization: string;
  amount: string;
  coin: string;
}

type Dictionary = { [key: string]: any }

export default function TableReceipts(props:any){
  const router = useRouter()
  const receipts:[Dictionary] = props?.receipts || []
  const recs = receipts.map(rec => { 
    return {
      id: rec.id,
      image: rec.imageUri.startsWith('ipfs') ? 'https://ipfs.filebase.io/ipfs/'+rec.imageUri.substr(5) : rec.imageUri,
      imageUri: rec.imageUri,
      initiative: rec.initiative.title,
      organization: rec.organization.name,
      amount: rec.coinValue,
      coin: rec.coinSymbol
    }
  })

  const [order, setOrder] = useState('')
  const [data, setData] = useState(recs)
  const [sorting, setSorting] = useState<SortingState>([])

  const columnHelper = createColumnHelper<Receipt>()

  const columns = [
    columnHelper.accessor("image", {
      header: "Image",
      cell: (info) => info.getValue(),
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
    columnHelper.accessor("coin", {
      header: "Coin",
      cell: (info) => info.getValue(),
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
    let rowid = ''
    if(evt.target.parentNode.tagName=='TD'){
      rowid = evt.target.parentNode.parentNode.dataset.id
    } else {
      rowid = evt.target.parentNode.dataset.id
    }
    const nftid = data[rowid].id
    console.log('CLICKED', rowid, nftid)
    console.log('DATA', data[rowid])
    router.push('/nft/'+nftid)
  }

  return (
    <Table id="table-nfts" className="w-full">
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
              {row.getVisibleCells().map((cell) => { 
                //console.log('CELL', cell)
                return (
                  <TableCell key={cell.id}>
                    { cell?.column?.id=='image' 
                      ? (<Image src={cell?.getValue() as string} width={64} height={64} alt="NFT" />)
                      : flexRender(cell.column.columnDef.cell, cell.getContext())
                    }
                  </TableCell>
                )}
              )}
            </TableRow>
          )
        }) : (
          <TableRow>
            <TableCell className="col-span-5">No receipts found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
