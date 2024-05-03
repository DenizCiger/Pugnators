// script.js

import { Player } from './player.js';

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 600;

let players = [];

// Create players
const player1 = new Player('shadow_dog.png', canvas, ctx);
const player2 = new Player('shadow_dog2.png', canvas, ctx);

players.push(player1, player2);

// Start animation loop for each player
player2.animateLooping(players);
