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
            numberOfFrames: 8,
            offset: { x: 7, y: 0 },
            framesHold: 10
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
            numberOfFrames: 1,
            offset: { x: 7, y: 0 },
            framesHold: 10
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
            numberOfFrames: 5,
            offset: { x: 6, y: 0 },
            framesHold: 11
        },
        {
            actionName: 'running',
            isAttack: false,
            animationSrc: './images/Game-Textures/Characters/Nerd/animations/run.png',
            numberOfFrames: 8,
            offset: { x: 5, y: 2 },
            framesHold: 7
        },
        {
            actionName: 'nlight',
            isAttack: true,
            animationSrc: './images/Game-Textures/Characters/Nerd/animations/default-combo.png',
            numberOfFrames: 12,
            offset: { x: 10, y: 0 },
            framesHold: 5
        },
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
            numberOfFrames: 1,
            offset: { x: 8, y: 0 },
            framesHold: 10
            // Other ability details
        },
        // Define more abilities for Frosty
    ],
    // Define abilities for other characters similarly
  };