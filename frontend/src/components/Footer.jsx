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
            <div className="flex items-center gap-1 mb-2">
              {/* 로고 텍스트 — Yori(빨강) Jori(노랑) */}
              <span className="text-xl font-bold leading-none">
                <span className="text-[#7A0000]">Yori</span>
                <br />
                <span className="text-[#FEFA99] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Jori</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-[#1C1C15] mb-2">Better cooking, simplified</p>
            <p className="text-xs text-[#78716C] leading-relaxed">
              요리조리는 당신의 냉장고 속 재료를 가장 똑똑하게 활용할 수 있도록 큐레이션 경험합니다나 나눠 있는 식생활,
              즐거운 요리 경험을 선사합니다.
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
            {/* Explore */}
            <div>
              <p className="text-sm font-semibold text-[#1C1C15] mb-3">Explore</p>
              <ul className="space-y-2 text-sm text-[#78716C]">
                <li><Link to="/recipes" className="hover:text-[#7A0000] transition-colors">Recipes</Link></li>
                <li><Link to="/" className="hover:text-[#7A0000] transition-colors">Classes</Link></li>
              </ul>
            </div>
            {/* Support */}
            <div>
              <p className="text-sm font-semibold text-[#1C1C15] mb-3">Support</p>
              <ul className="space-y-2 text-sm text-[#78716C]">
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">Help Center</span></li>
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">Safety Warnings</span></li>
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">Contact Us</span></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <p className="text-sm font-semibold text-[#1C1C15] mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-[#78716C]">
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">Terms</span></li>
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">Privacy</span></li>
                <li><span className="hover:text-[#7A0000] cursor-pointer transition-colors">Cookie Policy</span></li>
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
