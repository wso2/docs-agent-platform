import type {ReactNode} from 'react';
import RedirectPage from '@site/src/components/RedirectPage';


export default function Home(): ReactNode {
  return <RedirectPage path="get-started/what-is-amp/" />;
}
