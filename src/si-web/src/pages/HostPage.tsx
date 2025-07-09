/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import JSZip from "jszip";
import { SiqXmlParser } from "../utils/siqParser";
import type { SiqPackage } from "../types/siq";
import type { Team } from "../types/teams";
import type { GameState } from "../types/game";

export default function HostPage() {
    const [game, setGame] = React.useState<GameState>({ packFile: null, packContent: null, teams: [] });
    const [connection, setConnection] = React.useState<any>(null);

    const test = () => {
        console.log(connection);
    };

    const handlePackFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);
            const contentXmlFile = zip.file('content.xml');
            if (contentXmlFile) {
                const xmlContent = await contentXmlFile.async('text');
                const parsedPackage = SiqXmlParser.parseXml(xmlContent);
                setGame({ teams: game.teams, packFile: zip, packContent: parsedPackage });
            }
        }
    };

    const startPresentation = () => {
        // @ts-expect-error - Presentation API types are not available yet
        const presentationRequest = new PresentationRequest("./presentation");
        presentationRequest.start()
            .then((connection: any) => {
                setConnection(connection);
                console.log('Connected', connection);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

    const closePresentation = () => {
        if (connection) {
            connection.terminate();
            setConnection(null);
            console.log('Connection closed');
        }
    }

    const startGame = () => { }

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Новая игра</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' }}>

                <div>
                    <h3>Пак</h3>
                    <input
                        // style={{ border: '2px dashed #ccc', padding: '5px', width: '300px', borderRadius: '8px' }}
                        type="file"
                        onChange={handlePackFileSelect}
                        accept=".siq"
                    />

                    {game.packContent && (<PackDetails pack={game.packContent} />)}
                </div>

                <div >
                    <h3>Команды</h3>
                    {game.teams.map((team, i) => (
                        // <TeamRow team={team} key={i} />
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <p>
                                {team.name}
                            </p>
                            <button onClick={() => setGame(prev => ({ ...prev, teams: prev.teams.filter((_, index) => index !== i) }))}>
                                Удалить
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        placeholder="Введите название команды"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                                setGame(prev => ({ ...prev, teams: [...prev.teams, { name: (e.target as HTMLInputElement).value.trim(), score: 0 }] }));
                            }
                        }}
                        style={{ padding: '0.5rem', width: '300px', borderRadius: '0.5rem' }}
                    />
                </div>

            </div>

            <div style={{ marginTop: 54, textAlign: "center" }}>
                <button onClick={test}>
                    Test
                </button>
                {connection && connection.state === 'connected' ? (
                    <button onClick={closePresentation}>
                        Закрыть экран
                    </button>
                ) : (
                    <button onClick={startPresentation}>
                        Вывести на экран
                    </button>
                )}
                <button onClick={startGame}>
                    Начать
                </button>
            </div>
        </div>
    );
}

function PackDetails({ pack }: { pack: SiqPackage }) {
    return (
        <div>
            <h3>Информация о пакете:</h3>
            <p><strong>Название:</strong> {pack.name}</p>
            <p><strong>Версия:</strong> {pack.version}</p>
            <p><strong>Дата:</strong> {pack.date}</p>
            <p><strong>Сложность:</strong> {pack.difficulty}</p>
            <p><strong>Авторы:</strong> {pack.info.authors.join(', ')}</p>
            <p><strong>Раундов:</strong> {pack.rounds.length}</p>

            <details>
                <summary>Раунды</summary>
                {pack.rounds.map((round, index) => (
                    <div key={index} >
                        <p>Раунд {index + 1}: {round.name}</p>
                        <p>Тем: {round.themes.length}</p>
                        {round.themes.map((theme, themeIndex) => (
                            <div key={themeIndex} >
                                <strong>{theme.name}</strong> ({theme.questions.length} вопросов)
                            </div>
                        ))}
                    </div>
                ))}
            </details>
        </div>
    );
}