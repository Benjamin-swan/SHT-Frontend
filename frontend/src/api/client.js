// src/api/client.js
// axios 인스턴스를 만들고, 모든 API 함수를 여기서 관리합니다.
// 다른 파일에서 API를 호출할 때는 이 파일의 함수를 import해서 사용합니다.
import axios from 'axios'

// axios.create()로 기본 설정이 적용된 인스턴스를 만듭니다.
// baseURL을 설정하면 각 요청에서 도메인 주소를 반복하지 않아도 됩니다.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env의 VITE_API_BASE_URL 값을 사용
})

// GET /ingredients — 빈출 식재료 목록 조회
export const getIngredients = () =>
  client.get('/ingredients')

// POST /recipes/recommend — 선택한 재료 이름 목록으로 레시피 추천 요청
// ingredient_names: string[] — 백엔드가 DB에서 UUID로 변환합니다.
export const recommendRecipes = (ingredient_names) =>
  client.post('/recipes/recommend', { ingredient_names })

// GET /recipes/:id — 특정 레시피 상세 정보 조회
export const getRecipeDetail = (id) =>
  client.get(`/recipes/${id}`)

// POST /logs/recipe-click — 레시피 카드 클릭 이벤트 로그 전송
// .catch(() => {}) : 로그 전송 실패해도 에러를 무시합니다 (silent fail)
// 로그 실패가 사용자 경험에 영향을 주면 안 되기 때문입니다.
export const logRecipeClick = (session_id, recipe_id) =>
  client.post('/logs/recipe-click', { session_id, recipe_id }).catch(() => {})

export default client
