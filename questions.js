// 문제 풀 (100문제) — 난이도별 5문제 × 5단계 = 25문제 선택
// type: 'multiple'(4지선다) | 'triple'(3지선다) | 'ox'(O/X)
// difficulty: 1(매우쉬움) ~ 5(매우어려움)

module.exports = [

  // ══════════════════════════════════════════════
  //  난이도 1: 매우 쉬움 (20문제)
  // ══════════════════════════════════════════════
  {
    id: 1, type: 'multiple', difficulty: 1,
    question: '대한민국의 수도는?',
    choices: ['부산', '서울', '인천', '대전'],
    answer: 1, timeLimit: 15,
    explanation: '서울은 1394년 조선 건국 이래 수도로, 현재 인구 약 950만 명의 대한민국 최대 도시입니다.'
  },
  {
    id: 2, type: 'multiple', difficulty: 1,
    question: '한국의 국화(나라꽃)는?',
    choices: ['장미', '벚꽃', '진달래', '무궁화'],
    answer: 3, timeLimit: 15,
    explanation: '무궁화는 "영원히 피고 또 피어서 지지 않는 꽃"이라는 뜻으로 애국가 가사에도 등장합니다.'
  },
  {
    id: 3, type: 'multiple', difficulty: 1,
    question: '남한에서 가장 높은 산은?',
    choices: ['지리산', '설악산', '한라산', '북한산'],
    answer: 2, timeLimit: 15,
    explanation: '한라산(1,947m)은 남한 최고봉입니다. 2위는 지리산(1,915m), 3위는 설악산 대청봉(1,708m)입니다.'
  },
  {
    id: 4, type: 'multiple', difficulty: 1,
    question: '훈민정음(한글)을 만든 왕은?',
    choices: ['태종', '세종대왕', '성종', '영조'],
    answer: 1, timeLimit: 15,
    explanation: '세종대왕이 1443년 훈민정음을 창제하고 1446년에 반포했습니다. 한글은 세계에서 만든 사람과 날짜가 알려진 유일한 문자입니다.'
  },
  {
    id: 5, type: 'multiple', difficulty: 1,
    question: '한국에서 가장 큰 섬은?',
    choices: ['울릉도', '거제도', '강화도', '제주도'],
    answer: 3, timeLimit: 15,
    explanation: '제주도(면적 1,849km²)는 한국 최대의 섬이자 특별자치도입니다. 세계자연유산·세계지질공원에도 등재되어 있습니다.'
  },
  {
    id: 6, type: 'multiple', difficulty: 1,
    question: '한국의 전통 명절 추석은 음력 몇 월 며칠인가?',
    choices: ['음력 1월 1일', '음력 5월 5일', '음력 7월 7일', '음력 8월 15일'],
    answer: 3, timeLimit: 15,
    explanation: '추석(한가위)은 음력 8월 15일로, 한 해의 추수에 감사하는 한국 최대 명절 중 하나입니다.'
  },
  {
    id: 7, type: 'multiple', difficulty: 1,
    question: '대한민국의 초대 대통령은?',
    choices: ['박정희', '김대중', '이승만', '윤보선'],
    answer: 2, timeLimit: 15,
    explanation: '이승만은 1948년 대한민국 정부 수립 후 초대 대통령이 되었습니다. 4·19 혁명으로 하야 후 하와이로 망명했습니다.'
  },
  {
    id: 8, type: 'multiple', difficulty: 1,
    question: '한국 전쟁이 발발한 해는?',
    choices: ['1945년', '1948년', '1950년', '1953년'],
    answer: 2, timeLimit: 15,
    explanation: '1950년 6월 25일 북한의 기습 남침으로 한국전쟁이 발발했습니다. 1953년 7월 27일 휴전협정이 체결되었으며, 공식적으로 아직 종전 선언은 없습니다.'
  },
  {
    id: 9, type: 'multiple', difficulty: 1,
    question: '한국에서 가장 긴 강은?',
    choices: ['한강', '금강', '영산강', '낙동강'],
    answer: 3, timeLimit: 15,
    explanation: '낙동강은 약 525km로 남한에서 가장 긴 강입니다. 2위는 한강(약 514km), 3위는 금강(약 401km)입니다.'
  },
  {
    id: 10, type: 'ox', difficulty: 1,
    question: '태극기의 4괘 중 "건(乾)"은 하늘을 상징한다.',
    choices: ['O', 'X'],
    answer: 0, timeLimit: 15,
    explanation: '태극기 네 모서리의 4괘는 건(乾·하늘), 곤(坤·땅), 감(坎·물), 리(離·불)를 상징합니다.'
  },
  {
    id: 11, type: 'multiple', difficulty: 1,
    question: '삼일절은 몇 월 며칠인가?',
    choices: ['1월 1일', '3월 1일', '8월 15일', '10월 3일'],
    answer: 1, timeLimit: 15,
    explanation: '1919년 3월 1일 일제에 맞서 독립만세운동이 일어났습니다. 전국 약 200만 명이 참여한 역사적 사건으로, 현재 공휴일로 기념합니다.'
  },
  {
    id: 12, type: 'ox', difficulty: 1,
    question: '한국은 세계 최초로 5G 이동통신 상용화에 성공한 나라다.',
    choices: ['O', 'X'],
    answer: 0, timeLimit: 15,
    explanation: '2019년 4월 3일 한국이 세계 최초로 5G 서비스를 상용화했습니다. 미국이 불과 몇 시간 차이로 뒤를 이었습니다.'
  },
  {
    id: 13, type: 'multiple', difficulty: 1,
    question: '다음 중 한국의 전통 발효식품이 아닌 것은?',
    choices: ['된장', '간장', '두부', '고추장'],
    answer: 2, timeLimit: 15,
    explanation: '두부는 발효식품이 아니라 콩을 갈아 응고시켜 만든 식품입니다. 된장·간장·고추장은 모두 발효를 통해 만들어집니다.'
  },
  {
    id: 14, type: 'triple', difficulty: 1,
    question: '한국프로야구(KBO) 구단 수는?',
    choices: ['8개', '10개', '12개'],
    answer: 1, timeLimit: 15,
    explanation: '2015년 kt wiz 창단으로 10구단 체제가 완성되었습니다. (두산·LG·삼성·KIA·롯데·SSG·키움·한화·NC·kt)'
  },
  {
    id: 15, type: 'multiple', difficulty: 1,
    question: '한국의 전통 악기 가야금은 어떤 종류의 악기인가?',
    choices: ['관악기', '타악기', '현악기', '성악기'],
    answer: 2, timeLimit: 15,
    explanation: '가야금은 가야국 가실왕이 만들었다고 전해지는 현악기로, 12줄(정악 가야금) 또는 25줄(산조 가야금)이 있습니다.'
  },
  {
    id: 16, type: 'multiple', difficulty: 1,
    question: '대한민국 헌법에서 정한 대통령 임기는?',
    choices: ['4년', '5년', '6년', '7년'],
    answer: 1, timeLimit: 15,
    explanation: '대한민국 대통령 임기는 5년 단임제입니다. 장기 독재를 방지하기 위해 1987년 헌법 개정 시 도입되었습니다.'
  },
  {
    id: 17, type: 'multiple', difficulty: 1,
    question: '한국 최초의 노벨상 수상자는?',
    choices: ['이희호', '김대중', '박정희', '김영삼'],
    answer: 1, timeLimit: 15,
    explanation: '김대중 전 대통령이 2000년 노벨평화상을 수상했습니다. 민주주의 발전과 남북화해 기여로 수상했으며, 현재까지 한국 유일의 노벨상 수상자입니다.'
  },
  {
    id: 18, type: 'multiple', difficulty: 1,
    question: '태권도가 올림픽 정식 종목이 된 해는?',
    choices: ['1988년', '1992년', '1996년', '2000년'],
    answer: 3, timeLimit: 15,
    explanation: '태권도는 2000년 시드니 올림픽에서 처음으로 정식 종목이 되었습니다. 1988년 서울·1992년 바르셀로나 올림픽에서는 시범 종목이었습니다.'
  },
  {
    id: 19, type: 'multiple', difficulty: 1,
    question: '한국의 국보 1호는?',
    choices: ['석굴암', '경복궁 근정전', '숭례문(남대문)', '첨성대'],
    answer: 2, timeLimit: 15,
    explanation: '숭례문(남대문)이 국보 1호입니다. 2008년 화재로 소실되었다가 2013년 복원되었습니다. 참고로 2021년 "국보 1호" 호칭 제도 자체가 폐지되었습니다.'
  },
  {
    id: 20, type: 'ox', difficulty: 1,
    question: '세종대왕의 얼굴이 그려진 지폐는 1만 원권이다.',
    choices: ['O', 'X'],
    answer: 0, timeLimit: 15,
    explanation: '세종대왕은 1만 원권 지폐의 인물입니다. 5천 원권은 율곡 이이, 1천 원권은 퇴계 이황, 5만 원권은 신사임당입니다.'
  },

  // ══════════════════════════════════════════════
  //  난이도 2: 쉬움 (20문제)
  // ══════════════════════════════════════════════
  {
    id: 21, type: 'multiple', difficulty: 2,
    question: "'짜장면'과 '자장면' 중 2011년 이전까지 표준어로 인정받은 표기는?",
    choices: ['짜장면', '자장면', '둘 다 표준어였다', '둘 다 비표준어였다'],
    answer: 1, timeLimit: 15,
    explanation: "2011년 이전까지는 '자장면'만 표준어였습니다. 국립국어원이 2011년 표준어 규정을 개정하면서 '짜장면'도 함께 표준어로 인정했습니다."
  },
  {
    id: 22, type: 'multiple', difficulty: 2,
    question: 'BTS가 빌보드 HOT 100에서 처음으로 1위를 차지한 곡은?',
    choices: ['DNA', 'Boy With Luv', 'Dynamite', 'Butter'],
    answer: 2, timeLimit: 15,
    explanation: 'Dynamite(2020년 8월)는 BTS 최초의 전곡 영어 싱글로, 빌보드 HOT 100 1위를 기록한 한국 가수 최초의 곡입니다.'
  },
  {
    id: 23, type: 'multiple', difficulty: 2,
    question: '한국 월드컵 역사 최고 성적은?',
    choices: ['16강', '8강', '4강', '준우승'],
    answer: 2, timeLimit: 15,
    explanation: '2002년 한일 월드컵에서 히딩크 감독 지휘 하에 폴란드·미국·포르투갈·스페인·독일을 차례로 꺾고 사상 첫 4강에 진출했습니다.'
  },
  {
    id: 24, type: 'multiple', difficulty: 2,
    question: '영화 "기생충"으로 아카데미 감독상을 받은 사람은?',
    choices: ['이창동', '박찬욱', '봉준호', '홍상수'],
    answer: 2, timeLimit: 15,
    explanation: '봉준호 감독의 기생충(2019)은 칸 황금종려상에 이어 아카데미 작품상·감독상·각본상·국제영화상 4관왕 달성, 비영어권 최초 아카데미 작품상 수상작이 되었습니다.'
  },
  {
    id: 25, type: 'multiple', difficulty: 2,
    question: '싸이의 강남스타일이 유튜브 최초로 10억 뷰를 돌파한 해는?',
    choices: ['2011년', '2012년', '2013년', '2014년'],
    answer: 1, timeLimit: 15,
    explanation: '강남스타일은 2012년 유튜브 최초로 10억 뷰를 돌파했습니다. 한때 유튜브 역대 최다 조회수를 기록했으며 현재 약 51억 뷰를 보유 중입니다.'
  },
  {
    id: 26, type: 'multiple', difficulty: 2,
    question: '손흥민이 EPL 아시아 선수 최초로 득점왕을 차지한 시즌은?',
    choices: ['2019-20', '2020-21', '2021-22', '2022-23'],
    answer: 2, timeLimit: 15,
    explanation: '손흥민은 2021-22 시즌 살라와 공동 23골로 EPL 득점왕(골든부트)을 차지했습니다. 아시아 선수 최초의 기록입니다.'
  },
  {
    id: 27, type: 'multiple', difficulty: 2,
    question: '한국 최초의 우주인은?',
    choices: ['박정훈', '이소연', '고산', '조광래'],
    answer: 1, timeLimit: 15,
    explanation: '이소연은 2008년 4월 소유즈 우주선을 타고 국제우주정거장(ISS)에 10박 11일 체류한 한국 최초이자 유일한 우주인입니다.'
  },
  {
    id: 28, type: 'multiple', difficulty: 2,
    question: '조선시대 왕의 총 수는?',
    choices: ['23명', '25명', '27명', '29명'],
    answer: 2, timeLimit: 15,
    explanation: '태조(1대)부터 순종(27대)까지 총 27명의 왕이 조선(1392-1910)을 통치했습니다.'
  },
  {
    id: 29, type: 'multiple', difficulty: 2,
    question: '임진왜란이 발발한 해는?',
    choices: ['1492년', '1592년', '1650년', '1712년'],
    answer: 1, timeLimit: 15,
    explanation: '1592년(선조 25년) 도요토미 히데요시가 조선을 침략해 임진왜란이 발발했습니다. 이순신 장군의 활약으로 1598년 종결되었습니다.'
  },
  {
    id: 30, type: 'multiple', difficulty: 2,
    question: '박지성이 소속되었던 EPL 클럽은?',
    choices: ['아스날', '첼시', '맨체스터 유나이티드', '리버풀'],
    answer: 2, timeLimit: 15,
    explanation: '박지성은 2005-2012년 맨체스터 유나이티드에서 활약했습니다. 아시아 선수 최초로 UEFA 챔피언스리그 우승(2008)을 경험했습니다.'
  },
  {
    id: 31, type: 'multiple', difficulty: 2,
    question: '한국이 FIFA 월드컵에 처음 출전한 해는?',
    choices: ['1954년', '1966년', '1974년', '1982년'],
    answer: 0, timeLimit: 15,
    explanation: '한국은 1954년 스위스 월드컵에서 처음 본선에 출전했습니다. 헝가리에 0-9, 터키에 0-7로 대패했지만 아시아 최초의 월드컵 본선 진출이었습니다.'
  },
  {
    id: 32, type: 'multiple', difficulty: 2,
    question: '삼성전자를 창업한 사람은?',
    choices: ['이건희', '이재용', '이병철', '정주영'],
    answer: 2, timeLimit: 15,
    explanation: '이병철(1910-1987)이 1938년 삼성상회를 창업했습니다. 삼성전자는 1969년 설립되었으며 이건희(2대)·이재용(현 회장)으로 이어졌습니다.'
  },
  {
    id: 33, type: 'ox', difficulty: 2,
    question: '독도는 행정구역상 경상북도 울릉군에 속한다.',
    choices: ['O', 'X'],
    answer: 0, timeLimit: 15,
    explanation: '독도는 경상북도 울릉군 울릉읍 독도리에 속합니다. 동도·서도 및 89개 부속 도서로 이루어진 한국 영토의 동쪽 끝입니다.'
  },
  {
    id: 34, type: 'triple', difficulty: 2,
    question: '"어떡해"와 "어떻해" 중 올바른 표기는?',
    choices: ['어떡해', '어떻해', '둘 다 맞다'],
    answer: 0, timeLimit: 15,
    explanation: '"어떡해"가 맞습니다. "어떻게 하다"의 준말인 "어떡하다"의 활용형으로, "어떻해"는 존재하지 않는 표기입니다.'
  },
  {
    id: 35, type: 'multiple', difficulty: 2,
    question: '다음 중 유네스코 세계문화유산에 등재되지 않은 것은?',
    choices: ['석굴암·불국사', '창덕궁', '경복궁', '종묘'],
    answer: 2, timeLimit: 15,
    explanation: '경복궁은 사적으로 지정되어 있지만 유네스코 세계문화유산에는 등재되지 않았습니다. 석굴암·불국사(1995)·창덕궁(1997)·종묘(1995) 등 16건이 등재되어 있습니다.'
  },
  {
    id: 36, type: 'multiple', difficulty: 2,
    question: '"아리랑"이 유네스코 인류무형문화유산에 등재된 해는?',
    choices: ['2003년', '2008년', '2012년', '2016년'],
    answer: 2, timeLimit: 15,
    explanation: '아리랑은 2012년 유네스코 인류무형문화유산에 등재되었습니다. 전국에 60여 종의 아리랑이 전해지고 있습니다.'
  },
  {
    id: 37, type: 'multiple', difficulty: 2,
    question: '대한민국 올림픽 최초 금메달이 나온 대회는?',
    choices: ['1948 런던', '1964 도쿄', '1976 몬트리올', '1984 LA'],
    answer: 2, timeLimit: 15,
    explanation: '1976년 몬트리올 올림픽 레슬링 자유형 62kg급에서 양정모 선수가 한국 최초의 올림픽 금메달을 획득했습니다.'
  },
  {
    id: 38, type: 'triple', difficulty: 2,
    question: '다음 중 이순신 장군의 대첩이 아닌 것은?',
    choices: ['한산도 대첩', '명량 대첩', '행주 대첩'],
    answer: 2, timeLimit: 15,
    explanation: '행주 대첩은 권율 장군의 육상 전투입니다. 이순신 장군의 3대 해전은 한산도(1592)·명량(1597)·노량(1598)이며, 노량에서 전사했습니다.'
  },
  {
    id: 39, type: 'ox', difficulty: 2,
    question: '세종대왕의 훈민정음 창제 연도와 반포 연도는 같다.',
    choices: ['O', 'X'],
    answer: 1, timeLimit: 15,
    explanation: '세종대왕은 1443년(세종 25년)에 훈민정음을 창제하고, 1446년(세종 28년)에 반포했습니다. 한글날(10월 9일)은 반포일을 기념합니다.'
  },
  {
    id: 40, type: 'multiple', difficulty: 2,
    question: '한국의 "포항"에 있는 세계 최대 규모(단일 사업장)의 시설은?',
    choices: ['조선소', '반도체 공장', '제철소', '석유화학 단지'],
    answer: 2, timeLimit: 15,
    explanation: '포스코(POSCO) 포항 제철소는 단일 사업장 기준 세계 최대 규모의 제철소입니다. 1973년 첫 쇳물 생산 이래 한국 중공업 발전의 핵심 역할을 해왔습니다.'
  },

  // ══════════════════════════════════════════════
  //  난이도 3: 보통 (20문제)
  // ══════════════════════════════════════════════
  {
    id: 41, type: 'multiple', difficulty: 3,
    question: '한국 역대 음반 판매량 1위 앨범의 아티스트는?',
    choices: ['블랙핑크', '엑소', 'BTS', 'NCT'],
    answer: 2, timeLimit: 15,
    explanation: 'BTS는 Map of the Soul: 7(2020)로 약 440만 장 판매, 여러 앨범이 역대 판매 상위권을 차지합니다. 한국 가수 최초로 연속 밀리언셀러를 기록했습니다.'
  },
  {
    id: 42, type: 'multiple', difficulty: 3,
    question: '한국이 FIFA 월드컵에 총 몇 번 출전했나? (2022 카타르 기준)',
    choices: ['8회', '9회', '10회', '11회'],
    answer: 3, timeLimit: 15,
    explanation: '1954년부터 2022년까지 한국은 총 11회 월드컵 본선에 출전했습니다. 아시아에서 가장 많이 본선에 출전한 나라 중 하나입니다.'
  },
  {
    id: 43, type: 'multiple', difficulty: 3,
    question: '남한에서 3번째로 높은 산은?',
    choices: ['덕유산', '지리산', '설악산', '가야산'],
    answer: 2, timeLimit: 15,
    explanation: '설악산 대청봉(1,708m)이 남한 3위입니다. 1위 한라산(1,947m) → 2위 지리산(1,915m) → 3위 설악산(1,708m) → 4위 덕유산(1,614m) 순입니다.'
  },
  {
    id: 44, type: 'multiple', difficulty: 3,
    question: '오징어 게임이 넷플릭스 역대 시청 기록을 경신한 해는?',
    choices: ['2020년', '2021년', '2022년', '2023년'],
    answer: 1, timeLimit: 15,
    explanation: '오징어 게임(황동혁 감독, 이정재 주연)은 2021년 9월 공개 후 28일 만에 1억 1,100만 가구가 시청하며 넷플릭스 역대 최다 시청 기록을 세웠습니다.'
  },
  {
    id: 45, type: 'multiple', difficulty: 3,
    question: '한국 최초로 아카데미 연기상을 수상한 배우는?',
    choices: ['전도연', '윤여정', '김민희', '배두나'],
    answer: 1, timeLimit: 15,
    explanation: '윤여정은 영화 "미나리"(2020)로 아카데미 여우조연상을 수상했습니다. 한국 배우 최초의 아카데미 연기상 수상입니다.'
  },
  {
    id: 46, type: 'multiple', difficulty: 3,
    question: '블랙핑크(BLACKPINK)의 데뷔 연도는?',
    choices: ['2014년', '2015년', '2016년', '2017년'],
    answer: 2, timeLimit: 15,
    explanation: '블랙핑크는 2016년 8월 YG엔터테인먼트에서 데뷔했습니다. 지수·제니·로제·리사 4명으로 구성됩니다.'
  },
  {
    id: 47, type: 'multiple', difficulty: 3,
    question: '세계에서 가장 오래된 생수 브랜드는?',
    choices: ['산펠레그리노', '볼빅', '페리에', '에비앙'],
    answer: 3, timeLimit: 15,
    explanation: '에비앙(Evian)은 1826년 프랑스 알프스 에비앙레벵에서 처음 판매를 시작해 세계에서 가장 오래된 생수 브랜드입니다. 페리에 1863년, 산펠레그리노 1899년 순입니다.'
  },
  {
    id: 48, type: 'multiple', difficulty: 3,
    question: '박세리가 한국 여성 최초로 LPGA 메이저 우승을 차지한 해는?',
    choices: ['1996년', '1997년', '1998년', '1999년'],
    answer: 2, timeLimit: 15,
    explanation: '박세리는 1998년 US 여자오픈에서 맨발의 투혼을 보이며 우승, 외환위기로 침체된 한국에 큰 감동을 주었습니다. 한국 여자골프 붐의 시초가 되었습니다.'
  },
  {
    id: 49, type: 'ox', difficulty: 3,
    question: '"바나나는 나무에서 자란다" — 이 말은 맞는가?',
    choices: ['O', 'X'],
    answer: 1, timeLimit: 15,
    explanation: '바나나는 나무가 아닌 풀(초본식물)에서 자랍니다. 줄기처럼 보이는 부분은 잎자루가 겹쳐진 "가짜 줄기"로, 바나나는 세계에서 가장 큰 풀 중 하나입니다.'
  },
  {
    id: 50, type: 'multiple', difficulty: 3,
    question: '한국 최초의 순수 국내 기술 우주발사체는?',
    choices: ['나로호', '누리호', '한빛', '천리안'],
    answer: 1, timeLimit: 15,
    explanation: '누리호(KSLV-2)는 순수 국내 기술로 개발한 첫 발사체로, 2022년 6월 2차 발사에서 성공했습니다. 나로호는 러시아와 공동 개발했습니다.'
  },
  {
    id: 51, type: 'multiple', difficulty: 3,
    question: '한강 작가가 노벨 문학상을 수상한 해는?',
    choices: ['2022년', '2023년', '2024년', '2025년'],
    answer: 2, timeLimit: 15,
    explanation: '한강은 2024년 노벨 문학상을 수상했습니다. 한국인 최초이자 아시아 여성 최초의 노벨 문학상 수상입니다. 대표작으로 "채식주의자", "소년이 온다" 등이 있습니다.'
  },
  {
    id: 52, type: 'multiple', difficulty: 3,
    question: '다음 중 올바른 맞춤법은?',
    choices: ['설레임', '설렘', '설래임', '설래'],
    answer: 1, timeLimit: 15,
    explanation: '"설렘"이 표준어입니다. 롯데 아이스크림 "설레임"은 상품명이라 예외이지만, 일상에서는 "설레다"의 명사형인 "설렘"이 맞습니다.'
  },
  {
    id: 53, type: 'multiple', difficulty: 3,
    question: '"대동여지도"를 제작한 조선의 지리학자는?',
    choices: ['정약용', '안정복', '김정호', '이익'],
    answer: 2, timeLimit: 15,
    explanation: '김정호가 1861년 제작한 대동여지도는 분첩식 목판 지도로, 당시 세계 수준의 정밀도를 자랑합니다. 22첩으로 나뉘어 실용적으로 사용할 수 있습니다.'
  },
  {
    id: 54, type: 'multiple', difficulty: 3,
    question: '세계 최초로 상업용 MP3 플레이어를 출시한 나라는?',
    choices: ['미국', '일본', '한국', '독일'],
    answer: 2, timeLimit: 15,
    explanation: '세계 최초의 상업용 MP3 플레이어 "MPMan"은 1998년 한국 기업 새한정보시스템이 개발·출시했습니다. 애플 아이팟보다 3년 앞선 제품입니다.'
  },
  {
    id: 55, type: 'ox', difficulty: 3,
    question: '한국의 치킨 프랜차이즈 매장 수는 맥도날드 전 세계 매장 수보다 많다.',
    choices: ['O', 'X'],
    answer: 0, timeLimit: 15,
    explanation: '한국 전체 치킨 프랜차이즈 매장 수는 약 9만 개 이상으로 맥도날드 전 세계 매장 수(약 4만 개)보다 많습니다. 한국의 인구 대비 치킨집 밀도는 세계 최고 수준입니다.'
  },
  {
    id: 56, type: 'multiple', difficulty: 3,
    question: '안중근 의사가 이토 히로부미를 저격한 장소는?',
    choices: ['베이징', '상하이', '하얼빈', '뤼순'],
    answer: 2, timeLimit: 15,
    explanation: '안중근(1879-1910) 의사는 1909년 10월 26일 중국 하얼빈 역에서 초대 한국 통감 이토 히로부미를 사살했습니다.'
  },
  {
    id: 57, type: 'multiple', difficulty: 3,
    question: '"청산리 대첩"에서 독립군을 이끈 장군은?',
    choices: ['안중근', '홍범도', '김좌진', '이범윤'],
    answer: 2, timeLimit: 15,
    explanation: '김좌진(1889-1930) 장군이 이끄는 북로군정서군이 1920년 10월 청산리에서 일본군을 대파했습니다. 10여 차례 전투에서 일본군 1,200여 명을 사살한 대첩입니다.'
  },
  {
    id: 58, type: 'multiple', difficulty: 3,
    question: '유관순 열사가 순국한 나이는?',
    choices: ['17세', '19세', '21세', '23세'],
    answer: 1, timeLimit: 15,
    explanation: '유관순(1902-1920) 열사는 아우내 장터 만세운동을 주도하다 투옥되어 서대문형무소에서 고문으로 19세의 나이에 순국했습니다.'
  },
  {
    id: 59, type: 'multiple', difficulty: 3,
    question: '"난중일기"가 유네스코 세계기록유산에 등재된 해는?',
    choices: ['2001년', '2005년', '2013년', '2017년'],
    answer: 2, timeLimit: 15,
    explanation: '이순신 장군이 임진왜란 중 쓴 "난중일기"는 2013년 유네스코 세계기록유산에 등재되었습니다. 7년간 전장의 현실과 전략을 생생하게 기록한 역사적 사료입니다.'
  },
  {
    id: 60, type: 'multiple', difficulty: 3,
    question: '"한강의 기적"이라는 표현은 어느 나라의 사례에서 유래했나?',
    choices: ['미국 "미시시피의 기적"', '독일 "라인강의 기적"', '일본 "욱일승천"', '프랑스 "마른강의 기적"'],
    answer: 1, timeLimit: 15,
    explanation: '"한강의 기적"은 2차 세계대전 후 서독의 급속한 경제 재건을 가리키는 "라인강의 기적(Wirtschaftswunder)"을 본 따 만들어진 표현입니다.'
  },

  // ══════════════════════════════════════════════
  //  난이도 4: 어려움 (20문제)
  // ══════════════════════════════════════════════
  {
    id: 61, type: 'multiple', difficulty: 4,
    question: '나폴레옹의 실제 키는?',
    choices: ['약 140cm', '약 152cm', '약 168cm', '약 180cm'],
    answer: 2, timeLimit: 15,
    explanation: '나폴레옹의 실제 키는 약 168~169cm로 당시 프랑스 남성 평균(164cm)보다 오히려 컸습니다. "작은 나폴레옹" 이미지는 영국의 선전과 프랑스·영국 단위 오역에서 비롯된 오해입니다.'
  },
  {
    id: 62, type: 'multiple', difficulty: 4,
    question: '조선 최초의 한글 소설은?',
    choices: ['홍길동전', '춘향전', '심청전', '구운몽'],
    answer: 0, timeLimit: 15,
    explanation: '홍길동전은 허균이 17세기 초 쓴 최초의 한글 소설로 알려져 있습니다. 서자 차별과 탐관오리를 풍자한 한국 최초의 사회 비판 소설이기도 합니다.'
  },
  {
    id: 63, type: 'multiple', difficulty: 4,
    question: '"신사임당"이 율곡 이이의 어머니라는 것 외에, 그녀가 뛰어났던 분야는?',
    choices: ['천문학과 수학', '시·서·화(詩書畵)', '의학과 약학', '음악과 무용'],
    answer: 1, timeLimit: 15,
    explanation: '신사임당(1504-1551)은 시·서·화 모두에 뛰어난 예술가였습니다. 특히 포도·풀벌레·산수를 그린 그림으로 유명하며, "초충도"가 대표작입니다.'
  },
  {
    id: 64, type: 'multiple', difficulty: 4,
    question: '세종대왕이 만든 강수량 측정 기구 "측우기"는 유럽 발명보다 약 몇 년 앞섰나?',
    choices: ['약 50년', '약 100년', '약 200년', '약 300년'],
    answer: 2, timeLimit: 15,
    explanation: '측우기는 1441년 발명되었고, 유럽의 우량계는 17세기 중반에 등장합니다. 약 200년 앞선 발명으로 당시 세계 최고 수준의 과학 기술이었습니다.'
  },
  {
    id: 65, type: 'multiple', difficulty: 4,
    question: '한국에서 역대 가장 많이 팔린 라면은?',
    choices: ['불닭볶음면', '신라면', '진라면', '안성탕면'],
    answer: 1, timeLimit: 15,
    explanation: '농심 신라면은 1986년 출시 이후 수십 년간 한국 라면 시장 1위를 지키고 있습니다. 현재 100여 개국에 수출되고 있습니다.'
  },
  {
    id: 66, type: 'multiple', difficulty: 4,
    question: '한국의 "고인돌"이 세계문화유산으로 등재된 해는?',
    choices: ['1997년', '2000년', '2005년', '2010년'],
    answer: 1, timeLimit: 15,
    explanation: '전북 고창·전남 화순·인천 강화의 고인돌 유적이 2000년 유네스코 세계문화유산으로 등재되었습니다. 한반도에는 전 세계 고인돌의 약 40%가 있습니다.'
  },
  {
    id: 67, type: 'multiple', difficulty: 4,
    question: '조선왕조실록은 약 몇 권으로 구성되어 있나?',
    choices: ['888권', '1,893권', '2,077권', '3,045권'],
    answer: 2, timeLimit: 15,
    explanation: '조선왕조실록은 태조부터 철종까지 25대 왕, 472년의 역사를 기록한 약 2,077권의 방대한 사료로, 1997년 유네스코 세계기록유산에 등재되었습니다.'
  },
  {
    id: 68, type: 'multiple', difficulty: 4,
    question: '임진왜란 당시 이순신 장군이 한산도 대첩에서 사용한 전술 진형은?',
    choices: ['어린진', '학익진', '방진', '원진'],
    answer: 1, timeLimit: 15,
    explanation: '이순신 장군은 1592년 한산도 대첩에서 학이 날개를 펼친 모양의 "학익진"으로 일본 함대를 포위·격멸했습니다. 세계 해전사에 기록된 명전략입니다.'
  },
  {
    id: 69, type: 'multiple', difficulty: 4,
    question: '훈민정음 해례본의 현재 소장처는?',
    choices: ['국립중앙박물관', '국립한글박물관', '간송미술관', '국립고궁박물관'],
    answer: 2, timeLimit: 15,
    explanation: '훈민정음 해례본(국보 70호)은 간송 전형필이 1940년에 매입하여 간송미술관이 소장하고 있습니다. 1997년 유네스코 세계기록유산으로 등재되었습니다.'
  },
  {
    id: 70, type: 'multiple', difficulty: 4,
    question: '한국 최초의 인공위성 이름은?',
    choices: ['무궁화 1호', '아리랑 1호', '우리별 1호', '천리안 1호'],
    answer: 2, timeLimit: 15,
    explanation: '"우리별 1호"는 1992년 발사된 한국 최초의 인공위성입니다. 영국 서리대학교와 공동 개발했으며, 아리랑 1호(1999)는 독자 개발 첫 실용 위성입니다.'
  },
  {
    id: 71, type: 'multiple', difficulty: 4,
    question: '조선 최고 행정 기관(삼정승이 이끈 곳)은?',
    choices: ['사헌부', '홍문관', '의정부', '승정원'],
    answer: 2, timeLimit: 15,
    explanation: '의정부는 조선의 최고 국정 심의 기관으로, 영의정·좌의정·우의정의 삼정승이 국정을 논의했습니다.'
  },
  {
    id: 72, type: 'multiple', difficulty: 4,
    question: '한국 가요 역사상 멜론 누적 스트리밍 최초 10억 회 돌파 곡은?',
    choices: ['롤린(브레이브걸스)', '좋아(박재범)', '눈의꽃(박효신)', '사랑을 했다(아이콘)'],
    answer: 0, timeLimit: 15,
    explanation: '"롤린"(브레이브걸스, 2017)은 발매 4년 만인 2021년 역주행 열풍으로 멜론 역대 최초 10억 스트리밍 곡이 되었습니다.'
  },
  {
    id: 73, type: 'multiple', difficulty: 4,
    question: '봉오동 전투(1920)의 독립군 지휘관은?',
    choices: ['김좌진', '홍범도', '안중근', '이범윤'],
    answer: 1, timeLimit: 15,
    explanation: '홍범도 장군이 이끄는 독립군 부대가 1920년 6월 중국 봉오동에서 일본군을 대파했습니다. 청산리 대첩(1920년 10월)과 함께 독립군의 대표적 승전입니다.'
  },
  {
    id: 74, type: 'multiple', difficulty: 4,
    question: '한국 최초의 근대 소설로 불리는 이광수의 작품은?',
    choices: ['상록수', '무정', '흙', '사랑'],
    answer: 1, timeLimit: 15,
    explanation: '"무정"(1917)은 이광수가 발표한 한국 최초의 근대 소설로, 매일신보에 연재되었습니다. 개인의 자유·연애·근대 문명을 주제로 한국 근대 문학의 출발점으로 평가받습니다.'
  },
  {
    id: 75, type: 'multiple', difficulty: 4,
    question: '고려청자가 절정기를 맞이한 시기는?',
    choices: ['9-10세기', '11-12세기', '13-14세기', '15-16세기'],
    answer: 1, timeLimit: 15,
    explanation: '고려청자는 11~12세기에 상감청자 기법이 발달하며 최고의 전성기를 맞았습니다. 비취색 청자는 중국 송나라에서도 "고려비색"이라 칭송했습니다.'
  },
  {
    id: 76, type: 'multiple', difficulty: 4,
    question: '임진왜란 때 유일하게 소실되지 않고 보존된 조선왕조실록 사고(史庫)는?',
    choices: ['서울 춘추관', '충주사고', '성주사고', '전주사고'],
    answer: 3, timeLimit: 15,
    explanation: '임진왜란 때 서울·충주·성주 사고의 실록은 소실되었으나, 전주사고의 실록은 선비들이 목숨을 걸고 내장산으로 옮겨 보존했습니다.'
  },
  {
    id: 77, type: 'multiple', difficulty: 4,
    question: '발해의 최전성기 수도는?',
    choices: ['평양', '개경', '상경용천부', '동경용원부'],
    answer: 2, timeLimit: 15,
    explanation: '발해(698-926)의 최전성기 수도는 상경용천부(현재 중국 흑룡강성 닝안시)입니다. 고구려 유민 대조영이 건국한 발해는 "해동성국"이라 불렸습니다.'
  },
  {
    id: 78, type: 'multiple', difficulty: 4,
    question: '"조선 성리학"을 집대성하여 동방의 주자라 불린 인물은?',
    choices: ['정약용', '이황', '이이', '김정희'],
    answer: 1, timeLimit: 15,
    explanation: '이황(1501-1570, 호 퇴계)은 조선 성리학을 집대성하여 "동방의 주자"로 불립니다. 1,000원권 지폐의 인물이며, 도산서원에서 후학을 양성했습니다.'
  },
  {
    id: 79, type: 'multiple', difficulty: 4,
    question: '정간보(井間譜)를 창안한 세종대왕이 이룬 음악사적 업적은?',
    choices: ['세계 최초 악보', '세계 최초 리듬 표시 악보', '세계 최초 화음 표시', '세계 최초 5선 악보'],
    answer: 1, timeLimit: 15,
    explanation: '정간보는 음의 길이(리듬)를 정확히 표시할 수 있는 세계 최초의 기보법입니다. 서양 계량악보보다 앞선 발명으로 현재도 국악에서 사용됩니다.'
  },
  {
    id: 80, type: 'multiple', difficulty: 4,
    question: '"온돌" 문화가 유네스코 인류무형문화유산에 등재된 해는?',
    choices: ['2015년', '2018년', '2022년', '아직 미등재'],
    answer: 2, timeLimit: 15,
    explanation: '한국의 온돌 문화(전통 바닥 난방 시스템)는 2022년 유네스코 인류무형문화유산에 등재되었습니다. 연기와 열기를 이용한 과학적 난방 방식으로 세계적으로 인정받았습니다.'
  },

  // ══════════════════════════════════════════════
  //  난이도 5: 매우 어려움 (20문제)
  // ══════════════════════════════════════════════
  {
    id: 81, type: 'multiple', difficulty: 5,
    question: '"금세"와 "금새" 중 "곧, 바로"의 뜻으로 올바른 표기는?',
    choices: ['금새 돌아올게', '금세 돌아올게', '둘 다 맞다', '둘 다 틀리다'],
    answer: 1, timeLimit: 12,
    explanation: '"금세"가 맞습니다. "금시에(今時에)"의 준말로 "곧, 바로"를 뜻합니다. "금새"는 "물건의 값"을 뜻하는 전혀 다른 단어로, 혼동하는 사람이 매우 많습니다.'
  },
  {
    id: 82, type: 'multiple', difficulty: 5,
    question: '한국의 "아리랑"은 몇 종류나 전해지고 있나?',
    choices: ['약 20종', '약 40종', '약 60종', '약 100종'],
    answer: 2, timeLimit: 12,
    explanation: '전국적으로 약 60여 종의 아리랑이 전해지고 있습니다. 정선아리랑·밀양아리랑·진도아리랑이 3대 아리랑으로 꼽힙니다.'
  },
  {
    id: 83, type: 'multiple', difficulty: 5,
    question: '소설 "프랑켄슈타인"에서 "프랑켄슈타인"은 누구의 이름인가?',
    choices: ['괴물의 이름', '창조자 박사의 이름', '괴물의 조수 이름', '배경 마을 이름'],
    answer: 1, timeLimit: 12,
    explanation: '프랑켄슈타인은 괴물을 만든 "빅터 프랑켄슈타인 박사"의 성(姓)입니다. 괴물에게는 이름이 없습니다. 메리 셸리의 1818년 소설에서 비롯된 대표적인 착각입니다.'
  },
  {
    id: 84, type: 'multiple', difficulty: 5,
    question: '한국의 안동소주 알코올 도수는?',
    choices: ['19도', '25도', '45도', '60도'],
    answer: 2, timeLimit: 12,
    explanation: '안동소주는 경북 안동 지역의 전통 증류식 소주로 알코올 도수 약 45도입니다. 고려시대 원나라를 통해 전파된 증류 기술로 만들어진 전통 증류주입니다.'
  },
  {
    id: 85, type: 'multiple', difficulty: 5,
    question: '"조선 통신사"가 일본에 파견된 주된 목적은?',
    choices: ['무역 협상', '전쟁 선포', '외교·문화 교류', '포로 송환'],
    answer: 2, timeLimit: 12,
    explanation: '조선 통신사는 1607~1811년 사이 12회 일본에 파견된 조선의 공식 외교 사절단입니다. 2017년 유네스코 세계기록유산에 등재되었습니다.'
  },
  {
    id: 86, type: 'multiple', difficulty: 5,
    question: '아인슈타인에 대한 잘못 알려진 상식은?',
    choices: ['상대성이론을 만들었다', '노벨 물리학상을 받았다', '어릴 때 수학을 못했다', '유대계 독일인이다'],
    answer: 2, timeLimit: 12,
    explanation: '아인슈타인이 수학을 못했다는 것은 잘못된 상식입니다. 그는 12세에 대수학·미적분을 독학한 수학 천재였습니다. 이 오해는 스위스와 미국의 성적 표기 방식 차이에서 비롯됐습니다.'
  },
  {
    id: 87, type: 'multiple', difficulty: 5,
    question: '"사군자(四君子)"에 속하지 않는 것은?',
    choices: ['매화', '국화', '연꽃', '대나무'],
    answer: 2, timeLimit: 12,
    explanation: '사군자는 매화·난초·국화·대나무 네 가지입니다. 연꽃은 사군자가 아니며, 불교에서 신성시되는 꽃입니다.'
  },
  {
    id: 88, type: 'multiple', difficulty: 5,
    question: '조선 정조가 만든 신도시이자 수원 화성의 특징은?',
    choices: ['세계 최초 인공섬', '세계 최초 근대적 계획도시', '동양 최초 철근 건물', '아시아 최초 시민 광장'],
    answer: 1, timeLimit: 12,
    explanation: '수원화성(1796)은 정약용의 설계로 건설된 근대적 계획도시이자 군사 요새로, 1997년 유네스코 세계문화유산에 등재되었습니다.'
  },
  {
    id: 89, type: 'multiple', difficulty: 5,
    question: '고구려·백제·신라 삼국 중 가장 먼저 건국된 나라는?',
    choices: ['고구려', '백제', '신라', '모두 같은 시기'],
    answer: 0, timeLimit: 12,
    explanation: '삼국사기 기준 고구려(기원전 37년, 주몽) → 백제(기원전 18년, 온조) → 신라(기원전 57년, 박혁거세) 순이지만, 역사학계에서는 기원전 57년 신라 건국설도 인정합니다.'
  },
  {
    id: 90, type: 'multiple', difficulty: 5,
    question: '"직지심체요절"이 세계 최초의 금속활자 인쇄본으로 공인된 기관은?',
    choices: ['유네스코', '대영박물관', '기네스북', '국제인쇄학회'],
    answer: 0, timeLimit: 12,
    explanation: '직지심체요절(1377)은 2001년 유네스코 세계기록유산에 등재되면서 세계 최초의 금속활자 인쇄본으로 공인받았습니다. 구텐베르크 성서(1455)보다 78년 앞섭니다.'
  },
  {
    id: 91, type: 'multiple', difficulty: 5,
    question: '"며칠"과 "몇일" 중 올바른 맞춤법 표기는?',
    choices: ['며칠', '몇일', '둘 다 맞다', '둘 다 틀리다'],
    answer: 0, timeLimit: 15,
    explanation: '"며칠"이 올바른 표기입니다. "몇 일(日)"로 쓰고 싶어도 표준어 규정상 "며칠"만 인정됩니다. 한국인이 가장 많이 틀리는 맞춤법 중 하나입니다.'
  },
  {
    id: 92, type: 'multiple', difficulty: 5,
    question: '고려시대 세계 최초로 인쇄된 대장경은?',
    choices: ['초조대장경', '팔만대장경', '속장경', '고려대장경'],
    answer: 0, timeLimit: 12,
    explanation: '초조대장경(1011-1087)이 세계 최초의 목판 대장경입니다. 몽골 침략 때 소실되어 이후 팔만대장경(재조대장경, 1236-1251)이 제작되었으며 현재 해인사에 보존되어 있습니다.'
  },
  {
    id: 93, type: 'multiple', difficulty: 5,
    question: '"동학농민운동"이 일어난 해는?',
    choices: ['1884년', '1894년', '1904년', '1919년'],
    answer: 1, timeLimit: 12,
    explanation: '동학농민운동은 1894년(갑오년) 전봉준을 중심으로 일어난 농민 봉기입니다. "사람이 곧 하늘(人乃天)"을 주장한 동학 사상을 바탕으로 반봉건·반외세를 외쳤습니다.'
  },
  {
    id: 94, type: 'multiple', difficulty: 5,
    question: '신라 최초의 여왕은?',
    choices: ['진덕여왕', '선덕여왕', '진성여왕', '명성황후'],
    answer: 1, timeLimit: 12,
    explanation: '선덕여왕(재위 632-647)은 신라 최초이자 한국 역사상 첫 번째 여왕입니다. 첨성대 건립, 황룡사 9층 목탑 완공 등 문화 발전에 기여했습니다.'
  },
  {
    id: 95, type: 'multiple', difficulty: 5,
    question: '"조선 후기 실학자" 다산 정약용이 귀양지에서 집필한 대표 저서는?',
    choices: ['목민심서', '동의보감', '성학집요', '경국대전'],
    answer: 0, timeLimit: 12,
    explanation: '"목민심서"(1818)는 정약용이 18년간의 강진 유배 생활 중 완성한 저서입니다. 지방관의 청렴한 행정을 강조한 내용으로 현재도 공직자들의 필독서로 꼽힙니다.'
  },
  {
    id: 96, type: 'multiple', difficulty: 5,
    question: '한국 고대 유물 "금관총 금관"이 발굴된 지역은?',
    choices: ['경주', '공주', '부여', '강화'],
    answer: 0, timeLimit: 12,
    explanation: '금관총은 경북 경주에 있는 신라 고분으로, 1921년 금관·금제 허리띠·유리구슬 등 화려한 유물이 발굴되었습니다. 신라 금관 문화의 우수성을 보여주는 대표적 유적입니다.'
  },
  {
    id: 97, type: 'multiple', difficulty: 5,
    question: '"이산가족 찾기" 방송이 KBS에서 생방송된 해는?',
    choices: ['1975년', '1983년', '1988년', '1993년'],
    answer: 1, timeLimit: 12,
    explanation: '1983년 6월 30일부터 11월 14일까지 138일간 방송된 KBS "이산가족을 찾습니다"는 세계 최장 생방송으로 기네스북에 등재되었습니다. 2015년 유네스코 세계기록유산에 등재되었습니다.'
  },
  {
    id: 98, type: 'multiple', difficulty: 5,
    question: '"고조선"의 건국 신화에서 단군왕검이 고조선을 건국한 해는?',
    choices: ['기원전 1333년', '기원전 2333년', '기원전 3333년', '기원전 4333년'],
    answer: 1, timeLimit: 12,
    explanation: '삼국유사의 기록에 따르면 단군왕검이 기원전 2333년 고조선을 건국했습니다. 이 날을 기념하는 개천절은 10월 3일로, 대한민국 국경일입니다.'
  },
  {
    id: 99, type: 'ox', difficulty: 5,
    question: '"코알라는 곰의 일종이다" — 이 말은 맞는가?',
    choices: ['O', 'X'],
    answer: 1, timeLimit: 15,
    explanation: '코알라는 곰이 아닌 유대류입니다. 영어 이름 "Koala Bear"에서 비롯된 오해로, 코알라는 캥거루처럼 새끼를 주머니에 키우는 유대류입니다.'
  },
  {
    id: 100, type: 'multiple', difficulty: 5,
    question: '조선의 화폐 "상평통보"가 전국적으로 유통되기 시작한 시기는?',
    choices: ['세종 때', '임진왜란 직후', '숙종 때', '영조 때'],
    answer: 2, timeLimit: 12,
    explanation: '상평통보는 1678년(숙종 4년)부터 전국적으로 유통되기 시작했습니다. 조선 전기에도 화폐 유통 시도가 있었으나 번번이 실패하다가 숙종 때 비로소 정착했습니다.'
  },

];
