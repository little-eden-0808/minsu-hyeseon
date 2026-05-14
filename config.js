/**
 * Simple & Clean Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false, // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "두민수",
    father: "두갑진",
    mother: "강민숙",
    fatherDeceased: false,
    motherDeceased: false,
  },

  bride: {
    name: "이혜선",
    father: "이기선",
    mother: "김은례",
    fatherDeceased: false,
    motherDeceased: false,
  },

  wedding: {
    date: "2026-08-08",
    time: "17:50",
    venue: "여의도웨딩컨벤션",
    hall: "그랜드블룸홀 3층",
    address: "서울특별시 영등포구 여의대로 14 KT",
    tel: "02-761-3800",
    mapLinks: {
      kakao: "https://place.map.kakao.com/8011957",
      naver: "https://naver.me/FHlgBdXp",
    },
  },

  // ── 네이버 지도 (Web Dynamic Map) ──
  naverMap: {
    clientId: "9lb1de89ap",
    lat: 37.521688,
    lng: 126.916554,
    zoom: 17,
  },

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content:
      "함께 맞이하는 여섯번째 여름날, 결혼합니다.\n두 사람이 하나가 되어 하나님 안에서 가정을 이루어가려 합니다.\n부부로서 내딛는 이 소중한 시작에 함께해 주세요.",
  },

  // ── 우리의 이야기 ──
  story: {
    title: ".",
    content: ".",
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      {
        role: "신랑",
        name: "홍길동",
        bank: "국민은행",
        number: "000-000-000000",
      },
      {
        role: "아버지",
        name: "홍판서",
        bank: "신한은행",
        number: "000-000-000000",
      },
      {
        role: "어머니",
        name: "김부인",
        bank: "우리은행",
        number: "000-000-000000",
      },
    ],
    bride: [
      {
        role: "신부",
        name: "김영희",
        bank: "하나은행",
        number: "000-000-000000",
      },
      {
        role: "아버지",
        name: "김사장",
        bank: "기업은행",
        number: "000-000-000000",
      },
      {
        role: "어머니",
        name: "이부인",
        bank: "농협은행",
        number: "000-000-000000",
      },
    ],
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "두민수 ♥ 이혜선 결혼합니다",
    description: "2026년 8월 8.일, 소중한 분들을 초대합니다.",
  },
};
