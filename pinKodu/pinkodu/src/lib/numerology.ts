export type BirthParts = {
  day: number;
  month: number;
  year: number;
};

export function parseBirthInput(isoDate: string): BirthParts | null {
  if (!isoDate) return null;
  // Expecting YYYY-MM-DD from <input type="date">
  const [y, m, d] = isoDate.split("-").map((v) => Number(v));
  if (!y || !m || !d) return null;
  return { day: d, month: m, year: y };
}

export function sumDigits(value: number): number {
  return Math.abs(value)
    .toString()
    .split("")
    .reduce((acc, ch) => acc + Number(ch), 0);
}

export function reduceToDigit(value: number, options?: { preserveMaster?: boolean }): number {
  const preserveMaster = options?.preserveMaster ?? true;
  let n = Math.abs(value);
  const isMaster = (x: number) => x === 11 || x === 22 || x === 33;
  if (preserveMaster && isMaster(n)) return n;
  while (n > 9) {
    n = sumDigits(n);
    if (preserveMaster && isMaster(n)) return n;
  }
  return n;
}

export function lifePathNumber(parts: BirthParts, options?: { preserveMaster?: boolean }): number {
  const total = sumDigits(parts.day) + sumDigits(parts.month) + sumDigits(parts.year);
  return reduceToDigit(total, { preserveMaster: options?.preserveMaster ?? true });
}

export function dayNumber(parts: BirthParts, options?: { preserveMaster?: boolean }): number {
  return reduceToDigit(parts.day, { preserveMaster: options?.preserveMaster ?? true });
}

export function monthNumber(parts: BirthParts, options?: { preserveMaster?: boolean }): number {
  return reduceToDigit(parts.month, { preserveMaster: options?.preserveMaster ?? true });
}

export function yearNumber(parts: BirthParts, options?: { preserveMaster?: boolean }): number {
  return reduceToDigit(parts.year, { preserveMaster: options?.preserveMaster ?? true });
}

export function personalYearNumber(parts: BirthParts, currentYear: number, options?: { preserveMaster?: boolean }): number {
  const total = sumDigits(parts.day) + sumDigits(parts.month) + sumDigits(currentYear);
  return reduceToDigit(total, { preserveMaster: options?.preserveMaster ?? true });
}

export type PinStrategy = "D-M-Y-L";

// Default PIN strategy: 4 haneli kod = reduce(day) + reduce(month) + reduce(year) + reduce(lifePath, no master)
export function buildPinCode(parts: BirthParts, strategy: PinStrategy = "D-M-Y-L"): string {
  switch (strategy) {
    case "D-M-Y-L": {
      const d = reduceToDigit(parts.day, { preserveMaster: false });
      const m = reduceToDigit(parts.month, { preserveMaster: false });
      const y = reduceToDigit(parts.year, { preserveMaster: false });
      const l = reduceToDigit(lifePathNumber(parts, { preserveMaster: false }), { preserveMaster: false });
      return `${d}${m}${y}${l}`;
    }
    default: {
      const d = reduceToDigit(parts.day, { preserveMaster: false });
      const m = reduceToDigit(parts.month, { preserveMaster: false });
      const y = reduceToDigit(parts.year, { preserveMaster: false });
      const l = reduceToDigit(lifePathNumber(parts, { preserveMaster: false }), { preserveMaster: false });
      return `${d}${m}${y}${l}`;
    }
  }
}

export type NumerologySummary = {
  lifePath: number;
  dayNum: number;
  monthNum: number;
  yearNum: number;
  personalYear: number;
  pin: string;
};

export function calculateFromIsoDate(isoDate: string): NumerologySummary | null {
  const parts = parseBirthInput(isoDate);
  if (!parts) return null;
  const today = new Date();
  const currentYear = today.getFullYear();
  const lifePath = lifePathNumber(parts, { preserveMaster: true });
  const summary: NumerologySummary = {
    lifePath,
    dayNum: dayNumber(parts, { preserveMaster: true }),
    monthNum: monthNumber(parts, { preserveMaster: true }),
    yearNum: yearNumber(parts, { preserveMaster: true }),
    personalYear: personalYearNumber(parts, currentYear, { preserveMaster: true }),
    pin: buildPinCode(parts),
  };
  return summary;
}


