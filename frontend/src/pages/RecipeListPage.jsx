// src/pages/RecipeListPage.jsx
// 레시피 추천 결과 목록 페이지입니다.
// FridgePage에서 navigate state로 recipes 배열을 받아 카드 형태로 렌더링합니다.
// 카드 클릭 시 레시피 상세 페이지로 이동하고, 클릭 이벤트 로그를 전송합니다.
import { useLocation, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import useRecentRecipes from '../hooks/useRecentRecipes'
import { logRecipeClick } from '../api/client'

function RecipeListPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addRecentRecipe } = useRecentRecipes()

  // FridgePage에서 navigate('/recipes', { state: { recipes, selectedIngredients } })로 전달된 데이터
  const recipes = location.state?.recipes ?? []
  const selectedIngredients = location.state?.selectedIngredients ?? []

  // 레시피 카드 클릭 핸들러
  const handleCardClick = async (recipe) => {
    // 최근 본 레시피에 추가
    addRecentRecipe({ id: recipe.id, title: recipe.title })
    // 로그 전송 (silent fail — 실패해도 이동 계속)
    logRecipeClick(recipe.id)
    // 레시피 상세 페이지로 이동
    navigate(`/recipes/${recipe.id}`)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 페이지 제목 + 선택한 재료 칩 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1C1C15] mb-3">추천 레시피</h1>
          {selectedIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((name) => (
                <span
                  key={name}
                  className="bg-[#FEFA99] text-[#63610F] text-xs font-medium px-3 py-1 rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 레시피 없을 때 안내 */}
        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#78716C] text-base mb-4">추천할 레시피가 없습니다.</p>
            <button
              onClick={() => navigate('/fridge')}
              className="bg-[#7A0000] text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#600000] transition-colors"
            >
              재료 다시 선택하기
            </button>
          </div>
        ) : (
          /* 3열 카드 그리드 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleCardClick(recipe)}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* 이미지 플레이스홀더 */}
                <div className="w-full h-36 bg-[#F5F5F5] rounded-xl mb-4 flex items-center justify-center text-[#78716C] text-sm">
                  이미지 준비 중
                </div>

                {/* 레시피 제목 */}
                <h3 className="font-bold text-[#1C1C15] text-base mb-2 line-clamp-1">
                  {recipe.title}
                </h3>

                {/* 조리 시간 + 매칭률 */}
                <div className="flex items-center justify-between text-xs text-[#78716C]">
                  <span>조리시간 {recipe.cooking_time_min ?? '-'}분</span>
                  {recipe.match_ratio != null && (
                    <span className="text-[#7A0000] font-semibold">
                      재료 {Math.round(recipe.match_ratio * 100)}% 매칭
                    </span>
                  )}
                </div>

                {/* LLM 생성 레시피 뱃지 */}
                {recipe.is_llm_generated && (
                  <span className="inline-block mt-2 bg-[#99CFFE] text-[#195982] text-xs font-medium px-2 py-0.5 rounded-full">
                    AI 추천
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeListPage
