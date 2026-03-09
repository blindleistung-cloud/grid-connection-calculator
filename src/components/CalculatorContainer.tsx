
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TechnicalInputs from './TechnicalInputs';
import CostInputs from './CostInputs';
import ResultsView from './ResultsView';
import { TechnicalParams, EconomicParams, calculateScenario } from '@/lib/calculations';
import { Info, Zap, BarChart3, Calculator } from 'lucide-react';

const initialTech: TechnicalParams = {
  activePowerKw: 150,
  distanceM: 200,
  maxVoltageDropPercent: 3,
  cosPhi: 0.95,
  material: 'copper',
  lvVoltageV: 400,
  mvVoltageV: 20000,
  allowParallel: false,
};

const initialEcon: EconomicParams = {
  lvCableCostPerM: 45,
  lvInstallCostPerM: 30,
  mvCableCostPerM: 65,
  mvInstallCostPerM: 35,
  transformerCost: 25000,
  mvStationCost: 15000,
  additionalMvLumpSum: 5000,
};

export default function CalculatorContainer() {
  const [mounted, setMounted] = useState(false);
  const [tech, setTech] = useState<TechnicalParams>(initialTech);
  const [econ, setEcon] = useState<EconomicParams>(initialEcon);
  const [activeTab, setActiveTab] = useState('technical');

  useEffect(() => {
    setMounted(true);
  }, []);

  const results = useMemo(() => calculateScenario(tech, econ), [tech, econ]);

  if (!mounted) {
    return <div className="min-h-[400px] w-full bg-muted/10 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 mb-6 bg-muted/50">
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">1. Technische Auslegung</span>
            <span className="sm:hidden">Technik</span>
          </TabsTrigger>
          <TabsTrigger value="commercial" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">2. Kostenschätzung</span>
            <span className="sm:hidden">Kosten</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">3. Vergleichsergebnisse</span>
            <span className="sm:hidden">Ergebnis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          <TechnicalInputs 
            values={tech} 
            onChange={setTech} 
            results={results}
            onNext={() => setActiveTab('commercial')} 
          />
        </TabsContent>

        <TabsContent value="commercial">
          <CostInputs 
            values={econ} 
            onChange={setEcon} 
            onNext={() => setActiveTab('results')}
            onBack={() => setActiveTab('technical')}
          />
        </TabsContent>

        <TabsContent value="results">
          <ResultsView 
            tech={tech} 
            results={results} 
            onReset={() => {
              setActiveTab('technical');
              setTech(initialTech);
              setEcon(initialEcon);
            }} 
          />
        </TabsContent>
      </Tabs>

      <Card className="bg-secondary/20 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Info:</strong> Das Tool wählt Standardquerschnitte (16, 25, 35... 400 mm²) basierend auf den Spannungsfall-Anforderungen aus. Bei aktivierter paralleler Verlegung wird die Last auf zwei Leiter aufgeteilt, falls der Querschnitt zu groß wird.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
