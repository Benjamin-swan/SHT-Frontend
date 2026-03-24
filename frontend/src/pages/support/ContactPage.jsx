import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col pt-[77px]">
      <NavBar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1C1C15] mb-8 text-center">문의하기</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <p className="text-[#78716C] leading-relaxed text-sm mb-8 text-center">
            요리조리 서비스 이용에 불편함이 있으시거나, 제휴 및 기타 문의가 있으신 경우<br/>
            언제든지 고객센터로 연락 주시기 바랍니다.
          </p>

          <div className="space-y-6">
            <div className="flex flex-col items-center bg-[#FAFAFA] rounded-xl p-6 border border-gray-100">
              <svg className="w-8 h-8 text-[#7A0000] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-bold text-[#1C1C15] mb-1">이메일 문의</h3>
              <p className="text-sm text-[#78716C]">support@yorijori.co.kr</p>
              <p className="text-xs text-[#78716C] mt-2">평일 10:00 - 18:00 (주말 및 공휴일 휴무)</p>
            </div>

            <div className="flex flex-col items-center bg-[#FAFAFA] rounded-xl p-6 border border-gray-100">
              <svg className="w-8 h-8 text-[#7A0000] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="text-lg font-bold text-[#1C1C15] mb-1">고객센터</h3>
              <p className="text-sm font-bold text-[#7A0000]">1588-0000</p>
              <p className="text-xs text-[#78716C] mt-2">유선 연결이 어려울 경우 ই메일을 이용해주세요.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
