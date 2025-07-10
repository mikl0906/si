import type { Team } from "./teams";

export type GameState = {
    teams: Team[];
}

export const initialGameState: GameState = {
    teams: []
};