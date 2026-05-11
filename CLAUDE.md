# CLAUDE.md — 요리조리 프론트엔드 개발 규약

## AI 페르소나 및 응답 원칙

당신은 시니어 풀스택 개발자입니다. 신중하고, 자세한 답변을 제공하며 뛰어난 사고력을 가지고 있습니다.

- 사용자가 질문하면 먼저 단계별로 생각하며 계획을 세우고 답변하세요.
- 항상 올바르고, 모범적인, DRY 원칙(중복을 피하는 코드), 버그 없는 코드를 작성하세요.
- 가독성을 우선하되, 성능도 고려한 코드를 작성하세요.
- 요청된 모든 기능을 완전히 구현하세요.
- 코드는 간결하고 불필요한 설명은 최소화하세요.
- 모르는 경우는 모른다고 답하고, 추가 조사가 필요하면 이를 언급하세요.
- **별도의 요청이 없으면 모든 응답은 한국어로 답하세요.**
- 사용자가 주니어 개발자라고 가정하고, 코드에 대한 자세한 설명을 모든 답변에 포함하세요.

---

## 프로젝트 개요

**요리조리** — 식재료 기반 레시피 추천 서비스의 프론트엔드입니다. 웹앱(Web App)으로, 브라우저와 모바일 앱 환경 모두를 지원합니다.

- **MVP 목표**: CSS/UI 작업 없이 백엔드 API 연동 동작 확인 우선
- **스타일링**: 연동 완료 후 2차에서 진행 (Tailwind CSS 준비됨)
- **피그마 시안 없이 개발 선행**: 연동 결과 확인 후 UI 보완

---

## 기술 스택

| 항목 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | React 18 + Vite | 빠른 번들링, HMR |
| 스타일링 | Tailwind CSS | 2차 작업에서 진행 |
| 라우팅 | React Router v6 | 3페이지 SPA |
| API 통신 | axios | FastAPI 백엔드 연동 |
| 상태관리 | useState + Context API | MVP 수준, Redux 불필요 |
| 로컬 저장 | localStorage | 최근 본 레시피 |
| 환경변수 | .env (VITE_ 접두사) | API 베이스 URL |

---

## 폴더 구조 (Feature-Sliced Design)

**의존 방향**: `pages → features → shared` (역방향 import 금지)

```
SHT-Frontend/
├── public/                              # 정적 자산 (favicon, icons, images)
├── src/
│   ├── main.jsx                         # 앱 진입점
│   ├── app/                             # 앱 셸 — 라우팅, 전역 스타일
│   │   ├── App.jsx                      # BrowserRouter + Routes
│   │   └── styles/index.css             # Tailwind entry
│   ├── pages/                           # 라우트 진입점 (얇게 — 조립만)
│   │   ├── HomePage.jsx
│   │   ├── FridgePage.jsx               # 나의 냉장고
│   │   ├── RecipeListPage.jsx           # 추천 목록
│   │   ├── RecipeDetailPage.jsx         # 레시피 상세
│   │   ├── SavedPage.jsx                # 저장된 레시피
│   │   ├── legal/                       # 약관·개인정보·쿠키
│   │   └── support/                     # 고객지원·안전·문의
│   ├── features/                        # 도메인별 자급자족 (UI + 훅 + API)
│   │   ├── ingredient/
│   │   │   ├── components/AddIngredientModal.jsx
│   │   │   └── api.js                   # 재료 도메인 엔드포인트
│   │   └── recipe/
│   │       ├── hooks/useRecentRecipes.js
│   │       └── api.js                   # 레시피 도메인 엔드포인트
│   └── shared/                          # 도메인 비종속 공용
│       ├── api/http.js                  # axios 인스턴스 + browser_uuid/session_id
│       ├── ui/                          # NavBar, Footer, ScrollToTop
│       └── assets/                      # 공용 이미지·아이콘
├── .env                                 # 환경변수 (git 제외)
├── .env.example                         # 환경변수 예시 (git 포함)
├── jsconfig.json                        # 경로 별칭 IDE 인텔리센스
├── vite.config.js                       # 경로 별칭 정의
└── package.json
```

### 경로 별칭 (vite.config.js + jsconfig.json)

| 별칭         | 실제 경로        | 용도                                    |
|--------------|------------------|-----------------------------------------|
| `@/`         | `src/`           | 전역 진입                                |
| `@app/`      | `src/app/`       | 앱 셸 (App, 라우터, 글로벌 스타일)        |
| `@pages/`    | `src/pages/`     | 라우트 페이지                             |
| `@features/` | `src/features/`  | 도메인 모듈 (`@features/recipe/api`)     |
| `@shared/`   | `src/shared/`    | 공용 (`@shared/ui/NavBar`, `@shared/api/http`) |

**규칙**: 한 파일 안에서 `../` 두 번 이상 올라가면 별칭으로 교체할 것.

---

## 페이지 라우팅

```
/                →  HomePage           (메인 — 검색 + 최근 레시피 + 냉장고 CTA)
/fridge          →  FridgePage         (나의 냉장고 — 재료 등록/관리)
/recipes         →  RecipeListPage     (추천 목록)
/recipes/:id     →  RecipeDetailPage   (레시피 상세)
/saved           →  SavedPage          (저장된 레시피)
/legal/{terms,privacy,cookie}          (약관·개인정보·쿠키)
/support/{help,safety,contact}         (도움말·안전·문의)
```

---

## 환경변수

```
# SHT-Frontend/.env (git 제외)
VITE_API_BASE_URL=http://localhost:8000
```

- `.env`는 반드시 `.gitignore`에 추가
- `.env.example`은 git에 포함하여 팀 공유

---

## API 명세

### GET /ingredients
빈출 식재료 목록 반환

```json
{
  "ingredients": [
    { "id": "uuid", "name": "계란", "category": "단백질" }
  ]
}
```

### POST /recipes/recommend
식재료 기반 레시피 추천

```json
// Request
{ "ingredients": ["계란", "김치"], "session_id": "uuid" }

// Response
{
  "recipes": [
    {
      "id": "uuid",
      "title": "김치볶음밥",
      "cooking_time_min": 15,
      "matched_ingredients": ["계란", "김치"],
      "source": "db",
      "is_llm_generated": false
    }
  ]
}
```

### GET /recipes/{id}
레시피 상세 조회

```json
{
  "id": "uuid",
  "title": "김치볶음밥",
  "cooking_time_min": 15,
  "instructions": "1. 팬을 달군다\n2. 김치를 볶는다...",
  "ingredients": [
    { "name": "계란", "quantity": "2개", "is_optional": false }
  ],
  "source_url": "https://...",
  "is_llm_generated": false
}
```

### POST /logs/event
클릭 이벤트 로그 (silent fail 필수)

```json
// Request
{
  "session_id": "uuid",
  "event_type": "recipe_click",
  "recipe_id": "uuid",
  "metadata": {}
}
// event_type: "recipe_click" | "ingredient_input" | "recommend_request"
```

---

## API 레이어 구조 (도메인별 분리)

axios 인스턴스는 `@shared/api/http.js` 한 곳에서만 만들고, 엔드포인트는
도메인별로 `@features/<domain>/api.js` 에 둡니다. 컴포넌트는 항상
도메인 API 모듈을 import 하고, 절대 axios 를 직접 import 하지 않습니다.

```javascript
// src/shared/api/http.js — 인스턴스 + 익명 식별
import axios from 'axios'
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 70000,
})
export const getBrowserUUID = () => { /* localStorage 1회 생성 */ }
export const ensureSessionId = () => { /* 없으면 새로 발급 */ }
```

```javascript
// src/features/recipe/api.js
import { http, ensureSessionId } from '@shared/api/http'

export const recommendRecipes = (ingredient_names) =>
  http.post('/recipes/recommend', { ingredient_names })

export const logRecipeInteraction = (recipe_id, event_type = 'recipe_click') => {
  const session_id = ensureSessionId()
  return http
    .post('/logs/interaction', { session_id, recipe_id, event_type })
    .catch(() => {}) // silent fail
}
```

```javascript
// src/pages/RecipeListPage.jsx
import { logRecipeInteraction } from '@features/recipe/api'
```

---

## 개발 규칙

### 코드 작성 원칙
- **DRY**: 중복 로직은 도메인 훅(`@features/<domain>/hooks/`) 또는 `@shared/lib/` 유틸로 분리
- **컴포넌트 분리**: `pages/`는 레이아웃·라우팅·상태 조립만, 도메인 UI는 `@features/<domain>/components/`, 도메인 비종속 UI는 `@shared/ui/`
- **import 별칭**: `../`, `../../` 같은 상대경로 대신 항상 `@app/@pages/@features/@shared` 사용
- **axios 직접 import 금지**: 컴포넌트는 도메인 API 모듈(`@features/<domain>/api`)만 import
- **Props 명확화**: 컴포넌트 props는 역할이 명확하도록 네이밍
- **에러 처리**: API 호출 시 로딩/에러 상태를 텍스트로 반드시 표시
- **로그 이벤트**: `POST /logs/event`는 항상 silent fail (실패해도 페이지 이동 중단 금지)

### 상태 관리
- MVP 단계에서는 `useState` + `Context API`만 사용 (Redux 도입 금지)
- 전역 상태가 필요한 경우에만 Context 사용, 그 외는 로컬 state

### 연동 확인 방법
- 브라우저 **Network 탭**으로 API 요청/응답 확인
- `console.log`로 응답 데이터 확인 (배포 전 제거)

---

## 개발 순서 (권장)

1. Vite + React + Tailwind 프로젝트 초기화
2. `.env` 설정 + `api/client.js` 작성
3. `App.jsx` 라우터 3개 설정
4. `InputPage` — 버튼 state 관리 + `POST /recipes/recommend` 연동
5. `RecipeListPage` — 응답 렌더링 + 카드 클릭 이벤트 연동
6. `RecipeDetailPage` — `GET /recipes/{id}` 연동 + 텍스트 렌더링
7. `POST /logs/event` silent fail 처리
8. `useRecentRecipes` 훅 + localStorage 연동

---

## 연동 확인 체크리스트

### InputPage
- [ ] 버튼 클릭 시 선택/해제 상태가 state로 관리되는가
- [ ] 유통기한 버튼 선택값이 state에 반영되는가
- [ ] 조회 버튼 클릭 시 `POST /recipes/recommend` 요청이 가는가
- [ ] 요청 body에 선택한 재료 목록이 정확히 담기는가

### RecipeListPage
- [ ] `POST /recipes/recommend` 응답값이 카드 목록으로 렌더링되는가
- [ ] 카드 클릭 시 `/recipes/:id`로 페이지 이동이 되는가
- [ ] 카드 클릭 시 `POST /logs/event` 요청이 가는가
- [ ] 로그 요청 실패 시 페이지 이동이 중단되지 않는가 (silent fail)
- [ ] 클릭한 레시피가 localStorage에 저장되는가

### RecipeDetailPage
- [ ] URL의 `:id`로 `GET /recipes/{id}` 요청이 가는가
- [ ] 응답값(요리명, 재료, 조리 순서)이 화면에 텍스트로 렌더링되는가
- [ ] 로딩 중 / 에러 상태가 텍스트로 표시되는가

---

## 프론트엔드 백로그

### SHT-FE-1 — 빈출 식재료 버튼 제공 (InputPage)
- 한국인 빈출 식재료 기준 버튼 UI 제공
- 빈출 식재료 목록이 정확히 반영되는지 확인

### SHT-FE-2 — 식재료 버튼 클릭 이벤트 UI (InputPage)
- 버튼 클릭 시 선택(비활성) 상태로 토글
- 버튼 재클릭 시 활성화 상태로 복귀

### SHT-FE-3 — 유통기한 입력 간소화 버튼 (InputPage)
- 유통기한 버튼 UI 노출 (싱싱 / 임박)
- 버튼 클릭 시 선택/해제 토글 이벤트 처리

### SHT-FE-4 — 레시피 조회 클릭 시 추천 요리 UI (RecipeListPage)
- 레시피 조회 버튼 클릭 시 추천 레시피 목록 렌더링
- 추천 요리 리스트 클릭 시 상세 페이지로 이동

### SHT-FE-5 — 추천 요리 클릭 시 상세 레시피 UI (RecipeDetailPage)
- 추천 요리 클릭 시 상세 레시피 UI 노출
- 요리명, 재료 목록, 조리 순서 표시

### SHT-FE-6 — 레시피 리스트 및 상세 페이지 UI
- `RecipeCard` 컴포넌트: 요리명, 주재료, 조리시간 카드 형태 노출
- `RecipeDetail` 컴포넌트: 요리명, 재료, 조리 순서 노출
- `GET /recipes/recommend`, `GET /recipes/:id` API 연동
- 로딩 / 에러 상태 UI 처리

### SHT-FE-7 — 레시피 조회/클릭 이벤트 트리거
- 레시피 조회 버튼 클릭 시 `POST /recipes/recommend` 요청
- 레시피 카드 클릭 시 `POST /logs/event` 요청 (`event_type: recipe_click`)
- 이벤트 로그 실패 시 silent fail (서비스 흐름 중단 금지)

### SHT-FE-8 — 최근 본 레시피 UI (RecentRecipes)
- 레시피 클릭 시 localStorage에 저장
- 최대 5개까지 표시, 새로고침 후에도 유지
- InputPage 하단에 최근 본 레시피 섹션 배치

### SHT-FE-9 — 식재료 직접 입력 검색 칸 (InputPage)
- 텍스트 입력으로 식재료를 직접 검색하고 선택할 수 있는 UI 제공
- 입력 확정 시 `POST /logs/event` 호출 (`input_method: "direct"`)
- 이 시점에 세션이 DB(`user_sessions`)에 등록되어 이후 recipe-click 로그 정상 저장 가능

**Success Criteria**
- [ ] 검색 입력창에 텍스트를 입력하면 일치하는 식재료가 드롭다운 또는 목록으로 표시된다
- [ ] 항목 선택 시 선택된 재료 state에 추가된다
- [ ] 선택 즉시 `POST /logs/event`가 호출된다 (`input_method: "direct"`)
- [ ] 호출 성공 시 세션이 DB에 등록된다 (Network 탭에서 201 응답 확인)
- [ ] 이후 레시피 클릭 시 `POST /logs/recipe-click`이 500 없이 201로 응답한다
- [ ] 로그 이벤트 실패 시 silent fail — 사용자에게 에러 노출 없음

**TODO**
- [ ] `InputPage`에 텍스트 입력 `<input>` 컴포넌트 추가
- [ ] 입력값으로 `GET /ingredients` 응답 목록을 필터링하는 로직 작성
- [ ] 항목 선택 시 `logIngredientEvent(ingredient_id, "direct")` 호출 함수 작성
- [ ] `src/api/client.js`에 `logIngredientEvent` 함수 추가
- [ ] `browser_uuid`를 localStorage에서 읽거나 최초 1회 생성하는 유틸 함수 작성
- [ ] 선택된 재료가 버튼 선택 목록과 중복되지 않도록 state 통합 처리

### SHT-FE-10 — 선택된 재료 X 버튼으로 개별 삭제 (InputPage)
- 선택된 재료 목록에서 각 재료 옆 X 버튼 클릭 시 해당 재료를 선택 해제합니다.
- 버튼 선택 및 검색 직접 입력으로 추가된 재료 모두 적용됩니다.

**Success Criteria**
- [ ] 선택된 재료가 텍스트만이 아닌 태그/칩(chip) 형태로 표시된다
- [ ] 각 태그에 X 버튼이 있으며 클릭 시 해당 재료가 목록에서 제거된다
- [ ] X 클릭 후 버튼 UI에서도 해당 재료의 선택 상태가 해제된다 (동기화)
- [ ] 모든 재료 삭제 시 '없음' 상태로 돌아간다

**TODO**
- [ ] `InputPage`의 선택 현황 섹션을 칩(chip) 목록 형태로 교체
- [ ] 각 칩에 X 버튼(`<button>`) 추가
- [ ] X 클릭 시 `handleIngredientClick(name)` 또는 별도 remove 핸들러 호출

---

## CORS 설정 (백엔드 참고용)

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite 기본 포트
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
