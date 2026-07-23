# LinkPay NICEPAY 연동 준비

작성일: 2026-07-23

## 결론

이 프로젝트는 NICEPAY의 **신형 JS SDK + Server 승인 모델 + Basic 인증**으로 연동한다.

- 브라우저는 NICEPAY 결제창에서 인증만 진행한다.
- 금액 확인과 최종 승인 API 호출은 `apps/user`의 서버 Route Handler가 담당한다.
- 현재 `payment_links`의 금액과 상태는 브라우저 입력값이 아니라 서버가 조회한 DB 값을 기준으로 처리한다.
- 구형 `MID`/`MerchantKey`, `pg-web.nicepay.co.kr/v3` 방식과 신형 `Client Key`/`Secret Key` 방식을 섞지 않는다.
- 1차 범위는 **카드 결제, 링크 1개당 결제 1건, 전액 결제**로 제한한다.

NICEPAY 공식 문서상 Server 승인 모델은 결제창 인증과 승인 API가 분리되어 있어, 승인 전에 주문번호·금액·서명을 서버에서 검증할 수 있다.

## 먼저 준비할 것

NICEPAY 가맹점 관리자에서 아래 항목이 필요하다.

- 샌드박스(TEST 상점)
- 샌드박스 `Client Key`
  - 발급 유형: **Server 승인**
  - JS SDK의 `clientId` 값으로 사용
- 샌드박스 `Secret Key`
  - 발급 유형: **Basic 인증**
  - 서버 전용
- 운영 상점 계약 및 카드 결제수단 활성화
- 운영 `Client Key`와 운영 `Secret Key`
  - 샌드박스 키와 운영 키는 서로 다름
- NICEPAY 관리자에 등록할 웹훅 URL
- 운영에 사용할 고정 HTTPS 사용자 도메인

Vercel URL도 샌드박스 테스트에 사용할 수 있다. 다만 Preview 배포 URL은 배포마다 달라질 수 있으므로 운영에는 커스텀 도메인 또는 고정된 Production 도메인을 사용한다.

## 환경변수

`apps/user/.env.local`과 Vercel의 Preview/Production 환경에 아래 값을 각각 설정한다.

```dotenv
# sandbox | production
NICEPAY_MODE=sandbox

# NICEPAY 관리자 > 개발정보 > KEY 정보
# 브라우저 결제창 호출에 쓰이는 공개 가능한 키
NEXT_PUBLIC_NICEPAY_CLIENT_KEY=

# 서버 전용. 브라우저 번들, 응답, 로그에 절대 포함하지 않는다.
NICEPAY_SECRET_KEY=

# returnUrl과 결과 페이지 절대 URL 생성용
NEXT_PUBLIC_SITE_URL=https://your-user-domain.example
```

코드에서 `NICEPAY_MODE`로 API 호스트를 고정 매핑한다.

| 모드         | 승인·조회·취소 API                  |
| ------------ | ----------------------------------- |
| `sandbox`    | `https://sandbox-api.nicepay.co.kr` |
| `production` | `https://api.nicepay.co.kr`         |

- 결제창 SDK는 현재 공식 샘플의 `https://pay.nicepay.co.kr/v1/js/`를 사용한다.
- 임의 URL을 환경변수로 받아 결제 API를 호출하지 않는다.
- `Authorization`은 서버에서만 `Basic Base64(client-key:secret-key)`로 생성한다.
- `MID`, `MerchantKey`, `NICEPAY_MERCHANT_KEY`는 이 연동 모델에 추가하지 않는다.

## 필요한 URL

사용자 앱에 아래 공개 HTTPS endpoint가 필요하다.

| URL                                | 역할                                    |
| ---------------------------------- | --------------------------------------- |
| `/linkpay/[publicToken]`           | 고객에게 전달할 결제 상품 페이지        |
| `/api/linkpay/[publicToken]/order` | DB 기준 주문 생성 또는 기존 주문 반환   |
| `/api/payments/nicepay/return`     | NICEPAY 인증 결과 POST 수신, 검증, 승인 |
| `/api/payments/nicepay/webhook`    | 결제/취소 상태 통보 수신 및 대사        |
| `/linkpay/[publicToken]/result`    | 결제 성공·실패 결과 표시                |

예시:

```text
Return URL: https://your-user-domain.example/api/payments/nicepay/return
Webhook URL: https://your-user-domain.example/api/payments/nicepay/webhook
```

웹훅 endpoint는 인증 쿠키나 관리자 로그인을 요구하면 안 된다. 대신 본문 서명·주문번호·금액을 검증하고, 성공 시 HTTP 200, `Content-Type: text/html`, 본문 `OK`를 반환한다.

## DB 추가안

기존 `payment_links`는 결제 요청서와 공개 URL을 유지하고, NICEPAY 거래 정보는 별도 `payment_orders` 테이블에 저장한다. 링크 1개당 주문 1개만 허용하면 동일 링크의 중복 결제를 방지하기 쉽고, 관리자 표시 데이터와 PG 거래 데이터를 분리할 수 있다.

최소 컬럼:

| 컬럼                                  | 용도                                                                  |
| ------------------------------------- | --------------------------------------------------------------------- |
| `id uuid primary key`                 | 내부 PK                                                               |
| `payment_link_id uuid unique`         | `payment_links.id` FK, 링크당 주문 1개                                |
| `order_id varchar(64) unique`         | 서버가 만든 NICEPAY 주문번호                                          |
| `amount bigint`                       | 결제 시작 시점 금액 스냅샷                                            |
| `nicepay_tid varchar(30) unique null` | NICEPAY 거래 키                                                       |
| `provider_status text`                | `ready`, `paid`, `failed`, `cancelled`, `partialCancelled`, `expired` |
| `result_code varchar(4) null`         | NICEPAY 결과 코드                                                     |
| `result_message text null`            | NICEPAY 결과 메시지                                                   |
| `pay_method varchar(20) null`         | 최초 범위는 `card`                                                    |
| `receipt_url text null`               | 매출전표 URL                                                          |
| `paid_at timestamptz null`            | 결제 완료 시각                                                        |
| `cancelled_at timestamptz null`       | 취소 시각                                                             |
| `created_at`, `updated_at`            | 생성·수정 시각                                                        |

추가 규칙:

- `payment_orders`는 `anon`/일반 사용자 RLS 정책을 만들지 않고 서버의 service role만 변경한다.
- 주문이 생성된 뒤에는 금액·결제명 등 결제 핵심 필드를 수정하지 않는다. 변경이 필요하면 새 링크를 발급한다.
- 승인 성공 시 `payment_orders` 갱신과 `payment_links.status = 'paid'` 변경을 하나의 DB transaction/RPC로 처리한다.
- 중복 callback·웹훅은 같은 결과로 끝나는 idempotent 처리로 만든다.
- Secret Key, `authToken`, 카드정보, 전체 원문 payload는 DB에 저장하지 않는다.

## 결제 처리 순서

1. 고객이 `/linkpay/[publicToken]`에 접속한다.
2. 서버가 service role로 링크를 조회하고, 없는 토큰은 404, 이미 결제된 링크는 완료 화면을 보여준다.
3. 결제 버튼 클릭 시 서버가 `order_id`를 생성하고 DB의 `amount`, `payment_name`으로 결제 파라미터를 반환한다.
4. 브라우저가 `AUTHNICE.requestPay()`를 호출한다.
5. NICEPAY가 인증 결과를 `returnUrl`에 `application/x-www-form-urlencoded` POST로 전달한다.
6. 서버는 승인 API 호출 전에 아래 값을 모두 확인한다.
   - `authResultCode === '0000'`
   - `clientId`가 현재 환경의 Client Key와 일치
   - `orderId`가 DB 주문번호와 일치
   - 응답 `amount`가 DB 금액 스냅샷과 일치
   - `signature === SHA256(authToken + clientId + amount + SecretKey)`
7. 검증이 끝난 뒤 서버가 `POST /v1/payments/{tid}`에 DB 금액으로 승인을 요청한다.
8. 승인 응답의 `resultCode`, `status`, `orderId`, `amount`, 응답 서명을 다시 검증한다.
   - 승인 응답/웹훅 서명: `SHA256(tid + amount + ediDate + SecretKey)`
9. 성공한 경우 주문과 링크를 원자적으로 `paid` 처리하고 결과 페이지로 303 redirect한다.
10. 웹훅도 같은 검증과 idempotent 갱신 로직을 사용해 누락된 callback을 보정한다.

## 반드시 넣을 예외 처리

- 브라우저가 보낸 금액·상품명·주문번호를 승인 기준으로 사용하지 않는다.
- 서명 비교는 timing-safe 비교를 사용한다.
- 승인 API timeout을 일반 실패로 단정하지 않는다.
- NICEPAY 권장 timeout은 connection 5초, read 30초다.
- 승인 결과가 불확실한 read timeout이면 거래 조회로 상태를 확인하고, 필요 시 1시간 안에 망취소 `POST /v1/payments/netcancel`을 수행한다.
- 이미 결제된 링크의 추가 승인 요청은 막는다.
- 동일 callback이나 웹훅이 여러 번 와도 중복 상태 변경이나 중복 후속 작업이 발생하지 않게 한다.
- 로그에는 `orderId`, `tid`, `resultCode` 정도만 남기고 Secret Key, Basic credential, `authToken`, 구매자 개인정보는 남기지 않는다.
- 상품명은 NICEPAY `goodsName` 제한(40)에 맞게 검증한다. 주문번호는 64자 이내의 영문/숫자 중심 고유값으로 생성한다.

## 1차 구현 기본값

별도 요구가 없으면 아래 기준으로 구현한다.

- 결제수단: 카드(`method: 'card'`)
- 통화: KRW
- 링크: 1회 결제 후 재사용 불가
- 과세: 전액 과세(`taxFreeAmt = 0`), 실제 세무 조건이 다르면 구현 전에 변경
- 에스크로: 사용 안 함
- 구매자 이름·전화번호·이메일: 수집 안 함
- 취소/부분취소 UI: 1차 범위에서 제외하되 거래 키와 매출전표 URL은 저장
- NICEPAY 관리자에서 취소된 경우 `payment_orders.provider_status`만 `cancelled`로 동기화하고 링크는 재사용하지 않는다. LinkPay 목록에도 환불 상태가 필요해지면 `payment_links` enum과 UI를 별도로 확장한다.
- 가상계좌: 1차 범위 제외. 추가할 경우 입금 시점이 다르므로 웹훅을 필수로 사용하고 상태 모델을 확장

## 구현 순서

- [ ] NICEPAY 샌드박스에서 Server 승인 Client Key와 Basic Secret Key 발급
- [ ] 사용자 앱 로컬/Vercel 환경변수 설정
- [ ] `payment_orders` migration, 타입, service-role data helper 추가
- [ ] 공개 LinkPay 페이지와 주문 생성 endpoint 구현
- [ ] NICEPAY SDK 결제창 연결
- [ ] return endpoint의 금액·주문·서명 검증 및 승인 API 구현
- [ ] 승인 성공 DB transaction/RPC 구현
- [ ] 웹훅 검증·idempotency·`OK` 응답 구현 및 NICEPAY 관리자 등록
- [ ] 거래 조회와 timeout/망취소 예외 처리 구현
- [ ] 샌드박스 E2E와 웹훅 TEST 호출 통과
- [ ] 운영 키/도메인으로 분리 배포
- [ ] 소액 실결제 1건 후 전액 취소까지 운영 점검

## 테스트 체크리스트

- 정상 카드 결제 후 링크와 주문이 모두 `paid`
- 잘못된/없는 공개 토큰은 404
- 이미 결제된 링크는 결제 버튼 비활성화
- 금액, 주문번호, Client Key, callback 서명 변조 시 승인 API 미호출
- 승인 응답 서명 또는 금액 불일치 시 `paid` 처리 금지
- callback 중복 호출과 웹훅 재전송 시 결과가 1회 처리와 동일
- 사용자가 결제창을 닫거나 인증에 실패하면 링크는 다시 결제 가능
- 웹훅 TEST 호출에 정확히 HTTP 200 + `OK` 응답
- timeout 시 거래 조회/망취소 분기 검증
- 익명 Supabase 요청으로 `payment_links`, `payment_orders` 직접 조회 불가
- 브라우저 번들 및 로그에 `NICEPAY_SECRET_KEY`가 포함되지 않음
- 샌드박스 키와 운영 키가 Vercel 환경별로 분리됨

## 공식 자료

- [NICEPAY 개발 Quick guide](https://start.nicepay.co.kr/manual/admin/developers/info.do)
- [Server 승인 결제창·승인 API 명세](https://github.com/nicepayments/nicepay-manual/blob/main/api/payment-window-server.md)
- [샌드박스 테스트 가이드](https://github.com/nicepayments/nicepay-manual/blob/main/common/test.md)
- [웹훅 명세](https://github.com/nicepayments/nicepay-manual/blob/main/api/hook.md)
- [거래 조회 명세](https://github.com/nicepayments/nicepay-manual/blob/main/api/status-transaction.md)
- [취소·환불·망취소 명세](https://github.com/nicepayments/nicepay-manual/blob/main/api/cancel.md)
- [TLS·방화벽·timeout 준비사항](https://github.com/nicepayments/nicepay-manual/blob/main/common/preparations.md)
