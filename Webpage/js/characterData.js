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
            animationSrc: './images/Game-Textures/Characters/Troller/Troller.png',
            numberOfFrames: 1,
            offset: { x: 6, y: 0 },
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
            numberOfFrames: 4,
            offset: { x: 6, y: 0 },
            framesHold: 15
        },
        {
            actionName: 'running',
            isAttack: false,
            animationSrc: './images/Game-Textures/Characters/Nerd/animations/walk.png',
            numberOfFrames: 11,
            offset: { x: 10, y: 0 },
            framesHold: 5
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