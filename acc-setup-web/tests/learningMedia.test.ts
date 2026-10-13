import { describe, expect, test } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { learningTopics } from "../src/lib/learning";
import {
  learningScreenshotAssets,
  learningTopicScreenshots,
  screenshotAssetById,
} from "../src/lib/learningMedia";

// Read native dimensions from the bundled WebP/JPEG headers, not from registry metadata.
function dimensions(bytes: Buffer) {
  if (bytes.toString("ascii", 0, 4) === "RIFF") {
    const chunk = bytes.toString("ascii", 12, 16);
    if (chunk === "VP8X")
      return [1 + bytes.readUIntLE(24, 3), 1 + bytes.readUIntLE(27, 3)];
    if (chunk === "VP8 ")
      return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff];
    if (chunk === "VP8L") {
      const value = bytes.readUInt32LE(21);
      return [(value & 0x3fff) + 1, ((value >>> 14) & 0x3fff) + 1];
    }
  }
  if (bytes.readUInt16BE(0) === 0xffd8) {
    let offset = 2;
    while (offset < bytes.length) {
      if (bytes[offset] !== 0xff) throw new Error("JPEG marker tidak valid");
      const code = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2].includes(code))
        return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
      offset += length + 2;
    }
  }
  throw new Error("Format screenshot tidak didukung");
}
describe("aset screenshot ACC lokal", () => {
  test.each(learningScreenshotAssets)(
    "$id: file, ukuran asli, atribusi dan konteks",
    (asset) => {
      expect(asset.src).toMatch(/^\/media\/acc\/[a-z-]+\.(webp|jpg)$/);
      const bytes = readFileSync("public" + asset.src);
      expect(dimensions(bytes)).toEqual([asset.width, asset.height]);
      expect(bytes.byteLength).toBeGreaterThan(1000);
      expect(asset.creator.length).toBeGreaterThan(5);
      expect(asset.alt.length).toBeGreaterThan(25);
      expect(asset.note.length).toBeGreaterThan(40);
      expect(new URL(asset.sourceUrl).protocol).toBe("https:");
      expect(new URL(asset.originalUrl).protocol).toBe("https:");
      expect(asset.archive).toBe(true);
      expect(asset.versionEvidence === "unknown").toBe(asset.version === null);
    },
  );
  test("registry dideduplikasi dan tidak punya file/ID tanpa pemakaian", () => {
    expect(new Set(learningScreenshotAssets.map((a) => a.id)).size).toBe(
      learningScreenshotAssets.length,
    );
    expect(new Set(learningScreenshotAssets.map((a) => a.src)).size).toBe(
      learningScreenshotAssets.length,
    );
    const references = learningTopics.flatMap((t) => t.screenshots);
    for (const a of learningScreenshotAssets)
      expect(
        references.some((r) => r.assetId === a.id),
        a.id,
      ).toBe(true);
    expect(readdirSync("public/media/acc").sort()).toEqual(
      learningScreenshotAssets.map((a) => a.src.split("/").at(-1)!).sort(),
    );
    expect(screenshotAssetById("unknown")).toBeUndefined();
  });
  test("38 topik dan 68 parameter mendapat referensi dengan penanda/detail sah", () => {
    expect(Object.keys(learningTopicScreenshots).sort()).toEqual(
      learningTopics.map((t) => t.id).sort(),
    );
    const covered: string[] = [];
    for (const topic of learningTopics) {
      expect(topic.screenshots.length, topic.id).toBeGreaterThan(0);
      const keys = topic.screenshots.flatMap((r) =>
        r.markers.flatMap((m) => m.parameterKeys),
      );
      expect([...new Set(keys)].sort(), topic.id).toEqual(
        [...topic.parameterKeys].sort(),
      );
      covered.push(...topic.parameterKeys);
      for (const reference of topic.screenshots) {
        const asset = screenshotAssetById(reference.assetId)!;
        expect(asset).toBeDefined();
        expect(reference.caption.length).toBeGreaterThan(25);
        expect(reference.markers.length).toBeGreaterThan(0);
        expect(new Set(reference.markers.map((m) => m.id)).size).toBe(
          reference.markers.length,
        );
        for (const marker of reference.markers) {
          expect(
            marker.explanation.length,
            topic.id + ":" + marker.id,
          ).toBeGreaterThan(25);
          for (const r of [marker.box, marker.detail]) {
            expect([r.x, r.y, r.width, r.height].every(Number.isFinite)).toBe(
              true,
            );
            expect(r.x).toBeGreaterThanOrEqual(0);
            expect(r.y).toBeGreaterThanOrEqual(0);
            expect(r.width).toBeGreaterThan(0);
            expect(r.height).toBeGreaterThan(0);
            expect(
              r.x + r.width,
              topic.id + ":" + marker.id,
            ).toBeLessThanOrEqual(asset.width);
            expect(
              r.y + r.height,
              topic.id + ":" + marker.id,
            ).toBeLessThanOrEqual(asset.height);
          }
          expect(marker.detail.x).toBeLessThanOrEqual(marker.box.x);
          expect(marker.detail.y).toBeLessThanOrEqual(marker.box.y);
          expect(marker.detail.x + marker.detail.width).toBeGreaterThanOrEqual(
            marker.box.x + marker.box.width,
          );
          expect(marker.detail.y + marker.detail.height).toBeGreaterThanOrEqual(
            marker.box.y + marker.box.height,
          );
        }
      }
    }
    expect(new Set(covered).size).toBe(68);
  });
  test("versi capture bukan tanggal artikel; informasi arsip bukan slider", () => {
    expect(screenshotAssetById("electronics")?.version).toBe("1.7.7");
    expect(screenshotAssetById("electronics")?.versionEvidence).toBe("visible");
    expect(screenshotAssetById("driving-body")?.versionEvidence).toBe(
      "article",
    );
    expect(screenshotAssetById("tyres")?.version).toBeNull();
    expect(
      learningTopicScreenshots.konsumsi[0].markers[0].explanation,
    ).toContain("ESTIMATED");
    expect(learningTopicScreenshots.splitter[0].caption).toContain(
      "tanpa kontrol merah aktif",
    );
    expect(learningTopicScreenshots["aero-balance"][0].caption).toContain(
      "bukan slider",
    );
  });
});
