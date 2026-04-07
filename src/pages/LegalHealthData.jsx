import LegalDocument from '../components/LegalDocument'
import { LEGAL_HEALTH_DATA } from '../data/legalDocumentsI18n'

export default function LegalHealthData() {
  return <LegalDocument doc={LEGAL_HEALTH_DATA} basePath="/legal/health-data" />
}
