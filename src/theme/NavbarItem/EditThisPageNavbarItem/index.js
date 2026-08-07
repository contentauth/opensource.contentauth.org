import React, { useSyncExternalStore } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
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

  return (
    <Link
      to={editUrl}
      className={clsx(className)}
      aria-label="Edit this page"
      title="Edit this page"
    />
  );
}
