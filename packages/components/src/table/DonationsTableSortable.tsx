"use client"
import type {
  DonationWithRelations,
  NFTDataWithRelations,
} from "@cfce/database"
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import jsPDF from "jspdf"
import { Download } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"
import { useState } from "react"
import { Button } from "~/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/ui/table"
import "jspdf-autotable"

declare module "jspdf" {
  interface jsPDF {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    autoTable: (options: any) => jsPDF
  }
}

interface DonationsTableSortableProps {
  donations?: DonationWithRelations[]
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
  coinAmount?: number
  asset?: string
  wallet?: string
}

function money(amount: number) {
  return `$${amount.toFixed(2)}`
}

function downloadCSV(data: Donation[]) {
  const headers = [
    "Date",
    "Initiative",
    "Organization",
    "USD Amount",
    "Chain",
    "Impact",
    "Coin Amount",
    "Asset",
  ]
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        new Date(row.created).toLocaleString(),
        `"${row.initiative}"`,
        `"${row.organization}"`,
        row.amount,
        row.chain,
        `"${row.impact}"`,
        row.coinAmount,
        row.asset,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `donations_${new Date().toISOString()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function downloadPDF(data: Donation[]) {
  const doc = new jsPDF()

  // Format wallet address: first 6 chars + "..." + last 5 chars
  const wallet = data[0].wallet
  const formattedWallet = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-5)}`
    : ""

  doc.setFontSize(16)
  doc.text(`Donations Report for ${formattedWallet}`, 20, 20)

  // Add date
  doc.setFontSize(11)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30)

  // Table headers
  const headers = [
    "Date",
    "Initiative",
    "Organization",
    "USD Amount",
    "Chain",
    "Impact",
    "Coin Amount",
    "Asset",
  ]

  console.log("DATA", data)

  // Convert data to table format
  const tableData = data.map((row) => [
    new Date(row.created).toLocaleString(),
    row.initiative,
    row.organization,
    `$${row.amount.toFixed(2)}`,
    row.chain,
    row.impact,
    row.coinAmount,
    row.asset,
  ])

  // Add table
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 40,
    margin: { top: 40 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 40 },
      3: { halign: "right" },
    },
  })

  // Save PDF
  doc.save(`donations_${new Date().toISOString()}.pdf`)
}

export default function DonationsTableSortable(
  props: DonationsTableSortableProps,
) {
  const router = useRouter()
  const donations = props?.donations || []

  const recs: Donation[] = donations.map((rec) => {
    console.log("REC", rec)
    const unitValue =
      rec.impactlinks.length > 0 ? rec.impactlinks[0].story?.unitvalue || 0 : 0
    let impactScore = ""
    if (unitValue > 0) {
      impactScore = Math.ceil(Number(rec.amount) / unitValue).toString()
    }
    const unitLabel =
      rec.impactlinks.length > 0
        ? rec.impactlinks[0].story?.unitlabel || ""
        : ""
    let impactLabel = unitLabel
    if (unitLabel) {
      impactLabel = unitLabel + (impactScore === "1" ? "" : "s")
    }
    //console.log('UNITS', unitValue, unitLabel)
    console.log("IMPACT", impactScore, impactLabel)

    const item = {
      id: rec.id,
      created: rec.created,
      initiative: rec.initiative?.title || "No name",
      organization: rec.organization?.name || "No name",
      amount: Number(rec.usdvalue),
      chain: rec.chain || "N/A",
      storyId: rec.storyId || "",
      image: rec.storyId ? "/media/icon-story.svg" : "",
      impactScore,
      impactLabel,
      impact: `${impactScore} ${impactLabel}`,
      coinAmount: Number(rec.amount),
      asset: rec.asset || "",
      wallet: rec.wallet || "",
    }
    return item
  })

  const [data, setData] = useState(recs)
  const [order, setOrder] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  console.log("DATA", data)

  //const columnHelper = createColumnHelper<DonationWithRelations>();
  const columnHelper = createColumnHelper<Donation>()

  const columns = [
    columnHelper.accessor("created", {
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue())
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(date)
      },
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
      cell: (info) => money(info.getValue()),
    }),
    columnHelper.accessor("chain", {
      header: "Chain",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("impact", {
      header: "Impact",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("image", {
      header: "",
      cell: (info) => info.getValue(),
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

  const list = table.getRowModel().rows

  function clicked(evt: React.MouseEvent) {
    if (list.length < 1) {
      return
    }
    const parent = (evt.target as HTMLElement).closest(
      "[data-id]",
    ) as HTMLElement | null
    if (parent?.dataset?.id) {
      const rowId = Number.parseInt(parent.dataset.id, 10)
      const { id: nftId } = data[rowId]
      console.log("CLICKED", rowId, nftId)
      console.log("DATA", data[rowId])
      router.push(`/donations/${nftId}`)
    }
  }

  const exportButtons = (
    <div className="flex gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => downloadCSV(data)}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadPDF(data)}>
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <div>
      {exportButtons}
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
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: " ↑",
                        desc: " ↓",
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
            list.map((row) => {
              return (
                <TableRow key={row.id} data-id={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const align =
                      cell?.column?.id === "amount" ? "text-right" : ""
                    return (
                      <TableCell key={cell.id} className={align}>
                        {cell?.column?.id === "image" &&
                        cell?.getValue() !== "" ? (
                          <Image
                            src={cell?.getValue() as string}
                            width={20}
                            height={20}
                            alt="NFT"
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell className="col-span-5">No donations found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
