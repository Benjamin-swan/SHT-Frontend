// src/components/NavBar.jsx
// 모든 페이지에서 공통으로 사용하는 상단 네비게이션 바입니다.
// 모바일에서는 햄버거 메뉴로 네비게이션 링크를 접어서 보여줍니다.
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: '레시피 검색', to: '/' },
  { label: '저장된 레시피', to: '/saved' },
]

function NavBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] md:h-[77px] bg-white/90 border-b border-[#E7E5E4] backdrop-blur-[6px] z-50 shadow-sm">
      <div className="max-w-[1280px] h-full mx-auto flex items-center justify-between px-4 md:px-8">

        {/* 로고 */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/images/yorijori.png"
            alt="요리조리 로고"
            className="h-10 md:h-14 w-auto object-contain"
          />
        </Link>

        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#1C1C15]">
          {NAV_ITEMS.map(({ label, to }) => {
            const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`relative pb-1 transition-colors hover:text-[#7A0000] font-semibold`}
                style={{ color: isActive ? '#7A0000' : '#57534E' }}
              >
                {label}
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

        {/* 데스크탑 냉장고 버튼 */}
        <button
          onClick={() => navigate('/fridge')}
          className="hidden md:flex items-center gap-2 bg-[#7A0000] text-white text-[14px] font-medium px-5 py-2 rounded-full hover:bg-[#600000] transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" />
            <line x1="9" y1="6" x2="9" y2="8" />
            <line x1="9" y1="14" x2="9" y2="18" />
          </svg>
          나의 냉장고
        </button>

        {/* 모바일 우측 — 냉장고 아이콘 + 햄버거 */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => navigate('/fridge')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#7A0000] text-white"
            aria-label="나의 냉장고"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="4" y1="10" x2="20" y2="10" />
              <line x1="9" y1="6" x2="9" y2="8" />
              <line x1="9" y1="14" x2="9" y2="18" />
            </svg>
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
            aria-label="메뉴 열기"
          >
            <span
              className="block w-5 h-0.5 bg-[#1C1C15] transition-all duration-200"
              style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-0.5 bg-[#1C1C15] transition-all duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-0.5 bg-[#1C1C15] transition-all duration-200"
              style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E7E5E4] px-4 py-3 flex flex-col gap-1 shadow-md">
          {NAV_ITEMS.map(({ label, to }) => {
            const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors"
                style={{
                  color: isActive ? '#7A0000' : '#57534E',
                  background: isActive ? '#FFF3F1' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}

export default NavBar
