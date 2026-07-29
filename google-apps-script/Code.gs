const SPREADSHEET_ID = "1zinyyqXwi3Ts1-KRHa1xA7NzDvqlHjTzbDmDi9YNBhA";
const TARGET_SHEET_GID = 0;
const HEADERS = [
  "Дата отправки",
  "Имя гостя",
  "Статус участия",
  "Алкоголь",
  "Комментарий",
];

function doGet() {
  return createJsonResponse({
    success: true,
    message: "Сервис RSVP работает.",
  });
}

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    if (!event || !event.postData || !event.postData.contents) {
      throw new Error("Пустой запрос.");
    }

    const data = JSON.parse(event.postData.contents);
    validatePayload(data);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet =
      spreadsheet
        .getSheets()
        .find((candidate) => candidate.getSheetId() === TARGET_SHEET_GID) ||
      spreadsheet.getSheets()[0];

    ensureHeaders(sheet);

    sheet.appendRow([
      formatSubmittedAt(data.submittedAt),
      sanitizeCell(data.guestName),
      sanitizeCell(data.attendance),
      sanitizeCell(data.alcohol),
      sanitizeCell(data.comment || ""),
    ]);

    return createJsonResponse({
      success: true,
      message: "Ответ сохранён.",
    });
  } catch (error) {
    console.error(error);
    return createJsonResponse({
      success: false,
      message: "Не удалось сохранить ответ.",
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function validatePayload(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Некорректный формат данных.");
  }

  if (!String(data.guestName || "").trim()) {
    throw new Error("Не указано имя гостя.");
  }

  const allowedStatuses = ["Буду присутствовать", "Не смогу присутствовать"];
  if (!allowedStatuses.includes(String(data.attendance || ""))) {
    throw new Error("Некорректный статус участия.");
  }

  if (
    data.attendance === "Буду присутствовать" &&
    !String(data.alcohol || "").trim()
  ) {
    throw new Error("Не выбран напиток.");
  }
}

function ensureHeaders(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const headersAreMissing = HEADERS.some(
    (header, index) => firstRow[index] !== header,
  );

  if (headersAreMissing) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function formatSubmittedAt(value) {
  const parsed = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  return Utilities.formatDate(
    safeDate,
    Session.getScriptTimeZone() || "Europe/Moscow",
    "dd.MM.yyyy HH:mm:ss",
  );
}

function sanitizeCell(value) {
  const text = String(value || "").trim().slice(0, 2000);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function createJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
