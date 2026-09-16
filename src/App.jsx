import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedModule from './components/ProtectedModule'
import SiteAdminOnly from './components/SiteAdminOnly'
import ModuleAssetsPanel from './components/ModuleAssetsPanel'
import Home from './pages/Home'

const HealthSkills = lazy(() => import('./pages/HealthSkills'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const CourseLearn = lazy(() => import('./pages/CourseLearn'))
const MyFavorites = lazy(() => import('./pages/MyFavorites'))
const Solutions = lazy(() => import('./pages/Solutions'))
const Consult = lazy(() => import('./pages/Consult'))
const HealthQuestionnaire = lazy(() => import('./pages/HealthQuestionnaire'))
const RiskAssessments = lazy(() => import('./pages/RiskAssessments'))
const AgingAssessments = lazy(() => import('./pages/AgingAssessments'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const LongevityNews = lazy(() => import('./pages/LongevityNews'))
const TCMPrevention = lazy(() => import('./pages/TCMPrevention'))
const TranslationOpportunities = lazy(() => import('./pages/TranslationOpportunities'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Register = lazy(() => import('./pages/Register'))
const Payment = lazy(() => import('./pages/Payment'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const PaymentOpsMonitor = lazy(() => import('./pages/PaymentOpsMonitor'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))
const AdminQuestionnaires = lazy(() => import('./pages/AdminQuestionnaires'))
const AdminConsultReviews = lazy(() => import('./pages/AdminConsultReviews'))
const AdminConsultQuota = lazy(() => import('./pages/AdminConsultQuota'))
const AdminConsultFeedback = lazy(() => import('./pages/AdminConsultFeedback'))
const Tax = lazy(() => import('./pages/Tax'))
const LegalTerms = lazy(() => import('./pages/LegalTerms'))
const LegalPrivacy = lazy(() => import('./pages/LegalPrivacy'))
const LegalDisclaimer = lazy(() => import('./pages/LegalDisclaimer'))
const LegalSale = lazy(() => import('./pages/LegalSale'))
const LegalHealthData = lazy(() => import('./pages/LegalHealthData'))
const LegalCookies = lazy(() => import('./pages/LegalCookies'))
const Account = lazy(() => import('./pages/Account'))
const OrgConsole = lazy(() => import('./pages/OrgConsole'))
const OrgInviteAccept = lazy(() => import('./pages/OrgInviteAccept'))

function WithModuleAssets({ moduleKey, children }) {
  return (
    <>
      {children}
      <ModuleAssetsPanel key={moduleKey} moduleKey={moduleKey} />
    </>
  )
}

function PageFallback() {
  return (
    <div className="page-content" aria-busy="true">
      加载中…
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health-skills" element={<ProtectedModule><WithModuleAssets moduleKey="health-skills"><HealthSkills /></WithModuleAssets></ProtectedModule>} />
          <Route path="/health-skills/:id" element={<ProtectedModule><WithModuleAssets moduleKey="health-skills"><CourseDetail /></WithModuleAssets></ProtectedModule>} />
          <Route path="/health-skills/:id/learn" element={<ProtectedModule><WithModuleAssets moduleKey="health-skills"><CourseLearn /></WithModuleAssets></ProtectedModule>} />
          <Route path="/favorites" element={<ProtectedModule><WithModuleAssets moduleKey="favorites"><MyFavorites /></WithModuleAssets></ProtectedModule>} />
          <Route path="/solutions" element={<ProtectedModule><Solutions /></ProtectedModule>} />
          <Route path="/solutions/risk" element={<ProtectedModule><RiskAssessments /></ProtectedModule>} />
          <Route path="/solutions/aging" element={<ProtectedModule><AgingAssessments /></ProtectedModule>} />
          <Route path="/consult" element={<ProtectedModule><Consult /></ProtectedModule>} />
          <Route path="/health-questionnaire" element={<ProtectedModule><WithModuleAssets moduleKey="health-questionnaire"><HealthQuestionnaire /></WithModuleAssets></ProtectedModule>} />
          <Route path="/products" element={<ProtectedModule><Products /></ProtectedModule>} />
          <Route path="/products/:id" element={<ProtectedModule><ProductDetail /></ProtectedModule>} />
          <Route path="/tcm-prevention" element={<ProtectedModule><WithModuleAssets moduleKey="tcm-prevention"><TCMPrevention /></WithModuleAssets></ProtectedModule>} />
          <Route path="/longevity-news" element={<ProtectedModule><WithModuleAssets moduleKey="longevity-news"><LongevityNews /></WithModuleAssets></ProtectedModule>} />
          <Route path="/translation-opportunities" element={<ProtectedModule><WithModuleAssets moduleKey="translation-opportunities"><TranslationOpportunities /></WithModuleAssets></ProtectedModule>} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<WithModuleAssets moduleKey="payment"><Payment /></WithModuleAssets>} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/ops/payment-monitor" element={<SiteAdminOnly><PaymentOpsMonitor /></SiteAdminOnly>} />
          <Route path="/ops/users" element={<SiteAdminOnly><AdminUsers /></SiteAdminOnly>} />
          <Route path="/ops/health-questionnaires" element={<SiteAdminOnly><AdminQuestionnaires /></SiteAdminOnly>} />
          <Route path="/ops/consult-reviews" element={<SiteAdminOnly><AdminConsultReviews /></SiteAdminOnly>} />
          <Route path="/ops/consult-quota" element={<SiteAdminOnly><AdminConsultQuota /></SiteAdminOnly>} />
          <Route path="/ops/consult-feedback" element={<SiteAdminOnly><AdminConsultFeedback /></SiteAdminOnly>} />
          <Route path="/account" element={<WithModuleAssets moduleKey="account"><Account /></WithModuleAssets>} />
          <Route path="/org" element={<SiteAdminOnly><OrgConsole /></SiteAdminOnly>} />
          <Route path="/org/invite/accept" element={<ProtectedModule><OrgInviteAccept /></ProtectedModule>} />
          <Route path="/tax" element={<WithModuleAssets moduleKey="tax"><Tax /></WithModuleAssets>} />
          <Route path="/terms" element={<LegalTerms />} />
          <Route path="/privacy" element={<LegalPrivacy />} />
          <Route path="/disclaimer" element={<LegalDisclaimer />} />
          <Route path="/legal/sale" element={<LegalSale />} />
          <Route path="/legal/health-data" element={<LegalHealthData />} />
          <Route path="/legal/cookies" element={<LegalCookies />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
