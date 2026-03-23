// src/pages/RecipeListPage.jsx
// 추천 레시피 목록 페이지 (SHT-FE-4, 6, 7)
//
// 흐름:
//   1. InputPage에서 navigate('/recipes', { state: { recipes } })로 데이터를 받습니다.
//   2. 받은 레시피 목록을 RecipeCard로 렌더링합니다.
//   3. 카드 클릭 시 로그 이벤트를 전송하고 상세 페이지로 이동합니다.
import { useLocation, useNavigate } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { logEvent } from '../api/client'
import useRecentRecipes from '../hooks/useRecentRecipes'

function RecipeListPage() {
  // useLocation: 이전 페이지(InputPage)에서 navigate로 전달한 state를 읽습니다.
  const { state } = useLocation()
  const navigate = useNavigate()

  // InputPage를 거치지 않고 직접 /recipes에 접근하면 state가 없을 수 있습니다.
  const recipes = state?.recipes ?? []
  const { addRecentRecipe } = useRecentRecipes()

  // 카드 클릭 핸들러 (SHT-FE-4, 7, 8)
  const handleCardClick = async (recipe) => {
    // FE-8: 최근 본 레시피 localStorage에 저장
    addRecentRecipe({
      id: recipe.id,
      title: recipe.title,
      cooking_time_min: recipe.cooking_time_min,
    })

    // FE-7: 클릭 이벤트 로그 전송 (silent fail — 실패해도 이동은 진행됩니다)
    // logEvent 내부에서 이미 .catch(() => {}) 처리가 되어 있습니다.
    await logEvent({
      session_id: crypto.randomUUID(),
      event_type: 'recipe_click',
      recipe_id: recipe.id,
      metadata: {},
    })

    // FE-4: 상세 페이지로 이동
    navigate(`/recipes/${recipe.id}`)
  }

  // 직접 접근한 경우 안내 메시지 표시
  if (recipes.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>추천 레시피</h1>
        <p>추천된 레시피가 없습니다. 식재료를 선택하고 조회해주세요.</p>
        <button onClick={() => navigate('/')}>식재료 입력으로 돌아가기</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>추천 레시피</h1>
      <p>총 {recipes.length}개의 레시피를 찾았습니다.</p>

      {/* 레시피 카드 목록 (SHT-FE-6) */}
      <div>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => handleCardClick(recipe)}
          />
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '20px' }}
      >
        다시 선택하기
      </button>
    </div>
  )
}

export default RecipeListPage
