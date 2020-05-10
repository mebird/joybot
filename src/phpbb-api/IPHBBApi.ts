import { ISlot, IGame } from '../dataclient/data-types';

export interface IPostConfig {
  votecount?: boolean;
  gameInfo?: boolean;
  lynch?: ISlot;
}

interface IPHPBBApi {
  post: (game: IGame, options: IPostConfig) => Promise<void>;
}

export default IPHPBBApi;
