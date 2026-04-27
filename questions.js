// 문제 풀 (100문제) — 게임 시작 시 랜덤으로 20개 선택
// type: 'multiple'(4지선다) | 'triple'(3지선다) | 'ox'(O/X)

const questions = [
  // ── 1~10: 신조어 / 트렌드 ──────────────────────────────
  { id:1,  type:'triple', question:'닌텐도는 원래 무엇을 만들던 회사였을까?', choices:['화투','봉제인형','편지지'], answer:0, timeLimit:15 },
  { id:2,  type:'triple', question:'유니콘처럼 반짝 성공했다가 망한 스타트업을 일컫는 말은?', choices:['유니콥스','유니클로','유니세프'], answer:0, timeLimit:15 },
  { id:3,  type:'triple', question:'자신이 좋아하는 분야에서 성공한 사람을 뜻하는 신조어는?', choices:['지덕','후덕','성덕'], answer:2, timeLimit:12 },
  { id:4,  type:'triple', question:'외부와 단절된 혼자만의 공간에서 안락함을 추구하는 사람을 일컫는 용어는?', choices:['코쿤족','딩크족','니트족'], answer:0, timeLimit:15 },
  { id:5,  type:'triple', question:'뉴노멀(New Normal)의 중국식 표현으로 올바른 것은?', choices:['무에타이','신창타이','전선타이'], answer:1, timeLimit:15 },
  { id:6,  type:'triple', question:'소외될 것에 대한 두려움을 뜻하는 신조어는?', choices:['YOLO','FOMO','GAFA'], answer:1, timeLimit:12 },
  { id:7,  type:'triple', question:'\'YOLO\'는 어떤 뜻의 약자일까?', choices:['You Only Live Once','You Ought to Live Optimally','Your Own Life Option'], answer:0, timeLimit:12 },
  { id:8,  type:'triple', question:'구글·애플·페이스북·아마존을 묶어 부르는 약어는?', choices:['MAGA','GAFA','FANG'], answer:1, timeLimit:12 },
  { id:9,  type:'triple', question:'환경 친화적인 척 위장하는 마케팅을 무엇이라 할까?', choices:['블루워싱','그린워싱','화이트워싱'], answer:1, timeLimit:15 },
  { id:10, type:'triple', question:'핀테크(FinTech)에서 \'Fin\'은 무엇의 줄임말일까?', choices:['Final','Finance','Finland'], answer:1, timeLimit:12 },

  // ── 11~20: 한국 상식 ────────────────────────────────────
  { id:11, type:'triple', question:'우리나라가 가장 많이 수입하는 자원은?', choices:['철광석','석유','고무'], answer:1, timeLimit:12 },
  { id:12, type:'triple', question:'단군 신화를 최초로 기록한 역사서는?', choices:['구삼국사','삼국사기','삼국유사'], answer:2, timeLimit:15 },
  { id:13, type:'triple', question:'국내 사이버 민간 외교관 역할을 하는 사이버 외교사절단의 이름은?', choices:['뭉크','라크','반크'], answer:2, timeLimit:15 },
  { id:14, type:'triple', question:'다음 중 돼지고기 부위는?', choices:['우둔살','갈매기살','제비추리'], answer:1, timeLimit:15 },
  { id:15, type:'triple', question:'우리나라 최초의 근대식 병원은?', choices:['재생원','세브란스병원','광혜원'], answer:2, timeLimit:15 },
  { id:16, type:'triple', question:'한국의 첫 장거리 전화는 서울과 어느 도시 사이였을까?', choices:['인천','부산','제주'], answer:1, timeLimit:15 },
  { id:17, type:'triple', question:'국무회의의 의장은 누구인가?', choices:['국무총리','대통령','국회의장'], answer:1, timeLimit:12 },
  { id:18, type:'triple', question:'독도는 행정구역상 어디에 속할까?', choices:['강원도 삼척시','경상북도 울릉군','제주특별자치도'], answer:1, timeLimit:12 },
  { id:19, type:'triple', question:'한글날은 몇 월 며칠일까?', choices:['9월 9일','10월 9일','11월 9일'], answer:1, timeLimit:10 },
  { id:20, type:'triple', question:'훈민정음(訓民正音)의 뜻으로 올바른 것은?', choices:['글자를 배우는 백성','백성을 가르치는 바른 소리','아름다운 조선의 문자'], answer:1, timeLimit:12 },

  // ── 21~30: O/X 퀴즈 ─────────────────────────────────────
  { id:21, type:'ox', question:'대부분의 치킨은 왼쪽 다리가 더 쫄깃하다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:22, type:'ox', question:'짜장면과 자장면은 둘 다 표준어로 인정된다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:23, type:'ox', question:'소주는 식품위생법상 유통기한 표시를 생략할 수 있다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:24, type:'ox', question:'바나나는 나무 열매가 아니라 풀의 열매다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:25, type:'ox', question:'잠자리는 제자리에서 정지 비행이 가능하다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:26, type:'ox', question:'지구에서 달까지의 거리보다 지구 둘레가 더 길다', choices:['O','X'], answer:1, timeLimit:12 },
  { id:27, type:'ox', question:'코끼리와 쥐의 몸 크기 차이는 세포의 수가 아닌 세포 크기 차이 때문이다', choices:['O','X'], answer:1, timeLimit:12 },
  { id:28, type:'ox', question:'피카소는 스페인 태생의 화가이다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:29, type:'ox', question:'인간이 하루에 만드는 침의 양은 약 1~1.5리터다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:30, type:'ox', question:'문어의 뇌는 총 9개다(중앙 뇌 1개 + 각 다리 8개)', choices:['O','X'], answer:0, timeLimit:12 },

  // ── 31~40: 세계 상식 ────────────────────────────────────
  { id:31, type:'triple', question:'호주의 수도는?', choices:['시드니','멜버른','캔버라'], answer:2, timeLimit:12 },
  { id:32, type:'triple', question:'세계에서 가장 작은 나라는?', choices:['모나코','산마리노','바티칸'], answer:2, timeLimit:12 },
  { id:33, type:'triple', question:'세계에서 가장 긴 강은?', choices:['아마존강','나일강','미시시피강'], answer:1, timeLimit:12 },
  { id:34, type:'triple', question:'FIFA 월드컵 첫 개최국은?', choices:['브라질','이탈리아','우루과이'], answer:2, timeLimit:15 },
  { id:35, type:'triple', question:'자유의 여신상이 있는 도시는?', choices:['워싱턴 D.C.','시카고','뉴욕'], answer:2, timeLimit:12 },
  { id:36, type:'triple', question:'\'데자뷔(Déjà vu)\'는 어느 나라 말에서 유래했을까?', choices:['이탈리아어','독일어','프랑스어'], answer:2, timeLimit:15 },
  { id:37, type:'triple', question:'현재(2024년 기준) 세계에서 인구가 가장 많은 나라는?', choices:['중국','인도','미국'], answer:1, timeLimit:10 },
  { id:38, type:'triple', question:'세계 최초의 스마트폰으로 알려진 IBM 제품의 이름은?', choices:['사이먼','뉴턴','팜파일럿'], answer:0, timeLimit:15 },
  { id:39, type:'triple', question:'\'블루투스(Bluetooth)\'라는 이름은 어느 나라 왕의 이름에서 유래했을까?', choices:['스웨덴','노르웨이','덴마크'], answer:2, timeLimit:15 },
  { id:40, type:'triple', question:'월드 와이드 웹(WWW)을 만든 사람은?', choices:['빌 게이츠','팀 버너스리','마크 주커버그'], answer:1, timeLimit:15 },

  // ── 41~50: 과학 상식 ────────────────────────────────────
  { id:41, type:'triple', question:'피부색을 결정하며 자외선을 차단하는 색소는?', choices:['케라틴','콜라겐','멜라닌'], answer:2, timeLimit:15 },
  { id:42, type:'triple', question:'인체에서 가장 큰 장기(기관)는?', choices:['간','폐','피부'], answer:2, timeLimit:12 },
  { id:43, type:'triple', question:'성인 인체에 있는 뼈는 몇 개일까?', choices:['186개','206개','226개'], answer:1, timeLimit:15 },
  { id:44, type:'triple', question:'빛의 삼원색이 아닌 것은?', choices:['빨강','초록','노랑'], answer:2, timeLimit:15 },
  { id:45, type:'triple', question:'코뿔소의 뿔은 무엇으로 이루어져 있을까?', choices:['뼈','피부(각질)','이빨'], answer:1, timeLimit:15 },
  { id:46, type:'triple', question:'사막에서 낙타의 혹에 저장되는 것은?', choices:['물','지방','공기'], answer:1, timeLimit:12 },
  { id:47, type:'triple', question:'카멜레온이 색을 바꾸는 주요 이유는?', choices:['포식자 위장','체온 조절 및 감정 표현','먹이 유인'], answer:1, timeLimit:15 },
  { id:48, type:'triple', question:'물이 100℃에서 끓는 것은 어느 조건에서의 이야기일까?', choices:['기압이 낮을 때','1기압(표준 대기압)일 때','기압이 높을 때'], answer:1, timeLimit:15 },
  { id:49, type:'triple', question:'세종대왕이 한글을 창제한 연도는?', choices:['1343년','1443년','1543년'], answer:1, timeLimit:12 },
  { id:50, type:'multiple', question:'다음 중 포유류가 아닌 것은?', choices:['고래','박쥐','펭귄','돌고래'], answer:2, timeLimit:15 },

  // ── 51~60: 언어 / 국어 ─────────────────────────────────
  { id:51, type:'triple', question:'순우리말로 \'된바람\'은 어느 방향에서 부는 바람일까?', choices:['동쪽','서쪽','북쪽'], answer:1, timeLimit:15 },
  { id:52, type:'triple', question:'주식이나 채권을 보유하지 않은 상태에서 매도하는 것은?', choices:['가매도','반매도','공매도'], answer:2, timeLimit:15 },
  { id:53, type:'triple', question:'물건의 단단한 정도를 나타내는 단어는?', choices:['강도','인성','경도'], answer:2, timeLimit:15 },
  { id:54, type:'triple', question:'높은 사회적 신분에 따르는 도덕적 의무를 뜻하는 말은?', choices:['노블레스 오블리주','카르페 디엠','메멘토 모리'], answer:0, timeLimit:15 },
  { id:55, type:'triple', question:'\'사필귀정(事必歸正)\'의 뜻은?', choices:['모든 일은 반드시 바른 데로 돌아간다','일을 미루면 반드시 후회한다','옳은 일은 반드시 보상 받는다'], answer:0, timeLimit:15 },
  { id:56, type:'triple', question:'\'가성비\'는 무엇을 줄인 말일까?', choices:['가격 대비 성능','가격 대비 성분','가격 대비 성격'], answer:0, timeLimit:10 },
  { id:57, type:'triple', question:'음을 부드럽게 이어서 연주하라는 음악 기호는?', choices:['스타카토','레가토','포르타토'], answer:1, timeLimit:15 },
  { id:58, type:'triple', question:'\'알고리즘(Algorithm)\'이라는 단어는 어느 수학자의 이름에서 유래했을까?', choices:['알베르트 아인슈타인','무함마드 알콰리즈미','알렉산더 그레이엄 벨'], answer:1, timeLimit:15 },
  { id:59, type:'triple', question:'\'인스타그램(Instagram)\'은 어떤 두 단어의 합성어일까?', choices:['Internet+Grammar','Instant+Telegram','Image+Segment'], answer:1, timeLimit:12 },
  { id:60, type:'triple', question:'\'커피(Coffee)\'라는 단어는 어느 언어에서 유래했을까?', choices:['이탈리아어','아랍어','포르투갈어'], answer:1, timeLimit:15 },

  // ── 61~70: 역사 / 문화 ─────────────────────────────────
  { id:61, type:'triple', question:'세계 최초의 금속활자 인쇄본은?', choices:['직지심체요절','구텐베르크 성서','팔만대장경'], answer:0, timeLimit:15 },
  { id:62, type:'triple', question:'1681년에 멸종한 새로, 이름이 포르투갈어로 \'멍청이\'에서 유래한 것은?', choices:['모아','도도새','후이아'], answer:1, timeLimit:15 },
  { id:63, type:'multiple', question:'다음 중 셰익스피어 4대 비극이 아닌 것은?', choices:['햄릿','리어왕','오셀로','한여름 밤의 꿈'], answer:3, timeLimit:15 },
  { id:64, type:'triple', question:'한국의 국화(國花)는?', choices:['진달래','개나리','무궁화'], answer:2, timeLimit:10 },
  { id:65, type:'triple', question:'타이타닉호가 침몰한 연도는?', choices:['1902년','1912년','1922년'], answer:1, timeLimit:12 },
  { id:66, type:'triple', question:'조선시대 신분제에서 \'서얼(庶孼)\'이란?', choices:['첩의 자녀','양반의 서자','노비의 자녀'], answer:0, timeLimit:15 },
  { id:67, type:'triple', question:'호박, 구두, 왕자님 — 이 단어들에서 연상되는 동화 주인공은?', choices:['백설공주','인어공주','신데렐라'], answer:2, timeLimit:12 },
  { id:68, type:'triple', question:'다음 중 지명에서 유래된 음식이 아닌 것은?', choices:['체다치즈','햄버거','퐁듀'], answer:2, timeLimit:15 },
  { id:69, type:'triple', question:'익명이라는 뜻을 가진 글로벌 해커 집단의 이름은?', choices:['리자드 스쿼드','수어사이드 스쿼드','어나니머스'], answer:2, timeLimit:15 },
  { id:70, type:'triple', question:'\'서태지와 아이들\'의 멤버가 아닌 사람은?', choices:['양현석','이주노','이승철'], answer:2, timeLimit:15 },

  // ── 71~80: 경제 / 사회 ─────────────────────────────────
  { id:71, type:'triple', question:'불황기에 저가 사치품 판매가 늘어나는 현상은?', choices:['파운데이션 효과','립스틱 효과','아이섀도 효과'], answer:1, timeLimit:15 },
  { id:72, type:'triple', question:'\'파레토 법칙(80-20 법칙)\'이란?', choices:['20%의 원인이 80%의 결과를 만든다','80%의 노력이 20%의 성과를 만든다','50:50으로 모든 결과가 나뉜다'], answer:0, timeLimit:15 },
  { id:73, type:'triple', question:'부드럽게 유도해 행동을 바꾸는 효과를 무엇이라 할까?', choices:['프레이밍 효과','넛지 효과','스노우볼 효과'], answer:1, timeLimit:15 },
  { id:74, type:'triple', question:'\'유리천장(Glass Ceiling)\'이 의미하는 것은?', choices:['건축 자재 혁신','여성·소수자의 승진 장벽','투명 경영 원칙'], answer:1, timeLimit:15 },
  { id:75, type:'triple', question:'\'파블로프의 개\' 실험에서 개가 학습한 반응은?', choices:['소리를 들으면 잠든다','소리를 들으면 침을 흘린다','소리를 들으면 도망간다'], answer:1, timeLimit:15 },
  { id:76, type:'triple', question:'\'밀레니얼 세대\'는 주로 어느 연도에 태어난 세대를 가리킬까?', choices:['1960~1970년대','1980~1990년대','2000년대 이후'], answer:1, timeLimit:12 },
  { id:77, type:'triple', question:'2016년 리우 올림픽에서 정식 종목으로 새롭게 채택된 것은?', choices:['비치발리볼','주짓수','골프'], answer:2, timeLimit:15 },
  { id:78, type:'triple', question:'한 달에 두 번 뜨는 보름달을 무엇이라 부를까?', choices:['럭키문','블루문','더블문'], answer:1, timeLimit:12 },
  { id:79, type:'triple', question:'\'인지 부조화\'를 설명하는 사례는?', choices:['담배가 해롭다는 것을 알지만 계속 피운다','열심히 공부해서 좋은 성적을 받는다','좋아하는 음식을 먹어 기분이 좋아진다'], answer:0, timeLimit:15 },
  { id:80, type:'triple', question:'\'킬로(Kilo-)\'는 몇 배를 의미하는 접두사일까?', choices:['100배','1,000배','10,000배'], answer:1, timeLimit:10 },

  // ── 81~90: 자연 / 과학 2 ───────────────────────────────
  { id:81, type:'triple', question:'타조는 날지 못하는 새 중 가장 빠르게 달린다. 최대 시속은?', choices:['약 50km/h','약 70km/h','약 90km/h'], answer:1, timeLimit:15 },
  { id:82, type:'triple', question:'다음 중 재생 가능 에너지가 아닌 것은?', choices:['풍력','태양광','천연가스'], answer:2, timeLimit:12 },
  { id:83, type:'multiple', question:'다음 중 올림픽 오륜기에 없는 색깔은?', choices:['빨강','파랑','보라','검정'], answer:2, timeLimit:15 },
  { id:84, type:'triple', question:'세계 최초의 컴퓨터로 알려진 에니악(ENIAC)은 어느 나라에서 만들었을까?', choices:['영국','독일','미국'], answer:2, timeLimit:15 },
  { id:85, type:'triple', question:'\'매슬로의 욕구 5단계\'에서 가장 높은 단계는?', choices:['안전 욕구','존경 욕구','자아실현 욕구'], answer:2, timeLimit:15 },
  { id:86, type:'triple', question:'비타민 C를 가장 많이 함유한 과일은?', choices:['오렌지','레몬','키위'], answer:2, timeLimit:15 },
  { id:87, type:'triple', question:'\'호랑이도 제 말 하면 온다\'에 해당하는 영어 표현은?', choices:['Speak of the devil','It takes two to tango','The early bird catches the worm'], answer:0, timeLimit:15 },
  { id:88, type:'multiple', question:'다음 중 노벨상 시상 부문이 아닌 것은?', choices:['물리학','수학','화학','문학'], answer:1, timeLimit:15 },
  { id:89, type:'triple', question:'황사의 주요 발원지는?', choices:['시베리아','고비사막·황토고원','아라비아 반도'], answer:1, timeLimit:12 },
  { id:90, type:'triple', question:'손톱이 가장 빠르게 자라는 손가락은?', choices:['엄지손가락','중지(가운뎃손가락)','소지(새끼손가락)'], answer:1, timeLimit:15 },

  // ── 91~100: 잡학 ────────────────────────────────────────
  { id:91, type:'ox', question:'태양은 지구보다 약 130만 배 이상 크다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:92, type:'ox', question:'플라스틱은 자연 상태에서 분해되는 데 500년 이상 걸릴 수 있다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:93, type:'ox', question:'대한민국은 OECD(경제협력개발기구) 회원국이다', choices:['O','X'], answer:0, timeLimit:10 },
  { id:94, type:'triple', question:'\'블랙홀\'이라는 용어를 처음 대중화한 과학자는?', choices:['알베르트 아인슈타인','존 휠러','스티븐 호킹'], answer:1, timeLimit:15 },
  { id:95, type:'triple', question:'세종대왕이 창제한 훈민정음을 반포한 연도는?', choices:['1443년','1446년','1450년'], answer:1, timeLimit:15 },
  { id:96, type:'triple', question:'\'매경이춤(Buy the Dip)\'은 주가가 일시적으로 하락할 때 매수하는 전략이다. 반대로 주가 상승 시 매도하는 전략의 별명은?', choices:['셀 더 랠리','셀 더 피크','셀 더 무브'], answer:0, timeLimit:15 },
  { id:97, type:'triple', question:'\'앤비젼\'의 주요 사업 분야는?', choices:['식음료 제조','머신 비전 솔루션','자동차 부품'], answer:1, timeLimit:12 },
  { id:98, type:'triple', question:'다음 중 인체 혈액형 분류 방식이 아닌 것은?', choices:['ABO식','Rh식','DNA식'], answer:2, timeLimit:15 },
  { id:99, type:'triple', question:'\'파레토\'는 어느 나라 경제학자일까?', choices:['프랑스','이탈리아','독일'], answer:1, timeLimit:15 },
  { id:100,type:'triple', question:'세종대왕 외에 대한민국 지폐에 등장하는 인물이 아닌 사람은?', choices:['이순신','율곡 이이','정약용'], answer:2, timeLimit:15 },
];

module.exports = questions;
