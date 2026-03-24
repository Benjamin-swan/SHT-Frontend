// src/pages/FridgePage.jsx
// 나의 냉장고 페이지입니다.
// 카테고리별 재료 버튼을 선택하고, 선택한 재료로 레시피 추천을 요청합니다.
// 직접 입력 버튼 클릭 시 AddIngredientModal이 열립니다.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import AddIngredientModal from '../components/AddIngredientModal'
import { getIngredients, recommendRecipes } from '../api/client'
import { INGREDIENTS } from '../constants/ingredients'

// 카테고리 정의: 이름, 색상(배경/텍스트), 해당하는 category 값
const CATEGORIES = [
  { label: '곡물·면·빵', value: 'grain', bg: '#99CFFE', text: '#195982' },
  { label: '고기·해산물', value: '단백질', bg: '#FECACA', text: '#991B1B' },
  { label: '채소·과일', value: '채소', bg: '#FEFA99', text: '#63610F' },
  { label: '달걀·유제품', value: '달걀', bg: '#FDE68A', text: '#92400E' },
  { label: '양념·소스', value: '양념', bg: '#DDD6FE', text: '#5B21B6' },
  { label: '발효·가공·기타', value: '발효', bg: '#D1FAE5', text: '#065F46' },
]

function FridgePage() {
  const navigate = useNavigate()

  // 현재 선택된 카테고리 탭
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].value)

  // 모든 재료 목록 (API 응답 또는 로컬 상수)
  const [ingredients, setIngredients] = useState([])

  // 선택된 재료 이름 Set (중복 방지)
  const [selected, setSelected] = useState(new Set())

  // 직접 입력 모달 열림 여부
  const [showModal, setShowModal] = useState(false)

  // 레시피 추천 요청 로딩 상태
  const [loading, setLoading] = useState(false)

  // 컴포넌트 마운트 시 재료 목록 API 호출
  useEffect(() => {
    getIngredients()
      .then((res) => {
        // 응답이 배열이면 그대로, 객체면 .ingredients 배열 사용
        const data = Array.isArray(res.data) ? res.data : res.data.ingredients ?? []
        setIngredients(data.length > 0 ? data : INGREDIENTS)
      })
      .catch(() => {
        // API 실패 시 로컬 상수로 폴백
        setIngredients(INGREDIENTS)
      })
  }, [])

  // 현재 선택된 카테고리에 속한 재료만 필터링
  const filteredIngredients = ingredients.filter(
    (ing) => ing.category === activeCategory
  )

  // 재료 버튼 클릭 토글 핸들러
  const toggleIngredient = (name) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  // 직접 입력 모달에서 재료 추가 시 처리
  const handleModalAdd = (ingredient) => {
    setIngredients((prev) => [...prev, ingredient])
    setSelected((prev) => new Set(prev).add(ingredient.name))
  }

  // 레시피 추천 버튼 클릭 핸들러
  const handleRecommend = async () => {
    if (selected.size === 0) return
    setLoading(true)
    try {
      const ingredient_names = Array.from(selected)
      const res = await recommendRecipes(ingredient_names)
      const recipes = Array.isArray(res.data) ? res.data : res.data.recipes ?? []
      // 추천 결과를 state로 넘기기 위해 navigate state 사용
      navigate('/recipes', { state: { recipes, selectedIngredients: ingredient_names } })
    } catch (e) {
      alert('레시피 추천에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1C1C15] mb-2">나의 냉장고</h1>
        <p className="text-sm text-[#78716C] mb-6">가지고 있는 재료를 선택해주세요</p>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={
                activeCategory === cat.value
                  ? { backgroundColor: cat.bg, color: cat.text }
                  : {}
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat.value
                  ? 'border-transparent'
                  : 'border-gray-300 text-[#78716C] bg-white hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 재료 버튼 그리드 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ing) => (
              <button
                key={ing.id}
                onClick={() => toggleIngredient(ing.name)}
                className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                  selected.has(ing.name)
                    ? 'bg-[#7A0000] text-white border-[#7A0000]'
                    : 'bg-white text-[#1C1C15] border-gray-200 hover:border-[#7A0000]'
                }`}
              >
                {ing.name}
              </button>
            ))
          ) : (
            <p className="col-span-3 text-center text-[#78716C] text-sm py-8">
              이 카테고리에 재료가 없습니다
            </p>
          )}

          {/* 직접 입력 버튼 */}
          <button
            onClick={() => setShowModal(true)}
            className="py-3 rounded-xl text-sm font-medium border border-dashed border-gray-300 text-[#78716C] hover:border-[#7A0000] hover:text-[#7A0000] transition-all bg-white"
          >
            + 직접 입력
          </button>
        </div>

        {/* 선택된 재료 칩 목록 */}
        {selected.size > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#1C1C15] mb-2">
              선택된 재료 ({selected.size}개)
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(selected).map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-1 bg-[#7A0000] text-white text-xs px-3 py-1.5 rounded-full"
                >
                  {name}
                  {/* X 버튼 — 클릭 시 해당 재료 선택 해제 */}
                  <button
                    onClick={() => toggleIngredient(name)}
                    className="ml-1 leading-none hover:opacity-75"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 레시피 추천 버튼 */}
        <button
          onClick={handleRecommend}
          disabled={selected.size === 0 || loading}
          className="w-full bg-[#7A0000] text-white font-semibold py-4 rounded-2xl text-base hover:bg-[#600000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '추천 중...' : `레시피 추천받기 (${selected.size}개 선택)`}
        </button>
      </div>

      {/* 직접 입력 모달 */}
      {showModal && (
        <AddIngredientModal
          onClose={() => setShowModal(false)}
          onAdd={handleModalAdd}
        />
      )}
    </div>
  )
}

export default FridgePage
