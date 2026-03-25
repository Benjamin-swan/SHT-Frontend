// src/api/client.js
// axios 인스턴스를 만들고, 모든 API 함수를 여기서 관리합니다.
// 다른 파일에서 API를 호출할 때는 이 파일의 함수를 import해서 사용합니다.
import axios from 'axios'

// axios.create()로 기본 설정이 적용된 인스턴스를 만듭니다.
// baseURL을 설정하면 각 요청에서 도메인 주소를 반복하지 않아도 됩니다.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env의 VITE_API_BASE_URL 값을 사용
  timeout: 70000, // 70초 (백엔드 LLM 호출 최대 60초 + 여유 10초)



  
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
export const createIngredient = (name, category) =>
  client.post('/ingredients/', { name, category })

// POST /logs/event — 식재료 직접 입력 이벤트 로그 전송 (SHT-FE-9)
// 백엔드가 익명 사용자 + 세션을 자동 생성하고, 생성된 session_id를 응답으로 반환합니다.
// 응답의 session_id를 localStorage에 저장하면 이후 상호작용 로그에서 사용할 수 있습니다.
export const logIngredientEvent = (ingredient_id, freshness_status = '싱싱') => {
  const session_id = localStorage.getItem('session_id') || undefined
  return client.post('/logs/event', {
    browser_uuid: getBrowserUUID(),
    ingredient_id,
    input_method: 'direct',
    freshness_status,
    session_id
  }).then(res => {
    if (res.data.session_id) {
      localStorage.setItem('session_id', res.data.session_id)
    }
    return res
  })
}

// POST /logs/interaction — 레시피 상호작용(클릭, 저장 등) 로그 전송
// session_id를 localStorage에서 읽거나, 없으면 생성합니다.
// .catch(() => {}) : 로그 전송 실패해도 에러를 무시합니다 (silent fail)
export const logRecipeInteraction = (recipe_id, event_type = "recipe_click") => {
  let session_id = localStorage.getItem('session_id')
  if (!session_id) {
    session_id = crypto.randomUUID()
    localStorage.setItem('session_id', session_id)
  }
  return client.post('/logs/interaction', { session_id, recipe_id, event_type }).catch(() => {})
}

// PATCH /logs/event/{event_id}/freshness — 신선도 상태 변경 (싱싱 → 임박)
// InputPage에서 식재료 로그 생성 후 신선도를 바꾸고 싶을 때 사용합니다.
// eventId: logIngredientEvent() 응답의 event_id
export const updateIngredientFreshness = (eventId, freshnessStatus) =>
  client.patch(`/logs/event/${eventId}/freshness`, { freshness_status: freshnessStatus })

// GET /sessions/{session_id}/ingredients — 세션에 기록된 식재료 목록 조회
// 신선도, 유효기간, 만료 여부까지 포함된 상세 정보를 반환합니다.
// sessionId: logIngredientEvent() 응답에서 받아 localStorage에 저장한 session_id
export const getSessionIngredients = (sessionId) =>
  client.get(`/sessions/${sessionId}/ingredients`)

// GET /logs/interactions/{session_id} — 세션의 레시피 클릭 이력 조회
// "저장된 레시피" 페이지에서 백엔드 기반 클릭 이력을 표시할 때 사용합니다.
export const getInteractionLogs = (sessionId) =>
  client.get(`/logs/interactions/${sessionId}`)

export default client
