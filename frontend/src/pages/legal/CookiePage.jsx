import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

function CookiePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col pt-[77px]">
      <NavBar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1C1C15] mb-8 text-center">쿠키 정책 (Cookie Policy)</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <p className="text-[#78716C] leading-relaxed text-sm text-center mb-4">
            요리조리(Yori-Jori)는 이용자에게 연속적이고 원활한 서비스를 제공하기 위해 <br/>브라우저의 쿠키(Cookie) 및 로컬 스토리지(Local Storage)를 운용합니다.
          </p>

          <section>
            <h2 className="text-md font-bold text-[#1C1C15] mb-2">1. 쿠키 및 로컬스토리지의 정의</h2>
            <p className="text-[#78716C] leading-relaxed text-sm">
              쿠키와 로컬 스토리지는 웹사이트가 이용자의 브라우저 또는 기기에 저장하는 작은 텍스트 데이터 파일입니다.
              요리조리는 회원가입 절차가 없으므로, 이 기술들을 활용하여 이용자를 식별하고 서비스 이용 기록을 보장합니다.
            </p>
          </section>
          
          <section>
            <h2 className="text-md font-bold text-[#1C1C15] mb-2">2. 저장 및 사용되는 정보</h2>
            <p className="text-[#78716C] leading-relaxed text-sm">
              요리조리에서 사용하는 브라우저 저장 정보는 다음과 같습니다.<br/><br/>
              <strong>- Browser UUID (`browser_uuid`):</strong> 기기를 고유하게 식별하기 위한 무작위 문자열입니다.<br/>
              <strong>- Session ID (`session_id`):</strong> 레시피 클릭 및 저장, 식재료 추가 이력 등을 서버에 동기화하기 위한 세션 식별 키입니다.<br/>
              <strong>- Liked Recipes (`liked_recipes`):</strong> 사용자가 '좋아요(하트)'를 클릭하여 보관함에 담은 레시피의 목록 및 제목입니다.<br/>
              <strong>- 기타 UI 상태:</strong> 페이지네이션 내역, 검색 중이던 식재료 정보 등이 임시 저장될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-md font-bold text-[#1C1C15] mb-2">3. 쿠키 거부 및 삭제 방법</h2>
            <p className="text-[#78716C] leading-relaxed text-sm">
              이용자는 웹 브라우저의 옵션 설정을 통해 쿠키 및 로컬 스토리지 데이터 저장을 거부하실 수 있습니다. 
              다만, 이 기능을 차단하거나 삭제할 경우 <strong>저장된 레시피 기록이 초기화되거나 맞춤형 추천 기능이 제한될 수 있습니다.</strong><br/><br/>
              - 크롬(Chrome): 설정 &gt; 개인정보 및 보안 &gt; 인터넷 사용 기록 삭제 또는 쿠키 및 기타 사이트 데이터 설정<br/>
              - 사파리(Safari): 환경설정 &gt; 개인정보 보호 &gt; 쿠키 및 웹 사이트 데이터 차단/지우기
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CookiePage
