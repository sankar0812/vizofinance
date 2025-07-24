// Function to calculate loan payment details
export const calculateLoanPayment = (loanAmount, annualInterestRate, loanTermMonths) => {
  if (loanAmount <= 0 || loanTermMonths <= 0 || annualInterestRate < 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalAmount: 0 };
  }

  const monthlyInterestRate = (annualInterestRate / 100) / 12;

  let monthlyPayment = 0;
  if (monthlyInterestRate === 0) {
    monthlyPayment = loanAmount / loanTermMonths;
  } else {
    monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
  }

  const totalAmount = monthlyPayment * loanTermMonths;
  const totalInterest = totalAmount - loanAmount;

  return {
    monthlyPayment: monthlyPayment.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
  };
};
