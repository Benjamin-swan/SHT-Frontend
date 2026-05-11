// shared/api/http.js
// axios 인스턴스와 익명 사용자 식별(browser_uuid) 유틸을 제공합니다.
// 도메인별 API 함수는 features/<domain>/api.js 로 분리되어 있습니다.
import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 70000, // 백엔드 LLM 호출 최대 60s + 여유 10s
})

// 익명 사용자 식별용 UUID. localStorage 에 1회 저장 후 재사용.
export const getBrowserUUID = () => {
  let uuid = localStorage.getItem('browser_uuid')
  if (!uuid) {
    uuid = crypto.randomUUID()
    localStorage.setItem('browser_uuid', uuid)
  }
  return uuid
}

// session_id 헬퍼 — 없으면 새로 생성해 저장.
export const ensureSessionId = () => {
  let sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('session_id', sessionId)
  }
  return sessionId
}
