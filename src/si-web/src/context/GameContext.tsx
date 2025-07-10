import { initialGameState, type GameState } from "@/types/game";
import type { SiqPackage } from "@/types/siq";
import { SiqXmlParser } from "@/utils/siqParser";
import JSZip from "jszip";
import React from "react";

type GameContextType = {
    packFile: JSZip | null;
    packContent: SiqPackage | null;
    loadPackFromFile: (file: File) => Promise<void>;
    game: GameState;
    setGame: React.Dispatch<React.SetStateAction<GameState>>;
};

const GameContext = React.createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [packFile, setPackFile] = React.useState<JSZip | null>(null);
    const [packContent, setPackContent] = React.useState<SiqPackage | null>(null);
    const [game, setGame] = React.useState<GameState>(initialGameState);

    const loadPackFromFile = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        setPackFile(zip);

        const contentXmlFile = zip.file('content.xml');
        if (contentXmlFile) {
            const xmlContent = await contentXmlFile.async('text');
            const parsedPackage = SiqXmlParser.parseXml(xmlContent);
            setPackContent(parsedPackage);
        }
    };

    return (
        <GameContext.Provider value={{
            packFile,
            packContent,
            loadPackFromFile,
            game,
            setGame
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = React.useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}