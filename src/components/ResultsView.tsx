"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalculationResults, TechnicalParams } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, AlertTriangle, TrendingDown, Landmark, BarChart as BarChartIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  tech: TechnicalParams;
  results: CalculationResults;
  onReset: () => void;
}

export default function ResultsView({ tech, results, onReset }: Props) {
  const isTechnicallyRestricted = results.lv.isImpractical;
  const isBorderline = results.recommendation.toLowerCase().includes('borderline');

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const chartData = [
    { name: 'NS-Anschluss', cost: results.lv.totalCost, fill: 'var(--color-lv)' },
    { name: 'MS-Anschluss', cost: results.mv.totalCost, fill: 'var(--color-mv)' },
  ];

  const chartConfig = {
    lv: { label: 'Niederspannung', color: 'hsl(var(--primary))' },
    mv: { label: 'Mittelspannung', color: 'hsl(var(--accent))' },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-accent" />
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-2xl font-headline flex items-center justify-between">
            Empfehlung
            {isTechnicallyRestricted ? (
              <Badge variant="destructive" className="animate-pulse">Technische Einschränkung</Badge>
            ) : isBorderline ? (
              <Badge variant="secondary">Nicht eindeutig</Badge>
            ) : (
              <Badge variant="default" className="bg-accent">Wirtschaftliche Entscheidung</Badge>
            )}
          </CardTitle>
          <CardDescription>Basierend auf Leistung, Distanz und Kostenannahmen.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className={`p-4 rounded-full ${isTechnicallyRestricted ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>
              {isTechnicallyRestricted ? <AlertTriangle className="w-12 h-12" /> : <CheckCircle2 className="w-12 h-12" />}
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-xl font-bold">{results.recommendation}</h4>
              <p className="text-muted-foreground leading-relaxed">
                Die Übertragung von <strong>{tech.activePowerKw} kW</strong> über <strong>{tech.distanceM} m</strong> ergibt eine Kostendifferenz von 
                <strong> {formatCurrency(results.delta)}</strong> ({results.deltaPercent.toFixed(1)}%).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-primary" /> Kostenvergleich Visuell
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill === 'var(--color-lv)' ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-primary" /> Wirtschaftliche Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center border">
                  <span className="block text-xs uppercase text-muted-foreground mb-1">NS Gesamtkosten</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(results.lv.totalCost)}</span>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center border">
                  <span className="block text-xs uppercase text-muted-foreground mb-1">MS Gesamtkosten</span>
                  <span className="text-xl font-bold text-accent">{formatCurrency(results.mv.totalCost)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-dashed bg-accent/5">
                <span className="text-sm font-medium">CAPEX Differenz:</span>
                <span className="text-lg font-bold text-primary">
                  {results.deltaPercent > 0 ? (
                    results.lv.totalCost > results.mv.totalCost ? 
                      `MS spart ${formatCurrency(results.delta)}` : 
                      `NS spart ${formatCurrency(results.delta)}`
                  ) : 'Kein Unterschied'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary" /> Technische Zusammenfassung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>NS-Szenario</TableHead>
                <TableHead>MS-Szenario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Standard-Leiter</TableCell>
                <TableCell>
                  {results.lv.numCables}x {results.lv.standardSizeMm2} mm²
                </TableCell>
                <TableCell>
                  {results.mv.numCables}x {results.mv.standardSizeMm2} mm²
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Gesamtquerschnitt</TableCell>
                <TableCell>{(results.lv.numCables * results.lv.standardSizeMm2).toFixed(0)} mm²</TableCell>
                <TableCell>{(results.mv.numCables * results.mv.standardSizeMm2).toFixed(0)} mm²</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bemessungsstrom</TableCell>
                <TableCell>{results.lv.currentA.toFixed(1)} A</TableCell>
                <TableCell>{results.mv.currentA.toFixed(1)} A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Machbarkeit</TableCell>
                <TableCell>
                  {results.lv.isImpractical ? (
                    <span className="text-destructive flex items-center gap-1 font-semibold"><AlertTriangle className="w-3 h-3" /> Unpraktikabel</span>
                  ) : (
                    <span className="text-accent flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Standard</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-accent flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Standard</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button variant="ghost" onClick={onReset} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Neue Berechnung starten
        </Button>
      </div>
    </div>
  );
}