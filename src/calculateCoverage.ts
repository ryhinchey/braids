import { CoverageEntry } from "puppeteer";

interface Coverages {
  [index: string]: {
    usedBytes: number;
    totalBytes: number;
  };
}

function calculateCoverage(coverage: CoverageEntry[]) {
  let coverages: Coverages = {};

  for (let entry of coverage) {
    const { url, text, ranges } = entry;

    let totalBytes = text.length;
    let usedBytes = 0;

    for (const range of ranges) {
      usedBytes += range.end - range.start;
    }

    if (coverages[url]) {
      coverages[url].usedBytes = coverages[url].usedBytes + usedBytes;
    } else {
      coverages[url] = { usedBytes, totalBytes };
    }
  }

  return coverages;
}

export default calculateCoverage;
