"use client";
import React from "react";

function UploadExcel({ onFileUploaded }: { onFileUploaded: (file: File) => void }) {
  const [fileName, setFileName] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFileName(file ? file.name : "");
    if (file) {
      onFileUploaded(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <span className="font-semibold text-lg mb-2">上傳 Excel 檔案</span>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="px-6 py-3 bg-teal-500 text-white rounded-full font-semibold shadow hover:bg-teal-600 transition focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        選擇檔案
      </button>
      {fileName && (
        <span className="text-gray-600 text-sm mt-1">{fileName}</span>
      )}
    </div>
  );
}

export default function Home() {
  const [excelFile, setExcelFile] = React.useState<File | null>(null);
  const [downloading, setDownloading] = React.useState(false);
  const [readyToDownload, setReadyToDownload] = React.useState(false);
  // 課程表格資料（動態表單）
  const [rows, setRows] = React.useState([
    { time: "09:00-10:00", topic: "多元族群文化敏感度及能力", score: "1.2分" },
    { time: "10:10-12:10", topic: "原住民族文化敏感度及能力", score: "2.4分" },
    { time: "13:00-15:00", topic: "消防安全", score: "2.4分" },
    { time: "15:10-16:10", topic: "緊急應變", score: "1.2分" },
  ]);
  const [form, setForm] = React.useState({ time: '', topic: '', score: '' });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRow = () => {
    if (!form.time.trim() || !form.topic.trim() || !form.score.trim()) return;
    if (rows.length >= 5) return;
    setRows(prev => [...prev, { ...form }]);
    setForm({ time: '', topic: '', score: '' });
  };

  const handleExcelUpload = (file: File) => {
    setExcelFile(file);
    setReadyToDownload(false);
    // 處理 Excel 檔案後，模擬處理完成
    setDownloading(true);
    // 這裡可改為實際處理 Excel 的邏輯
    setTimeout(() => {
      setReadyToDownload(true);
      setDownloading(false);
    }, 1200); // 模擬處理 1.2 秒
  };

  const handleDownload = async () => {
    if (!excelFile || !readyToDownload) return;
    setDownloading(true);
    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("courses", JSON.stringify(rows)); // 傳送課程表
    const res = await fetch("/api/generate-certificates", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificates.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      alert("下載失敗，請確認檔案格式或稍後再試。");
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-teal-100 p-8">
      {/* 標題 */}
      <h1 className="text-2xl md:text-3xl font-bold text-center mt-8 mb-12 tracking-wide leading-relaxed">
        高雄市永康關懷照顧促進協會附設高雄市私立馥諭居家長照機構證書產生器
      </h1>
      {/* 下載 Excel 範本按鈕 */}
      <a
        href="/template.xlsx"
        download
        className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
        style={{ textAlign: 'center', display: 'inline-block' }}
      >
        下載 Excel 範本
      </a>
      {/* 上傳 Excel 區塊 */}
      <UploadExcel onFileUploaded={handleExcelUpload} />
      {/* 下載按鈕（永遠顯示） */}
      <button
        className={`mt-4 px-6 py-3 rounded-full font-semibold shadow transition focus:outline-none focus:ring-2
          ${readyToDownload && !downloading
            ? "bg-black text-white hover:bg-gray-800 focus:ring-gray-400 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"}
        `}
        onClick={handleDownload}
        disabled={!readyToDownload || downloading}
      >
        {downloading
          ? "產生並下載中..."
          : !excelFile
            ? "下載全部證書pdf檔"
            : !readyToDownload
              ? "處理檔案中..."
              : "下載證書 PDF 檔 (批次)"}
      </button>
      {/* 證書預覽區塊 */}
      <div className="relative mt-12 w-[350px] sm:w-[600px] min-h-[500px] sm:min-h-[850px] border shadow bg-white flex flex-col items-center justify-center overflow-auto">
        {/* 固定證書底圖 */}
        <img src="/certificate-bg.jpg" alt="證書底圖" className="absolute w-full h-full object-cover" />
        {/* 標題 */}
        <div className="absolute left-0 w-full text-center font-bold tracking-wider" style={{ top: "60px", letterSpacing: "0.1em", color: "#222", fontSize: "1.25rem" }}>
          <span className="custom-title">高雄市永康關懷照顧促進協會</span>
          <div className="custom-title" style={{ position: 'relative', top: '0.2em', textAlign: 'center', width: '100%' }}>
            附設高雄市私立馥諭居家長照機構
            <div style={{ height: '1em' }}></div>
            <div style={{ textAlign: 'center', width: '100%' }}>
              聯合辦理員工在職教育訓練課程
            </div>
          </div>
        </div>
        {/* 日期與認證字號區塊 */}
        <div className="absolute text-base sm:text-xl font-bold tracking-wider" style={{ top: "190px", right: "40px", color: "#222", textAlign: 'right', minWidth: '180px' }}>
          《日期》
        </div>
        <div className="absolute text-base sm:text-xl font-bold tracking-wider" style={{ top: "210px", right: "40px", color: "#b91c1c", textAlign: 'right', minWidth: '180px' }}>
          《課程認證字號》
        </div>
        <div className="absolute text-base sm:text-xl font-bold tracking-wider" style={{ top: "230px", left: "40px", width: "calc(100% - 80px)", color: "#222", textAlign: 'left', lineHeight: '2.2rem', wordBreak: 'break-all' }}>
          《姓名》&nbsp;君
        </div>
        <div className="absolute text-base sm:text-xl font-bold tracking-wider" style={{ top: "250px", left: "40px", width: "calc(100% - 80px)", color: "#222", textAlign: 'left', lineHeight: '2.2rem', wordBreak: 'break-all' }}>
          <span style={{ display: 'block', height: '0.5em' }}></span>
          &nbsp;&nbsp;<span className="text-red-700">《日期》</span> 參加高雄市永康關懷照顧促進協會附設高雄市私立馥諭居家長照機構辦理實體課程共計<span className="text-red-700">《時數》</span>小時，長照繼續教育積分共<span className="text-red-700">《積分數》</span>積分。
          {/* 課程表格區塊（動態表單） */}
          <div className="mt-6 w-full">
            {/* 動態表單輸入區 */}
            <div className="flex flex-wrap gap-2 mb-2 items-end">
              <div>
                <label className="block text-xs text-gray-600 mb-1">時間</label>
                <input
                  type="text"
                  name="time"
                  value={form.time}
                  onChange={handleFormChange}
                  className="border px-2 py-1 rounded w-[110px] text-sm"
                  placeholder="如 09:00-10:00"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">主題</label>
                <input
                  type="text"
                  name="topic"
                  value={form.topic}
                  onChange={handleFormChange}
                  className="border px-2 py-1 rounded w-[220px] text-sm"
                  placeholder="課程主題"
                  maxLength={30}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">積分</label>
                <input
                  type="text"
                  name="score"
                  value={form.score}
                  onChange={handleFormChange}
                  className="border px-2 py-1 rounded w-[60px] text-sm"
                  placeholder="如 1.2分"
                  maxLength={6}
                />
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full font-semibold shadow hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
                disabled={!form.time.trim() || !form.topic.trim() || !form.score.trim() || rows.length >= 5}
              >
                新增
              </button>
              {rows.length >= 5 && (
                <span className="text-xs text-red-500 ml-2">最多5列</span>
              )}
            </div>
            {/* 顯示表格 */}
            <table className="border border-black w-full max-w-[500px] text-center bg-white text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-0.5 whitespace-nowrap w-[70px]">時間</th>
                  <th className="border border-black px-8 py-0.5 whitespace-nowrap w-[320px]">主題</th>
                  <th className="border border-black px-1 py-0.5 whitespace-nowrap w-[55px]">積分</th>
                  <th className="border border-black px-1 py-0.5 whitespace-nowrap w-[40px]">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border border-black px-2 py-0.5 whitespace-nowrap w-[70px]">{row.time}</td>
                    <td className="border border-black px-8 py-0.5 whitespace-nowrap w-[320px]">{row.topic}</td>
                    <td className="border border-black px-1 py-0.5 whitespace-nowrap w-[55px]">{row.score}</td>
                    <td className="border border-black px-1 py-0.5 whitespace-nowrap w-[40px]">
                      <button
                        type="button"
                        onClick={() => setRows(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:text-red-800 font-bold px-2"
                        title="刪除這一列"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 表格下方的特此證書 */}
          <div className="w-full text-left mt-6">
            <span className="special-cert">特此證書</span>
            <div style={{ height: '1em' }}></div>
            <span className="principal">負責人&nbsp;&nbsp;&nbsp;&nbsp;<span className="principal-name">張簡春霞</span></span>
          </div>
        </div>
        {/* 日期 */}
        <div className="absolute w-full text-center text-base sm:text-xl font-bold" style={{ bottom: "60px", color: "#222", letterSpacing: "0.2em" }}>
          <span
            className="text-red-700"
            style={{ display: "inline-block", position: "relative", top: "0.6em" }}
          >
            《日期》
          </span>
        </div>
      </div>
    </div>
  );
}
