// src/api/client.js
// axios 인스턴스를 만들고, 모든 API 함수를 여기서 관리합니다.
// 다른 파일에서 API를 호출할 때는 이 파일의 함수를 import해서 사용합니다.
import axios from 'axios'

// axios.create()로 기본 설정이 적용된 인스턴스를 만듭니다.
// baseURL을 설정하면 각 요청에서 도메인 주소를 반복하지 않아도 됩니다.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env의 VITE_API_BASE_URL 값을 사용
})

// 브라우저 고유 UUID를 localStorage에서 읽거나, 없으면 최초 1회 생성합니다.
// 익명 사용자를 식별하기 위해 사용합니다.
const getBrowserUUID = () => {
  let uuid = localStorage.getItem('browser_uuid')
  if (!uuid) {
    uuid = crypto.randomUUID()
    localStorage.setItem('browser_uuid', uuid)
  }
  return uuid
}

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

// POST /ingredients — DB에 없는 신규 식재료를 LLM으로 분류 후 등록 (SHT-BE-1)
// is_new: true → 새로 등록됨, false → 기존에 있던 재료
export const createIngredient = (name) =>
  client.post('/ingredients/', { name })

// POST /logs/event — 식재료 직접 입력 이벤트 로그 전송 (SHT-FE-9)
// 백엔드가 익명 사용자 + 세션을 자동 생성하고, 생성된 session_id를 응답으로 반환합니다.
// 응답의 session_id를 localStorage에 저장하면 이후 recipe-click 로그에서 사용할 수 있습니다.
export const logIngredientEvent = (ingredient_id) =>
  client.post('/logs/event', {
    browser_uuid: getBrowserUUID(),
    ingredient_id,
    input_method: 'direct',
    freshness_status: '싱싱',
  })

// POST /logs/recipe-click — 레시피 카드 클릭 이벤트 로그 전송
// session_id를 localStorage에서 읽습니다.
// logIngredientEvent를 먼저 호출해야 session_id가 DB에 등록됩니다.
// .catch(() => {}) : 로그 전송 실패해도 에러를 무시합니다 (silent fail)
export const logRecipeClick = (recipe_id) => {
  const session_id = localStorage.getItem('session_id')
  if (!session_id) return Promise.resolve() // 세션 미등록 시 로그 생략
  return client.post('/logs/recipe-click', { session_id, recipe_id }).catch(() => {})
}

export default client
