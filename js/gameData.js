const actionIndexMap = {
    // Movement
    'idle':       0,
    'walking':    1,
    'running':    2,
    'jumping':    3,
    'falling':    4,
    'duck':       5,
    // Light Attacks
    'nlight':    10,
    'slight':    11,
    'dlight':    12,
    'ulight':    13,
    // Air Attacks
    'nair':      20,
    'sair':      21,
    'dair':      22,
    'uair':      23,
    // Heavy Attacks
    'sheavy':    31,
    'dheavy':    32,
    'uheavy':    33,
    // Special Attacks
    'nspecial':  40,
    'sspecial':  41,
    'dspecial':  42,
    'uspecial':  43,
    // Interaction
    'spawn':     50,
    'damaged':   51,
    'hang':      52,
    'pickup':    53,
    'grab':      54,
    'block':     55,
    'dodge':     56,
    // EndGame
    'win':       61,
    'lose':      62,
    // Emotes
    'emote1':   101,
    'emote2':   102,
    'emote3':   103,
};

const characterData = {
    'Troller': [
        {
            actionName: 'info',
            logoSrc: './images/Game-Textures/Characters/Troller/Troller_Icon.png',
            scale: 1
        },
        {
            actionName: 'idle',
            isAttack: false,
            animationSrc: './images/Game-Textures/Characters/Troller/Animations/idle.png',
            offset: { x: 7, y: 0 },
            frameTime: [100, 100, 100, 100, 100, 100, 100, 100]
            // Other ability details
        },
        // Define more abilities for Troller
    ],
    'LeondingChan': [
        {
            actionName: 'info',
            logoSrc: './images/Game-Textures/Characters/LeondingChan/LeondingChan_Icon.png',
            scale: 1
        },
        {
            actionName: 'idle',
            isAttack: false,
            animationSrc: './images/Game-Textures/Characters/LeondingChan/LeondingChan_Front.png',
            offset: { x: 7, y: 0 },
            frameTime: [100]
            // Other ability details
        },
        // Define more abilities for LeondingChan
    ],
    'Nerd': [
        {
            actionName: 'info',
            logoSrc: './images/Game-Textures/Characters/Nerd/Nerd_Icon.png',
            scale: 1,
        },
        {
            actionName: 'idle',
            isAttack: false,
            animationSrc: './images/Game-Textures/Characters/Nerd/animations/idle.png',
            offset: { x: 6, y: 0 },
            frameTime: [70, 70, 70, 70, 70]
        },
        {
            actionName: 'running',
            isAttack: false,
            animationSrc: './images/Game-Textures/Characters/Nerd/animations/run.png',
            offset: { x: 5, y: 2 },
            frameTime: [50, 50, 50, 50, 50, 50, 50, 50]
        },
        {
            actionName: 'nlight',
            isAttack: true,
            animationSrc: './images/Game-Textures/Characters/Nerd/animations/default-combo.png',
            offset: { x: 14, y: 0 }, //character need to move 1 step for each punch
            frameTime: [50, 50, 50, 80, 50, 50, 50, 50, 100, 50, 50] //the 80 for a better looking animation and the 100 so the hand stays up a little bit longer
        },
        {
            actionName: 'jumping',
            isAttack: false,
            animationSrc: './images/Game-Textures/Characters/Nerd/animations/jump.png',
            offset: { x: 7, y: 0 }, //character need to move 1 step for each punch
            frameTime: [20, 30, 40, 50, 50, 50, 250, 40,] //the 80 for a better looking animation and the 100 so the hand stays up a little bit longer
        }
        // Define more abilities for Nerd
    ],
    'Snowy': [
        {
            actionName: 'info',
            logoSrc: './images/Game-Textures/Characters/Snowy/Snowy_Icon.png',
            scale: 1,
        },
        {
            actionName: 'idle',
            isAttack: false,
            animationSrc: './images/Game-Textures/Characters/Snowy/Snowy.png',
            offset: { x: 8, y: 0 },
            frameTime: [100]
            // Other ability details
        },
        // Define more abilities for Frosty
    ],
    // Define abilities for other characters similarly
  };

const spawnPositions = [
    // { x: 960, y: 100 },
    // { x: 960, y: 200 },
    // { x: 960, y: 300 },
    // { x: 960, y: 400 },

    { x:  800, y: 480 },
    { x:  910, y: 480 },
    { x: 1020, y: 480 },
    { x: 1130, y: 480 },
];