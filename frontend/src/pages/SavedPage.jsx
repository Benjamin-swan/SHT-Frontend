// src/pages/SavedPage.jsx
// 사용자가 하트(좋아요)를 누른 "저장된 레시피" 목록을 보여주는 페이지입니다.
// 레시피가 일정 수 이상 쌓이면 페이지네이션(이전/다음)으로 나눠서 보여줍니다.
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { getInteractionLogs } from '../api/client'

// 한 페이지에 보여줄 레시피 수
// 웹(lg 이상): 3열 × 3행 = 9개 / 모바일: 1열 × 6행 = 6개
// 단순하게 화면 너비로 분기하는 대신, 9개를 기준으로 통일합니다.
// (그리드 레이아웃이 반응형이므로 카드 수만 맞추면 깔끔하게 채워집니다.)
const PAGE_SIZE = 6

function SavedPage() {
  const navigate = useNavigate()
  const [savedRecipes, setSavedRecipes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // 로컬 데이터 먼저 렌더링 (빠른 UI 응답성)
    try {
      const rawList = JSON.parse(localStorage.getItem('liked_recipes') || '[]')
      const validList = rawList.filter(item => typeof item === 'object' && item !== null && item.id)
      validList.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
      if (validList.length > 0) setSavedRecipes(validList)
    } catch { }

    // 백엔드 로그 데이터를 통해 동기화 (최신성 및 기기 연동 보장)
    const sessionId = localStorage.getItem('session_id')
    if (sessionId) {
      getInteractionLogs(sessionId)
        .then(res => {
          const actionMap = new Map() // recipe_id -> is_saved (true/false)
          const metaMap = new Map()   // recipe_id -> metadata
          
          // res.data는 기본적으로 최신순 내림차순(Created At Desc)이므로 역순(Asc)으로 순회하여 최신 상태 덮어쓰기
          const logs = [...res.data].reverse()
          logs.forEach(log => {
            if (log.event_type === 'recipe_save') {
              actionMap.set(log.recipe_id, true)
              metaMap.set(log.recipe_id, {
                id: log.recipe_id,
                title: log.recipe_title,
                savedAt: log.created_at
              })
            } else if (log.event_type === 'recipe_unsave') {
              actionMap.set(log.recipe_id, false)
            }
          })

          const backendSavedList = Array.from(actionMap.entries())
            .filter(([_, isSaved]) => isSaved) // 저장 상태가 활성인 것들만 필터링
            .map(([id]) => metaMap.get(id))

          backendSavedList.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
          
          setSavedRecipes(backendSavedList)
          // 서버 데이터 기준으로 로컬스토리지 최신 동기화
          localStorage.setItem('liked_recipes', JSON.stringify(backendSavedList))
        })
        .catch(() => {})
    }
  }, [])

  // 총 페이지 수
  const totalPages = Math.ceil(savedRecipes.length / PAGE_SIZE)

  // 현재 페이지에 해당하는 레시피 슬라이스
  const pagedRecipes = savedRecipes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // 페이지 이동 시 스크롤을 상단으로 올립니다.
  const goToPage = useCallback((page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
          <>
            {/* 레시피 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pagedRecipes.map((recipe) => (
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

            {/* 페이지네이션 — 저장된 레시피가 7개 이상일 때만 표시 */}
            {savedRecipes.length >= 7 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                {/* 이전 버튼 */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E6E2D8] bg-white text-[#78716C] hover:bg-[#F3F4F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="이전 페이지"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>

                {/* 페이지 번호 목록 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-colors
                      ${currentPage === page
                        ? 'bg-[#7A0000] text-white shadow-sm'
                        : 'border border-[#E6E2D8] bg-white text-[#78716C] hover:bg-[#F3F4F5]'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                {/* 다음 버튼 */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E6E2D8] bg-white text-[#78716C] hover:bg-[#F3F4F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="다음 페이지"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default SavedPage
