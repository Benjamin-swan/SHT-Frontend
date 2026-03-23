// App.jsx — 앱 전체 라우터 설정
// React Router v6의 BrowserRouter, Routes, Route를 사용합니다.
// 각 path에 맞는 페이지 컴포넌트를 연결합니다.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputPage from './pages/InputPage'
import RecipeListPage from './pages/RecipeListPage'
import RecipeDetailPage from './pages/RecipeDetailPage'

function App() {
  return (
    // BrowserRouter: 브라우저 URL 기반 라우팅을 활성화합니다.
    <BrowserRouter>
      {/* Routes: 현재 URL과 일치하는 첫 번째 Route만 렌더링합니다. */}
      <Routes>
        {/* / → 식재료 입력 페이지 */}
        <Route path="/" element={<InputPage />} />

        {/* /recipes → 추천 레시피 목록 페이지 */}
        <Route path="/recipes" element={<RecipeListPage />} />

        {/* /recipes/:id → 레시피 상세 페이지 (:id는 동적 파라미터) */}
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
