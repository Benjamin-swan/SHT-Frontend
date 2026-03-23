// src/pages/RecipeDetailPage.jsx
// 레시피 상세 페이지 (SHT-FE-5, 6)
//
// 흐름:
//   1. URL의 :id 파라미터를 읽어 GET /recipes/:id 요청을 보냅니다.
//   2. 응답 데이터를 RecipeDetail 컴포넌트에 전달해 렌더링합니다.
//   3. 로딩 중 / 에러 상태를 텍스트로 표시합니다.
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RecipeDetail from '../components/RecipeDetail'
import { getRecipeDetail } from '../api/client'

function RecipeDetailPage() {
  // useParams: URL의 동적 파라미터(:id)를 읽습니다.
  // 예) /recipes/abc123 → { id: 'abc123' }
  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // useEffect: 컴포넌트가 처음 렌더링될 때 API 요청을 보냅니다.
  // [id]를 의존성 배열에 넣으면 id가 바뀔 때마다 다시 요청합니다.
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getRecipeDetail(id)
        setRecipe(response.data)
      } catch (err) {
        setError('레시피 정보를 불러오지 못했습니다. 다시 시도해주세요.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/recipes')} style={{ marginBottom: '16px' }}>
        ← 목록으로 돌아가기
      </button>

      {/* 로딩 상태 */}
      {loading && <p>레시피를 불러오는 중...</p>}

      {/* 에러 상태 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 정상 응답: RecipeDetail 컴포넌트에 데이터 전달 */}
      {!loading && !error && recipe && (
        <RecipeDetail recipe={recipe} />
      )}
    </div>
  )
}

export default RecipeDetailPage
