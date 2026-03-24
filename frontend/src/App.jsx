// App.jsx — 앱 전체 라우터 설정
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FridgePage from './pages/FridgePage'
import RecipeListPage from './pages/RecipeListPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import SavedPage from './pages/SavedPage'
import HelpPage from './pages/support/HelpPage'
import SafetyPage from './pages/support/SafetyPage'
import ContactPage from './pages/support/ContactPage'
import TermsPage from './pages/legal/TermsPage'
import PrivacyPage from './pages/legal/PrivacyPage'
import CookiePage from './pages/legal/CookiePage'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* / → 메인(홈) 페이지 */}
        <Route path="/" element={<HomePage />} />

        {/* /fridge → 나의 냉장고 (재료 등록) 페이지 */}
        <Route path="/fridge" element={<FridgePage />} />

        {/* /recipes → 추천 레시피 목록 페이지 */}
        <Route path="/recipes" element={<RecipeListPage />} />

        {/* /recipes/:id → 레시피 상세 페이지 */}
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />

        {/* /saved → 저장된 레시피 (세션 클릭 이력 + localStorage 폴백) */}
        <Route path="/saved" element={<SavedPage />} />

        {/* 푸터 연동 페이지 */}
        <Route path="/support/help" element={<HelpPage />} />
        <Route path="/support/safety" element={<SafetyPage />} />
        <Route path="/support/contact" element={<ContactPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/legal/privacy" element={<PrivacyPage />} />
        <Route path="/legal/cookie" element={<CookiePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
