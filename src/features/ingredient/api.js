// features/ingredient/api.js
// 식재료 도메인 API.
import { http, getBrowserUUID } from '@shared/api/http'

// GET /ingredients — 빈출 식재료 목록 조회
export const getIngredients = () => http.get('/ingredients')

// POST /ingredients — DB에 없는 신규 식재료를 LLM으로 분류 후 등록
export const createIngredient = (name, category) =>
  http.post('/ingredients/', { name, category })

// POST /logs/event — 식재료 직접 입력 로그 (백엔드가 session_id 발급/반환)
export const logIngredientEvent = (ingredient_id, freshness_status = '싱싱') => {
  const session_id = localStorage.getItem('session_id') || undefined
  return http
    .post('/logs/event', {
      browser_uuid: getBrowserUUID(),
      ingredient_id,
      input_method: 'direct',
      freshness_status,
      session_id,
    })
    .then((res) => {
      if (res.data.session_id) {
        localStorage.setItem('session_id', res.data.session_id)
      }
      return res
    })
}

// PATCH /logs/event/{event_id}/freshness — 신선도 변경 (싱싱 ↔ 임박)
export const updateIngredientFreshness = (eventId, freshnessStatus) =>
  http.patch(`/logs/event/${eventId}/freshness`, { freshness_status: freshnessStatus })

// GET /sessions/{session_id}/ingredients — 세션 식재료 목록 (신선도/만료 포함)
export const getSessionIngredients = (sessionId) =>
  http.get(`/sessions/${sessionId}/ingredients`)
