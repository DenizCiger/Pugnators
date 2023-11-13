# HTL-Party Project Description

The fun party game for HTL students!

## Static Part

For the static part, we are researching how to create an online multiplayer browser game. This can be a complex topic and we will most likely use all subtopics of it in our Dynamic Part (the web app).
##### Here is a wireframe diagram, showcasing a sketch for some sites in the project.

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
|Professor Robert Reder   | Project Client  |