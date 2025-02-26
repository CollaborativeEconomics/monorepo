'use client'
import Select from '~/components/form/select'

const InitiativeStatusSelect = ({ status, handler }: { status: string , handler: (val: string) => void }) => {
  return (
    <Select
      className="my-4 w-full box-border"
      label="Initiative Status"
      selectedValue={status}
      handler={handler}
      options={[
        {id:'0', name:'Draft'},
        {id:'1', name:'Active'},
        {id:'2', name:'Finished'},
        {id:'3', name:'Archived'}
      ]}
    />
  )
}

export default InitiativeStatusSelect
