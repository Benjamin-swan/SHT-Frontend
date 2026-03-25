// src/pages/HomePage.jsx
// 메인(홈) 페이지입니다.
// 구성: Hero(검색) → 최근 본 레시피 슬라이더 → 냉장고 관리 CTA 배너 → Footer
import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import useRecentRecipes from '../hooks/useRecentRecipes'
import { recommendRecipes } from '../api/client'

// 최근 본 레시피가 없을 때 보여줄 플레이스홀더 카드 데이터
const PLACEHOLDER_RECIPES = [
  { id: 'p1', title: '닭볶음탕', cooking_time_min: 25, difficulty: 'EASY' },
  { id: 'p2', title: '김치볶음밥', cooking_time_min: 15, difficulty: 'EASY' },
  { id: 'p3', title: '두부조림', cooking_time_min: 35, difficulty: 'NORMAL' },
  { id: 'p4', title: '크림 치즈밥', cooking_time_min: 45, difficulty: 'HARD' },
]

const MAX_INGREDIENTS = 10

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { recentRecipes } = useRecentRecipes()

  // ── Hero 검색 상태 ──────────────────────────────
  // FridgePage에서 navigate('/', { state: { selectedIngredients } })로 전달된 재료를 초기값으로 사용
  const [inputValue, setInputValue] = useState('')
  const [ingredients, setIngredients] = useState(
    () => location.state?.selectedIngredients ?? []
  )
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
      alert('해당 식재료로 레시피를 제작할 수 없습니다.')
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
    <div className="min-h-screen bg-white flex flex-col pt-[77px]">
      <NavBar />

      {/* ── Hero 섹션 ─────────────────────────────── */}
      <section
        className="flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #DBEAFE 0%, #FFFDE7 60%, #FFFDE7 100%)',
          minHeight: '380px',
        }}
      >
        {/* 트렌디한 뱃지 (Hook-in) */}
        <div className="inline-flex items-center gap-2 text-[#7A0000] text-sm font-bold tracking-wide mb-6">
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B02D20] opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7A0000]"></span>
          </span>
          AI추천 맛있는 레시피 뚝딱
        </div>

        {/* 메인 타이틀 (시선 집중 최적화) */}
        <h1 className="text-[28px] sm:text-[34px] md:text-[44px] leading-[1.35] md:leading-[1.4] font-extrabold text-[#1C1C15] tracking-[-0.02em] mb-5">
          냉장고 속 재료만 <span className="bg-gradient-to-r from-[#7A0000] to-[#E35D5D] text-transparent bg-clip-text">알려주세요</span><br />
          오늘을 위한 <span className="text-[#7A0000] relative inline-block z-10 w-fit">
            최적의 레시피
            {/* 반응형 형광펜 밑줄 효과 */}
            <span className="absolute bottom-1.5 md:bottom-2 left-0 w-full h-[30%] bg-[#FEFA99] -z-10 rounded-sm rounded-br-2xl opacity-90"></span>
          </span>
        </h1>

        {/* 서브 타이틀 (반응형) */}
        <p className="text-[#605A55] text-sm md:text-base font-medium mb-10 mx-auto leading-relaxed break-keep max-w-[90vw] md:whitespace-nowrap">
          버려지는 식재료 없이, 매일 새롭고 맛있는 한 끼를 완성하세요.
        </p>

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
              onKeyDown={(e) => {
                // isComposing: 한글 IME 조합 중 Enter 중복 입력 방지
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd()
              }}
              placeholder="재료 입력"
              className="flex-1 bg-transparent text-sm text-[#1C1C15] placeholder-[#78716C] outline-none"
            />
            <button
              onClick={handleAdd}
              disabled={ingredients.length >= MAX_INGREDIENTS}
              className="w-9 h-9 rounded-full bg-[#7A0000] flex items-center justify-center hover:bg-[#600000] transition-colors disabled:opacity-40 flex-shrink-0"
              aria-label="재료 추가"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="M12 5v14"/>
              </svg>
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
          {loading ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              {/* 원형 스피너: border-t 색상만 진하게 → 회전하면서 스피너처럼 보임 */}
              <div className="w-11 h-11 rounded-full border-4 border-[#FEFA99] border-t-[#7A0000] animate-spin" />
              <p className="text-sm text-[#78716C] animate-pulse">레시피를 찾고 있어요...</p>
            </div>
          ) : (
            <button
              onClick={handleSearch}
              disabled={ingredients.length === 0}
              className="mt-8 mx-auto bg-[#FEFA99] text-[#7A0000] font-bold text-base px-10 py-3 rounded-full hover:brightness-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
            >
              레시피 조회
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>
              </svg>
            </button>
          )}
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
            return (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="flex-shrink-0 w-48 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
              >
                {/* 레시피 제목 */}
                <p className="font-bold text-[#1C1C15] text-sm mb-2 truncate">{recipe.title ? recipe.title.replace(/\s*\(.*?\)\s*/g, '') : ''}</p>

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
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 냉장고 관리 CTA 배너 ─────────────────────── */}
      <section className="px-6 pb-12 max-w-5xl mx-auto w-full">
        <div
          className="rounded-3xl py-10 px-10 flex items-center justify-between gap-8 relative overflow-hidden"
          style={{ backgroundColor: '#FEFA99' }}
        >
          {/* 왼쪽: 냄비 SVG 일러스트 — 모바일에서 숨김 */}
          <div className="hidden md:block flex-shrink-0">
            <svg width="160" height="160" viewBox="0 0 272 272" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M156.142 244.771C72.2218 265.333 37.2073 213.916 30.4928 181.096L252.646 126.666C259.609 160.702 243.69 223.321 156.142 244.771Z" fill="#D74949"/>
              <path d="M252.646 126.665C259.514 160.232 215.35 199.628 154.004 214.659C92.658 229.689 37.3603 214.663 30.493 181.096C23.6257 147.529 67.7893 108.133 129.135 93.1021C190.481 78.0716 245.779 93.0985 252.646 126.665Z" fill="#AF1A1A"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M33.7847 201.947C35.8521 202.368 37.901 201.756 39.0219 201.114C41.2595 199.833 44.0183 200.77 45.1839 203.208C46.3494 205.646 45.4803 208.661 43.2427 209.942C40.6656 211.418 36.5342 212.658 32.0793 211.752C27.3692 210.794 22.7972 207.529 19.6543 200.956C16.5113 194.382 16.6675 188.411 18.6338 183.63C20.4936 179.108 23.78 176.101 26.3571 174.625C28.5947 173.344 31.3535 174.281 32.519 176.719C33.6846 179.157 32.8155 182.172 30.5779 183.453C29.457 184.095 27.8296 185.588 26.9665 187.686C26.21 189.526 25.8344 192.294 27.7574 196.316C29.6803 200.338 31.9726 201.578 33.7847 201.947Z" fill="#AF1A1A"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M254.427 120.04C254.089 122.314 252.868 124.222 251.933 125.164C250.078 127.032 249.957 130.19 251.663 132.219C253.368 134.247 256.255 134.377 258.109 132.51C260.246 130.359 262.707 126.528 263.433 121.636C264.202 116.462 262.941 110.644 258.344 105.177C253.747 99.7102 248.554 97.8524 243.779 98.2611C239.264 98.6475 235.571 101.014 233.435 103.165C231.58 105.032 231.459 108.191 233.165 110.219C234.87 112.248 237.757 112.378 239.611 110.51C240.546 109.569 242.385 108.396 244.484 108.216C246.323 108.059 248.825 108.608 251.627 111.941C254.43 115.274 254.722 118.048 254.427 120.04Z" fill="#AF1A1A"/>
              <path d="M98.8354 209.361C41.3729 205.774 12.6643 136.583 1.23306 99.313C109.61 37.6442 61.4578 182.216 118.445 161.967C164.034 145.767 178.212 180.276 178.628 194.785C179.601 197.468 151.718 212.661 98.8354 209.361Z" fill="#FFE5C6"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M55.3959 85.2795C61.9046 95.4187 67.0719 111.847 65.3859 136.767C61.6848 191.474 83.8915 207.637 134.474 179.04C146.72 172.117 155.929 167.599 163.116 164.903C153.72 157.788 139.401 154.519 118.444 161.966C94.8587 170.347 89.2829 150.495 83.1659 128.716C78.006 110.345 72.461 90.6027 55.3959 85.2795Z" fill="#FDD3A1"/>
              <path d="M70.2712 52.1464C71.9456 60.3459 59.9083 70.2808 43.385 74.3365C26.8617 78.3923 12.1096 75.0331 10.4351 66.8336C8.76067 58.6341 20.798 48.6992 37.3213 44.6434C53.8446 40.5877 68.5967 43.9468 70.2712 52.1464Z" fill="#FFE5C6"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M29.8403 46.4074C32.2506 45.4695 34.8192 44.6544 37.5064 43.9948C54.0297 39.939 68.7819 43.2982 70.4563 51.4977C71.5815 57.0077 66.5149 63.3013 58.0562 68.0679C57.4071 66.7989 57.0148 65.0802 57.0148 62.7905C57.0148 53.1579 43.1306 49.7442 35.5308 49.1618C33.3287 48.4408 31.1272 47.4707 29.8403 46.4074Z" fill="#FDD3A1"/>
              <path d="M56.1185 11.0042C57.4581 17.0816 54.2577 22.983 48.9702 24.1855C43.6828 25.3879 38.3105 21.436 36.971 15.3586C35.6314 9.28119 38.8318 3.37972 44.1193 2.17729C49.4067 0.974851 54.779 4.92678 56.1185 11.0042Z" fill="#FF9500"/>
              <path d="M21.573 48.4019C22.9126 54.4793 19.7122 60.3807 14.4247 61.5832C9.13729 62.7856 3.76505 58.8337 2.42549 52.7563C1.08594 46.6789 4.28634 40.7774 9.57378 39.575C14.8612 38.3726 20.2335 42.3245 21.573 48.4019Z" fill="#FF9500"/>
              <path d="M149.88 132.851C151.219 138.928 148.019 144.829 142.732 146.032C137.444 147.234 132.072 143.282 130.732 137.205C129.393 131.128 132.593 125.226 137.881 124.024C143.168 122.821 148.54 126.773 149.88 132.851Z" fill="#FF9500"/>
              <path d="M74.2941 112.778C80.3193 126.43 100.58 127.504 109.957 126.335C113.744 124.511 122.15 118.94 125.482 111.249C129.647 101.635 126.008 85.1286 116.722 82.9071C109.292 81.1299 109.052 88.0216 109.861 91.6896C103.143 80.2172 86.8991 59.3555 75.6659 67.6879C64.4326 76.0204 75.4321 91.3339 82.3359 97.9491C77.1448 97.2037 68.2688 99.1259 74.2941 112.778Z" fill="#89C947"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M90.308 85.1257C91.1951 84.126 92.7616 84.0813 93.8067 85.0258C97.0743 87.9788 101.641 94.2987 105.268 101.022C107.102 104.422 108.748 108.018 109.891 111.455C111.022 114.856 111.724 118.285 111.5 121.276C111.398 122.64 110.207 123.603 108.84 123.428C107.473 123.253 106.447 122.005 106.549 120.641C106.702 118.6 106.224 115.912 105.189 112.802C104.167 109.728 102.662 106.419 100.93 103.209C97.4269 96.7156 93.2049 91.0055 90.5941 88.646C89.549 87.7015 89.4209 86.1254 90.308 85.1257Z" fill="#368C0E"/>
              <path d="M80.1289 174.262C76.4324 184.525 61.1842 185.144 54.0222 184.171C51.0447 182.756 44.3393 178.465 41.3372 172.619C37.5847 165.312 39.2972 152.868 46.1778 151.277C51.6822 150.005 52.2972 155.217 51.9166 157.982C56.2736 149.373 67.2415 133.757 76.2571 140.163C85.2727 146.569 77.9205 158.04 73.1174 162.976C76.9948 162.461 83.8254 163.999 80.1289 174.262Z" fill="#89C947"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M66.7065 152.799C65.7677 151.756 64.2259 151.663 63.2627 152.591C60.9047 154.863 57.8118 159.674 55.4771 164.755C54.2929 167.333 53.2588 170.075 52.5978 172.715C51.9465 175.315 51.6074 178.009 51.9868 180.412C52.2056 181.798 53.4589 182.789 54.7859 182.625C56.113 182.461 57.0114 181.203 56.7925 179.817C56.5709 178.413 56.7393 176.494 57.3155 174.193C57.8821 171.931 58.7958 169.483 59.8913 167.098C62.1161 162.256 64.9106 158.056 66.6624 156.368C67.6255 155.44 67.6453 153.842 66.7065 152.799Z" fill="#368C0E"/>
              <path d="M220.906 170.949C213.987 180.611 198.897 187.028 192.216 189.029C172.143 183.483 187.669 168.396 195.727 159.341C203.784 150.287 229.554 158.871 220.906 170.949Z" fill="#FFE5C6"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M195.83 159.223C204.005 150.36 229.515 158.922 220.904 170.948C218.752 173.952 215.811 176.643 212.578 178.984C210.917 177.819 209.73 175.563 209.73 171.58C209.73 164.7 202.647 160.993 195.83 159.223Z" fill="#FDD3A1"/>
            </svg>
          </div>

          {/* 오른쪽: 텍스트 + 버튼 */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#7A0000] mb-2">냉장고 관리를 손쉽게</h3>
            <p className="text-sm text-[#78716C] leading-relaxed mb-5">
              남은 재료로 만드는 마법 같은 레시피를 제안해 드립니다.<br />
              체계적인 식재료 관리로 식비는 절약하고, 매일의 요리는 더 즐겁게.<br />
              지금 바로 재료를 등록하고 요리를 시작해보세요.
            </p>
            <div className="flex flex-col gap-3 items-center md:items-start">
              <span className="text-xs text-[#78716C] flex items-center gap-1">
                {/* 체크 아이콘 */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                식재료 유통기한 관리도 한번에 해보세요
              </span>
              <button
                onClick={() => navigate('/fridge')}
                className="bg-[#7A0000] text-white font-bold text-sm px-7 py-3 rounded-full hover:bg-[#600000] transition-colors w-fit"
              >
                시작하기
              </button>
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
