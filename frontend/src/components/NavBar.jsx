// src/components/NavBar.jsx
// 모든 페이지에서 공통으로 사용하는 상단 네비게이션 바입니다.
// 현재 경로에 맞는 메뉴 항목 하단에 #7A0000 실금(언더라인)을 표시합니다.
import { Link, useNavigate, useLocation } from 'react-router-dom'

// 메뉴 항목 정의 — path가 현재 URL과 일치하면 활성 상태로 표시합니다.
const NAV_ITEMS = [
  { label: '레시피 검색', to: '/' },
  { label: '저장된 레시피', to: '/saved' },
]

function NavBar() {
  const navigate = useNavigate()
  // 현재 URL 경로를 읽어 활성 메뉴 판별에 사용합니다.
  const { pathname } = useLocation()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* 로고 — 클릭 시 홈으로 이동 */}
      <Link to="/">
        <img
          src="/images/yorijori.png"
          alt="요리조리 로고"
          className="h-10 w-auto object-contain"
        />
      </Link>

      {/* 가운데 메뉴 링크 */}
      <div className="flex items-center gap-8 text-sm font-medium text-[#1C1C15]">
        {NAV_ITEMS.map(({ label, to }) => {
          // 홈('/')은 정확히 일치할 때만, 나머지는 startsWith로 판별
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className="relative pb-1 transition-colors hover:text-[#7A0000]"
              style={{ color: isActive ? '#7A0000' : undefined }}
            >
              {label}
              {/* 활성 상태일 때만 하단 실금 표시 — 페이드인 효과 */}
              <span
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  borderRadius: '9999px',
                  background: '#7A0000',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.25s ease',
                }}
              />
            </Link>
          )
        })}
      </div>

      {/* My Fridge 버튼 */}
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
