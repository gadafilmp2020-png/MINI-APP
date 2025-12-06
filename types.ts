export enum View {
  GAME = 'GAME',
  UPGRADES = 'UPGRADES',
  REFERRALS = 'REFERRALS',
  ORACLE = 'ORACLE'
}

export interface UserState {
  balance: number;
  energy: number;
  maxEnergy: number;
  multitapLevel: number;
  energyLimitLevel: number;
  rechargeRateLevel: number;
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  level: number;
  type: 'MULTITAP' | 'ENERGY_LIMIT' | 'RECHARGE_SPEED';
  icon: string;
}

export interface ReferralTier {
  level: number;
  percentage: number;
  count: number;
  earnings: number;
}
