import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function RedirectPage({
  path,
}: {
  /** Path inside the latest version, e.g. `get-started/what-is-amp/`. */
  path: string;
}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const latestVersion = siteConfig.customFields?.latestVersion as string;
  const target = useBaseUrl(`/${latestVersion}/${path}`);
  const canonical = useBaseUrl(`/${latestVersion}/${path}`, {absolute: true});
  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={canonical} />
      </Head>
      <Redirect to={target} />
    </>
  );
}
