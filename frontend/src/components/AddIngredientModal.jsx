// src/components/AddIngredientModal.jsx
// 나의 냉장고 페이지에서 재료를 직접 입력할 때 나타나는 팝업 모달입니다.
// 재료 이름을 입력하면 LLM이 카테고리를 자동 분류합니다.
import { useState } from 'react'
import { createIngredient } from '../api/client'

function AddIngredientModal({ onClose, onAdd }) {
  // 입력창 값 상태
  const [name, setName] = useState('')
  // 로딩 상태 (API 요청 중 버튼 비활성화)
  const [loading, setLoading] = useState(false)
  // 에러 메시지 상태
  const [error, setError] = useState('')

  // 재료 추가 버튼 클릭 핸들러
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
      // 부모(FridgePage)에 추가된 재료 정보 전달
      onAdd(res.data)
      onClose()
    } catch (e) {
      setError('재료 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // 어두운 오버레이 배경 — 클릭 시 모달 닫기
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* 모달 본체 — 클릭 이벤트가 오버레이로 버블링되지 않도록 stopPropagation */}
      <div
        className="bg-white rounded-2xl p-6 w-80 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[#1C1C15] mb-4">재료 직접 입력</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="예: 파프리카"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#7A0000] mb-2"
        />

        {/* 에러 메시지 */}
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <p className="text-xs text-[#78716C] mb-4">
          입력한 재료는 AI가 카테고리를 자동으로 분류합니다.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-[#78716C] text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#7A0000] text-white text-sm font-semibold py-2 rounded-xl hover:bg-[#600000] transition-colors disabled:opacity-50"
          >
            {loading ? '등록 중...' : '추가하기'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddIngredientModal
