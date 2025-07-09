import type JSZip from "jszip";
import type { SiqPackage } from "./siq";
import type { Team } from "./teams";

export type GameState = {
    packFile: JSZip | null;
    packContent: SiqPackage | null;
    teams: Team[];
}