// src/components/RecipeDetail.jsx
// 레시피 상세 정보를 표시하는 컴포넌트입니다. (SHT-FE-5, 6)
//
// Props:
//   - recipe (object): GET /recipes/:id 응답 데이터
//     - title (string): 요리명
//     - cooking_time_min (number): 조리시간 (분)
//     - ingredients (array): 재료 목록 [{ name, quantity, is_optional }]
//     - instructions (string): 조리 순서 (줄바꿈 \n으로 구분)
//     - source_url (string): 원본 출처 URL
//     - is_llm_generated (boolean): LLM 생성 여부

function RecipeDetail({ recipe }) {
  const {
    title,
    cooking_time_min,
    ingredients,
    instructions,
    source_url,
    is_llm_generated,
  } = recipe

  // instructions는 \n으로 구분된 문자열입니다.
  // split('\n')으로 배열로 변환해 각 단계를 순서대로 렌더링합니다.
  const steps = instructions?.split('\n').filter((step) => step.trim() !== '')

  return (
    <div>
      {/* 요리명 */}
      <h2>{title}</h2>

      {/* 조리시간 */}
      <p>조리시간: {cooking_time_min}분</p>

      {/* LLM 생성 여부 */}
      {is_llm_generated && <p>AI 생성 레시피</p>}

      {/* 재료 목록 */}
      <section style={{ marginTop: '16px' }}>
        <h3>재료</h3>
        <ul>
          {ingredients?.map((item, index) => (
            <li key={index}>
              {item.name} {item.quantity}
              {item.is_optional && ' (선택)'}
            </li>
          ))}
        </ul>
      </section>

      {/* 조리 순서 */}
      <section style={{ marginTop: '16px' }}>
        <h3>조리 순서</h3>
        <ol>
          {steps?.map((step, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* 출처 URL */}
      {source_url && (
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#888' }}>
          출처: {source_url}
        </p>
      )}
    </div>
  )
}

export default RecipeDetail
