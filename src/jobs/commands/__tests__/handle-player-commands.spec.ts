import {
  handlePlayerCommand,
  PlayerCommands,
} from './../handle-player-command';

import { IVote, ISlot } from './../../../models/data-types';
import { createGame, createPlayers } from '../../../models/create-mocks';

describe('player commands', () => {
  describe('player votes', () => {
    describe('unvotes', () => {
      it('should handle unvotes on a particular player', () => {
        const game = createGame();
        game.players = createPlayers();
        const { players } = game;

        handlePlayerCommand(`/${PlayerCommands.UNVOTE} 1`, '0', game);
        const { voting } = players[0];
        const { votedBy } = players[1];

        expect(voting.length).toBe(1);
        expect(votedBy.length).toBe(1);

        expect(voting[0].slotNumber).toBe(2);
        expect(votedBy[0].slotNumber).toBe(2);
      });
      it('should handle multiple unvotes when there are no arguments', () => {
        const game = createGame();
        game.players = createPlayers();
        const { players } = game;

        handlePlayerCommand(`/${PlayerCommands.UNVOTE}`, '0', game);

        const { voting } = players[0];
        const { votedBy: vb1 } = players[1];
        const { votedBy: vb2 } = players[2];

        expect(voting.length).toBe(0);
        expect(vb1.length).toBe(1);
        expect(vb2.length).toBe(1);
      });
    });
    describe('placing votes', () => {
      it('should not place the vote if the player has multiple votes but no votes left', () => {
        const game = createGame();
        game.players = createPlayers();
        const expected = createGame();
        expected.players = createPlayers();

        handlePlayerCommand(`/${PlayerCommands.VOTE} 3`, '0', game);

        expect(game).toEqual(expected);
      });

      it('should allow a player who is not voting to vote', () => {
        const game = createGame();
        const players = createPlayers();
        game.players = players;
        handlePlayerCommand(`/${PlayerCommands.VOTE} 3`, '4', game);
        const { votedBy } = players[3];
        const { voting } = players[4];
        expect(voting[0].slotNumber).toBe(3);
        expect(votedBy[0].slotNumber).toBe(4);
      });
    });
  });
});