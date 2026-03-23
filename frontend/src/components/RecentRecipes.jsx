// src/components/RecentRecipes.jsx
// 최근 본 레시피 목록을 표시하는 컴포넌트입니다. (SHT-FE-8)
//
// Props:
//   - recipes (array): 최근 본 레시피 목록 [{ id, title, cooking_time_min }]
//   - onSelect (function): 항목 클릭 시 해당 레시피 id를 전달하는 함수
import { useNavigate } from 'react-router-dom'

function RecentRecipes({ recipes, onSelect }) {
  const navigate = useNavigate()

  if (recipes.length === 0) return null

  return (
    <section style={{ marginTop: '32px' }}>
      <h2>최근 본 레시피</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            style={{
              padding: '10px 0',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
            }}
          >
            <span>{recipe.title}</span>
            {recipe.cooking_time_min && (
              <span style={{ marginLeft: '8px', color: '#888', fontSize: '13px' }}>
                {recipe.cooking_time_min}분
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecentRecipes
