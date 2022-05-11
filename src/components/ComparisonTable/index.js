import React from 'react';
import styles from './styles.module.css';
import CheckIcon from '../../assets/images/check.svg';

export function TabelCellValue({ value, type }) {
  switch (type) {
    case 'boolean':
      return value ? <CheckIcon /> : null;
    default:
      return <span>{value}</span>;
  }
}

export default function Table({ title, columns, records }) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.scroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} data-column-type={column.type}>
                    <h3 className={styles.headCell}>{column.label}</h3>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record, i) => (
                <tr key={i}>
                  {columns.map((column) => (
                    <td key={column.key} data-column-type={column.type}>
                      <div className={styles.cell}>
                        <TabelCellValue
                          value={record[column.key]}
                          type={column.type}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
