export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return `R${amount.toFixed(2)}`;
};

export const formatTokens = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${num.toFixed(0)} MAMA`;
};

export const truncateAddress = (address: string, chars = 8): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
