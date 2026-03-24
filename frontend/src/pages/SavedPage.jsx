// src/pages/SavedPage.jsx
// 사용자가 하트(좋아요)를 누른 "저장된 레시피" 목록을 보여주는 페이지입니다.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

function SavedPage() {
  const navigate = useNavigate()
  const [savedRecipes, setSavedRecipes] = useState([])

  useEffect(() => {
    try {
      const rawList = JSON.parse(localStorage.getItem('liked_recipes') || '[]')
      const validList = rawList.filter(item => typeof item === 'object' && item !== null && item.id)
      validList.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
      setSavedRecipes(validList)
    } catch {
      setSavedRecipes([])
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F3F4F5] pt-[60px] md:pt-[77px]">
      <NavBar />

      <main className="w-full max-w-[1024px] mx-auto px-4 md:px-8 pt-8 md:pt-14 pb-16 flex flex-col gap-6 md:gap-8">

        {/* 헤더 */}
        <div className="flex flex-col gap-1 border-b border-[#E6E2D8] pb-5">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#7A0000]">
            저장된 레시피
          </h1>
          <p className="text-xs md:text-sm text-[#78716C]">
            마음에 들어 찜해둔 나만의 레시피 목록입니다.
          </p>
        </div>

        {/* 빈 상태 */}
        {savedRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            {/* 하트 아이콘 (인라인 SVG) */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E6E2D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p className="text-[#78716C] text-sm">아직 저장된 레시피가 없습니다.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 bg-[#7A0000] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#600000] transition-colors shadow-sm"
            >
              새로운 레시피 찾으러 가기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="flex flex-col p-4 md:p-5 bg-white border border-[#E6E2D8]/50 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow relative"
              >
                {/* 저장 하트 */}
                <div className="absolute top-4 right-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#B02E21" stroke="#B02E21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>

                <h3 className="font-semibold text-[14px] md:text-[15px] leading-snug text-[#1C1C15] pr-7 mb-3 line-clamp-2 min-h-[40px]">
                  {recipe.title}
                </h3>

                <div className="border-t border-[#E6E2D8] pt-3 mt-auto">
                  <p className="text-xs text-[#9CA3AF]">
                    {new Date(recipe.savedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })} 저장됨
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default SavedPage
