import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function HomepageTable() {
  return (
    <div className={clsx('container', styles.wrapper)}>
      <div className={clsx('row', styles.body)}>
        <p className={styles.title}>Which tool is right for you?</p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Implementation</th>
              <th scope="col">JavaScript UI kit</th>
              <th scope="col">Command line utility</th>
              <th scope="col">Full SDK</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="row">View data</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td scope="row">Write data</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td scope="row">Lorem ipsum dolor sit amet</td>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <td scope="row">Lorem ipsum dolor sit amet</td>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <td scope="row">Lorem ipsum dolor sit amet</td>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <td scope="row">Lorem ipsum dolor sit amet</td>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <td scope="row">Lorem ipsum dolor sit amet</td>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <td scope="row">Lorem ipsum dolor sit amet</td>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
