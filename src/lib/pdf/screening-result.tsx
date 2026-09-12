import "server-only";

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import path from "node:path";

/**
 * The PDF a visitor asks to be sent after finishing a screening test.
 *
 * Fonts are registered from `public/fonts` rather than left as the built-in
 * Helvetica: the standard PDF fonts are WinAnsi-encoded and have no Polish
 * diacritics, which would punch holes through every other word.
 */
const FONT_DIR = path.join(process.cwd(), "public", "fonts");
let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;
  Font.register({
    family: "WorkSans",
    fonts: [
      { src: path.join(FONT_DIR, "WorkSans-Regular.ttf"), fontWeight: 400 },
      { src: path.join(FONT_DIR, "WorkSans-SemiBold.ttf"), fontWeight: 600 },
    ],
  });
  // react-pdf hyphenates aggressively by default, which reads badly in Polish.
  Font.registerHyphenationCallback((word) => [word]);
  fontsRegistered = true;
}

const INK = "#2E3330";
const INK_SOFT = "#585E56";
const MUTED = "#9A9F95";
const CLAY = "#A08E7B";
const LINE = "#E8E4DA";

const styles = StyleSheet.create({
  page: {
    fontFamily: "WorkSans",
    fontSize: 10.5,
    lineHeight: 1.6,
    color: INK_SOFT,
    paddingTop: 46,
    paddingBottom: 56,
    paddingHorizontal: 52,
    backgroundColor: "#FFFFFF",
  },
  eyebrow: { fontSize: 8, letterSpacing: 2, color: CLAY, textTransform: "uppercase" },
  brand: { fontSize: 15, fontWeight: 600, color: INK, marginTop: 6 },
  rule: { borderBottomWidth: 1, borderBottomColor: LINE, marginTop: 18, marginBottom: 22 },
  h1: { fontSize: 19, fontWeight: 600, color: INK, lineHeight: 1.25, marginBottom: 10 },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  scoreLabel: { fontSize: 8, letterSpacing: 2, color: CLAY, textTransform: "uppercase" },
  score: { fontSize: 22, fontWeight: 600, color: INK },
  body: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 8,
    letterSpacing: 2,
    color: CLAY,
    textTransform: "uppercase",
    marginBottom: 7,
  },
  box: { backgroundColor: "#F1EDE4", padding: 16, marginTop: 14 },
  boxTitle: { fontSize: 12, fontWeight: 600, color: INK, marginBottom: 5 },
  phone: { fontSize: 17, fontWeight: 600, color: INK, marginTop: 3 },
  disclaimer: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: LINE,
    fontSize: 8.5,
    lineHeight: 1.55,
    color: MUTED,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    fontSize: 8,
    color: MUTED,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export type ScreeningResultPdfData = {
  testTitle: string;
  score: number;
  maxScore: number;
  resultTitle: string;
  resultBody: string;
  disclaimer: string;
  phone: string;
  createdAt: Date;
};

function ScreeningResultDocument({ data }: { data: ScreeningResultPdfData }) {
  const date = data.createdAt.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Document
      title={`Wynik testu — ${data.testTitle}`}
      author="Insieme"
      language="pl"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Ośrodek terapii uzależnień</Text>
        <Text style={styles.brand}>Insieme</Text>
        <View style={styles.rule} />

        <Text style={styles.sectionTitle}>{data.testTitle}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.h1}>{data.resultTitle}</Text>
          <View>
            <Text style={styles.scoreLabel}>Wynik</Text>
            <Text style={styles.score}>
              {data.score} / {data.maxScore}
            </Text>
          </View>
        </View>

        <Text style={styles.body}>{data.resultBody}</Text>

        <View style={styles.box}>
          <Text style={styles.boxTitle}>Chcesz o tym porozmawiać?</Text>
          <Text>
            Odbiera terapeuta z ośrodka. Rozmowa nie zobowiązuje do przyjazdu i nie
            kończy się ofertą.
          </Text>
          <Text style={styles.phone}>{data.phone}</Text>
          <Text style={{ fontSize: 9, color: MUTED }}>dyżur całą dobę</Text>
        </View>

        <Text style={styles.disclaimer}>{data.disclaimer}</Text>

        <View style={styles.footer} fixed>
          <Text>Insieme — ośrodek leczenia uzależnień, Magdalenka</Text>
          <Text>{date}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderScreeningResultPdf(
  data: ScreeningResultPdfData,
): Promise<Buffer> {
  registerFonts();
  return renderToBuffer(<ScreeningResultDocument data={data} />);
}
