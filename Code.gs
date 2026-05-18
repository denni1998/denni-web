const SPREADSHEET_ID = "1q5ZbW1dyHQc2FnNrCnObzbjxdmy0zqTWGvDRbGRkrww";
const SHEET_NAME = "DATA";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    const headers = [
      "Timestamp",
      "Tanggal",
      "Nama",
      "Nomor Mesin",
      "Lokasi",
      "Mulai",
      "Selesai",
      "Total Waktu",
      "Problem",
      "Tindakan",
      "Catatan"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.tanggal || "",
      data.nama || "",
      data.mesin || "",
      data.lokasi || "",
      data.mulai || "",
      data.selesai || "",
      data.total || "",
      data.problem || "",
      data.tindakan || "",
      data.catatan || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Laporan berhasil disimpan ke sheet DATA"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: err.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("Google Apps Script aktif - Spreadsheet ID: " + SPREADSHEET_ID + " | Sheet: " + SHEET_NAME)
    .setMimeType(ContentService.MimeType.TEXT);
}