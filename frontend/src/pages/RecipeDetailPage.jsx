// src/pages/RecipeDetailPage.jsx
// 레시피 상세 페이지입니다.
// URL의 :id 파라미터로 GET /recipes/:id API를 호출하여 상세 정보를 렌더링합니다.
// 2컬럼 레이아웃: 왼쪽 재료 목록 / 오른쪽 조리 순서
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getRecipeDetail } from '../api/client'

function RecipeDetailPage() {
  // URL 파라미터에서 레시피 ID 추출 (/recipes/:id)
  const { id } = useParams()
  const navigate = useNavigate()

  // 레시피 상세 데이터 상태
  const [recipe, setRecipe] = useState(null)
  // 로딩 상태
  const [loading, setLoading] = useState(true)
  // 에러 메시지 상태
  const [error, setError] = useState('')

  // 컴포넌트 마운트 시 또는 id 변경 시 API 호출
  useEffect(() => {
    setLoading(true)
    setError('')
    getRecipeDetail(id)
      .then((res) => setRecipe(res.data))
      .catch(() => setError('레시피 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  // 조리 순서 파싱: instructions 문자열을 줄바꿈 또는 숫자 패턴으로 분리
  const parseInstructions = (instructions) => {
    if (!instructions) return []
    // "1. ...\n2. ..." 형태도, "줄바꿈" 형태도 처리
    return instructions
      .split(/\n|(?=\d+\.)/)
      .map((s) => s.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#78716C] hover:text-[#7A0000] mb-6 flex items-center gap-1 transition-colors"
        >
          ← 목록으로
        </button>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-20 text-[#78716C]">레시피를 불러오는 중...</div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/fridge')}
              className="bg-[#7A0000] text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#600000] transition-colors"
            >
              처음으로 돌아가기
            </button>
          </div>
        )}

        {/* 레시피 상세 내용 */}
        {!loading && !error && recipe && (
          <>
            {/* 헤더: 제목 + 메타 정보 */}
            <div className="bg-white rounded-2xl p-6 mb-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1C1C15] mb-2">
                    {recipe.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-[#78716C]">
                    {recipe.cooking_time_min && (
                      <span>⏱ 조리시간 {recipe.cooking_time_min}분</span>
                    )}
                    {recipe.is_llm_generated && (
                      <span className="bg-[#99CFFE] text-[#195982] text-xs font-medium px-2 py-0.5 rounded-full">
                        AI 추천
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2컬럼 레이아웃: 재료 목록 + 조리 순서 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 왼쪽: 재료 목록 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#1C1C15] mb-4">재료</h2>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <span
                          className={
                            ing.is_optional ? 'text-[#78716C]' : 'text-[#1C1C15]'
                          }
                        >
                          {ing.name}
                          {ing.is_optional && (
                            <span className="ml-1 text-xs text-[#78716C]">(선택)</span>
                          )}
                        </span>
                        <span className="text-[#78716C]">{ing.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#78716C] text-sm">재료 정보가 없습니다.</p>
                )}
              </div>

              {/* 오른쪽: 조리 순서 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#1C1C15] mb-4">조리 순서</h2>
                {recipe.instructions ? (
                  <ol className="space-y-3">
                    {parseInstructions(recipe.instructions).map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        {/* 단계 번호 뱃지 */}
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7A0000] text-white text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-[#1C1C15] leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-[#78716C] text-sm">조리 순서 정보가 없습니다.</p>
                )}
              </div>
            </div>

            {/* 안전 경고 섹션 */}
            <div className="mt-5 bg-[#FEFA99] rounded-2xl p-4 text-sm text-[#63610F]">
              <p className="font-semibold mb-1">⚠️ 주의사항</p>
              <p>조리 시 식재료 알레르기 여부를 반드시 확인하세요. AI가 생성한 레시피는 참고용이며, 실제 조리 결과와 다를 수 있습니다.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RecipeDetailPage
