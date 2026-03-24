// src/pages/HomePage.jsx
// 메인(홈) 페이지입니다.
// 구성: Hero(검색) → 최근 본 레시피 슬라이더 → 냉장고 관리 CTA 배너 → Footer
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import useRecentRecipes from '../hooks/useRecentRecipes'
import { recommendRecipes } from '../api/client'

// 난이도별 뱃지 색상
const DIFFICULTY_STYLE = {
  EASY:   { bg: '#D1FAE5', text: '#065F46', label: '● EASY' },
  NORMAL: { bg: '#7A0000', text: '#FFFFFF', label: '● NORMAL' },
  HARD:   { bg: '#1C1C15', text: '#FFFFFF', label: '● HARD' },
}

// 최근 본 레시피가 없을 때 보여줄 플레이스홀더 카드 데이터
const PLACEHOLDER_RECIPES = [
  { id: 'p1', title: '닭볶음탕', cooking_time_min: 25, kcal: 320, difficulty: 'EASY' },
  { id: 'p2', title: '김치볶음밥', cooking_time_min: 15, kcal: 210, difficulty: 'EASY' },
  { id: 'p3', title: '두부조림', cooking_time_min: 35, kcal: 280, difficulty: 'NORMAL' },
  { id: 'p4', title: '크림 치즈밥', cooking_time_min: 45, kcal: 450, difficulty: 'HARD' },
]

const MAX_INGREDIENTS = 10

function HomePage() {
  const navigate = useNavigate()
  const { recentRecipes } = useRecentRecipes()

  // ── Hero 검색 상태 ──────────────────────────────
  const [inputValue, setInputValue] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(false)

  // 재료 추가 (+버튼 or Enter)
  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || ingredients.includes(trimmed) || ingredients.length >= MAX_INGREDIENTS) {
      setInputValue('')
      return
    }
    setIngredients((prev) => [...prev, trimmed])
    setInputValue('')
  }

  // X 버튼으로 개별 재료 삭제
  const handleRemove = (name) => setIngredients((prev) => prev.filter((i) => i !== name))

  // 전체 삭제
  const handleClearAll = () => setIngredients([])

  // 레시피 조회 버튼 — API 호출 후 결과 페이지 이동
  const handleSearch = async () => {
    if (ingredients.length === 0) return
    setLoading(true)
    try {
      const res = await recommendRecipes(ingredients)
      const recipes = Array.isArray(res.data) ? res.data : (res.data.recipes ?? [])
      navigate('/recipes', { state: { recipes, selectedIngredients: ingredients } })
    } catch {
      alert('레시피 추천에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  // ── 최근 본 레시피 슬라이더 ──────────────────────
  // recentRecipes가 없으면 플레이스홀더 사용
  const displayRecipes = recentRecipes.length > 0 ? recentRecipes : PLACEHOLDER_RECIPES
  const sliderRef = useRef(null)

  // 슬라이더 좌우 스크롤 핸들러
  const scroll = (dir) => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />

      {/* ── Hero 섹션 ─────────────────────────────── */}
      <section
        className="flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #DBEAFE 0%, #FFFDE7 60%, #FFFDE7 100%)',
          minHeight: '380px',
        }}
      >
        <p className="text-[#78716C] text-sm mb-1">안녕하세요.</p>
        <h1 className="text-3xl font-bold text-[#1C1C15] mb-8">
          오늘은 무슨 요리를 만들까요?
        </h1>

        {/* 검색창 */}
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-md">
            <svg className="w-4 h-4 text-[#78716C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="재료 입력"
              className="flex-1 bg-transparent text-sm text-[#1C1C15] placeholder-[#78716C] outline-none"
            />
            <button
              onClick={handleAdd}
              disabled={ingredients.length >= MAX_INGREDIENTS}
              className="w-9 h-9 rounded-full bg-[#7A0000] text-white flex items-center justify-center text-xl font-bold hover:bg-[#600000] transition-colors disabled:opacity-40 flex-shrink-0"
            >
              +
            </button>
          </div>

          {/* 추가된 재료 칩 목록 */}
          {ingredients.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[#78716C] mb-2 px-1">
                <span>입력한 재료 {ingredients.length}/{MAX_INGREDIENTS}</span>
                <button onClick={handleClearAll} className="flex items-center gap-1 hover:text-[#7A0000] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  전체 삭제
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {ingredients.map((name) => (
                  <span key={name} className="flex items-center gap-1.5 bg-white border border-gray-300 text-[#1C1C15] text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                    {name}
                    <button onClick={() => handleRemove(name)} className="text-[#78716C] hover:text-[#7A0000] transition-colors leading-none">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 레시피 조회 버튼 */}
          <button
            onClick={handleSearch}
            disabled={ingredients.length === 0 || loading}
            className="mt-8 bg-[#FEFA99] text-[#7A0000] font-bold text-base px-10 py-3 rounded-full hover:brightness-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? '조회 중...' : '레시피 조회 🍴'}
          </button>
        </div>
      </section>

      {/* ── 최근 본 레시피 슬라이더 ──────────────────── */}
      <section className="px-6 py-10 max-w-5xl mx-auto w-full">
        {/* 섹션 헤더: 제목 + 좌우 화살표 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C1C15]">최근 본 레시피</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#78716C] hover:border-[#7A0000] hover:text-[#7A0000] transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#78716C] hover:border-[#7A0000] hover:text-[#7A0000] transition-colors"
            >
              ›
            </button>
          </div>
        </div>

        {/* 카드 슬라이더 — 가로 스크롤 */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayRecipes.map((recipe) => {
            const diff = DIFFICULTY_STYLE[recipe.difficulty] ?? DIFFICULTY_STYLE.EASY
            return (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="flex-shrink-0 w-48 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
              >
                {/* 이미지 플레이스홀더 */}
                <div className="w-full h-28 bg-[#F5F5F5] rounded-xl mb-3 flex items-center justify-center text-[#78716C] text-xs">
                  이미지 준비 중
                </div>

                {/* 난이도 뱃지 */}
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: diff.bg, color: diff.text }}
                >
                  {diff.label}
                </span>

                {/* 레시피 제목 */}
                <p className="font-bold text-[#1C1C15] text-sm mb-2 truncate">{recipe.title}</p>

                {/* 조리시간 + kcal */}
                <div className="flex flex-col gap-0.5 text-xs text-[#78716C]">
                  {recipe.cooking_time_min && (
                    <span className="flex items-center gap-1">
                      {/* 시계 아이콘 */}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
                      </svg>
                      {recipe.cooking_time_min} mins
                    </span>
                  )}
                  {recipe.kcal && (
                    <span className="flex items-center gap-1">
                      {/* 불꽃 아이콘 */}
                      <svg className="w-3.5 h-3.5 text-[#63610F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                      </svg>
                      {recipe.kcal} kcal
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 냉장고 관리 CTA 배너 ─────────────────────── */}
      <section className="px-6 pb-12 max-w-5xl mx-auto w-full">
        <div
          className="rounded-3xl p-8 flex items-center justify-between gap-6 relative overflow-hidden"
          style={{ backgroundColor: '#FEFA99' }}
        >
          {/* 왼쪽: 냄비 일러스트 플레이스홀더 */}
          <div className="flex-shrink-0 w-32 h-32 relative">
            {/* 냄비 SVG 일러스트 (간단한 대체 표현) */}
            <div className="w-32 h-32 bg-[#7A0000]/10 rounded-full flex items-center justify-center text-5xl">
              🍲
            </div>
          </div>

          {/* 오른쪽: 텍스트 + 버튼 */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#7A0000] mb-2">냉장고 관리를 손쉽게</h3>
            <p className="text-sm text-[#78716C] leading-relaxed mb-5">
              남은 재료로 만드는 마법 같은 레시피를 제안해 드립니다.<br />
              체계적인 식재료 관리로 식비는 절약하고, 매일의 요리는 더 즐겁게.<br />
              지금 바로 재료를 등록하고 요리를 시작해보세요.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/fridge')}
                className="bg-[#7A0000] text-white font-bold text-sm px-7 py-3 rounded-full hover:bg-[#600000] transition-colors"
              >
                시작하기
              </button>
              <span className="text-xs text-[#78716C] flex items-center gap-1">
                {/* 체크 아이콘 */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                식재료 유통기한 관리도 한번에 해보세요
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <Footer />
    </div>
  )
}

export default HomePage
