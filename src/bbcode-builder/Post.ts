import { HostISOs, PlayerISOs } from './ISOs';
import {
  Center,
  Size,
  Bold,
  Code,
  Spoiler,
  Newlines,
  Underline,
  List,
} from './TagDecorators';
import { Votecount } from './Votecount';
import { IGame, ISlot } from './../dataclient/data-types';

interface PostMaker {
  withVotecount: () => PostMaker;
  withLynched: (p: ISlot) => PostMaker;
  withInfo: () => PostMaker;
  withISOs: () => PostMaker;
  finish: () => string;
}

export const Post = (game: IGame): PostMaker => {
  const {
    players,
    hosts,
    config: { majority },
    id,
  } = game;
  const post: string[] = [];
  return {
    withVotecount() {
      post.push(Votecount(players, majority));
      return this;
    },
    withLynched({ name }: ISlot) {
      post.push(Center(Size(`${Bold(name)} will be lynched today.`, 150)));
      return this;
    },
    withInfo() {
      post.push(Code(game));
      return this;
    },
    withISOs() {
      post.push(
        Spoiler(
          Newlines([
            Bold(Underline('Hosts')),
            HostISOs(hosts, id),
            Bold(Underline('Playerlist')),
            PlayerISOs(players, id),
          ])
        )
      );
      return this;
    },
    finish: () => Newlines(post),
  };
};
