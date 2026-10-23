import React, { useSyncExternalStore } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import {
  getEditThisPageUrl,
  subscribeEditThisPageUrl,
} from '@site/src/utils/editThisPageStore';

const getServerSnapshot = () => undefined;

export default function EditThisPageNavbarItem({ className }) {
  const editUrl = useSyncExternalStore(
    subscribeEditThisPageUrl,
    getEditThisPageUrl,
    getServerSnapshot,
  );

  if (!editUrl) {
    return null;
  }

  const label = translate({
    id: 'theme.common.editThisPage',
    message: 'Edit this page',
  });

  return (
    <Link
      to={editUrl}
      className={clsx(className)}
      aria-label={label}
      title={label}
    />
  );
}
