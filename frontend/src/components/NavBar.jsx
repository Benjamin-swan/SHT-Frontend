// src/components/NavBar.jsx
// 모든 페이지에서 공통으로 사용하는 상단 네비게이션 바입니다.
// 로고, 메뉴 링크, My Fridge 버튼으로 구성됩니다.
import { Link, useNavigate } from 'react-router-dom'

function NavBar() {
  const navigate = useNavigate()

  return (
    // 흰 배경 네비게이션 바. 하단에 얇은 테두리선
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* 로고 — 클릭 시 홈으로 이동 */}
      <Link to="/" className="text-xl font-bold text-[#7A0000]">
        요리조리
      </Link>

      {/* 가운데 메뉴 링크 */}
      <div className="flex items-center gap-8 text-sm font-medium text-[#1C1C15]">
        <Link to="/recipes" className="hover:text-[#7A0000] transition-colors">
          레시피
        </Link>
        <Link to="/" className="hover:text-[#7A0000] transition-colors">
          저장된 레시피
        </Link>
        <Link to="/" className="hover:text-[#7A0000] transition-colors">
          Cooking Class
        </Link>
      </div>

      {/* My Fridge 버튼 — 클릭 시 냉장고(재료 등록) 페이지로 이동 */}
      <button
        onClick={() => navigate('/fridge')}
        className="bg-[#7A0000] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#600000] transition-colors"
      >
        My Fridge
      </button>
    </nav>
  )
}

export default NavBar
