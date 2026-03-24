// App.jsx — 앱 전체 라우터 설정
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FridgePage from './pages/FridgePage'
import RecipeListPage from './pages/RecipeListPage'
import RecipeDetailPage from './pages/RecipeDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / → 메인(홈) 페이지 */}
        <Route path="/" element={<HomePage />} />

        {/* /fridge → 나의 냉장고 (재료 등록) 페이지 */}
        <Route path="/fridge" element={<FridgePage />} />

        {/* /recipes → 추천 레시피 목록 페이지 */}
        <Route path="/recipes" element={<RecipeListPage />} />

        {/* /recipes/:id → 레시피 상세 페이지 */}
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
