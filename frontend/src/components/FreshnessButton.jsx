// src/components/FreshnessButton.jsx
// 유통기한 선택 버튼 컴포넌트입니다. (SHT-FE-3)
// '싱싱해요'와 '곧 만료돼요' 두 가지 옵션을 버튼으로 제공합니다.
//
// Props:
//   - selected (string | null): 현재 선택된 값 ('fresh' | 'expiring' | null)
//   - onChange (function): 버튼 클릭 시 선택값을 전달하는 함수

// 버튼 옵션을 상수로 분리해 유지보수를 쉽게 합니다.
const OPTIONS = [
  { value: 'fresh', label: '싱싱해요' },
  { value: 'expiring', label: '곧 만료돼요' },
]

function FreshnessButton({ selected, onChange }) {
  const handleClick = (value) => {
    // 이미 선택된 버튼을 다시 클릭하면 선택 해제 (null로 설정)
    onChange(selected === value ? null : value)
  }

  return (
    <div>
      <p>유통기한</p>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleClick(option.value)}
          style={{
            padding: '8px 16px',
            margin: '4px',
            border: '1px solid #333',
            borderRadius: '20px',
            backgroundColor: selected === option.value ? '#333' : '#fff',
            color: selected === option.value ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default FreshnessButton
