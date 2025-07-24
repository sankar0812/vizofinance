export const formatINR = (num) => {
  const n = Number(num) || 0
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)
}