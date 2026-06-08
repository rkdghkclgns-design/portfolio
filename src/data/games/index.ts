import { PC_GAMES } from './pc';
import { MOBILE_GAMES } from './mobile';
import { CONSOLE_GAMES } from './console';
import type { GameHistoryItem } from '../types';

export const ALL_GAMES: GameHistoryItem[] = [
  ...PC_GAMES,
  ...MOBILE_GAMES,
  ...CONSOLE_GAMES,
];

export { PC_GAMES, MOBILE_GAMES, CONSOLE_GAMES };
