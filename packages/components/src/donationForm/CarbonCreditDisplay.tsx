import type { Prisma } from "@cfce/database"
import { amountUSDAtom } from "@cfce/state"
import { useAtomValue } from "jotai"
import React from "react"
import CarbonChart from "~/home/CarbonChart"
import Progress from "~/ui/progressbar"

interface CarbonCreditDisplayProps {
  initiative: Prisma.InitiativeGetPayload<{
    include: {
      organization: { include: { wallets: true } }
      credits: true
      wallets: true
    }
  }>
}

export function CarbonCreditDisplay({ initiative }: CarbonCreditDisplayProps) {
  const usdAmount = useAtomValue(amountUSDAtom)

  const initiativeCredit =
    (initiative?.credits?.length ?? 0) > 0 ? initiative?.credits[0] : null
  const creditGoal = Number(initiativeCredit?.goal) || 1
  const currentCreditAmount = Number(initiativeCredit?.current) || 0
  const creditUnitValue = Number(initiativeCredit?.value) || 0
  const creditCompletionPercentage = (
    (creditUnitValue * 100) /
    creditGoal
  ).toFixed(0)

  const maxGoal = 100
  const maxValue = (currentCreditAmount * 100) / creditGoal
  const tons = 173.243 // TODO: get from db?
  const tonx =
    (Number(initiativeCredit?.current) ?? 0) /
    (Number(initiativeCredit?.value) ?? 0)
  const perc = (tonx * 100) / tons

  const chartTitle = React.useMemo(
    () =>
      `${perc.toFixed(
        2,
      )}% of total estimated carbon emissions retired ${tonx.toFixed(
        2,
      )} out of ${tons} tons`,
    [perc, tonx],
  )

  const percent = React.useMemo(() => {
    const creditsToRetire = usdAmount / creditUnitValue
    const remainingCredits = tonx - creditsToRetire
    const percentDiff = (100 * remainingCredits) / creditsToRetire
    return percentDiff
  }, [creditUnitValue, usdAmount, tonx])

  const offset = (usdAmount / creditUnitValue).toFixed(2)

  return (
    <div className="my-10 text-center">
      <CarbonChart title={chartTitle} goal={maxGoal} value={maxValue} />
      <p className="mt-4 mb-4">
        Your donation will offset {offset} ton
        {Number.parseInt(offset) === 1 ? "" : "s"} of carbon
      </p>
      <Progress value={percent} />
      <p className="mt-2 mb-4">1 ton of carbon = USD {creditUnitValue}</p>
    </div>
  )
}
