"use client"
import type { InitiativeStatus } from "@cfce/database"
import { InitiativeStatus as Status } from "@cfce/database/types"
import Select from "~/components/form/select"

// To be brutally honest, I don't know how to assign a status based on the string value
// const status = InitiativeStatus[val] doesn't work as type can't be used as value
// So this function stays until somebody enlightens me
function getStatus(val:string){
  switch(val){
  case '0': return Status.Draft
  case '1': return Status.Active
  case '2': return Status.Finished
  case '3': return Status.Archived
  }
  return Status.Draft
}

function setStatus(val:InitiativeStatus){
  switch(val){
  case Status.Draft: return '0';
  case Status.Active: return '1';
  case Status.Finished: return '2';
  case Status.Archived: return '3';
  }
  return '0'
}

const InitiativeStatusSelect = ({
  status,
  handler,
}: { status: InitiativeStatus; handler: (val: InitiativeStatus) => void }) => {
  return (
    <Select
      className="my-4 w-full box-border"
      label="Initiative Status"
      selectedValue={setStatus(status)}
      handler={(val: string) => {
        //const status = Status[val] // doesn't work
        //const status = Status[Number.parseInt(val)] // doesn't work
        const status = getStatus(val)
        handler(status)
      }}
      options={[
        { id: "0", name: "Draft" },
        { id: "1", name: "Active" },
        { id: "2", name: "Finished" },
        { id: "3", name: "Archived" },
      ]}
    />
  )
}

export default InitiativeStatusSelect
