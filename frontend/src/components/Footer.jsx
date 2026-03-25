// src/components/Footer.jsx
// 모든 페이지 하단에 공통으로 사용하는 푸터 컴포넌트입니다.
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const [copyDone, setCopyDone] = useState(false)

  const handleShare = async () => {
    if (copyDone) return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 2000)
    } catch {
      alert('링크 복사에 실패했습니다. 주소창에서 직접 복사해 주세요.')
    }
  }
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-6 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* 상단: 로고 + 링크 그룹 */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-8">
          {/* 왼쪽: 로고 + 소개 */}
          <div className="flex-shrink-0 max-w-xs">
            <div className="mb-2">
              <img
                src="/images/yorijori.png"
                alt="요리조리 로고"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm font-semibold text-[#1C1C15] mb-2">Better cooking, simplified</p>
            <p className="text-xs text-[#78716C] leading-relaxed break-keep">
              냉장고 속 재료로 오늘 뭐 먹을지 고민될 때, 요리조리가 딱 맞는 레시피를 찾아드립니다.
            </p>
            {/* 공유 아이콘 */}
            <button
              onClick={handleShare}
              className="mt-4 transition-colors"
              aria-label="현재 페이지 링크 복사"
              title={copyDone ? '링크가 복사되었습니다!' : '링크 복사'}
            >
              {copyDone ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#78716C] hover:text-[#7A0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              )}
            </button>
          </div>

          {/* 오른쪽: 링크 그룹 */}
          <div className="flex gap-8 md:gap-16 md:ml-auto">
            {/* 탐색 */}
            <div>
              <p className="text-sm font-semibold text-[#1C1C15] mb-3">탐색</p>
              <ul className="space-y-2 text-sm text-[#78716C]">
                <li><Link to="/recipes" className="hover:text-[#7A0000] transition-colors">레시피</Link></li>
              </ul>
            </div>
            {/* 고객지원 */}
            <div>
              <p className="text-sm font-semibold text-[#1C1C15] mb-3">고객지원</p>
              <ul className="space-y-2 text-sm text-[#78716C]">
                <li><Link to="/support/help" className="hover:text-[#7A0000] transition-colors">도움말</Link></li>
                <li><Link to="/support/safety" className="hover:text-[#7A0000] transition-colors">안전 안내</Link></li>
                <li><Link to="/support/contact" className="hover:text-[#7A0000] transition-colors">문의하기</Link></li>
              </ul>
            </div>
            {/* 약관 */}
            <div>
              <p className="text-sm font-semibold text-[#1C1C15] mb-3">약관</p>
              <ul className="space-y-2 text-sm text-[#78716C]">
                <li><Link to="/legal/terms" className="hover:text-[#7A0000] transition-colors">이용약관</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-[#7A0000] transition-colors whitespace-nowrap">개인정보처리방침</Link></li>
                <li><Link to="/legal/cookie" className="hover:text-[#7A0000] transition-colors">쿠키 정책</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단: 저작권 */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-[#78716C] break-keep">
            © 2026 Yorijori Culinary Curator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
