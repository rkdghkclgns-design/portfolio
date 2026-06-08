import { PC_GAMES, MOBILE_GAMES, CONSOLE_GAMES } from './data/games/index';
import type { GameHistory } from './types';

export const GAME_HISTORY: GameHistory = {
  pc: PC_GAMES,
  mobile: MOBILE_GAMES,
  console: CONSOLE_GAMES
};

export { RESUME_DATA } from './data/resume';
export { PROJECTS } from './data/projects';
export { SKILLS } from './data/skills';
