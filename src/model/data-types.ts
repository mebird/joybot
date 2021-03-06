import { Role, Action, InformedTeam } from './role-types';
import { merge } from 'lodash';
import { numOrUndefined } from '../utils/format-utils';

export interface IVote {
  slotNumber: number;
  weight: number;
}

export interface ISlot {
  name: string;
  slotNumber: number;
  history: string[];
  isAlive: boolean;
  voting: IVote[];
  votedBy: IVote[];
  voteWeight: number;
  canSplitVote: boolean;
  extraVotesToLynch: number;
  role?: Role;
  actions?: {
    current: Action[];
    cache: Action[][];
  };
}

export interface IHost {
  name: string;
  hex: string;
}

export type INamed = ISlot | IHost;

export interface IConfig {
  interval: number;
  autolock: boolean;
  majority: number;
  enabled: boolean;
}

export enum GameType {
  VFM = 'VFM',
  SFM = 'SFM',
  TFM = 'TFM',
  CFM = 'CFM',
  GFM = 'GFM',
  EVENT = 'E',
  ALL_STARS = 'ASG',
  EPISODE = 'EP',
  NFM = 'NFM',
  APRILFOOLS = 'AFFM',
  STANDARD = 'STANDARD',
  UNKNOWN = 'UNKNOWN',
}

export enum GamePhaseType {
  NIGHT = 'night',
  DAY = 'day',
  PRE = 'pregame',
  POST = 'postgame',
}

export interface GamePhase {
  type: GamePhaseType;
  no: number;
}

export interface IGameInfo {
  type: GameType;
  gameNumber: number;
  title: string;
  letter?: string;
}

interface IGameMain {
  config: IConfig;
  id: string;
  hosts: IHost[];
  players: ISlot[];
  informedTeams: InformedTeam[];
  lastPost: string;
  phase: GamePhase;
}

export type IGame = IGameMain & Partial<IGameInfo>;

const getInterval = () =>
  numOrUndefined(process.env.DEFAULT_VOTECOUNT_TIMEOUT) || 60;
export const DefaultConfig: IConfig = {
  interval: getInterval(),
  autolock: false,
  majority: 1,
  enabled: true,
};

const DefaultSlot: ISlot = {
  name: '',
  isAlive: true,
  slotNumber: -1,
  voteWeight: 1,
  extraVotesToLynch: 0,
  canSplitVote: false,
  history: null,
  voting: null,
  votedBy: null,
};

export const createSlot = (config?: Partial<ISlot>): ISlot =>
  merge({}, DefaultSlot, { history: [], voting: [], votedBy: [] }, config);

export const createGame = (id: string, info: IGameInfo): IGame =>
  merge(
    {
      id,
      hosts: [],
      players: [],
      informedTeams: [],
      config: { ...DefaultConfig, interval: getInterval() },
      lastPost: '0',
      phase: {
        type: GamePhaseType.PRE,
        no: 0,
      },
    },
    { ...info }
  );

export const createInfo = (config?: Partial<IGameInfo>): IGameInfo =>
  merge(
    {
      type: GameType.UNKNOWN,
      gameNumber: 0,
      title: '???',
    },
    config
  );

export default DefaultConfig;
