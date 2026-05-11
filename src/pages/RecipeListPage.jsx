// src/pages/RecipeListPage.jsx
// 레시피 추천 결과 목록 페이지입니다.
// FridgePage에서 navigate state로 recipes 배열을 받아 카드 형태로 렌더링합니다.
// 카드 클릭 시 레시피 상세 페이지로 이동하고, 클릭 이벤트 로그를 전송합니다.
import { useLocation, useNavigate } from 'react-router-dom'
import NavBar from '@shared/ui/NavBar'
import Footer from '@shared/ui/Footer'
import useRecentRecipes from '@features/recipe/hooks/useRecentRecipes'
import { logRecipeInteraction } from '@features/recipe/api'

function RecipeListPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addRecentRecipe } = useRecentRecipes()

  const recipes = location.state?.recipes ?? []
  const selectedIngredients = location.state?.selectedIngredients ?? []

  const handleCardClick = async (recipe) => {
    addRecentRecipe({
      id: recipe.id,
      title: recipe.title,
      cooking_time_min: recipe.cooking_time_min
    })
    logRecipeInteraction(recipe.id, 'recipe_click')
    navigate(`/recipes/${recipe.id}`)
  }

  return (
    <div className="min-h-screen bg-[#F3F4F5] flex flex-col">
      <NavBar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-16 flex flex-col gap-8 md:gap-12">

        {/* 상단 타이틀 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-[32px] font-semibold tracking-tight text-[#1C1C15]">
            레시피 조회 결과
          </h1>
          <p className="text-sm text-[#78716C]">선택된 식재료</p>
        </div>

        {/* 선택된 식재료 칩 영역 */}
        <div className="bg-white rounded-3xl py-5 px-4 w-full flex flex-wrap justify-center items-center gap-2 md:gap-3">
          {selectedIngredients.length > 0 ? (
            selectedIngredients.map((name, idx) => {
              const bgClass = idx % 2 === 0 ? 'bg-[#99CFFE]' : 'bg-[#FEFA99]'
              return (
                <div
                  key={name}
                  className={`flex items-center px-4 py-2 gap-2 rounded-full ${bgClass}`}
                >
                  <div className="w-2 h-2 flex-shrink-0">
                    <div className="w-2 h-2 bg-[#550303]" style={{ clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)' }} />
                  </div>
                  <span className="text-sm md:text-base font-medium text-[#550303]">
                    {name}
                  </span>
                </div>
              )
            })
          ) : (
            <p className="text-[#78716C] text-sm py-3">선택된 식재료가 없습니다.</p>
          )}
        </div>

        {/* 추천 레시피 섹션 */}
        <div className="flex flex-col gap-6">
          {/* 섹션 헤더 */}
          <div className="flex justify-between items-end w-full pb-2 border-b border-[#E6E2D8]">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg md:text-xl font-semibold text-[#1C1C15]">추천 레시피</h2>
              <p className="text-xs md:text-sm text-[#78716C]">
                선택한 재료로 만들 수 있는 최고의 요리들입니다.
              </p>
            </div>
            <button className="flex flex-col justify-center items-center p-2.5 w-9 h-8 bg-[#ECE8DD] rounded-full hover:bg-[#E2DECD] transition-colors">
              <svg width="16" height="10" viewBox="0 0 18 12" fill="none">
                <path d="M7 12H11V10H7V12ZM0 0V2H18V0H0ZM3 7H15V5H3V7Z" fill="#1C1C15"/>
              </svg>
            </button>
          </div>

          {/* 레시피 결과 */}
          {recipes.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <p className="text-[#78716C] text-sm">해당 식재료로 레시피를 제작할 수 없습니다.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#7A0000] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#600000] transition-colors shadow-md"
              >
                레시피 검색
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-8">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleCardClick(recipe)}
                  className="flex flex-col items-start p-5 md:p-6 bg-white border border-[#E6E2D8]/50 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <h3 className="font-semibold text-[15px] md:text-[17px] leading-snug text-[#1C1C15] mb-4 line-clamp-2 min-h-[44px]">
                    {recipe.title ? recipe.title.replace(/\s*\(.*?\)\s*/g, '') : ''}
                  </h3>
                  <div className="w-full border-t border-[#E6E2D8]/40 pt-4">
                    <div className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                        <path d="M7.49935 0C3.3556 0 0 3.3556 0 7.49935C0 11.6431 3.3556 15 7.49935 15C11.6431 15 14.9987 11.6431 14.9987 7.49935C14.9987 3.3556 11.6431 0 7.49935 0ZM7.49935 13.5C4.18535 13.5 1.49987 10.8145 1.49987 7.49935C1.49987 4.1842 4.18535 1.4987 7.49935 1.4987C10.8134 1.4987 13.4988 4.1842 13.4988 7.49935C13.4988 10.8145 10.8134 13.5 7.49935 13.5Z" fill="#78716C"/>
                        <path d="M7.87419 3.75049H6.37435V7.87519L9.93652 10.0125L10.6865 8.7847L7.87419 7.11475V3.75049Z" fill="#78716C"/>
                      </svg>
                      <span className="text-xs text-[#78716C]">
                        {recipe.cooking_time_min ? `${recipe.cooking_time_min} mins` : '- mins'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RecipeListPage
