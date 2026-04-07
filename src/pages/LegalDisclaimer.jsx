import LegalDocument from '../components/LegalDocument'
import { LEGAL_HEALTH_DISCLAIMER } from '../data/legalDocumentsI18n'

export default function LegalDisclaimer() {
  return <LegalDocument doc={LEGAL_HEALTH_DISCLAIMER} basePath="/disclaimer" />
}
