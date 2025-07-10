import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/context/GameContext";
import type { SiqPackage } from "@/types/siq";
import React from "react";
import { useNavigate } from "react-router";

export default function NewGamePage() {
    const navigate = useNavigate();
    const { packContent, loadPackFromFile, game, setGame } = useGame();

    const handlePackFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await loadPackFromFile(file);
        }
    };

    const addTeam = (teamName: string) => {
        if (teamName.trim() === "") return;

        setGame(prev => ({
            ...prev,
            teams: [...prev.teams, { name: teamName.trim(), score: 0 }]
        }));
    }

    const removeTeam = (index: number) => {
        setGame(prev => ({
            ...prev,
            teams: prev.teams.filter((_, i) => i !== index)
        }));
    }

    const startGame = () => {
        if (!packContent) {
            alert("Пожалуйста, загрузите пакет перед началом игры.");
            return;
        }

        if (game.teams.length < 2) {
            alert("Добавьте как минимум две команды для начала игры.");
            return;
        }

        navigate("/host");
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Новая игра</h1>

            <div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Пак</h3>
                <Input type="file" accept=".siq" onChange={handlePackFileSelect} />
                {packContent && (<PackDetails pack={packContent} />)}
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Команды</h3>
                {game.teams.map((team, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <p>
                            {team.name}
                        </p>
                        <Button onClick={() => removeTeam(i)}>Удалить</Button>
                    </div>
                ))}
                <div className="flex flex-row gap-2">
                    <Input type="text" placeholder="Название команды" onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                            const teamName = (e.target as HTMLInputElement).value.trim();
                            addTeam(teamName);
                            (e.target as HTMLInputElement).value = ''; // Clear input after adding
                        }
                    }} />
                    <Button onClick={() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (input && input.value.trim()) {
                            addTeam(input.value.trim());
                            input.value = ''; // Clear input after adding
                        }
                    }}>
                        Добавить
                    </Button>
                </div>
            </div>

            <div className="flex flex-row gap-2">
                <Button onClick={startGame}>
                    Начать
                </Button>
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