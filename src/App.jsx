import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedModule from './components/ProtectedModule'
import SiteAdminOnly from './components/SiteAdminOnly'
import ModuleAssetsPanel from './components/ModuleAssetsPanel'
import Home from './pages/Home'
import HealthSkills from './pages/HealthSkills'
import CourseDetail from './pages/CourseDetail'
import CourseLearn from './pages/CourseLearn'
import MyFavorites from './pages/MyFavorites'
import Solutions from './pages/Solutions'
import HealthQuestionnaire from './pages/HealthQuestionnaire'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import LongevityNews from './pages/LongevityNews'
import TCMPrevention from './pages/TCMPrevention'
import TranslationOpportunities from './pages/TranslationOpportunities'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Register from './pages/Register'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentOpsMonitor from './pages/PaymentOpsMonitor'
import AdminUsers from './pages/AdminUsers'
import AdminQuestionnaires from './pages/AdminQuestionnaires'
import Tax from './pages/Tax'
import LegalTerms from './pages/LegalTerms'
import LegalPrivacy from './pages/LegalPrivacy'
import LegalDisclaimer from './pages/LegalDisclaimer'
import LegalSale from './pages/LegalSale'
import LegalHealthData from './pages/LegalHealthData'
import LegalCookies from './pages/LegalCookies'
import Account from './pages/Account'
import OrgConsole from './pages/OrgConsole'
import OrgInviteAccept from './pages/OrgInviteAccept'

function WithModuleAssets({ moduleKey, children }) {
  return (
    <>
      {children}
      <ModuleAssetsPanel moduleKey={moduleKey} />
    </>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/health-skills" element={<ProtectedModule><WithModuleAssets moduleKey="health-skills"><HealthSkills /></WithModuleAssets></ProtectedModule>} />
        <Route path="/health-skills/:id" element={<ProtectedModule><WithModuleAssets moduleKey="health-skills"><CourseDetail /></WithModuleAssets></ProtectedModule>} />
        <Route path="/health-skills/:id/learn" element={<ProtectedModule><WithModuleAssets moduleKey="health-skills"><CourseLearn /></WithModuleAssets></ProtectedModule>} />
        <Route path="/favorites" element={<ProtectedModule><WithModuleAssets moduleKey="favorites"><MyFavorites /></WithModuleAssets></ProtectedModule>} />
        <Route path="/solutions" element={<ProtectedModule><WithModuleAssets moduleKey="solutions"><Solutions /></WithModuleAssets></ProtectedModule>} />
        <Route path="/health-questionnaire" element={<ProtectedModule><WithModuleAssets moduleKey="health-questionnaire"><HealthQuestionnaire /></WithModuleAssets></ProtectedModule>} />
        <Route path="/products" element={<ProtectedModule><WithModuleAssets moduleKey="products"><Products /></WithModuleAssets></ProtectedModule>} />
        <Route path="/products/:id" element={<ProtectedModule><WithModuleAssets moduleKey="products"><ProductDetail /></WithModuleAssets></ProtectedModule>} />
        <Route path="/longevity-news" element={<ProtectedModule><WithModuleAssets moduleKey="longevity-news"><LongevityNews /></WithModuleAssets></ProtectedModule>} />
        <Route path="/tcm-prevention" element={<ProtectedModule><WithModuleAssets moduleKey="tcm-prevention"><TCMPrevention /></WithModuleAssets></ProtectedModule>} />
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
    </Layout>
  )
}
