### State

The state of the game consists of:

- zip file (.siq) with all the resources and content description
- SiqPackage object - deserialized content.xml from .siq with the description of the content
- GameState - list of teams with their scores. Current round, current question, etc.

### Persistence

The state of the game is persisted using React Context API. It does not persist the state between page reloads. If user reloads the page, the game is lost. It is good to safe the state of the game in the local storage. Zip file cannot be saved as it is too large. Every SiqPackage has a an id property (guid). GameState can save this id and be stored in the local storage. That way if the page is reloaded and the state is lost, user can select the same .siq file, and be offered to continue the game with saved GameState.

### Navigation

Navigation to create new game:

Home page -> New game page -> Host page

### Home page /

Title and a link button to the new game page (/new).

### New game page /new

Host can select the pack file (.siq), create teams, and start a game (link to /host).

### Host page /host

Displays the host (private) state of the game with controls.
Host can start and end presentation on external display Presentation displays /presentation page. 

/host page on host devide and /presentation page on extenal display are two separate apps that communicate by messages. When the game is started the whole state (including zip file, SiqPackage and GameState) should be sent to /presentation. After that the state on the presentation page is updated by sending updated GameState to it.

### Presentation page /presentation

Displays the presentation (public) state of the game.

### TODO

- Complete the SiqPackage type description (it is not finished). The types were taken from [SI on github](https://github.com/VladimirKhil/SI). Fix the SiqXmlParser accordingly
- Create type for messages between /host and /presentation pages. Maybe sparse object is fine?
- Create /host page components
- Create /presentation page components