/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PresentationPage() {

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
        };
    }

    return <>
        <h1>Своя игра</h1>
    </>
}