const bgPath = "http://localhost:3000/certificate-bg.jpg";
export function generateCertificateHTML({
  name,
  date,
  certNo,
  totalHours,
  totalScore,
  courses, // [{time, topic, score}]
  principal = "張簡春霞"
}: {
  name: string;
  date: string;
  certNo: string;
  totalHours: string;
  totalScore: string;
  courses: { time: string; topic: string; score: string }[];
  principal?: string;
}) {
  console.log(bgPath);
  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
  margin: 0;
  padding: 0;
  width: 210mm;
  height: 297mm;
  position: relative;
  font-family: 'Noto Sans TC', 'Microsoft JhengHei', Arial, sans-serif;
  box-sizing: border-box;
}
.bg {
  position: absolute;
  width: 210mm;
  height: 297mm;
  z-index: 0;
  left: 0;
  top: 0;
}
.content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.title {
  margin-top: 1.75em;
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 1.67rem;
  letter-spacing: 0.1em;
  color: #222;
}
.date {
  margin-top: 2.2em;
  margin-bottom: 0;
  text-align: right;
  font-weight: bold;
  font-size: 1rem;
  color: #222;
  min-width: 180px;
}
.certno {
  margin-top: 0;
  text-align: right;
  font-weight: bold;
  font-size: 1rem;
  color: #222;
  min-width: 180px;
}
.name {
  margin-top: 24px;
  font-weight: bold;
  font-size: 2rem;
  color: #222;
  text-align: left;
  line-height: 2.2rem;
  word-break: break-all;
}
.desc {
  margin-top: 8px;
  font-weight: bold;
  font-size: 1.5rem;
  color: #222;
  text-align: left;
  line-height: 2.2rem;
  word-break: break-all;
}
.courses {
  margin-top: 32px;
  width: 100%;
}
table {
  border-collapse: collapse;
  width: 100%;
  background: white;
  font-size: 1.67rem;
}
th, td {
  border: 3px solid #000;
  padding: 4px 8px;
  text-align: center;
  font-size: 1.67rem;
}
.footer {
  margin-top: 32px;
  width: 100%;
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
}
.principal {
  margin-top: 1em;
  font-size: 2.17rem;
}
.date-bottom {
  width: 100%;
  text-align: center;
  margin-top: 0;
  margin-bottom: 24mm;
  font-size: 1.67rem;
  font-weight: bold;
  color: #222;
  letter-spacing: 0.2em;
  position: absolute;
  left: 0;
  bottom: -2.7rem;
  z-index: 2;
  pointer-events: none;
}
      </style>
    </head>
    <body>
      <img class="bg" src="${bgPath}" />
      <div class="content">
        <div class="title">
          <span style="font-size:1.5rem;">高雄市永康關懷照顧促進協會</span><br/>
          <span style="font-size:1.5rem;">附設高雄市私立馥諭居家長照機構</span><br/>
          <span style="font-size:1.83rem; margin-top:1em; display:inline-block;">聯合辦理員工在職教育訓練課程</span>
        </div>
        <div class="date"> 中華民國${date} </div>
        <div class="certno">${certNo}</div>
        <div class="name"> ${name} 君</div>
        <div class="desc">
          <span style="color:#222;">${date}</span>
          參加高雄市永康關懷照顧促進協會附設高雄市私立馥諭居家長照機構辦理實體課程共計
          <span style="color:#222;">${totalHours}</span>小時，長照繼續教育積分共
          <span style="color:#222;">${totalScore}</span>積分。
        </div>
        <div class="courses">
          <table>
            <thead>
              <tr>
                <th>時間</th>
                <th>主題</th>
                <th>積分</th>
              </tr>
            </thead>
            <tbody>
              ${courses.map(c => `
                <tr>
                  <td>${c.time}</td>
                  <td>${c.topic}</td>
                  <td>${c.score}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="footer">
          特此證書
          <div class="principal">負責人　<span style="font-size:3rem;">${principal}</span></div>
        </div>
      </div>
      <div class="date-bottom">中華民國${date}</div>
    </body>
  </html>
  `;
}