"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EconomicParams } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  values: EconomicParams;
  onChange: (vals: EconomicParams) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CostInputs({ values, onChange, onNext, onBack }: Props) {
  const updateField = (field: keyof EconomicParams, value: number) => {
    onChange({ ...values, [field]: value || 0 });
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Ökonomische Annahmen</CardTitle>
        <CardDescription>Geben Sie die projektspezifischen Schätzungen für Installations- und Gerätekosten ein.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary border-b pb-2">
              Niederspannung (Szenario A)
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lvCable">Kabelkosten pro Meter (€/m)</Label>
                <Input
                  id="lvCable"
                  type="number"
                  value={values.lvCableCostPerM}
                  onChange={(e) => updateField('lvCableCostPerM', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lvInstall">Verlegekosten / Tiefbau (€/m)</Label>
                <Input
                  id="lvInstall"
                  type="number"
                  value={values.lvInstallCostPerM}
                  onChange={(e) => updateField('lvInstallCostPerM', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-accent border-b pb-2">
              Mittelspannung (Szenario B)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mvCable">Kabelkosten pro Meter (€/m)</Label>
                  <Input
                    id="mvCable"
                    type="number"
                    value={values.mvCableCostPerM}
                    onChange={(e) => updateField('mvCableCostPerM', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mvInstall">Verlegekosten (€/m)</Label>
                  <Input
                    id="mvInstall"
                    type="number"
                    value={values.mvInstallCostPerM}
                    onChange={(e) => updateField('mvInstallCostPerM', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transformer">Transformatorkosten (€)</Label>
                <Input
                  id="transformer"
                  type="number"
                  value={values.transformerCost}
                  onChange={(e) => updateField('transformerCost', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mvStation">MS-Station / Schaltanlage (€)</Label>
                <Input
                  id="mvStation"
                  type="number"
                  value={values.mvStationCost}
                  onChange={(e) => updateField('mvStationCost', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mvLump">Zusätzliche MS-Pauschalen (€)</Label>
                <Input
                  id="mvLump"
                  type="number"
                  value={values.additionalMvLumpSum}
                  onChange={(e) => updateField('additionalMvLumpSum', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Zurück
          </Button>
          <Button onClick={onNext} className="gap-2">
            Vergleich berechnen <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
