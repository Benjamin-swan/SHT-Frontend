// src/components/IngredientButton.jsx
// 식재료 버튼 하나를 담당하는 컴포넌트입니다. (SHT-FE-1, 2)
//
// Props:
//   - name (string): 버튼에 표시할 식재료 이름
//   - isSelected (boolean): 현재 선택된 상태인지 여부
//   - onClick (function): 버튼 클릭 시 호출할 함수

function IngredientButton({ name, isSelected, onClick }) {
  return (
    // isSelected 값에 따라 버튼 스타일을 다르게 적용합니다.
    // 선택됨 → 진한 배경 / 미선택 → 테두리만 표시
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        margin: '4px',
        border: '1px solid #333',
        borderRadius: '20px',
        backgroundColor: isSelected ? '#333' : '#fff',
        color: isSelected ? '#fff' : '#333',
        cursor: 'pointer',
      }}
    >
      {name}
    </button>
  )
}

export default IngredientButton
