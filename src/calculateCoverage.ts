import { CoverageEntry } from "puppeteer";
import { Coverages } from './types';

function calculateCoverage(coverage: CoverageEntry[]): Coverages {
  const coverages: Coverages = {};

  for (const entry of coverage) {
    const { url, text, ranges } = entry;

    const totalBytes = text.length;
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
