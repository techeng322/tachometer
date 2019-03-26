/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

export interface ConfidenceInterval {
  low: number;
  high: number;
}

export interface SummaryStats {
  size: number;
  min: number;
  max: number;
  arithmeticMean: ConfidenceInterval;
  standardDeviation: number;
  relativeStandardDeviation: number;
}

export function summaryStats(data: number[]): SummaryStats {
  const size = data.length;
  const sum = sumOf(data);
  const arithMean = sum / size;
  const squareResiduals = data.map((val) => (val - arithMean) ** 2);
  // TODO Should we use Bessel's correction (n-1)?
  const variance = sumOf(squareResiduals) / size;
  const stdDev = Math.sqrt(variance);
  const meanMargin = z95 * (stdDev / Math.sqrt(size));
  return {
    size,
    min: Math.min(...data),
    max: Math.max(...data),
    arithmeticMean: {
      low: arithMean - meanMargin,
      high: arithMean + meanMargin,
    },
    standardDeviation: stdDev,
    // aka coefficient of variation
    relativeStandardDeviation: stdDev / arithMean,
    // TODO Should we use the t distribution instead of the standard normal
    // distribution?
  };
}

const z95 = 1.96;

function sumOf(data: number[]): number {
  return data.reduce((acc, cur) => acc + cur);
}
