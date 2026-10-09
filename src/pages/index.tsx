import Head from '@docusaurus/Head';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const latestVersion = siteConfig.customFields?.latestVersion as string;
  const target = useBaseUrl(`/${latestVersion}/get-started/what-is-amp/`);
  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
      </Head>
      <Redirect to={target} />
    </>
  );
}
