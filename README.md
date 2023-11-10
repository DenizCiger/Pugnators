# HTL-Party Project Description

The fun party game for HTL students!

## Static Part

For the static part, we are researching how to create an online multiplayer browser game.
This includes the following stuff:
- Networking: Learn about different networking architectures for games. Understand concepts like **client-server models**, **peer-to-peer connections**, and **latency reduction**.
- WebSockets: Explore how to  implement **real-time communication** between clients and servers. WebSockets are often used to create **responsive** and **interactive multiplayer experiences**.

- Frameworks: Consider, if we should use frameworks like **[Phaser.js](https://phaser.io/)** for our project. Frameworks like it can provide **tools** to streamline the **development process**.

- Security: Ensure the security of our game by learning about **authentication**, **authorization**, and **data encryption**. We don't want any unwanted guests crashing our virtual party!

- Database Integration: Research databases that can handle **real-time updates** and **store player data**. This is **crucial** for **maintaining player progress** and **managing in-game assets**.

- Scalability: Explore **strategies to scale our game** as the number of players increases. This includes **load balancing**, **server clusters**, and **other techniques** to **maintain performance**.

- Frontend and Backend Development: Brush up on our frontend skills (**HTML, CSS, JavaScript**) for the **user interface**, and delve into backend technologies (**Node.js, Django, Flask**) for **handling game logic** and **data storage**.

- Testing and Debugging: Learn about **testing methodologies** for multiplayer games. Debugging in **real-time environments** can be a challenge, so it's **good to be prepared**.

- User Experience (UX) Design: Understand the principles of designing an **engaging** and **intuitive user interface**. A **smooth user experience** is crucial for player retention.

- Monetization Strategies: If we plan to monetize our game, researching different models like **in-app purchases**, **ads**, or **subscriptions** is a must-have. Find out what works best for our target audience.

![](htlparty.svg)
 
## Dynamic Part

For the Dynamic Part, our Plan is to create "HTL-Party", which is an exciting web game inspired by the popular Mario Party series, but as an online multiplayer web game. This project aims to provide an engaging and entertaining experience for HTL (Höhere Technische Lehranstalt) students. This also helps them to socialize more with other students and study HTL subjects in fun ways.

### People will be able to...
- Host Lobbies
- Join public lobbies to meet new People
- Join private lobbies of their friends or classmates with a code

### Hosts of lobbies will be able to...
- Change the lobby visibility (public or private)
- Set the max number of players for their lobby
- Toggle on/off specific minigames
- Toggle on/off In-Game Chat
- Decide wether player's are allowed to choose their character
- Set the win conditions for the game, such as the player with the most stars at the end of the game, or the first to reach the finish line
- Control the availability and frequency of power-ups or items
- Set time limits for each player's turn or for the entire game
- Decide whether players are penalized for taking too long with their turn
- Decide the criteria for earning bonus stars at the end of the game
- Toggle on/off the visibility of the scoreboard
- Define the number of rounds

### Game Start
- Players choose their Character (if someone else didn't already choose it)
- Players roll their dices, at the same time, to decide the order in which player's are going to take their turns

### Main Game 
- Game loop:
    1. All players will be asked if they want to use their ability (if they have it available) 
    2. Every Player takes a turn
        - Player turn:
            1. The player rolls the dice
            2. The player moves as many fields as the dice shows
            3. If the player stands on an action field, the corresponding actian will be executed
    3. A random Minigame starts
        1. Player's will get instructions for the minigame
        2. Wait for everyone to press 'proceed'
        3. Minigame starts playing
    4. According to how good the players played, their ability bar will fill
- Game ends, if an ending requirement is met
    - Possible ending requirements (set by the host):
        - A player obtained a certain number of stars
        - A player reached the finish line
        - All set game rounds are over
- After the game ended, one of the following ranking systems will be applied (set by the host):
    - A player reached the finish line:
        - Ranking based on the players' distance to the finish line
    - Round ended because a player reached a certain number of stars:
        - Ranking based on the players' ammount of stars
    - If the players played for a certain numbers of rounds:
        1. Player's will get additional stars based on certain stats
        2. Ranking based on the players' ammount of stars

## Team Members
|Person                   | Profession      |
|-------------------------|-----------------|
|Deniz Ciger              | Project Manager |
|Sebastian Schneiderbauer | Project Member  |
|Adrian Pichler           | Project Member  |
|Marcel Gasteiner         | Project Member  |
|Professor David Klewein  | Project Client  |