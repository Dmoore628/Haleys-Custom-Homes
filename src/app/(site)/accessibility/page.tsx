import { legalDocs } from '@content/legal';
import { LegalPage, legalMetadata } from '@/components/sections/LegalPage';

export const metadata = legalMetadata(legalDocs.accessibility);

export default function Page() {
  return <LegalPage doc={legalDocs.accessibility} />;
}
