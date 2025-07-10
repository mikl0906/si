/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import type { Round } from "@/types/siq";
import React from "react";

export default function HostPage() {
    const [connection, setConnection] = React.useState<any>(null);
    const { packContent } = useGame();

    const test = () => {
        connection?.send(`${JSON.stringify(RoundComponent({ round: packContent?.rounds[0] }))}`);
    }

    const startPresentation = () => {
        // @ts-expect-error - Presentation API types are not available yet
        const presentationRequest = new PresentationRequest("./presentation");
        presentationRequest.start()
            .then((conn: any) => {
                setConnection(conn);
                console.log('Connected', conn);
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

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Хост</h1>
            <p>{packContent?.name}</p>
            <Button onClick={test} >
                Test
            </Button>
            {!connection ? (
                <Button onClick={startPresentation} >
                    Начать презентацию
                </Button>
            ) : (
                <Button onClick={closePresentation}>
                    Закрыть презентацию
                </Button>
            )}
        </div>
    );
}

function TextComponent({ text }: { text: string }) {
    return <p className="text-center text-lg">{text}</p>;
}

function RoundComponent({ round }: { round: Round }) {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">{round.name}</h2>
            {round.themes.map((theme, index) => (
                <div key={index} className="p-4 border rounded-lg my-2 w-full max-w-md">
                    <h3 className="text-xl font-semibold">{theme.name}</h3>
                    {/* <ul className="list-disc pl-5">
                        {question.answers.map((answer, idx) => (
                            <li key={idx}>{answer}</li>
                        ))}
                    </ul> */}
                </div>
            ))}
        </div>
    );
}