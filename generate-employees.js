// 임직원 엑셀 파일을 읽어 employees.json 생성
// 사용법: node generate-employees.js
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const FILE = '임직원 정보_Rev.0_Lara_덮어쓰기만 가능.xlsx';

try {
  const wb = XLSX.readFile(path.join(__dirname, FILE));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

  // 헤더 제외, 번호/성명/그룹/전화번호 있는 행만
  const employees = rows.slice(1)
    .filter(r => r[0] && r[2] && r[4])
    .map(r => ({
      id: Number(r[0]),
      group: String(r[1] || '').replace(/\s+/g, ' ').trim(),
      name: String(r[2]),
      pw: String(r[4]).replace(/[^0-9]/g, '').slice(-4), // 전화번호 뒤 4자리
    }));

  fs.writeFileSync(
    path.join(__dirname, 'employees.json'),
    JSON.stringify(employees, null, 2),
    'utf8'
  );

  console.log(`✅ employees.json 생성 완료: ${employees.length}명`);
  employees.forEach(e => console.log(`  [${e.id}] ${e.group} - ${e.name} (pw: ${e.pw})`));
} catch (e) {
  console.error('❌ 오류:', e.message);
}
