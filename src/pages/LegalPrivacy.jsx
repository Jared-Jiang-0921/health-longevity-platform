import LegalDocument from '../components/LegalDocument'
import { LEGAL_PRIVACY } from '../data/legalDocumentsI18n'

export default function LegalPrivacy() {
  return <LegalDocument doc={LEGAL_PRIVACY} basePath="/privacy" />
}
