# 🔌 API 연동 완료!

## 완료된 작업

✅ **모든 API 서비스 파일 생성 완료**
- ✅ `src/services/auth.service.ts` - 인증 (로그인, 회원가입, 카카오)
- ✅ `src/services/product.service.ts` - 상품 조회
- ✅ `src/services/cart.service.ts` - 장바구니 관리
- ✅ `src/services/order.service.ts` - 주문 관리
- ✅ `src/services/favorite.service.ts` - 좋아요 관리

✅ **Context API 통합**
- ✅ `CartContext` - 장바구니를 API와 동기화
- ✅ `LoginPage` - 로그인 API 연동
- ✅ `SignUpPage` - 회원가입 API 연동

✅ **하이브리드 방식**
- 로그인하지 않은 사용자: localStorage 사용
- 로그인한 사용자: API 서버와 동기화

---

## 설정 방법

### 1. .env 파일 생성

`KITAE-project-1 (1)` 폴더에 `.env` 파일 생성:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. 백엔드 서버 실행

KITAE 백엔드가 실행 중이어야 합니다:

```bash
cd KITAE-project-1-backend
npm run dev
```

### 3. 프론트엔드 실행

```bash
cd "KITAE-project-1 (1)"
npm run dev
```

---

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/kakao` - 카카오 로그인
- `POST /api/auth/logout` - 로그아웃

### 상품
- `GET /api/products` - 상품 목록
- `GET /api/products/:id` - 상품 상세
- `GET /api/products/featured` - 추천 상품

### 장바구니
- `GET /api/cart` - 장바구니 조회
- `POST /api/cart` - 장바구니 추가
- `PATCH /api/cart/:id` - 수량 변경
- `DELETE /api/cart/:id` - 삭제
- `DELETE /api/cart` - 전체 삭제

### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders/my` - 내 주문 목록
- `GET /api/orders/:id` - 주문 상세

### 좋아요
- `GET /api/favorites` - 좋아요 목록
- `POST /api/favorites` - 좋아요 추가
- `DELETE /api/favorites/:id` - 좋아요 삭제

---

## 작동 방식

### 1. 비로그인 상태
- 모든 데이터는 localStorage에 저장
- 로그인 없이도 장바구니 사용 가능

### 2. 로그인 상태
- localStorage + API 서버 동기화
- 장바구니, 주문, 좋아요가 서버에 저장

### 3. 에러 처리
- API 실패 시 localStorage 데이터 유지
- 사용자에게 에러 메시지 표시
- 콘솔에 상세 에러 로그

---

## 다음 단계

1. ✅ API 서비스 파일 생성
2. ✅ Context API 통합
3. ⏳ CheckoutPage 주문 API 연결
4. ⏳ MyPage 주문 조회 API 연결
5. ⏳ Favorite API Context 통합

---

**이제 프론트엔드를 실행하고 테스트하세요!** 🚀

