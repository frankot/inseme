import ExcelJS from "exceljs";

import { requireAdmin } from "@/lib/auth-guard";
import { getLeadRows } from "@/lib/queries/leads";

/**
 * Real .xlsx rather than a CSV: the centre's staff open this in Excel, and a
 * CSV of Polish text with semicolons is a support call waiting to happen.
 *
 * The route is a GET so the browser downloads it directly, but it re-checks the
 * admin session — `proxy.ts` gates /admin, and this must never become a public
 * dump of every address the site has collected.
 */
export async function GET() {
  await requireAdmin();

  const rows = await getLeadRows();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Insieme";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Adresy");
  sheet.columns = [
    { header: "E-mail", key: "email", width: 34 },
    { header: "Źródło", key: "source", width: 20 },
    { header: "Szczegóły", key: "detail", width: 44 },
    { header: "Zgoda", key: "consentAt", width: 20 },
    { header: "Data", key: "createdAt", width: 20 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  for (const row of rows) {
    sheet.addRow({
      email: row.email,
      source: row.source,
      detail: row.detail ?? "",
      consentAt: row.consentAt,
      createdAt: row.createdAt,
    });
  }

  // Real dates, not strings, so sorting and filtering behave in Excel.
  for (const key of ["consentAt", "createdAt"]) {
    sheet.getColumn(key).numFmt = "yyyy-mm-dd hh:mm";
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(buffer as ArrayBuffer, {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="insieme-adresy-${stamp}.xlsx"`,
      // Personal data: never cached by a proxy or the browser.
      "cache-control": "no-store, private",
    },
  });
}
