// features/recipe/api.js
// 레시피 도메인 API.
import { http, ensureSessionId } from '@shared/api/http'

// POST /recipes/recommend — 재료 이름 배열로 레시피 추천
export const recommendRecipes = (ingredient_names) =>
  http.post('/recipes/recommend', { ingredient_names })

// GET /recipes/:id — 레시피 상세
export const getRecipeDetail = (id) => http.get(`/recipes/${id}`)

// POST /logs/interaction — 레시피 클릭/저장 등 상호작용 로그 (silent fail)
export const logRecipeInteraction = (recipe_id, event_type = 'recipe_click') => {
  const session_id = ensureSessionId()
  return http
    .post('/logs/interaction', { session_id, recipe_id, event_type })
    .catch(() => {})
}

// GET /logs/interactions/{session_id} — 세션 클릭 이력
export const getInteractionLogs = (sessionId) =>
  http.get(`/logs/interactions/${sessionId}`)
