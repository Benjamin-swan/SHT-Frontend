// src/pages/InputPage.jsx
// 식재료 입력 페이지 (SHT-FE-1, 2, 3, 9)
// 사용자가 식재료와 유통기한을 선택하고 레시피를 조회하는 페이지입니다.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import IngredientButton from '../components/IngredientButton'
import FreshnessButton from '../components/FreshnessButton'
import RecentRecipes from '../components/RecentRecipes'
import IngredientSearchInput from '../components/IngredientSearchInput'
import { INGREDIENTS } from '../constants/ingredients'
import { getIngredients, logIngredientEvent, recommendRecipes } from '../api/client'
import useRecentRecipes from '../hooks/useRecentRecipes'

function InputPage() {
  // 선택된 식재료 이름 목록을 Set으로 관리합니다.
  // Set을 사용하면 중복 없이 선택/해제를 간단하게 처리할 수 있습니다.
  const [selectedIngredients, setSelectedIngredients] = useState(new Set())

  // 유통기한 선택값: 'fresh' | 'expiring' | null
  const [freshness, setFreshness] = useState(null)

  // 로딩/에러 상태
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // API에서 불러온 재료 목록 (실제 UUID 포함) — 검색 입력에 사용합니다.
  const [apiIngredients, setApiIngredients] = useState([])

  // useNavigate: 버튼 클릭 시 다른 페이지로 이동할 때 사용합니다.
  const navigate = useNavigate()
  const { recentRecipes } = useRecentRecipes()

  // 페이지 마운트 시 API에서 재료 목록을 불러옵니다.
  // 검색 드롭다운에서 실제 UUID를 사용하기 위해 필요합니다.
  useEffect(() => {
    getIngredients()
      .then((res) => setApiIngredients(res.data))
      .catch(() => {}) // 실패해도 버튼 UI는 상수(INGREDIENTS)로 정상 동작합니다.
  }, [])

  // 식재료 버튼 클릭 핸들러 (SHT-FE-2)
  // 이미 선택된 재료면 제거, 선택 안 된 재료면 추가합니다.
  const handleIngredientClick = (name) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)  // 선택 해제
      } else {
        next.add(name)     // 선택
      }
      return next
    })
  }

  // 검색 드롭다운에서 재료 선택 핸들러 (SHT-FE-9)
  // 1. 선택된 재료 목록에 추가
  // 2. POST /logs/event 호출 → 백엔드가 세션을 생성하고 session_id를 반환
  // 3. 반환된 session_id를 localStorage에 저장 → 이후 recipe-click 로그에 사용
  const handleDirectSelect = async (ingredient) => {
    setSelectedIngredients((prev) => new Set(prev).add(ingredient.name))

    try {
      const res = await logIngredientEvent(ingredient.id)
      localStorage.setItem('session_id', res.data.session_id)
    } catch {
      // silent fail — 세션 등록 실패해도 재료 선택은 유지됩니다.
    }
  }

  // 레시피 조회 버튼 클릭 핸들러 (SHT-FE-4, FE-7)
  const handleRecommend = async () => {
    if (selectedIngredients.size === 0) {
      setError('식재료를 1개 이상 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // POST /recipes/recommend 요청
      // Array.from()으로 Set을 배열로 변환합니다.
      // 백엔드가 이름 → UUID 변환을 내부적으로 처리합니다.
      const response = await recommendRecipes(Array.from(selectedIngredients))

      // 레시피 목록 페이지로 이동하면서 응답 데이터를 state로 전달합니다.
      navigate('/recipes', { state: { recipes: response.data.recipes } })
    } catch (err) {
      setError('레시피 조회에 실패했습니다. 다시 시도해주세요.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>요리조리</h1>
      <p>냉장고에 있는 재료를 선택하세요</p>

      {/* 식재료 버튼 목록 (SHT-FE-1, 2) */}
      <section>
        <h2>식재료</h2>
        <div>
          {INGREDIENTS.map((ingredient) => (
            <IngredientButton
              key={ingredient.id}
              name={ingredient.name}
              isSelected={selectedIngredients.has(ingredient.name)}
              onClick={() => handleIngredientClick(ingredient.name)}
            />
          ))}
        </div>
      </section>

      {/* 식재료 직접 입력 검색 (SHT-FE-9, SHT-BE-1) */}
      <section style={{ marginTop: '20px' }}>
        <h2>직접 입력</h2>
        <IngredientSearchInput
          allIngredients={apiIngredients}
          selectedIngredients={selectedIngredients}
          onSelect={handleDirectSelect}
          onAdd={(newIngredient) => setApiIngredients((prev) => [...prev, newIngredient])}
        />
      </section>

      {/* 유통기한 버튼 (SHT-FE-3) */}
      <section style={{ marginTop: '20px' }}>
        <FreshnessButton selected={freshness} onChange={setFreshness} />
      </section>

      {/* 선택된 재료 칩(chip) 목록 (SHT-FE-10) */}
      <section style={{ marginTop: '20px' }}>
        <p>선택한 재료:</p>
        {selectedIngredients.size === 0 ? (
          <p style={{ color: '#999' }}>없음</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Array.from(selectedIngredients).map((name) => (
              <span
                key={name}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  border: '1px solid #aaa',
                  borderRadius: '16px',
                  fontSize: '14px',
                }}
              >
                {name}
                <button
                  onClick={() => handleIngredientClick(name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                    lineHeight: 1,
                  }}
                  aria-label={`${name} 삭제`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p style={{ marginTop: '8px' }}>유통기한: {freshness ?? '미선택'}</p>
      </section>

      {/* 에러 메시지 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 레시피 조회 버튼 */}
      <button
        onClick={handleRecommend}
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '조회 중...' : '레시피 조회'}
      </button>

      {/* 최근 본 레시피 (SHT-FE-8) — 페이지 하단에 배치 */}
      <RecentRecipes recipes={recentRecipes} />
    </div>
  )
}

export default InputPage
