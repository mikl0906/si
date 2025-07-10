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
            console.log(message)
            console.log('Received message: ' + message.data);

            // paste the message into the container
            const container = document.getElementById("container");
            if (container) {
                container.innerHTML = message.data;
            }

        };
    }

    return <div id="container" className="flex h-screen flex-col items-center justify-center gap-6">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Своя игра</h1>
    </div>
}