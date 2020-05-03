import { applyCommand, Commands } from '../apply-commands';
import DefaultConfig, { IGame, DefaultSlot } from '../../../models/data-types';

const createGame = (): IGame => {
  return {
    config: { ...DefaultConfig },
    id: '430',
    lastVotecount: '430',
    voteCount: { jerry: ['swords'] },
    type: 'SFM',
    number: 50,
    hosts: [{ name: 'jimmy', hex: '#900' }],
    title: 'Test',
    players: [
      { ...DefaultSlot, name: 'jerry', history: [] },
      { ...DefaultSlot, name: 'swords', history: [] },
    ],
  };
};

describe('command parsing tests', () => {
  let oldCommand: string;
  beforeAll(() => {
    oldCommand = process.env.START_COMMAND;
    process.env.START_COMMAND = '!';
  });
  afterAll(() => (process.env.START_COMMAND = oldCommand));

  describe('manage hosts', () => {
    describe('add hosts', () => {
      const name = `marcy`;

      it('should add a host with a hex color', () => {
        const hex = '#900';
        const command = `${Commands.HOST_ADD} ${name} ${hex}`;
        const game = createGame();
        applyCommand(game, command);
        expect(game.hosts[1]).toEqual({ name, hex });
      });
      it('add a host without a hex color', () => {
        const hex = '#000';
        const command = `${Commands.HOST_ADD} ${name}`;
        const game = createGame();
        applyCommand(game, command);
        expect(game.hosts[1]).toEqual({ name, hex });
      });

      it('not add an empty host', () => {
        const game = createGame();
        applyCommand(game, Commands.HOST_ADD);
        expect(game.hosts.length).toEqual(createGame().hosts.length);
      });
    });

    describe('remove hosts', () => {
      it('should remove a host from the game', () => {
        const { hosts: expectedHosts } = createGame();
        expectedHosts.pop();

        const game = createGame();
        const { hosts } = game;
        const { name } = hosts[0];
        const command = `${Commands.HOST_REMOVE} ${name}`;

        applyCommand(game, command);
        expect(hosts).toEqual(expectedHosts);
      });

      it('should not remove a non-existant host', () => {
        const game = createGame();
        applyCommand(game, Commands.HOST_REMOVE);
        expect(game.hosts).toEqual(createGame().hosts);
      });
    });
  });

  describe('manage players', () => {
    describe('add players', () => {
      it('should be able to add multiple players', () => {
        const n1 = 'marcy';
        const n2 = 'dave';
        const game = createGame();
        const command = `${Commands.PLAYER_ADD} ${n1} ${n2}`;
        applyCommand(game, command);
        expect(game.players.map(p => p.name)).toEqual([
          ...createGame().players.map(p => p.name),
          n1,
          n2,
        ]);
      });

      it('should not add the same player twice', () => {
        const game = createGame();
        const name = 'marcy';
        const command = `${Commands.PLAYER_ADD} ${name} ${name}`;
        applyCommand(game, command);
        expect(game.players.map(p => p.name)).toEqual([
          ...createGame().players.map(p => p.name),
          name,
        ]);
      });

      it('should not add a player already included', () => {
        const game = createGame();
        const command = `${Commands.PLAYER_ADD} ${game.players[0].name}`;
        applyCommand(game, command);
        expect(game.players).toEqual(createGame().players);
      });
    });

    describe('replace players', () => {
      it('should be able to replace a player', () => {
        const game = createGame();
        game.players = [
          { ...DefaultSlot, name: 'marcy', history: [] },
          { ...DefaultSlot, name: 'manny', history: [] },
        ];
        game.voteCount = {
          marcy: ['manny'],
          manny: ['marcy'],
        };

        const expectedGame = createGame();
        expectedGame.players = [
          { ...DefaultSlot, name: 'jenny', history: ['marcy'] },
          { ...DefaultSlot, name: 'manny', history: [] },
        ];
        expectedGame.voteCount = {
          jenny: ['manny'],
          manny: ['jenny'],
        };

        const command = `${Commands.PLAYER_REPLACE} marcy jenny`;
        applyCommand(game, command);
        expect(game).toEqual(expectedGame);
      });

      it('should not be able to replace in a player already in the game', () => {
        const game = createGame();
        const command = `${Commands.PLAYER_REPLACE} ${game.players[0].name} ${game.players[1].name}`;
        applyCommand(game, command);
        expect(game).toEqual(createGame());
      });

      it('should not replace if there is an argument that is not defined', () => {
        const game = createGame();
        const command = `${Commands.PLAYER_REPLACE} ${game.players[0].name}`;
        applyCommand(game, command);
        expect(game).toEqual(createGame());
      });
      it('should not replace if the target is not in the game', () => {
        const game = createGame();
        const command = `${Commands.PLAYER_REPLACE} johnnyjingle jamiejunes`;
        applyCommand(game, command);
        expect(game).toEqual(createGame());
      });
    });

    describe('update player attributes', () => {
      it('should be able to update a number attribute', () => {
        const game = createGame();
        const { name, voteWeight } = game.players[0];
        const newWeight = voteWeight + 5;
        const command = `${Commands.CHANGE_WEIGHT} ${name} ${newWeight}`;
        applyCommand(game, command);
        expect(game.players[0].voteWeight).toEqual(newWeight);
      });

      it('should not update a number attribute if given a word', () => {
        const game = createGame();
        const { name, voteWeight } = game.players[0];
        const command = `${Commands.CHANGE_WEIGHT} ${name} mary had a little lamb`;
        applyCommand(game, command);
        expect(game.players[0].voteWeight).toEqual(voteWeight);
      });
    });
  });
});
