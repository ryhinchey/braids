import { CoverageEntry } from "puppeteer";
import { Coverages } from './types';
import calculateCoverage from './calculateCoverage';

const coverage: CoverageEntry[] = [
  {
    url: 'http://asset-one',
    text: 'fdsafdafdsfdsafdsafdsafdsafdsafdsa',
    ranges: [
      { start: 0, end: 4 },
      { start: 5, end: 11 }
    ]
  }
]

test('calculateCoverage correctly calculates coverage on an array of coverage entries', () => {
  const coverages: Coverages = calculateCoverage(coverage);

  expect(coverages).toEqual({
    'http://asset-one': {
      usedBytes: 10,
      totalBytes: 34
    }
  });
})