import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedModule from './components/ProtectedModule'
import Home from './pages/Home'
import HealthSkills from './pages/HealthSkills'
import CourseDetail from './pages/CourseDetail'
import CourseLearn from './pages/CourseLearn'
import MyFavorites from './pages/MyFavorites'
import Solutions from './pages/Solutions'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import LongevityNews from './pages/LongevityNews'
import TCMPrevention from './pages/TCMPrevention'
import TranslationOpportunities from './pages/TranslationOpportunities'
import Login from './pages/Login'
import Register from './pages/Register'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import Tax from './pages/Tax'
import LegalTerms from './pages/LegalTerms'
import LegalPrivacy from './pages/LegalPrivacy'
import LegalDisclaimer from './pages/LegalDisclaimer'
import Account from './pages/Account'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/health-skills" element={<ProtectedModule><HealthSkills /></ProtectedModule>} />
        <Route path="/health-skills/:id" element={<ProtectedModule><CourseDetail /></ProtectedModule>} />
        <Route path="/health-skills/:id/learn" element={<ProtectedModule><CourseLearn /></ProtectedModule>} />
        <Route path="/favorites" element={<ProtectedModule><MyFavorites /></ProtectedModule>} />
        <Route path="/solutions" element={<ProtectedModule><Solutions /></ProtectedModule>} />
        <Route path="/products" element={<ProtectedModule><Products /></ProtectedModule>} />
        <Route path="/products/:id" element={<ProtectedModule><ProductDetail /></ProtectedModule>} />
        <Route path="/longevity-news" element={<ProtectedModule><LongevityNews /></ProtectedModule>} />
        <Route path="/tcm-prevention" element={<ProtectedModule><TCMPrevention /></ProtectedModule>} />
        <Route path="/translation-opportunities" element={<ProtectedModule><TranslationOpportunities /></ProtectedModule>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/account" element={<Account />} />
        <Route path="/tax" element={<Tax />} />
        <Route path="/terms" element={<LegalTerms />} />
        <Route path="/privacy" element={<LegalPrivacy />} />
        <Route path="/disclaimer" element={<LegalDisclaimer />} />
      </Routes>
    </Layout>
  )
}
