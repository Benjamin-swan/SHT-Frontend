// src/pages/FridgePage.jsx
// 나의 냉장고 페이지입니다.
// 상단 슬라이더 토글로 "선택 모드" / "관리 모드"를 전환합니다.
// - 선택 모드(좌): 재료를 선택해 레시피 추천으로 이동
// - 관리 모드(우): 재료를 클릭하면 수정·삭제 패널이 열림
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import AddIngredientModal from '../components/AddIngredientModal'
import { getSessionIngredients, updateIngredientFreshness } from '../api/client'

// localStorage에 저장할 키
const FRIDGE_STORAGE_KEY = 'fridge_ingredients'

// 오늘 기준 n일 뒤 날짜를 YYYY-MM-DD(로컬 시간 기준)로 반환
function getDateOffsetStr(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const ACTIVE_TAB_STYLE = { bg: '#FEFA99', text: '#63610F' }

const CATEGORIES = [
  { label: '전체', value: null },
  { label: '곡물·면·빵', value: 'grain' },
  { label: '고기·해산물', value: '단백질' },
  { label: '채소·과일', value: '채소' },
  { label: '달걀·유제품', value: '달걀' },
  { label: '양념·소스', value: '양념' },
  { label: '발효·가공·기타', value: '발효' },
]

function getDaysLeft(expiryDate) {
  if (!expiryDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  return Math.round((expiry - today) / (1000 * 60 * 60 * 24))
}

function getExpiryStyle(expiryDate, isSelected) {
  if (isSelected) return { bg: '#99CFFE', text: '#195982', border: '#99CFFE' }
  const days = getDaysLeft(expiryDate)
  if (days === null) return { bg: '#F5F5F5', text: '#1C1C15', border: 'transparent' }
  if (days < 0)  return { bg: '#E5E5E5', text: '#9CA3AF', border: 'transparent' }
  if (days <= 1) return { bg: '#7A0000', text: '#FEFA99', border: '#7A0000' }
  if (days <= 2) return { bg: '#FEFA99', text: '#63610F', border: '#FEFA99' }
  return { bg: '#F5F5F5', text: '#1C1C15', border: 'transparent' }
}

function FridgeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 20C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V6.725C0.7 6.54167 0.458333 6.30417 0.275 6.0125C0.0916667 5.72083 0 5.38333 0 5V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V5C20 5.38333 19.9083 5.72083 19.725 6.0125C19.5417 6.30417 19.3 6.54167 19 6.725V18C19 18.55 18.8042 19.0208 18.4125 19.4125C18.0208 19.8042 17.55 20 17 20H3ZM2 5H18V2H2V5ZM7 12H13V10H7V12Z" fill="#B02D20"/>
    </svg>
  )
}

// 재료 수정·삭제 패널 컴포넌트 — 관리 모드에서 재료 클릭 시 하단에 슬라이드업으로 표시됩니다.
function EditIngredientPanel({ ingredient, categories, onSave, onDelete, onClose }) {
  const [name, setName] = useState(ingredient.name)
  const [category, setCategory] = useState(ingredient.category ?? categories[0].value)
  const [expiryDate, setExpiryDate] = useState(ingredient.expiryDate ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full flex flex-col"
        style={{ maxWidth: '480px', borderRadius: '28px', boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-4 pb-1">
          <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(202,199,180,0.6)' }} />
        </div>

        <div className="px-6 pb-7 pt-2 flex flex-col gap-4">
          <h3 className="text-base font-semibold text-[#1C1C15]">식재료 수정</h3>

          {/* 이름 */}
          <div>
            <p className="text-xs font-medium text-[#78716C] mb-1 uppercase tracking-wide">이름</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full outline-none text-sm"
              style={{ background: '#F5F5F5', borderRadius: '48px', padding: '11px 18px', border: 'none', color: '#1C1C15' }}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <p className="text-xs font-medium text-[#78716C] mb-2 uppercase tracking-wide">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className="text-xs font-medium transition-all"
                  style={{
                    padding: '7px 14px',
                    borderRadius: '9999px',
                    background: category === cat.value ? '#99CFFE' : '#F5F5F5',
                    color: category === cat.value ? '#195982' : '#494739',
                    border: 'none',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 소비기한 */}
          <div>
            <p className="text-xs font-medium text-[#78716C] mb-1 uppercase tracking-wide">소비기한</p>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full outline-none text-sm"
              style={{ background: '#F5F5F5', borderRadius: '48px', padding: '11px 18px', border: 'none', color: '#1C1C15', letterSpacing: '1px' }}
            />
          </div>

          {/* 수정 / 삭제 버튼 */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSave({ ...ingredient, name: name.trim() || ingredient.name, category, expiryDate })}
              className="flex-1 font-semibold text-sm py-3 rounded-2xl transition-colors"
              style={{ background: '#7A0000', color: '#fff', border: 'none', boxShadow: '0px 4px 12px rgba(122,0,0,0.2)' }}
            >
              수정 완료
            </button>
            <button
              onClick={() => onDelete(ingredient.id)}
              className="font-medium text-sm px-5 py-3 rounded-2xl transition-colors"
              style={{ background: '#F5F5F5', color: '#9CA3AF', border: 'none' }}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FridgePage() {
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState(null)
  const [ingredients, setIngredients] = useState(() => {
    try {
      const saved = localStorage.getItem(FRIDGE_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [selected, setSelected] = useState(new Set())
  const [showModal, setShowModal] = useState(false)

  // 관리 모드 여부 (false = 선택 모드, true = 관리 모드)
  const [isManageMode, setIsManageMode] = useState(false)
  // 관리 모드에서 선택된 재료 (수정 패널 열기용)
  const [editingIngredient, setEditingIngredient] = useState(null)
  // 세션 가져오기 진행 중 여부
  const [importingSession, setImportingSession] = useState(false)

  // ingredients가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(FRIDGE_STORAGE_KEY, JSON.stringify(ingredients))
  }, [ingredients])

  const filteredIngredients = activeCategory === null
    ? ingredients
    : ingredients.filter((ing) => ing.category === activeCategory)

  const toggleIngredient = (name) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const removeIngredient = (id) => {
    const ing = ingredients.find((i) => i.id === id)
    setIngredients((prev) => prev.filter((i) => i.id !== id))
    if (ing) setSelected((prev) => { const next = new Set(prev); next.delete(ing.name); return next })
    setEditingIngredient(null)
  }

  // 수정 완료 — 해당 재료 정보를 덮어씁니다.
  const saveIngredient = (updated) => {
    setIngredients((prev) => prev.map((ing) => ing.id === updated.id ? updated : ing))
    // 이름이 변경됐다면 선택 Set도 업데이트
    if (editingIngredient.name !== updated.name) {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(editingIngredient.name)) { next.delete(editingIngredient.name); next.add(updated.name) }
        return next
      })
    }
    // [BE-8] 세션에서 가져온 재료(_eventId 존재)의 expiryDate가 임박(1일 이하)으로 변경됐을 때
    // 백엔드에 신선도 상태 변경을 silent fail로 전송합니다.
    if (updated._eventId) {
      const daysLeft = getDaysLeft(updated.expiryDate)
      const wasImminentBefore = getDaysLeft(editingIngredient.expiryDate) !== null
        && getDaysLeft(editingIngredient.expiryDate) > 1
      if (daysLeft !== null && daysLeft <= 1 && wasImminentBefore) {
        updateIngredientFreshness(updated._eventId, '임박').catch(() => {})
      }
    }
    setEditingIngredient(null)
  }

  // [BE-9] 현재 세션에 기록된 재료를 냉장고로 가져옵니다.
  // - 이미 냉장고에 있는 재료(이름 기준)는 건너뜁니다.
  // - 만료된 이벤트는 제외합니다.
  // - 각 재료에 _eventId를 저장해 두면 BE-8 freshness update에서 사용할 수 있습니다.
  const handleSessionImport = async () => {
    const sessionId = localStorage.getItem('session_id')
    if (!sessionId) return
    setImportingSession(true)
    try {
      const res = await getSessionIngredients(sessionId)
      const items = Array.isArray(res.data) ? res.data : []
      
      setIngredients((prev) => {
        const existingNames = new Set(prev.map((i) => i.name))
        
        let importedEvents = []
        try {
          const stored = localStorage.getItem('imported_events_' + sessionId)
          if (stored) importedEvents = JSON.parse(stored)
        } catch {}
        const importedSet = new Set(importedEvents)

        const newItems = items
          .filter((item) => !item.is_expired && !existingNames.has(item.ingredient_name) && !importedSet.has(item.event_id))
          .map((item) => ({
            id: crypto.randomUUID(),
            _eventId: item.event_id,            // BE-8 freshness 업데이트용
            name: item.ingredient_name,
            category: '발효',                   // 세션 응답에 category 없음 → 기타로 기본값
            expiryDate: getDateOffsetStr(item.freshness_status === '임박' ? 1 : 2),
          }))
          
        if (newItems.length === 0) return prev
        
        // 가져온 event_id들을 localStorage에 기록하여 새로고침 시 부활 방지
        const newEventIds = newItems.map((i) => i._eventId)
        if (newEventIds.length > 0) {
          localStorage.setItem('imported_events_' + sessionId, JSON.stringify([...importedEvents, ...newEventIds]))
        }
        
        return [...prev, ...newItems]
      })
    } catch (err) {
      console.error('세션 재료를 불러오는 데 실패했습니다.', err)
    } finally {
      setImportingSession(false)
    }
  }

  // 컴포넌트 마운트 시 백그라운드에서 자동 수행
  useEffect(() => {
    handleSessionImport()
  }, [])

  const handleModalAdd = (ingredient) => {
    setIngredients((prev) => [...prev, ingredient])
  }

  const handleRecommend = () => {
    if (selected.size === 0) return
    navigate('/', { state: { selectedIngredients: Array.from(selected) } })
  }

  // 재료 버튼 클릭 — 모드에 따라 다르게 동작
  const handleIngredientClick = (ing) => {
    if (isManageMode) {
      setEditingIngredient(ing)
    } else {
      const isExpired = getDaysLeft(ing.expiryDate) !== null && getDaysLeft(ing.expiryDate) < 0
      if (!isExpired) toggleIngredient(ing.name)
    }
  }

  // 재료 버튼 렌더링 — 두 탭(전체/카테고리)에서 공통으로 사용
  const renderIngredientButton = (ing) => {
    const isSelected = selected.has(ing.name)
    const isExpired = getDaysLeft(ing.expiryDate) !== null && getDaysLeft(ing.expiryDate) < 0
    // 관리 모드에선 소비기한 스타일 그대로, 선택 하이라이트 없음
    const style = isManageMode
      ? getExpiryStyle(ing.expiryDate, false)
      : getExpiryStyle(ing.expiryDate, isSelected)

    return (
      <div key={ing.id} className="relative flex items-center">
        <button
          onClick={() => handleIngredientClick(ing)}
          className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
          style={{
            background: style.bg,
            color: style.text,
            borderColor: style.border,
            // 관리 모드에서 살짝 테두리 점선으로 구분감 제공
            outline: isManageMode ? '1.5px dashed rgba(120,113,108,0.3)' : 'none',
            outlineOffset: '2px',
          }}
        >
          {ing.name}
          {!isManageMode && isSelected && <span className="ml-1 text-xs">✓</span>}
          {isManageMode && <span className="ml-1 text-xs opacity-50">✎</span>}
        </button>
        {/* 만료 재료 X 버튼 — 선택 모드에서만 표시 */}
        {!isManageMode && isExpired && (
          <button
            onClick={() => removeIngredient(ing.id)}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center hover:bg-gray-500 transition-colors leading-none"
          >
            ×
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-[77px]">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* 헤더: 타이틀 + (식재료 추가 버튼 + 모드 토글) */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-[#1C1C15]">나의 냉장고</h1>

          {/* 우측: (세션 가져오기 버튼) + 식재료 추가 버튼 + 토글 — 같은 높이로 나란히 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-sm text-[#78716C] border border-gray-300 bg-white px-3 py-1.5 rounded-full hover:border-[#7A0000] hover:text-[#7A0000] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
              </svg>
              식재료 추가
            </button>

            {/* 카메라 커버형 슬라이더 토글
                좌(회색) = 요리 재료 선택 모드 (포크 아이콘)
                우(빨강) = 재료 수정·삭제 관리 모드 (연필 아이콘) */}
            <button
              onClick={() => { setIsManageMode((v) => !v); setEditingIngredient(null) }}
              className="relative flex-shrink-0"
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '9999px',
                background: isManageMode ? '#7A0000' : '#D1D5DB',
                transition: 'background 0.25s ease',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              aria-label={isManageMode ? '관리 모드 (재료 수정·삭제)' : '선택 모드 (요리 재료 선택)'}
            >
              {/* 핸들 — 현재 모드에 맞는 아이콘 포함 */}
              <span
                className="absolute flex items-center justify-center"
                style={{
                  top: '3px',
                  left: isManageMode ? '27px' : '3px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '9999px',
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {isManageMode ? (
                  // 관리 모드: 연필 아이콘
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7A0000" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
                  </svg>
                ) : (
                  // 선택 모드: 포크 아이콘
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 13v9M21 2v4a4 4 0 01-4 4v11" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* 냉장고 아이콘 + 재료 수 */}
        <div className="flex items-center gap-1.5 mb-6">
          <FridgeIcon />
          <span className="text-sm font-semibold text-[#B02D20]">재료 {ingredients.length}개</span>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex mb-0 border border-gray-200 rounded-t-xl overflow-hidden bg-white">
          {[CATEGORIES[0]].map((cat) => {
            const isActive = activeCategory === cat.value
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.value)}
                style={isActive ? { backgroundColor: ACTIVE_TAB_STYLE.bg, color: ACTIVE_TAB_STYLE.text } : {}}
                className={`flex-1 py-2 text-sm font-semibold transition-all ${isActive ? '' : 'text-[#78716C] bg-white hover:bg-gray-50'}`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
        <div className="flex mb-5 border border-t-0 border-gray-200 rounded-b-xl overflow-hidden bg-white">
          {CATEGORIES.slice(1).map((cat, idx) => {
            const isActive = activeCategory === cat.value
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.value)}
                style={isActive ? { backgroundColor: ACTIVE_TAB_STYLE.bg, color: ACTIVE_TAB_STYLE.text } : {}}
                className={`flex-1 py-2 text-xs font-medium transition-all ${idx !== 0 ? 'border-l border-gray-200' : ''} ${isActive ? '' : 'text-[#78716C] bg-white hover:bg-gray-50'}`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* 소비기한 각주 — 카테고리 탭 바로 아래 우측 정렬 */}
        <div className="flex items-center justify-end gap-3 mb-3 text-xs text-[#78716C]">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#FEFA99' }} />
            이틀 남음
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#7A0000' }} />
            하루 남음
          </span>
          <span className="text-[#9CA3AF]">· 소비기한 지난 재료는 ×로 제거하세요</span>
        </div>

        {/* 재료 카드 영역 */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          {activeCategory === null ? (
            CATEGORIES.slice(1).map((cat) => {
              const catIngredients = ingredients.filter((ing) => ing.category === cat.value)
              if (catIngredients.length === 0) return null
              return (
                <div key={cat.value} className="mb-5 last:mb-0">
                  <p className="text-xs font-semibold text-[#78716C] mb-2">{cat.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {catIngredients.map(renderIngredientButton)}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map(renderIngredientButton)
              ) : (
                <p className="text-sm text-[#78716C] py-4 w-full text-center">이 카테고리에 재료가 없습니다</p>
              )}
            </div>
          )}
        </div>

        {/* 선택된 재료 칩 — 선택 모드에서만 표시 */}
        {!isManageMode && selected.size > 0 && (
          <div className="mb-6">
            <p className="text-xs text-[#78716C] mb-2">선택된 재료 {selected.size}개</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(selected).map((name) => (
                <span key={name} className="flex items-center gap-1 bg-[#99CFFE] text-[#195982] text-xs font-medium px-3 py-1.5 rounded-full">
                  {name}
                  <button onClick={() => toggleIngredient(name)} className="ml-0.5 leading-none hover:opacity-70">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-none px-6 py-4 rounded-2xl border border-gray-300 text-[#78716C] text-sm font-medium bg-white hover:bg-gray-50 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handleRecommend}
            disabled={selected.size === 0 || isManageMode}
            className="flex-1 flex items-center justify-center gap-2 bg-[#7A0000] text-white font-semibold py-4 rounded-2xl text-sm hover:bg-[#600000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 13v9M21 2v4a4 4 0 01-4 4v11" />
            </svg>
            {isManageMode ? '선택 모드로 전환 후 사용' : '요리할 재료 선택'}
          </button>
        </div>
      </div>

      {/* 식재료 추가 모달 */}
      {showModal && (
        <AddIngredientModal
          onClose={() => setShowModal(false)}
          onAdd={handleModalAdd}
        />
      )}

      {/* 수정·삭제 패널 — 관리 모드에서 재료 클릭 시 */}
      {editingIngredient && (
        <EditIngredientPanel
          ingredient={editingIngredient}
          categories={CATEGORIES.slice(1)}
          onSave={saveIngredient}
          onDelete={removeIngredient}
          onClose={() => setEditingIngredient(null)}
        />
      )}
    </div>
  )
}

export default FridgePage
