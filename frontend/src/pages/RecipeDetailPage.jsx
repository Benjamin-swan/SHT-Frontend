// src/pages/RecipeDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { getRecipeDetail } from '../api/client'

function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('liked_recipes') || '[]')
    if (savedList.some(item => (typeof item === 'object' ? item.id === id : item === id))) {
      setIsSaved(true)
    }

    setLoading(true)
    setError('')
    getRecipeDetail(id)
      .then((res) => setRecipe(res.data))
      .catch(() => setError('레시피 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  const parseInstructions = (instructions) => {
    if (!instructions) return { steps: [], tip: null }
    const parts = instructions.split('[CHEF_TIP]')
    const stepLines = parts[0]
      .split(/\n|(?=\d+\.)/)
      .map((s) => s.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean)
    return {
      steps: stepLines,
      tip: parts[1] ? parts[1].trim() : null
    }
  }

  const handleToggleSave = () => {
    const rawList = JSON.parse(localStorage.getItem('liked_recipes') || '[]')
    const savedList = rawList.filter(item => typeof item === 'object' && item !== null && item.id)

    if (isSaved) {
      localStorage.setItem('liked_recipes', JSON.stringify(savedList.filter(item => item.id !== id)))
    } else {
      const displayTitle = recipe.title ? recipe.title.replace(/\s*\(.*?\)\s*/g, '') : '제목 없음'
      localStorage.setItem('liked_recipes', JSON.stringify([...savedList, {
        id,
        title: displayTitle,
        savedAt: new Date().toISOString()
      }]))
    }
    setIsSaved(!isSaved)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col pt-[60px] md:pt-[77px]">
        <NavBar />
        <div className="flex-1 flex justify-center items-center text-[#78716C] text-sm">
          레시피를 불러오는 중...
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-white flex flex-col pt-[60px] md:pt-[77px]">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#7A0000] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#600000] transition-colors"
          >
            돌아가기
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const parsedData = parseInstructions(recipe.instructions)
  const instructionsList = parsedData.steps
  const displayTip = parsedData.tip || recipe.chef_tip || '이 요리의 조향과 시간 조절이 핵심입니다. 차분히 순서대로 따라오시면 누구나 성공할 수 있습니다!'
  const difficulty = recipe.difficulty || 'EASY'
  const displayTitle = recipe.title ? recipe.title.replace(/\s*\(.*?\)\s*/g, '') : ''

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[60px] md:pt-[77px]">
      <NavBar />

      <main className="flex-1 w-full max-w-[1024px] mx-auto px-4 md:px-10 pt-8 md:pt-16 pb-16 flex flex-col gap-8 md:gap-12">

        {/* 헤더 섹션 */}
        <section className="flex flex-col border-b border-[#E6E2D8] pb-8 gap-4">
          {/* 뒤로가기 */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#494739] hover:text-[#7A0000] transition-colors w-fit"
          >
            {/* 화살표 (lucide 없이 인라인 SVG) */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            <span className="text-sm font-medium">레시피 목록으로</span>
          </button>

          {/* 레시피 제목 */}
          <h1 className="font-semibold text-[22px] md:text-[28px] leading-tight text-[#7A0000] tracking-tight">
            {displayTitle}
          </h1>

          {/* 메타 배지 + 하트 */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button onClick={handleToggleSave} className="flex-shrink-0">
              <svg
                width="22" height="22" viewBox="0 0 24 24" fill={isSaved ? '#B02E21' : 'none'}
                stroke="#B02E21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <div className="flex items-center gap-1.5 bg-[#ECE8DD] px-3 py-1.5 rounded-full">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A0000" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span className="text-xs font-medium text-[#1C1C15]">2인분</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#ECE8DD] px-3 py-1.5 rounded-full">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A0000" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span className="text-xs font-semibold text-[#1C1C15]">
                {recipe.cooking_time_min ? `${recipe.cooking_time_min}분` : '-분'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FEFA99] px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
              <span className="text-xs font-semibold text-[#1C1C15]">{difficulty}</span>
            </div>
          </div>

          {/* 설명 */}
          <p className="text-sm md:text-[15px] leading-relaxed text-[#3B3B3B]">
            {recipe.description || '한국인의 소울푸드, 누구나 실패 없이 만들 수 있는 황금 레시피입니다.'}
          </p>
        </section>

        {/* 2컬럼 레이아웃 */}
        <section className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start w-full">

          {/* 식재료 사이드바 */}
          <aside className="w-full lg:w-[240px] flex-shrink-0 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <h2 className="font-semibold text-[15px] text-[#1C1C15]">필요한 식재료</h2>
            </div>

            <div className="bg-[#F3F4F5] border border-[#2D2E30]/20 rounded-2xl p-4 w-full">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="flex flex-col w-full">
                  {recipe.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className={`flex justify-between items-center py-2.5 border-b border-[#2D2E30]/20 ${idx === recipe.ingredients.length - 1 ? 'border-b-0 pb-0' : ''} ${idx === 0 ? 'pt-0' : ''}`}
                    >
                      <span className="text-sm text-[#1C1C15]">
                        {ing.name} {ing.is_optional && <span className="text-[#78716C] text-xs">(선택)</span>}
                      </span>
                      <span className="text-sm font-semibold text-[#7A0000]">
                        {ing.quantity || '적당량'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#78716C] text-xs py-3 text-center">재료 정보가 없습니다.</p>
              )}
            </div>
          </aside>

          {/* 조리 순서 + 팁 + 안전 */}
          <div className="w-full lg:flex-1 flex flex-col gap-8">

            {/* 조리 순서 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 11l-3 9L9 4l-3 9H2"/><path d="M22 12h-4"/><path d="M20 9l2 3-2 3"/>
                </svg>
                <h2 className="font-semibold text-[15px] md:text-[17px] text-[#1C1C15]">조리 순서</h2>
              </div>

              <div className="flex flex-col gap-8">
                {instructionsList.length > 0 ? (
                  instructionsList.map((step, idx) => (
                    <div key={idx} className="relative flex flex-col pl-12">
                      {/* 단계 번호 (장식용) */}
                      <span
                        className="absolute left-0 top-0 font-extrabold text-[40px] leading-none text-[#FEFA99] select-none"
                        style={{ WebkitTextStroke: '1.5px #B02D20', opacity: 0.5 }}
                      >
                        {idx + 1}
                      </span>
                      <p className="text-sm md:text-[15px] leading-relaxed text-[#494739] mt-1">
                        {step}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#78716C] text-sm">조리 순서 정보가 없습니다.</p>
                )}
              </div>
            </div>

            {/* 셰프의 팁 */}
            <div className="bg-[#FEFA99] border border-[#63610F]/10 rounded-2xl p-5 flex gap-3 mt-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#63610F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26A7 7 0 0 1 12 2z"/><path d="M9 21h6"/><path d="M12 17v4"/>
              </svg>
              <div className="flex flex-col gap-1">
                <h4 className="font-semibold text-sm text-[#63610F]">셰프의 팁</h4>
                <p className="text-xs md:text-sm leading-relaxed text-[#757321]">{displayTip}</p>
              </div>
            </div>

            {/* 안전 유의사항 */}
            <div className="bg-[#FFF3F1] border-l-4 border-[#7A0000] rounded-r-2xl p-4 flex gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#7A0000]">안전 유의사항</span>
                <p className="text-xs md:text-sm leading-relaxed text-[#C93F2F]">
                  본 레시피는 AI가 생성한 참고용 정보입니다. 요리 전 식재료 신선도와 알레르기 유무를 반드시 확인해 주세요.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default RecipeDetailPage
