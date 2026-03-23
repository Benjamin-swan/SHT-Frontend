// src/hooks/useRecentRecipes.js
// 최근 본 레시피를 localStorage에 저장/조회하는 커스텀 훅입니다. (SHT-FE-8)
//
// 반환값:
//   - recentRecipes (array): 최근 본 레시피 목록 (최대 5개, 최신순)
//   - addRecentRecipe (function): 레시피를 목록에 추가하는 함수
import { useState } from 'react'

const STORAGE_KEY = 'recentRecipes'
const MAX_COUNT = 5

// localStorage에서 저장된 목록을 읽어오는 헬퍼 함수
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    // JSON 파싱 실패 시 빈 배열 반환 (방어 처리)
    return []
  }
}

function useRecentRecipes() {
  // 초기값으로 localStorage에 저장된 목록을 불러옵니다.
  const [recentRecipes, setRecentRecipes] = useState(loadFromStorage)

  // 레시피를 최근 본 목록에 추가합니다.
  // 이미 있는 항목은 맨 앞으로 이동하고, 5개를 초과하면 오래된 항목을 제거합니다.
  const addRecentRecipe = (recipe) => {
    setRecentRecipes((prev) => {
      // 동일한 id가 있으면 제거 (중복 방지)
      const filtered = prev.filter((r) => r.id !== recipe.id)

      // 맨 앞에 추가하고 최대 5개로 자릅니다.
      const next = [recipe, ...filtered].slice(0, MAX_COUNT)

      // localStorage에 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

      return next
    })
  }

  return { recentRecipes, addRecentRecipe }
}

export default useRecentRecipes
