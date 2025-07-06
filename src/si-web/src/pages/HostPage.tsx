/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import JSZip from "jszip";
import { SiqXmlParser } from "../utils/siqParser";
import type { SiqPackage } from "../types/siq";
import type { Team } from "../types/teams";

// @ts-expect-error - Presentation API types are not available yet
const presentationRequest = new PresentationRequest("./presentation");

export default function HostPage() {
    const [connection, setConnection] = React.useState<any>(null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [teams, setTeams] = React.useState<Team[]>([]);
    const [siqPackage, setSiqPackage] = React.useState<SiqPackage | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
        }
    };

    const processFile = async () => {
        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        try {
            console.log('Processing .siq file');

            // Read file as ArrayBuffer for zip processing
            const arrayBuffer = await selectedFile.arrayBuffer();

            // Load the zip file
            const zip = await JSZip.loadAsync(arrayBuffer);

            console.log('Zip contents:');

            // List all files in the zip
            const fileList: string[] = [];
            zip.forEach((relativePath, file) => {
                console.log(`- ${relativePath} (${file.dir ? 'directory' : 'file'})`);
                if (!file.dir) {
                    fileList.push(relativePath);
                }
            });

            // Look for content.xml specifically
            const contentXmlFile = zip.file('content.xml');
            if (contentXmlFile) {
                console.log('Found content.xml, parsing...');

                // Read the XML content
                const xmlContent = await contentXmlFile.async('text');
                console.log('Raw XML content (first 500 chars):', xmlContent.substring(0, 500));

                // Parse XML into typed object
                const parsedPackage = SiqXmlParser.parseXml(xmlContent);
                setSiqPackage(parsedPackage);

                console.log('Parsed SIQ Package:', parsedPackage);
                console.log(`Package name: ${parsedPackage.name}`);
                console.log(`Authors: ${parsedPackage.info.authors.join(', ')}`);
                console.log(`Rounds: ${parsedPackage.rounds.length}`);

                // Log round details
                parsedPackage.rounds.forEach((round, index) => {
                    console.log(`Round ${index + 1}: ${round.name} (${round.themes.length} themes)`);
                    round.themes.forEach((theme, themeIndex) => {
                        console.log(`  Theme ${themeIndex + 1}: ${theme.name} (${theme.questions.length} questions)`);
                    });
                });

            } else {
                console.error('content.xml not found in the archive!');

                // List available files for debugging
                console.log('Available files:');
                fileList.forEach(fileName => {
                    console.log(`  - ${fileName}`);
                });
            }

        } catch (error) {
            console.error('Error processing .siq file:', error);
        }
    };

    const startGame = () => {
        presentationRequest.start()
            .then((connection: any) => {
                setConnection(connection);
                console.log('Connected to ' + connection.url + ', id: ' + connection.id);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

    // const closeGame = () => {
    //     connection.terminate();
    //     setConnection(null);
    //     console.log('Connection closed');
    // }

    // const sendMessage = () => {
    //     connection.send("Hello from the host!");
    // }

    return (
        <div>
            <h1>Новая игра</h1>

            <div>
                <h3>Пак</h3>
                <input
                    style={{ border: '2px dashed #ccc', padding: '5px', width: '300px', borderRadius: '8px' }}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".siq"
                />
            </div>

            <div style={{ marginTop: 54 }}>
                <h3>Команды</h3>
                {teams.map((team) => (
                    <TeamRow team={team} />
                ))}
                <input
                    type="text"
                    placeholder="Введите название команды"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                            setTeams(prev => [...prev, { name: (e.target as HTMLInputElement).value.trim(), score: 0 }]);
                        }
                    }}
                    style={{ marginBottom: '10px', width: '300px' }}
                />
            </div>

            {/* <button onClick={processFile}>
                Обработать файл
            </button> */}

            {/* {siqPackage && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h3>Информация о пакете:</h3>
                    <p><strong>Название:</strong> {siqPackage.name}</p>
                    <p><strong>Версия:</strong> {siqPackage.version}</p>
                    <p><strong>Дата:</strong> {siqPackage.date}</p>
                    <p><strong>Сложность:</strong> {siqPackage.difficulty}</p>
                    <p><strong>Авторы:</strong> {siqPackage.info.authors.join(', ')}</p>
                    <p><strong>Раундов:</strong> {siqPackage.rounds.length}</p>

                    <details style={{ marginTop: '10px' }}>
                        <summary>Подробности раундов</summary>
                        {siqPackage.rounds.map((round, index) => (
                            <div key={index} style={{ marginLeft: '20px', marginTop: '10px' }}>
                                <h4>Раунд {index + 1}: {round.name}</h4>
                                <p>Тем: {round.themes.length}</p>
                                {round.themes.map((theme, themeIndex) => (
                                    <div key={themeIndex} style={{ marginLeft: '20px' }}>
                                        <strong>{theme.name}</strong> ({theme.questions.length} вопросов)
                                    </div>
                                ))}
                            </div>
                        ))}
                    </details>
                </div>
            )} */}

            <div style={{ marginTop: 54 }}>
                {/* <h3>Управление игрой:</h3> */}
                <button onClick={startGame}>
                    Начать
                </button>
                {/* <button onClick={closeGame}>
                    Закрыть
                </button>
                <button onClick={sendMessage}>
                    Отправить сообщение
                </button> */}
            </div>
        </div>
    );
}

function TeamRow({ team }: { team: Team }) {
    return (
        <p>
            {team.name}
        </p>
    );
}