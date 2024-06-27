import { coinFromChain } from '@/lib/utils/chain'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

type Dictionary = { [key: string]: any }

export default function TableDonations(props:Dictionary){
  const donations:[Dictionary] = props?.donations || []
  
  return (
    <Table id="table-donations" className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Initiative</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Coin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.length ? donations.map((item:any)=>{
          return (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.created).toLocaleString()}</TableCell>
              <TableCell>{item.initiative.title}</TableCell>
              <TableCell>{item.organization.name}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{coinFromChain(item.chain).toUpperCase()}</TableCell>
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
