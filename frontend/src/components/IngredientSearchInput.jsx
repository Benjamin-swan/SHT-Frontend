// src/components/IngredientSearchInput.jsx
// 식재료 직접 입력 검색 컴포넌트 (SHT-FE-9, SHT-BE-1)
//
// 동작 흐름:
//   1. 사용자가 텍스트를 입력하면 API에서 받아온 재료 목록을 필터링합니다 (최대 3개).
//   2. 드롭다운에서 항목을 선택하면 onSelect 콜백을 호출합니다.
//   3. 검색 결과가 없으면 "추가하기" 버튼을 표시합니다.
//   4. "추가하기" 클릭 시 POST /ingredients → LLM이 식용 여부 판단 후 DB에 등록합니다.
import { useState } from 'react'
import { createIngredient } from '../api/client'

function IngredientSearchInput({ allIngredients, selectedIngredients, onSelect, onAdd }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [adding, setAdding] = useState(false) // LLM 분류 중 로딩 상태
  const [addError, setAddError] = useState(null)

  // 입력값으로 재료 목록을 필터링하고 최대 3개까지만 표시합니다.
  // 이미 선택된 재료는 제외하여 중복 선택을 방지합니다.
  const filtered = allIngredients
    .filter((ing) => ing.name.includes(query) && !selectedIngredients.has(ing.name))
    .slice(0, 3)

  const handleSelect = (ingredient) => {
    onSelect(ingredient)
    setQuery('')
    setIsOpen(false)
    setAddError(null)
  }

  // "추가하기" 클릭 — LLM으로 식재료 분류 후 DB 등록
  const handleAdd = async () => {
    if (!query.trim()) return
    setAdding(true)
    setAddError(null)

    try {
      const res = await createIngredient(query.trim())
      const newIngredient = res.data
      // 부모(InputPage)에게 새로 추가된 재료를 알려서 allIngredients 목록을 갱신합니다.
      onAdd(newIngredient)
      // 바로 선택 상태에도 추가합니다.
      onSelect(newIngredient)
      setQuery('')
      setIsOpen(false)
    } catch (err) {
      // 422: 식용 불가 판단
      const msg = err.response?.data?.detail ?? '등록에 실패했습니다.'
      setAddError(msg)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
          setAddError(null)
        }}
        onFocus={() => setIsOpen(true)}
        // onBlur에 setTimeout을 쓰는 이유:
        // 드롭다운 항목 클릭 시 blur가 먼저 발생해 목록이 사라지는 문제를 방지합니다.
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="식재료 직접 입력..."
        style={{ padding: '8px', fontSize: '14px', width: '200px' }}
      />

      {/* 드롭다운 — 입력값이 있을 때만 표시 */}
      {isOpen && query && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            width: '200px',
            zIndex: 10,
          }}
        >
          {filtered.length > 0 ? (
            filtered.map((ing) => (
              <li
                key={ing.id}
                onMouseDown={() => handleSelect(ing)}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                {ing.name}
              </li>
            ))
          ) : (
            // 검색 결과 없음 → "추가하기" 버튼 표시
            <li style={{ padding: '8px' }}>
              <span style={{ color: '#999', fontSize: '13px' }}>"{query}" 검색 결과 없음</span>
              <br />
              <button
                onMouseDown={handleAdd}
                disabled={adding}
                style={{ marginTop: '4px', cursor: adding ? 'not-allowed' : 'pointer', fontSize: '13px' }}
              >
                {adding ? 'LLM 분류 중...' : `"${query}" 추가하기`}
              </button>
            </li>
          )}
        </ul>
      )}

      {/* 식용 불가 에러 메시지 */}
      {addError && (
        <p style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{addError}</p>
      )}
    </div>
  )
}

export default IngredientSearchInput
