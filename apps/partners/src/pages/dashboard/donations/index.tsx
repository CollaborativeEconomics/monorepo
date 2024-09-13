import { type Donation, getDonations } from '@cfce/database';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Dashboard from '~/components/dashboard';
import DonationsTable from '~/components/donationstable';
import Sidebar from '~/components/sidebar';
import TimeTab from '~/components/timetab';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';

function firstDayOfYear() {
  const year = new Date().getFullYear();
  return new Date(year, 0, 1).toISOString().substr(0, 10);
}

function firstDayOfMonth() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  return new Date(year, month, 1).toISOString().substr(0, 10);
}

function firstDayOfWeek() {
  const now = new Date();
  now.setDate(now.getDate() - 7);
  return now.toISOString().substr(0, 10);
}

function tomorrow() {
  const now = new Date();
  now.setDate(now.getDate() + 1); // tomorrow
  return now.toISOString().substr(0, 10);
}

interface Props {
  data?: Array<Donation>;
}

export default function Page(props: Props) {
  //console.log('PROPS', props)
  const { data: session, update } = useSession();
  //console.log('DASH SESSION', session)
  const [data, setData] = useState<Array<Donation>>([]);
  const [orgId, setOrgid] = useState(session?.orgId || '');
  //const orgName = session.orgName
  //console.log('DASH ORGID', orgId)
  //console.log('DASH ORGIS', session?.orgId)
  //const oid = session?.orgId
  //setOrgid(session?.orgId)
  //if(!orgId){ orgId = '636283c22552948fa675473c' }

  useEffect(() => {
    async function loadData() {
      const orid = session?.orgId ?? '';
      console.log('GET DONATIONS:', orid);
      const donations = await getDonations({ orgId: orid });
      console.log('DONATIONS:', donations);
      setData(donations);
      setOrgid(orid);
      console.log('LAST ORGID:', orid);
    }
    loadData();
  }, [session?.orgId]);

  async function byYear() {
    const from = firstDayOfYear();
    const to = tomorrow();
    const donations = await getDonations({ orgId, from, to });
    setData(donations);
  }

  async function byMonth() {
    const from = firstDayOfMonth();
    const to = tomorrow();
    const donations = await getDonations({ orgId, from, to });
    setData(donations);
  }

  async function byWeek() {
    const from = firstDayOfWeek();
    const to = tomorrow();
    const donations = await getDonations({ orgId, from, to });
    setData(donations);
  }

  async function onOrgChange(id: string) {
    console.log('ORG CHANGED', orgId, 'to', id);
  }

  return (
    <Dashboard>
      <Sidebar afterChange={onOrgChange} />
      <div className={styles.content}>
        <div className={styles.report}>
          <div className={styles.reportHead}>
            <Title>Donations</Title>
            <TimeTab byYear={byYear} byMonth={byMonth} byWeek={byWeek} />
            {/*<TimeTab />*/}
          </div>
          <div className={styles.reportData}>
            <DonationsTable data={data} />
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
