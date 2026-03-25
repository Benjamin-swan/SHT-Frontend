# 요리조리 — 프론트엔드

식재료를 선택하면 어울리는 레시피를 추천해주는 웹앱입니다.

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | React 18 + Vite |
| 스타일링 | Tailwind CSS v4 |
| 라우팅 | React Router v6 |
| API 통신 | axios |
| 상태관리 | useState + Context API |
| 로컬 저장 | localStorage |

---

## 시작하기

### 요구 사항
- Node.js 18 이상
- 백엔드 서버 실행 중 (FastAPI, 기본 포트 `8000`)

### 설치 및 실행

```bash
# 1. frontend 폴더로 이동
cd frontend

# 2. 패키지 설치
npm install

# 3. 환경변수 설정
cp .env.example .env
# .env 파일에서 VITE_API_BASE_URL 확인 (기본값: http://localhost:8000)

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 페이지 구조

```
/                →  식재료 입력 페이지
/recipes         →  추천 레시피 목록 페이지
/recipes/:id     →  레시피 상세 페이지
```

---

## 폴더 구조

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js             # axios 인스턴스 + API 함수
│   ├── components/
│   │   ├── IngredientButton.jsx  # 식재료 선택 버튼
│   │   ├── FreshnessButton.jsx   # 소비기한 선택 버튼
│   │   ├── RecipeCard.jsx        # 레시피 카드
│   │   ├── RecipeDetail.jsx      # 레시피 상세 내용
│   │   └── RecentRecipes.jsx     # 최근 본 레시피 목록
│   ├── constants/
│   │   └── ingredients.js        # 빈출 식재료 10종
│   ├── hooks/
│   │   └── useRecentRecipes.js   # 최근 본 레시피 localStorage 훅
│   └── pages/
│       ├── InputPage.jsx         # 식재료 입력
│       ├── RecipeListPage.jsx    # 추천 목록
│       └── RecipeDetailPage.jsx  # 레시피 상세
├── .env.example                  # 환경변수 예시
└── package.json
```

---

## 환경변수

`.env.example`을 복사해 `.env`로 만든 뒤 값을 설정합니다.

```
VITE_API_BASE_URL=http://localhost:8000
```

> `.env`는 git에 포함되지 않습니다.

---

## 연동 API

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/ingredients` | 빈출 식재료 목록 조회 |
| POST | `/recipes/recommend` | 식재료 기반 레시피 추천 |
| GET | `/recipes/:id` | 레시피 상세 조회 |
| POST | `/logs/event` | 사용자 클릭 이벤트 로그 |

---

## 개발 현황

- [x] SHT-FE-1: 빈출 식재료 버튼 제공
- [x] SHT-FE-2: 식재료 버튼 클릭/해제 토글 UI
- [x] SHT-FE-3: 소비기한 입력 간소화 버튼
- [x] SHT-FE-4: 레시피 조회 → 추천 목록 UI
- [x] SHT-FE-5: 추천 요리 클릭 → 상세 레시피 UI
- [x] SHT-FE-6: 레시피 리스트 및 상세 페이지 컴포넌트
- [x] SHT-FE-7: 클릭 이벤트 로그 API 연동 (silent fail)
- [x] SHT-FE-8: 최근 본 레시피 localStorage 저장/조회
- [x] SHT-FE-9: 식재료 직접 입력 모달 - 프론트엔드 카테고리 지정 연동
- [x] SHT-FE-10: 소비기한(싱싱/임박) 선택 및 이벤트 로그 연동 (client.js)
