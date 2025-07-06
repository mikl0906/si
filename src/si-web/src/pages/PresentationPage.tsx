/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export default function PresentationPage() {
    const [message, setMessage] = React.useState<string | null>(null);

    // @ts-expect-error - Presentation API types are not available yet
    navigator.presentation.receiver.connectionList.then(list => {
        list.connections.forEach((connection: any) => {
            addConnection(connection);
        });
        list.onconnectionavailable = (event: any) => {
            addConnection(event.connection);
        };
    });

    function addConnection(connection: any) {
        connection.onmessage = (message: any) => {
            console.log('Received message: ' + message.data);
            setMessage(message.data);
        };
    }

    return <>
        <p>Презентация</p>
        <p>Сообщение: {message}</p>
    </>
}