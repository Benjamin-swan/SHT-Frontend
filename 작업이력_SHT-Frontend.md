# 요리조리 프론트엔드 — 작업 이력

> 작성일: 2026-03-23
> 브랜치: main
> 대상 레포: SHT-Frontend

---

## 개요

식재료 기반 레시피 추천 서비스 **요리조리**의 프론트엔드 MVP를 처음부터 구성한 작업 이력입니다.
백엔드(FastAPI) 연동을 목표로, CSS 없이 API 동작 확인 우선으로 개발되었습니다.

---

## 작업 순서 및 내용

### 1단계 — CLAUDE.md 작성 (개발 규약)

**파일**: `CLAUDE.md`

- AI 페르소나 및 응답 원칙 정의 (시니어 풀스택 개발자, 한국어 응답, 주니어 대상 설명 포함)
- 프로젝트 개요, 기술 스택, 폴더 구조, 페이지 라우팅 문서화
- API 명세 4개 정의 (GET /ingredients, POST /recipes/recommend, GET /recipes/:id, POST /logs/event)
- 개발 규칙, 권장 개발 순서, 연동 확인 체크리스트 작성
- 프론트엔드 백로그 SHT-FE-1 ~ FE-8 전체 정리

---

### 2단계 — 프로젝트 초기화 (1~3단계 통합)

**생성 파일**: `frontend/` 전체 구조

| 항목 | 내용 |
|------|------|
| 프레임워크 | Vite + React 18 |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite` 플러그인) |
| 라우팅 | React Router v6 |
| API 통신 | axios |
| 환경변수 | `.env` / `.env.example` 생성, `.gitignore`에 `.env` 추가 |

**주요 파일:**
- `vite.config.js` — Tailwind CSS 플러그인 설정
- `src/index.css` — `@import "tailwindcss"` 적용
- `src/main.jsx` — 앱 진입점 (기존 유지)
- `src/App.jsx` — React Router 3개 라우트 설정

```
/                →  InputPage
/recipes         →  RecipeListPage
/recipes/:id     →  RecipeDetailPage
```

- `src/api/client.js` — axios 인스턴스 + API 함수 4개

```javascript
getIngredients()           // GET /ingredients
recommendRecipes()         // POST /recipes/recommend
getRecipeDetail(id)        // GET /recipes/:id
logEvent(payload)          // POST /logs/event (silent fail)
```

---

### 3단계 — SHT-FE-1, 2, 3: InputPage 구현

**생성 파일:**

| 파일 | 역할 |
|------|------|
| `src/constants/ingredients.js` | 한국인 빈출 식재료 10종 상수 |
| `src/components/IngredientButton.jsx` | 식재료 버튼 (선택/해제 토글) |
| `src/components/FreshnessButton.jsx` | 유통기한 버튼 (싱싱/임박 토글) |
| `src/pages/InputPage.jsx` | 위 컴포넌트 통합 + 레시피 조회 버튼 |

**구현 내용:**
- `SHT-FE-1`: 빈출 식재료 10종 버튼 렌더링 (constants에서 관리)
- `SHT-FE-2`: 버튼 클릭 시 선택/해제 토글 (`Set` 기반 state 관리)
- `SHT-FE-3`: 유통기한 버튼 싱싱/임박 단일 선택, 재클릭 시 해제
- 레시피 조회 버튼 클릭 → `POST /recipes/recommend` → `/recipes`로 이동

---

### 4단계 — SHT-FE-4, 6, 7: RecipeListPage 구현

**생성/수정 파일:**

| 파일 | 역할 |
|------|------|
| `src/components/RecipeCard.jsx` | 요리명, 조리시간, 매칭 재료 카드 UI |
| `src/pages/RecipeListPage.jsx` | 레시피 목록 렌더링 + 카드 클릭 처리 |

**구현 내용:**
- `SHT-FE-4`: InputPage에서 `navigate('/recipes', { state: { recipes } })`로 받은 데이터를 카드 목록으로 렌더링, 카드 클릭 시 `/recipes/:id`로 이동
- `SHT-FE-6`: RecipeCard 컴포넌트 (요리명, 조리시간, 재료, AI 생성 여부 표시)
- `SHT-FE-7`: 카드 클릭 시 `POST /logs/event` 전송, silent fail 처리 (`logEvent`의 `.catch(() => {})` 활용)

**데이터 흐름:**
```
InputPage → POST /recipes/recommend
  → navigate('/recipes', { state: { recipes } })
    → RecipeListPage 렌더링
      → 카드 클릭 → POST /logs/event (silent fail)
        → navigate('/recipes/:id')
```

---

### 5단계 — SHT-FE-5, 6: RecipeDetailPage 구현

**생성/수정 파일:**

| 파일 | 역할 |
|------|------|
| `src/components/RecipeDetail.jsx` | 요리명, 재료 목록, 조리 순서 렌더링 |
| `src/pages/RecipeDetailPage.jsx` | GET /recipes/:id 연동 + 로딩/에러 처리 |

**구현 내용:**
- `SHT-FE-5`: URL `:id` 파라미터로 `GET /recipes/:id` 요청, 응답 데이터를 RecipeDetail에 전달
- `SHT-FE-6`: RecipeDetail 컴포넌트 (조리 순서는 `\n` split으로 `<ol>` 렌더링)
- 로딩 중 / 에러 상태 텍스트 표시

---

### 6단계 — SHT-FE-8: 최근 본 레시피 구현

**생성/수정 파일:**

| 파일 | 역할 |
|------|------|
| `src/hooks/useRecentRecipes.js` | localStorage 저장/조회, 최대 5개, 중복 제거 |
| `src/components/RecentRecipes.jsx` | 최근 본 레시피 목록 UI |
| `src/pages/RecipeListPage.jsx` | 카드 클릭 시 `addRecentRecipe` 연결 |
| `src/pages/InputPage.jsx` | 하단에 `<RecentRecipes>` 섹션 추가 |

**구현 내용:**
- 레시피 클릭 시 `{ id, title, cooking_time_min }` localStorage 저장
- 동일 항목 재클릭 시 중복 제거 후 맨 앞으로 이동
- 최대 5개 초과 시 오래된 항목 자동 제거
- 앱 새로고침 후에도 목록 유지 (localStorage 기반)
- InputPage 하단에 목록 노출, 클릭 시 `/recipes/:id`로 바로 이동

---

## 최종 파일 구조

```
frontend/
├── src/
│   ├── App.jsx                        # 라우터 3개
│   ├── main.jsx                       # 앱 진입점
│   ├── index.css                      # Tailwind 임포트
│   ├── api/
│   │   └── client.js                  # axios 인스턴스 + API 함수 4개
│   ├── constants/
│   │   └── ingredients.js             # 빈출 식재료 10종
│   ├── hooks/
│   │   └── useRecentRecipes.js        # localStorage 훅
│   ├── components/
│   │   ├── IngredientButton.jsx       # 식재료 버튼
│   │   ├── FreshnessButton.jsx        # 유통기한 버튼
│   │   ├── RecipeCard.jsx             # 레시피 카드
│   │   ├── RecipeDetail.jsx           # 레시피 상세 내용
│   │   └── RecentRecipes.jsx          # 최근 본 레시피 목록
│   └── pages/
│       ├── InputPage.jsx              # 식재료 입력
│       ├── RecipeListPage.jsx         # 추천 목록
│       └── RecipeDetailPage.jsx       # 레시피 상세
├── .env                               # 환경변수 (git 제외)
├── .env.example                       # 환경변수 예시
└── package.json
```

---

## 현재 상태 및 다음 과제

### 완료
- [x] 프로젝트 초기화 (Vite + React + Tailwind)
- [x] 라우터 3개 설정
- [x] API client 구성
- [x] SHT-FE-1 ~ FE-8 전체 구현

### 미완료 / 다음 과제
- [ ] **Mock 모드 추가**: 백엔드 없이 전체 페이지 흐름 체험 가능하도록 `.env` 플래그(`VITE_MOCK`) 기반 Mock 데이터 분기 처리 예정
- [ ] 백엔드 연동 실테스트 및 체크리스트 검증
- [ ] 2차 UI/CSS 작업 (Tailwind 스타일링)
