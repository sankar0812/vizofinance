export function calculateEMI(P: number, annualRate: number, n: number): number {
  const r = annualRate / 12 / 100; // Monthly interest rate
  return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

export function getFirstPaymentBreakdown(P: number, annualRate: number, n: number) {
  const emi = calculateEMI(P, annualRate, n);
  const monthlyRate = annualRate / 12 / 100;
  const interest = P * monthlyRate;
  const principal = emi - interest;
  return {
    emi,
    principal,
    interest,
  };
}
