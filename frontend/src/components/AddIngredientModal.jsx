// src/components/AddIngredientModal.jsx
// 나의 냉장고 페이지에서 재료를 직접 입력할 때 나타나는 바텀 시트 모달입니다.
// 아래에서 위로 슬라이드 업 애니메이션으로 등장하며, 배경은 블러 처리됩니다.
import { useState, useEffect } from 'react'
import { createIngredient, logIngredientEvent } from '../api/client'

const CATEGORY_OPTIONS = [
  { label: '곡물·면·빵', value: 'grain' },
  { label: '고기·해산물', value: '단백질' },
  { label: '채소·과일', value: '채소' },
  { label: '달걀·유제품', value: '달걀' },
  { label: '양념·소스', value: '양념' },
  { label: '가공·기타', value: '발효' },
]

// 오늘 기준으로 n일 뒤 날짜를 YYYY-MM-DD 형식으로 반환 (로컬 시간 기준)
// toISOString()은 UTC를 반환하므로 한국(UTC+9) 오전 0~9시 사이에 호출하면
// 날짜가 하루 이전으로 잘못 계산됩니다. 로컬 날짜를 직접 포맷합니다.
function getDateOffsetStr(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function AddIngredientModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value)
  // 'fresh' = 싱싱 (+2일), 'imminent' = 임박 (+1일)
  const [freshness, setFreshness] = useState('fresh')
  const [expiryDate, setExpiryDate] = useState(getDateOffsetStr(2))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // 슬라이드업 애니메이션 제어 — true가 되면 translateY(0)으로 이동
  const [visible, setVisible] = useState(false)

  // 마운트 직후 한 프레임 뒤에 visible을 true로 바꿔 CSS transition 트리거
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // 닫기: 먼저 슬라이드 다운 후 onClose 호출
  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300) // transition duration과 맞춤
  }

  // 유통기한 버튼 클릭 시 날짜 자동 설정
  const handleFreshness = (type) => {
    setFreshness(type)
    setExpiryDate(getDateOffsetStr(type === 'fresh' ? 2 : 1))
  }

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('재료 이름을 입력해주세요.')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      const res = await createIngredient(trimmed)
      onAdd({
        id: res.data.id,
        name: res.data.name,
        category: res.data.category, // 백엔드 LLM 자동 분류 카테고리
        expiryDate,
      })
      // 백엔드 이벤트 로깅 (silent fail)
      logIngredientEvent(res.data.id).catch(() => {})
      handleClose()
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.detail || '식용 식재료로 인식되지 않습니다.')
      } else {
        setError('재료 등록에 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    // 블러 오버레이 — 바깥 클릭 시 닫기
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:pb-10"
      style={{
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        transition: 'background-color 0.3s ease',
      }}
      onClick={handleClose}
    >
      {/* 바텀 시트 — 슬라이드업 애니메이션, 컨텐츠 너비에 맞게 제한 */}
      <div
        className="bg-white flex flex-col w-full"
        style={{
          maxWidth: '480px',
          borderRadius: '32px',
          boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.18)',
          transform: visible ? 'translateY(0)' : 'translateY(120%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-4 pb-2 flex-shrink-0">
          <div
            className="w-10 h-1.5 rounded-full"
            style={{ background: 'rgba(202, 199, 180, 0.6)' }}
          />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="px-6 sm:px-10 pb-10 pt-2">

          {/* 헤더 아이콘 + 제목 */}
          <div className="flex flex-col items-center pb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: '#7A0000', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M3.25 18.4167L8.9375 17.3333L20.3125 5.9583C20.3125 5.9583 18.4167 3.7917 16.25 5.9583L4.875 17.3333L3.25 18.4167Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.25 5.9583L18.4167 8.125" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-medium text-xl" style={{ color: '#1C1C15', letterSpacing: '-0.4px' }}>
              식재료 추가
            </h2>
          </div>

          {/* 단일 컬럼 폼 */}
          <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">

            {/* 식재료 이름 */}
            <div>
              <p className="text-sm font-medium mb-2 uppercase tracking-wide" style={{ color: '#1C1C15' }}>
                식자재 이름
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit()
                }}
                placeholder="예: 양파"
                autoFocus
                className="w-full outline-none text-sm"
                style={{
                  background: '#F5F5F5',
                  borderRadius: '48px',
                  padding: '13px 20px',
                  color: '#1C1C15',
                  border: 'none',
                }}
              />
              {error && <p className="text-red-500 text-xs mt-1 pl-2">{error}</p>}
            </div>

            {/* 식재료 카테고리 */}
            <div>
              <p className="text-sm font-medium mb-2 uppercase tracking-wide" style={{ color: '#1C1C15' }}>
                식자재 카테고리
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isActive = category === cat.value
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className="font-medium transition-all text-sm"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        background: isActive ? '#99CFFE' : '#F5F5F5',
                        color: isActive ? '#195982' : '#494739',
                        border: 'none',
                      }}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 유통기한 */}
            <div>
              <p className="text-sm font-medium mb-2 uppercase tracking-wide" style={{ color: '#1C1C15' }}>
                유통기한
              </p>
              {/* 싱싱 / 임박 토글 */}
              <div className="flex gap-2.5 mb-3">
                <button
                  onClick={() => handleFreshness('fresh')}
                  className="flex-1 font-medium transition-all text-sm"
                  style={{
                    height: '44px',
                    borderRadius: '48px',
                    letterSpacing: '0.5px',
                    background: freshness === 'fresh' ? '#FEFA99' : '#F5F5F5',
                    color: freshness === 'fresh' ? '#7A0000' : '#494739',
                    border: 'none',
                    boxShadow: freshness === 'fresh' ? '0px 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  싱싱 (+2일)
                </button>
                <button
                  onClick={() => handleFreshness('imminent')}
                  className="flex-1 font-medium transition-all text-sm"
                  style={{
                    height: '44px',
                    borderRadius: '48px',
                    letterSpacing: '0.5px',
                    background: freshness === 'imminent' ? '#7A0000' : '#F5F5F5',
                    color: freshness === 'imminent' ? '#FEFA99' : '#494739',
                    border: 'none',
                    boxShadow: freshness === 'imminent' ? '0px 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  임박 (+1일)
                </button>
              </div>
              {/* 날짜 입력 */}
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full outline-none text-sm"
                style={{
                  background: '#F5F5F5',
                  borderRadius: '48px',
                  padding: '13px 20px',
                  color: '#1C1C15',
                  letterSpacing: '1px',
                  border: 'none',
                }}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 font-medium transition-all"
                style={{
                  background: '#7A0000',
                  borderRadius: '30px',
                  padding: '0 40px',
                  height: '48px',
                  fontSize: '18px',
                  color: '#FFFFFF',
                  border: 'none',
                  boxShadow: '0px 10px 20px -5px rgba(122,0,0,0.3)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {loading ? '등록 중...' : '등록'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AddIngredientModal
