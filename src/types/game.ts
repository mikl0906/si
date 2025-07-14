import type { Team } from "./teams";

export type GameState = {
    teams: Team[];
    packageId: string;
    currentRoundIndex: number;
    currentThemeIndex: number;
    currentQuestionIndex: number;
}

export const initialGameState: GameState = {
    packageId: '',
    teams: [],
    currentRoundIndex: 0,
    currentThemeIndex: 0,
    currentQuestionIndex: 0,
};