const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const data = [
  [
    '日期', '課程認證字號', '姓名', '時數', '積分數',
    '課程1-時間', '課程1-主題', '課程1-積分',
    '課程2-時間', '課程2-主題', '課程2-積分'
  ],
  [
    '2024/06/25', 'ABC123', '王小明', 7.2, 7.2,
    '09:00-10:00', '失智課程A', 1.2,
    '10:10-12:10', '失智課程B', 2.4
  ],
  [
    '2024/06/25', 'ABC123', '李小華', 7.2, 7.2,
    '09:00-10:00', '失智課程A', 1.2,
    '10:10-12:10', '失智課程B', 2.4
  ],
  [
    '2024/06/26', 'DEF456', '張大同', 6.0, 6.0,
    '09:00-10:00', '精神障礙A', 1.0,
    '10:10-12:10', '精神障礙B', 2.0
  ]
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, '範本');

const outPath = path.join(__dirname, '../public/template.xlsx');
XLSX.writeFile(wb, outPath);

console.log('Excel 範本已產生:', outPath); 