import { NextRequest, NextResponse } from "next/server";
import { generateCertificateHTML } from "../../../utils/certificateTemplate";
import * as XLSX from "xlsx";
import puppeteer from "puppeteer";
import archiver from "archiver";

export const runtime = "nodejs";

// Excel日期序列轉換為yyyy/mm/dd
function excelDateToString(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const y = date_info.getFullYear();
  const m = String(date_info.getMonth() + 1).padStart(2, "0");
  const d = String(date_info.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new NextResponse("No file uploaded", { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  // 取得課程表
  const coursesRaw = formData.get("courses");
  let courses = [];
  if (coursesRaw) {
    try {
      courses = JSON.parse(coursesRaw as string);
    } catch {
      courses = [];
    }
  }
  // 欄位自動對應
  const FIELD_MAP = {
    name: ["姓名", "名字", "Name"],
    date: ["日期", "上課日期", "Date"],
    certNo: ["課程認證字號", "認證字號", "證書號碼", "證號", "Certificate No"],
    totalHours: ["時數", "總時數", "Hours"],
    totalScore: ["積分", "總積分", "Score", "積分數"],
    unit: ["單位"]
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getFieldValue(row: any, keys: string[]) {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
        return row[key];
      }
    }
    return "";
  }
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const students = XLSX.utils.sheet_to_json(sheet);

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const archive = archiver("zip");
  const zipChunks: Buffer[] = [];
  archive.on("data", chunk => zipChunks.push(chunk));

  for (const student of students) {
    const name = getFieldValue(student, FIELD_MAP.name) || "未知";
    let date = getFieldValue(student, FIELD_MAP.date) || "";
    if (typeof date === "number") {
      date = excelDateToString(date);
    }
    const certNo = getFieldValue(student, FIELD_MAP.certNo) || "";
    const totalHours = getFieldValue(student, FIELD_MAP.totalHours) || "";
    const totalScore = getFieldValue(student, FIELD_MAP.totalScore) || "";
    const unit = getFieldValue(student, FIELD_MAP.unit) || "";
    const html = generateCertificateHTML({
      name,
      date,
      certNo,
      totalHours,
      totalScore,
      courses
    });
    console.log(html);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await new Promise(resolve => setTimeout(resolve, 500));
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" }
    });
    await page.close();
    archive.append(Buffer.from(pdfBuffer), { name: `${name}-${unit}.pdf` });
  }
  await browser.close();
  await archive.finalize();
  const zipBuffer = Buffer.concat(zipChunks);
  return new NextResponse(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=certificates.zip"
    }
  });
}