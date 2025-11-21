export interface CalculationParams {
  currentAge: number;
  currentSavings: number;
  annualIncome: number;
  monthlyPersonalExpenses: number; // Renamed
  monthlyRent: number; // New
  incomeGrowth: number;
  buyHouse: boolean;
  houseCost: number;
  buyCar: boolean;
  carCost: number;
  kidsCount: number; // Just count
  kidCost: number;
}

export const CONSTANTS = {
  INFLATION: 2.5,
  INVESTMENT_RETURN: 5.0,
  WITHDRAWAL_RATE: 0.04,
  KID_DEPENDENCY_YEARS: 20,
};

export interface YearData {
  age: number;
  savings: number;
  target: number;
  income: number;
  expenses: number;
  isRetired: boolean;
}

export interface CalculationResult {
  yearsToRetire: number;
  retirementAge: number;
  targetCorpus: number;
  data: YearData[];
  achievable: boolean;
  savingsRate: number;
  theme: 'peace' | 'worry' | 'panic' | 'void'; // Morandi themed emotions
}

export function calculateRetirement(params: CalculationParams): CalculationResult {
  const {
    currentAge,
    currentSavings,
    annualIncome,
    monthlyPersonalExpenses,
    monthlyRent,
    incomeGrowth,
    buyHouse,
    houseCost,
    buyCar,
    carCost,
    kidsCount,
    kidCost,
  } = params;

  // Initial Annual Expenses
  // If buyHouse is TRUE, we assume Rent is eliminated immediately (simplified)
  // Realistically, buying house means: Savings - HouseCost. Expenses = Personal (Rent gone).
  // If buyHouse is FALSE, Expenses = Personal + Rent.
  const annualRent = buyHouse ? 0 : monthlyRent * 12;
  const annualBaseExpenses = (monthlyPersonalExpenses * 12) + annualRent;
  
  const annualKidExpense = kidsCount * kidCost;

  // Savings Rate (Year 0)
  const totalInitialExpenses = annualBaseExpenses + annualKidExpense;
  const savingsRate = annualIncome > 0 ? ((annualIncome - totalInitialExpenses) / annualIncome) * 100 : 0;

  let currentCorpus = currentSavings;
  if (buyHouse) currentCorpus -= houseCost;
  if (buyCar) currentCorpus -= carCost;

  const data: YearData[] = [];
  let age = currentAge;
  const maxYears = 100 - currentAge; 
  let retired = false;
  let yearsToRetire = -1;

  const incomeGrowthRate = incomeGrowth / 100;
  const inflationRate = CONSTANTS.INFLATION / 100;
  const investmentRate = CONSTANTS.INVESTMENT_RETURN / 100;

  let currentAnnualIncome = annualIncome;
  let currentBaseExpenses = annualBaseExpenses;
  let currentKidExpense = annualKidExpense;

  for (let i = 0; i <= maxYears; i++) {
    if (i >= CONSTANTS.KID_DEPENDENCY_YEARS) {
      currentKidExpense = 0;
    } else if (i > 0) {
      currentKidExpense = currentKidExpense * (1 + inflationRate);
    }

    const totalCurrentExpenses = currentBaseExpenses + currentKidExpense;
    const targetCorpus = totalCurrentExpenses / CONSTANTS.WITHDRAWAL_RATE;

    data.push({
      age: age,
      savings: Math.round(currentCorpus),
      target: Math.round(targetCorpus),
      income: Math.round(currentAnnualIncome),
      expenses: Math.round(totalCurrentExpenses),
      isRetired: currentCorpus >= targetCorpus
    });

    if (currentCorpus >= targetCorpus && !retired) {
      retired = true;
      yearsToRetire = i;
    }

    if (!retired) {
       currentAnnualIncome = currentAnnualIncome * (1 + incomeGrowthRate);
       currentBaseExpenses = currentBaseExpenses * (1 + inflationRate);
       
       const annualSavings = currentAnnualIncome - (currentBaseExpenses + currentKidExpense);
       currentCorpus = currentCorpus * (1 + investmentRate) + annualSavings;
    } else {
       currentBaseExpenses = currentBaseExpenses * (1 + inflationRate);
       const expenseWithdrawal = currentBaseExpenses + currentKidExpense;
       currentCorpus = currentCorpus * (1 + investmentRate) - expenseWithdrawal;
       if (i > yearsToRetire + 15) break;
    }

    age++;
  }

  const finalRetirementAge = yearsToRetire === -1 ? -1 : currentAge + yearsToRetire;
  
  let theme: CalculationResult['theme'] = 'peace';
  if (finalRetirementAge === -1 || finalRetirementAge > 75) theme = 'void';
  else if (finalRetirementAge > 60) theme = 'panic';
  else if (finalRetirementAge > 50) theme = 'worry';

  return {
    yearsToRetire: yearsToRetire,
    retirementAge: finalRetirementAge,
    targetCorpus: data[yearsToRetire === -1 ? data.length - 1 : yearsToRetire]?.target || 0,
    data,
    achievable: yearsToRetire !== -1,
    savingsRate,
    theme
  };
}
