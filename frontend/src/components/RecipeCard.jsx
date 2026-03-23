// src/components/RecipeCard.jsx
// 추천 레시피 하나를 카드 형태로 표시하는 컴포넌트입니다. (SHT-FE-6)
//
// Props:
//   - recipe (object): 레시피 데이터
//     - id (string): 레시피 고유 ID
//     - title (string): 요리명
//     - cooking_time_min (number): 조리시간 (분)
//     - matched_ingredients (string[]): 매칭된 재료 목록
//     - is_llm_generated (boolean): LLM 생성 여부
//   - onClick (function): 카드 클릭 시 호출할 함수

function RecipeCard({ recipe, onClick }) {
  const { title, cooking_time_min, matched_ingredients, is_llm_generated } = recipe

  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        cursor: 'pointer',
      }}
    >
      {/* 요리명 */}
      <h3 style={{ margin: '0 0 8px' }}>{title}</h3>

      {/* 조리시간 */}
      <p style={{ margin: '0 0 4px', color: '#555' }}>
        조리시간: {cooking_time_min}분
      </p>

      {/* 매칭된 식재료 */}
      <p style={{ margin: '0 0 4px', color: '#555' }}>
        재료: {matched_ingredients?.join(', ')}
      </p>

      {/* LLM 생성 여부 표시 */}
      {is_llm_generated && (
        <p style={{ margin: '0', color: '#888', fontSize: '12px' }}>
          AI 생성 레시피
        </p>
      )}
    </div>
  )
}

export default RecipeCard
