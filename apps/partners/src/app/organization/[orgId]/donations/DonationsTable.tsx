'use client';

import type { Donation } from '@cfce/database';
import React, { useMemo, useState } from 'react';
import styles from '~/styles/dashboard.module.css';
import TimeTab from '~/components/timetab';

interface TableProps {
  data?: Donation[];
}

function toLocale(sdate: Date) {
  return new Date(sdate).toJSON().substr(0, 16).replace('T', ' ');
}

const DonationsTable = ({ data }: TableProps) => {
  const count = data?.length || 0;
  let total = 0;
  if (data) {
    total = data.reduce((sum, donation) => sum + Number(donation.usdvalue), 0);
  }
  const [timeframe, setTimeframe] = useState<'year' | 'month' | 'week'>('year');
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const created = new Date(item.created);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - created.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (timeframe === 'year') {
        return diffDays <= 365;
      }
      if (timeframe === 'month') {
        return diffDays <= 30;
      }
      if (timeframe === 'week') {
        return diffDays <= 7;
      }
      return true;
    });
  }, [data, timeframe]);
  //console.log('DATA', data)
  console.log('Count', count);
  console.log('Total', total);

  return (
    <>
      <TimeTab timeframe={timeframe} setTimeframe={setTimeframe} />
      <table className={styles.reportList}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Chain</th>
            <th>Wallet</th>
            <th>Amount</th>
            <th>Asset</th>
            <th>Amount USD</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.length ? (
            filteredData.map(item => (
              <tr key={item.id}>
                <td>{toLocale(item.created)}</td>
                <td>{item.chain}</td>
                <td>{`${(item.wallet || '').substr(0, 10)}...`}</td>
                <td>{item.amount.toString()}</td>
                <td>{item.asset}</td>
                <td>{item.usdvalue.toString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-6">
                No donations received
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              Total received in {count} donations USD {total.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default DonationsTable;
