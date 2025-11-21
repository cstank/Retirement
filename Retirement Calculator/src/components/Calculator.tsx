"use client"

import React, { useState, useMemo } from 'react';
import { translations, Language } from '../lib/i18n';
import { calculateRetirement, CalculationParams, CONSTANTS } from '../lib/calculate';
import { formatCurrency } from '../lib/utils';
import { RetirementChart } from './RetirementChart';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { TrendingUp, Wallet, Home, Car, Baby, Wind, RotateCcw, Plus, Minus, Rocket, Zap, AlertTriangle, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Stepper Component (Vibrant Style)
const Stepper = ({ value, onChange, min = 0, max = 10 }: any) => (
  <div className="flex items-center gap-2 bg-indigo-50/50 rounded-lg p-1 border border-indigo-100">
    <button 
      onClick={() => Math.max(min, value - 1) !== value && onChange(Math.max(min, value - 1))}
      className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-50"
      disabled={value <= min}
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="font-bold text-lg w-6 text-center text-indigo-900">{value}</span>
    <button 
      onClick={() => Math.min(max, value + 1) !== value && onChange(Math.min(max, value + 1))}
      className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-50"
      disabled={value >= max}
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

export function CalculatorApp() {
  const [lang, setLang] = useState<Language>('zh');
  const t = translations[lang];
  const currency = lang === 'zh' ? '¥' : '$';
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';

  const defaultParams: CalculationParams = {
    currentAge: 28,
    currentSavings: 100000,
    annualIncome: 200000,
    monthlyPersonalExpenses: 5000,
    monthlyRent: 3000,
    incomeGrowth: 8,
    buyHouse: false,
    houseCost: 2000000,
    buyCar: false,
    carCost: 200000,
    kidsCount: 0,
    kidCost: 30000,
  };

  const [params, setParams] = useState<CalculationParams>(defaultParams);

  const updateParam = (key: keyof CalculationParams, value: any) => {
    let finalValue = value;
    if (typeof value === 'string') {
      if (value === '') finalValue = 0;
      else finalValue = Number(value);
    }
    setParams(prev => ({ ...prev, [key]: finalValue }));
  };

  const getDisplayValue = (val: number) => val === 0 ? '' : val;

  const result = useMemo(() => calculateRetirement(params), [params]);
  
  const toggleLang = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // Theme determination based on result (Vibrant Logic)
  const getTheme = () => {
    switch (result.theme) {
      case 'peace': return { 
        bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50', 
        accent: 'text-emerald-600', 
        icon: Rocket,
        chartColor: '#10b981'
      };
      case 'worry': return { 
        bg: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50', 
        accent: 'text-indigo-600', 
        icon: Zap,
        chartColor: '#6366f1'
      };
      case 'panic': return { 
        bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50', 
        accent: 'text-orange-600', 
        icon: AlertTriangle,
        chartColor: '#f97316'
      };
      case 'void': return { 
        bg: 'bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900 text-white', 
        accent: 'text-red-500', 
        icon: Skull,
        chartColor: '#ef4444'
      };
      default: return { 
        bg: 'bg-gray-50', 
        accent: 'text-gray-600', 
        icon: TrendingUp,
        chartColor: '#6b7280'
      };
    }
  };

  const theme = getTheme();
  const isDark = result.theme === 'void';

  return (
    <div className={`min-h-screen transition-colors duration-700 ease-in-out p-4 md:p-8 font-sans ${theme.bg}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg shadow-lg ${isDark ? 'bg-red-600' : 'bg-gradient-to-r from-violet-600 to-indigo-600'} text-white`}>
                <theme.icon className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 backdrop-blur border rounded-full text-xs font-semibold tracking-wider uppercase ${isDark ? 'bg-white/10 border-white/20 text-red-400' : 'bg-white/50 border-indigo-100 text-indigo-600'}`}>
                Retirement Simulator v2.0
              </span>
            </div>
            <h1 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.title}</h1>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.subtitle}</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={toggleLang} 
            className={`rounded-full transition-all duration-300 ${isDark ? 'text-white hover:bg-white/20' : 'hover:bg-white/50 hover:text-indigo-600'}`}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.toggle}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <motion.div 
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Personal Finance */}
            <Card className={`border-0 shadow-xl backdrop-blur-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 ring-1 ${isDark ? 'bg-zinc-800/80 ring-white/10' : 'bg-white/80 ring-white/50'}`}>
              <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              <CardHeader className="pb-4">
                <CardTitle className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Wallet className="w-5 h-5 text-violet-500" />
                  {t.inputs.section_personal}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.inputs.currentAge}</Label>
                    <Input 
                      type="number" 
                      value={getDisplayValue(params.currentAge)}
                      onChange={(e) => updateParam('currentAge', e.target.value)}
                      className={isDark ? 'bg-black/30 border-zinc-700 text-white focus:border-red-500' : 'bg-white/50 focus:border-violet-500'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.inputs.currentSavings}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">{currency}</span>
                      <Input 
                        type="number" 
                        value={getDisplayValue(params.currentSavings)}
                        onChange={(e) => updateParam('currentSavings', e.target.value)}
                        className={`pl-8 ${isDark ? 'bg-black/30 border-zinc-700 text-white focus:border-red-500' : 'bg-white/50 focus:border-violet-500'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.inputs.annualIncome}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">{currency}</span>
                    <Input 
                      type="number" 
                      value={getDisplayValue(params.annualIncome)}
                      onChange={(e) => updateParam('annualIncome', e.target.value)}
                      className={`pl-8 ${isDark ? 'bg-black/30 border-zinc-700 text-white focus:border-red-500' : 'bg-white/50 focus:border-violet-500 font-medium'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.inputs.monthlyPersonalExpenses}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">{currency}</span>
                      <Input 
                        type="number" 
                        value={getDisplayValue(params.monthlyPersonalExpenses)}
                        onChange={(e) => updateParam('monthlyPersonalExpenses', e.target.value)}
                        className={`pl-8 ${isDark ? 'bg-black/30 border-zinc-700 text-white focus:border-red-500' : 'bg-white/50 focus:border-violet-500'}`}
                      />
                    </div>
                   </div>
                   <div className={`space-y-2 transition-opacity ${params.buyHouse ? 'opacity-40' : ''}`}>
                    <Label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.inputs.monthlyRent}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">{currency}</span>
                      <Input 
                        type="number" 
                        disabled={params.buyHouse}
                        value={getDisplayValue(params.monthlyRent)}
                        onChange={(e) => updateParam('monthlyRent', e.target.value)}
                        className={`pl-8 ${isDark ? 'bg-black/30 border-zinc-700 text-white focus:border-red-500' : 'bg-white/50 focus:border-violet-500'}`}
                      />
                    </div>
                   </div>
                </div>

                <div className="space-y-2">
                    <Label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{t.inputs.incomeGrowth}</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={getDisplayValue(params.incomeGrowth)}
                        onChange={(e) => updateParam('incomeGrowth', e.target.value)}
                        className={isDark ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400' : 'bg-emerald-50/50 border-emerald-100 text-emerald-700'}
                      />
                      <span className={`absolute right-3 top-2.5 font-bold ${isDark ? 'text-emerald-500' : 'text-emerald-400'}`}>%</span>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Family & Life */}
            <Card className={`border-0 shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-500 ring-1 ${isDark ? 'bg-zinc-800/80 ring-white/10' : 'bg-white/80 ring-white/50'}`}>
              <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-rose-500" />
              <CardContent className="pt-6 space-y-6">
                 
                 {/* Kids */}
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Baby className="w-5 h-5 text-pink-500" />
                       <Label className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{t.inputs.kidsCount}</Label>
                    </div>
                    <Stepper value={params.kidsCount} onChange={(v: any) => updateParam('kidsCount', v)} />
                 </div>
                 
                 <AnimatePresence>
                    {params.kidsCount > 0 && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                         <Label className={`text-xs font-semibold uppercase tracking-wide mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.inputs.kidCost}</Label>
                         <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400">{currency}</span>
                            <Input 
                              type="number" 
                              value={getDisplayValue(params.kidCost)}
                              onChange={(e) => updateParam('kidCost', e.target.value)}
                              className={`pl-8 ${isDark ? 'bg-black/30 border-zinc-700 text-white focus:border-red-500' : 'bg-white border-pink-100 focus:border-pink-500'}`}
                            />
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>

                 {/* House */}
                 <div className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-white/5' : 'bg-white/40 hover:bg-white/60'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                          <Home className="w-5 h-5 text-blue-500" />
                          <Label className={`cursor-pointer font-bold ${isDark ? 'text-white' : 'text-slate-700'}`} htmlFor="buyHouse">{t.inputs.buyHouse}</Label>
                       </div>
                       <Switch id="buyHouse" checked={params.buyHouse} onCheckedChange={(c) => updateParam('buyHouse', c)} className="data-[state=checked]:bg-blue-500" />
                    </div>
                    {params.buyHouse && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-2">
                          <Input 
                            placeholder={t.inputs.houseCost}
                            type="number" 
                            value={getDisplayValue(params.houseCost)}
                            onChange={(e) => updateParam('houseCost', e.target.value)}
                            className={isDark ? 'bg-black/30 border-zinc-700 text-white' : 'bg-white border-blue-100 focus:border-blue-500'}
                          />
                          <p className="text-[10px] text-slate-400 mt-1">{t.results.tooltip}</p>
                       </motion.div>
                    )}
                 </div>

                 {/* Car */}
                 <div className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-white/5' : 'bg-white/40 hover:bg-white/60'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-orange-500" />
                          <Label className={`cursor-pointer font-bold ${isDark ? 'text-white' : 'text-slate-700'}`} htmlFor="buyCar">{t.inputs.buyCar}</Label>
                       </div>
                       <Switch id="buyCar" checked={params.buyCar} onCheckedChange={(c) => updateParam('buyCar', c)} className="data-[state=checked]:bg-orange-500" />
                    </div>
                    {params.buyCar && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-2">
                          <Input 
                            placeholder={t.inputs.carCost}
                            type="number" 
                            value={getDisplayValue(params.carCost)}
                            onChange={(e) => updateParam('carCost', e.target.value)}
                            className={isDark ? 'bg-black/30 border-zinc-700 text-white' : 'bg-white border-orange-100 focus:border-orange-500'}
                          />
                       </motion.div>
                    )}
                 </div>

              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div 
             className="lg:col-span-8 h-full"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <Card className={`border-0 shadow-2xl h-full flex flex-col ring-1 overflow-hidden ${isDark ? 'bg-zinc-900/90 ring-white/10' : 'bg-white/90 ring-white/60'}`}>
              <CardHeader className={`border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-white/50'}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 text-xl ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <theme.icon className={`w-6 h-6 ${theme.accent}`} />
                    {t.results.title}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 flex-1 flex flex-col gap-8">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10' : 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-300'}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.accent}`}>{t.results.yearsToRetire}</span>
                    <div className="flex items-baseline gap-1">
                      {result.achievable ? (
                        <>
                          <span className={`text-5xl font-black tracking-tighter ${theme.accent}`}>{result.yearsToRetire}</span>
                          <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Years</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-red-500">∞</span>
                      )}
                    </div>
                    {result.achievable && (
                       <div className={`mt-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-indigo-400'}`}>
                        Age <span className={isDark ? 'text-white' : 'text-indigo-600'}>{result.retirementAge}</span>
                      </div>
                    )}
                  </div>

                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-300'}`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2 block">{t.results.totalNeeded}</span>
                    <span className={`text-2xl font-bold truncate ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {formatCurrency(result.targetCorpus, currency, locale)}
                    </span>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50/50 border-blue-100 hover:border-blue-300'}`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2 block">{t.results.savingsRate}</span>
                    <div className="flex items-baseline">
                      <span className={`text-4xl font-black tracking-tighter ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {result.savingsRate.toFixed(1)}
                      </span>
                      <span className="text-xl font-bold text-blue-400">%</span>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className={`flex-1 min-h-[350px] rounded-2xl p-4 shadow-inner border ${isDark ? 'bg-black/40 border-white/5' : 'bg-white border-slate-100'}`}>
                   <RetirementChart 
                     data={result.data} 
                     currencySymbol={currency}
                     labelSavings={t.inputs.currentSavings}
                     labelTarget={t.results.financialFreedomParams}
                     color={theme.chartColor}
                   />
                </div>

              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
