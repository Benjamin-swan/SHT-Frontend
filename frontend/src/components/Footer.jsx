// src/components/Footer.jsx
// 모든 페이지 하단에 공통으로 사용하는 푸터 컴포넌트입니다.
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-6 px-8">
      <div className="max-w-5xl mx-auto">
        {/* 상단: 로고 + 링크 그룹 */}
        <div className="flex flex-col md:flex-row gap-10 mb-8">
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
            <p className="text-xs text-[#78716C] leading-relaxed">
              냉장고 속 재료로 오늘 뭐 먹을지 고민될 때, 요리조리가 딱 맞는 레시피를 찾아드립니다.
            </p>
            {/* 공유 아이콘 */}
            <button className="mt-4 text-[#78716C] hover:text-[#7A0000] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {/* 오른쪽: 링크 그룹 */}
          <div className="flex gap-16 ml-auto">
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
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">도움말</span></li>
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">안전 안내</span></li>
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">문의하기</span></li>
              </ul>
            </div>
            {/* 약관 */}
            <div>
              <p className="text-sm font-semibold text-[#1C1C15] mb-3">약관</p>
              <ul className="space-y-2 text-sm text-[#78716C]">
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">이용약관</span></li>
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">개인정보처리방침</span></li>
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">쿠키 정책</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단: 저작권 */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-[#78716C]">
            © 2026 Yorijori Culinary Curator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
