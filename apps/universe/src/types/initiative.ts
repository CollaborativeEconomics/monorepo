export default interface Initiative {
  id?: string
  title: string
  created: Date
  description: string
  defaultAsset: string
  start: Date
  end: Date
  tag: number
  organizationId: string
  inactive: boolean
  imageUri?: string
  contractnft?: string
  contractcredit?: string
  wallet?: string
  country?: string
  categoryId?: string
  donors: number
  institutions: number
  goal: number
  received: number
  lastmonth: number
}