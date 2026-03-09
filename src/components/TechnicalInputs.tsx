"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TechnicalParams, CalculationResults } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { ArrowRight, Ruler, AlertCircle, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  values: TechnicalParams;
  onChange: (vals: TechnicalParams) => void;
  onNext: () => void;
  results: CalculationResults;
}

export default function TechnicalInputs({ values, onChange, onNext, results }: Props) {
  const updateField = (field: keyof TechnicalParams, value: any) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Technische Auslegung</CardTitle>
        <CardDescription>Definieren Sie die technischen Kernparameter der PV-Anlage.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activePowerKw">Installierte Wirkleistung (kW)</Label>
                <Input
                  id="activePowerKw"
                  type="number"
                  value={values.activePowerKw}
                  onChange={(e) => updateField('activePowerKw', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distanceM">Leitungslänge zum Anschlusspunkt (m)</Label>
                <Input
                  id="distanceM"
                  type="number"
                  value={values.distanceM}
                  onChange={(e) => updateField('distanceM', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxVoltageDropPercent">Max. zulässiger Spannungsfall (%)</Label>
                <Input
                  id="maxVoltageDropPercent"
                  type="number"
                  step="0.1"
                  value={values.maxVoltageDropPercent}
                  onChange={(e) => updateField('maxVoltageDropPercent', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="parallel" 
                  checked={values.allowParallel}
                  onCheckedChange={(checked) => updateField('allowParallel', !!checked)}
                />
                <Label htmlFor="parallel" className="flex items-center gap-1.5 cursor-pointer">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  Parallele Kabelführung zulassen (NS)
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material">Leitermaterial</Label>
                <Select 
                  value={values.material} 
                  onValueChange={(v) => updateField('material', v)}
                >
                  <SelectTrigger id="material">
                    <SelectValue placeholder="Material wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copper">Kupfer (Cu)</SelectItem>
                    <SelectItem value="aluminium">Aluminium (Al)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lvVoltageV">Niederspannungsebene (V)</Label>
                <Select 
                  value={values.lvVoltageV.toString()} 
                  onValueChange={(v) => updateField('lvVoltageV', parseInt(v))}
                >
                  <SelectTrigger id="lvVoltageV">
                    <SelectValue placeholder="NS wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="400">400 V</SelectItem>
                    <SelectItem value="230">230 V (Einphasig)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mvVoltageV">Mittelspannungsebene (V)</Label>
                <Select 
                  value={values.mvVoltageV.toString()} 
                  onValueChange={(v) => updateField('mvVoltageV', parseInt(v))}
                >
                  <SelectTrigger id="mvVoltageV">
                    <SelectValue placeholder="MS wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10000">10 kV</SelectItem>
                    <SelectItem value="20000">20 kV</SelectItem>
                    <SelectItem value="30000">30 kV</SelectItem>
                    <SelectItem value="35000">35 kV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-6 rounded-xl border border-border/50 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Ruler className="w-5 h-5" />
                <h3>Dimensionierung</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground font-medium">Standard NS-Querschnitt</span>
                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold ${results.lv.isImpractical ? 'text-destructive' : 'text-foreground'}`}>
                      {results.lv.numCables > 1 ? `${results.lv.numCables}x` : ''}{results.lv.standardSizeMm2}
                    </span>
                    <span className="text-sm pb-1 text-muted-foreground font-medium">mm²</span>
                    {results.lv.isImpractical && (
                      <Badge variant="destructive" className="ml-auto text-[10px] h-5">UNPRAKTIKABEL</Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Erf: {results.lv.requiredCrossSectionMm2.toFixed(1)} mm² gesamt</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground font-medium">Standard MS-Querschnitt</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-accent">
                      {results.mv.standardSizeMm2}
                    </span>
                    <span className="text-sm pb-1 text-muted-foreground font-medium">mm²</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Erf: {results.mv.requiredCrossSectionMm2.toFixed(1)} mm² gesamt</p>
                </div>
              </div>

              {results.lv.isImpractical && (
                <div className="flex gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-tight">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>NS-Kabelquerschnitt übersteigt praktische Grenzen (&gt;400 mm² pro Leiter). Parallele Verlegung oder MS-Anschluss empfohlen.</p>
                </div>
              )}
            </div>

            <p className="text-[10px] text-muted-foreground mt-6 italic">
              Nutzen Sie diese Querschnitte zur Kostenschätzung in Schritt 2.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onNext} className="gap-2">
            Weiter zur Kostenschätzung <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}