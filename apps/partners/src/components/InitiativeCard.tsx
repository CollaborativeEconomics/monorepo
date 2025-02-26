import Image from 'next/image';
import Link from 'next/link';
import type { InitiativeStatus } from '@cfce/database'

interface CreditType {
  id: string;
  type: string;
  currency: string;
  value: number;
}

interface InitiativeProps {
  id: string;
  title?: string;
  description?: string;
  defaultAsset?: string;
  credits?: CreditType[];
  start?: Date;
  end?: Date;
  status?: InitiativeStatus|null;
}

function toDate(date: Date) {
  return new Date(date).toLocaleString();
}

const InitiativeCard = (initiative: InitiativeProps) => {
  let hasCredit = false;
  let creditText = '';
  if (initiative?.credits?.length && initiative.credits.length > 0) {
    const credit = initiative.credits[0];
    creditText = `Offsets ${credit.type} Credits every ${credit.currency} ${credit.value}`;
    hasCredit = true;
  }
  return (
    <div className="flex flex-row justify-start w-full">
      {initiative.defaultAsset ? (
        <Image
          src={initiative.defaultAsset}
          width={100}
          height={100}
          className="w-32 h-32 mr-6 rounded"
          alt={initiative.title ?? 'Initiative banner'}
        />
      ) : null}
      <div>
        <h1 className="text-2xl font-bold">{initiative.title}</h1>
        {initiative.start && initiative.end ? (
          <div className="text-slate-400 text-sm">
            Start {toDate(initiative.start)} • End {toDate(initiative.end)}
          </div>
        ) : null}
        <h3 className="text-base">{initiative.description}</h3>
        {hasCredit ? <p className="text-green-500">{creditText}</p> : ''}
        {/*<Link href={'/partners/reports/initiatives?id='+initiative.id} className="text-slate-250">View donations &raquo;</Link>*/}
        <p className="mt-4 text-right text-gray-500">{initiative.status}</p>
      </div>
    </div>
  );
};

export default InitiativeCard;
