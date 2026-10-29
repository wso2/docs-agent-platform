import React from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc, useDocsVersion } from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import DocMarkdownActions from '@site/src/components/DocMarkdownActions';
import styles from '@docusaurus/theme-classic/lib/theme/DocItem/Layout/styles.module.css';
import localStyles from './styles.module.css';

function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;
  return {
    hidden,
    mobile,
    desktop,
  };
}

function DocStructuredData() {
  const { metadata } = useDoc();
  const version = useDocsVersion();
  const { siteConfig } = useDocusaurusContext();
  const permalink =
    siteConfig.trailingSlash && !metadata.permalink.endsWith('/')
      ? `${metadata.permalink}/`
      : metadata.permalink;
  const url = `${siteConfig.url}${permalink}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: metadata.title,
    description: metadata.description || undefined,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en',
    version: version.label,
    dateModified: metadata.lastUpdatedAt
      ? new Date(metadata.lastUpdatedAt).toISOString()
      : undefined,
    isPartOf: { '@id': 'https://wso2.com/agent-platform/docs/#website' },
    publisher: { '@id': 'https://wso2.com/#organization' },
  };
  return (
    <Head>
      <meta property="og:type" content="article" />
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Head>
  );
}

export default function DocItemLayout({ children }: { children: React.ReactNode }) {
  const docTOC = useDocTOC();
  const { metadata } = useDoc();

  return (
    <div className="row">
      <div className={clsx('col', styles.docItemCol)}>
        <DocStructuredData />
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <div className={localStyles.breadcrumbRow}>
              <DocBreadcrumbs />
              <DocMarkdownActions className={localStyles.inlineActions} />
            </div>
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
