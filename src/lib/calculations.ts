export type ConductorMaterial = 'copper' | 'aluminium';

export interface TechnicalParams {
  activePowerKw: number;
  distanceM: number;
  maxVoltageDropPercent: number;
  cosPhi: number;
  material: ConductorMaterial;
  lvVoltageV: number;
  mvVoltageV: number;
  allowParallel: boolean;
}

export interface EconomicParams {
  lvCableCostPerM: number;
  lvInstallCostPerM: number;
  mvCableCostPerM: number;
  mvInstallCostPerM: number;
  transformerCost: number;
  mvStationCost: number;
  additionalMvLumpSum: number;
}

export interface ScenarioDetails {
  currentA: number;
  requiredCrossSectionMm2: number;
  standardSizeMm2: number;
  numCables: number;
  totalCost: number;
  isImpractical: boolean;
}

export interface CalculationResults {
  lv: ScenarioDetails;
  mv: ScenarioDetails;
  delta: number;
  deltaPercent: number;
  recommendation: string;
}

const RHO = {
  copper: 0.0175,
  aluminium: 0.028,
};

const STANDARD_SIZES = [16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400];

function getStandardSize(required: number): number {
  return STANDARD_SIZES.find((s) => s >= required) || 400;
}

export function calculateScenario(
  tech: TechnicalParams,
  econ: EconomicParams
): CalculationResults {
  const {
    activePowerKw,
    distanceM,
    maxVoltageDropPercent,
    cosPhi,
    material,
    lvVoltageV,
    mvVoltageV,
    allowParallel,
  } = tech;

  const rho = RHO[material];

  // LV Calculation
  const lvCurrent = (activePowerKw * 1000) / (Math.sqrt(3) * lvVoltageV * cosPhi);
  const lvDeltaULimit = lvVoltageV * (maxVoltageDropPercent / 100);
  const lvRequiredArea = (Math.sqrt(3) * lvCurrent * distanceM * rho * cosPhi) / lvDeltaULimit;

  // Parallel logic: if enabled and single cable exceeds 150mm2, we use 2 cables
  const lvNumCables = allowParallel && lvRequiredArea > 150 ? 2 : 1;
  const lvStandardSize = getStandardSize(lvRequiredArea / lvNumCables);
  const lvIsImpractical = (lvRequiredArea / lvNumCables) > 400 || (lvCurrent / lvNumCables) > 400;

  const lvTotalCost = (econ.lvCableCostPerM * lvNumCables + econ.lvInstallCostPerM) * distanceM;

  // MV Calculation
  const mvCurrent = (activePowerKw * 1000) / (Math.sqrt(3) * mvVoltageV * cosPhi);
  const mvDeltaULimit = mvVoltageV * (maxVoltageDropPercent / 100);
  const mvRequiredArea = (Math.sqrt(3) * mvCurrent * distanceM * rho * cosPhi) / mvDeltaULimit;

  // Usually MV isn't paralleled for these power levels, keep at 1
  const mvNumCables = 1;
  const mvStandardSize = getStandardSize(mvRequiredArea / mvNumCables);
  const mvIsImpractical = (mvRequiredArea / mvNumCables) > 400;

  const mvTotalCost =
    (econ.mvCableCostPerM * mvNumCables + econ.mvInstallCostPerM) * distanceM +
    econ.transformerCost +
    econ.mvStationCost +
    econ.additionalMvLumpSum;

  const delta = lvTotalCost - mvTotalCost;
  const deltaPercent = (Math.abs(delta) / Math.min(lvTotalCost, mvTotalCost)) * 100;

  let recommendation = '';
  if (lvIsImpractical) {
    recommendation = 'MS-Anschluss technisch erforderlich. NS-Dimensionierung übersteigt praktische Grenzen.';
  } else if (Math.abs(deltaPercent) < 5) {
    recommendation = 'Borderline / Ergebnis hängt von spezifischen Verlegebedingungen ab.';
  } else if (lvTotalCost < mvTotalCost) {
    recommendation = 'NS-Anschluss wirtschaftlich vorteilhaft.';
  } else {
    recommendation = 'MS-Anschluss wirtschaftlich vorteilhaft.';
  }

  return {
    lv: {
      currentA: lvCurrent,
      requiredCrossSectionMm2: lvRequiredArea,
      standardSizeMm2: lvStandardSize,
      numCables: lvNumCables,
      totalCost: lvTotalCost,
      isImpractical: lvIsImpractical,
    },
    mv: {
      currentA: mvCurrent,
      requiredCrossSectionMm2: mvRequiredArea,
      standardSizeMm2: mvStandardSize,
      numCables: mvNumCables,
      totalCost: mvTotalCost,
      isImpractical: mvIsImpractical,
    },
    delta: Math.abs(delta),
    deltaPercent,
    recommendation,
  };
}
