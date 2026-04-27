// 퀴즈 문제 데이터
// type: 'multiple' (4지선다) | 'ox' (O/X) | 'triple' (3지선다)
const questions = [
  {
    id: 1,
    type: 'multiple',
    question: '대한민국의 수도는?',
    choices: ['부산', '서울', '인천', '대전'],
    answer: 1, // 0-indexed
    timeLimit: 15,
  },
  {
    id: 2,
    type: 'ox',
    question: '지구는 태양 주위를 돈다',
    choices: ['O', 'X'],
    answer: 0,
    timeLimit: 10,
  },
  {
    id: 3,
    type: 'multiple',
    question: '다음 중 포유류가 아닌 동물은?',
    choices: ['고래', '박쥐', '연어', '돌고래'],
    answer: 2,
    timeLimit: 15,
  },
  {
    id: 4,
    type: 'triple',
    question: '올림픽은 몇 년마다 열리나요?',
    choices: ['2년', '4년', '6년'],
    answer: 1,
    timeLimit: 12,
  },
  {
    id: 5,
    type: 'multiple',
    question: '세계에서 가장 긴 강은?',
    choices: ['아마존강', '나일강', '양쯔강', '미시시피강'],
    answer: 1,
    timeLimit: 15,
  },
  {
    id: 6,
    type: 'ox',
    question: '피카소는 프랑스 태생의 화가이다',
    choices: ['O', 'X'],
    answer: 1, // 스페인 출신
    timeLimit: 10,
  },
  {
    id: 7,
    type: 'multiple',
    question: '다음 중 비타민 C가 가장 많이 함유된 과일은?',
    choices: ['오렌지', '레몬', '키위', '딸기'],
    answer: 2,
    timeLimit: 15,
  },
  {
    id: 8,
    type: 'triple',
    question: '인체에서 가장 큰 기관은?',
    choices: ['간', '피부', '폐'],
    answer: 1,
    timeLimit: 12,
  },
  {
    id: 9,
    type: 'multiple',
    question: '다음 중 재생에너지가 아닌 것은?',
    choices: ['태양광', '풍력', '천연가스', '수력'],
    answer: 2,
    timeLimit: 15,
  },
  {
    id: 10,
    type: 'ox',
    question: '빛의 속도는 소리의 속도보다 빠르다',
    choices: ['O', 'X'],
    answer: 0,
    timeLimit: 10,
  },
  {
    id: 11,
    type: 'multiple',
    question: '셰익스피어의 작품이 아닌 것은?',
    choices: ['햄릿', '오셀로', '돈키호테', '맥베스'],
    answer: 2,
    timeLimit: 15,
  },
  {
    id: 12,
    type: 'multiple',
    question: '다음 중 노벨상 부문이 아닌 것은?',
    choices: ['물리학', '수학', '화학', '문학'],
    answer: 1,
    timeLimit: 15,
  },
];

module.exports = questions;
