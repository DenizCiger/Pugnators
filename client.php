<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
	header('Location: ./php/login.php');
	exit;
}
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Websocket Test</title>
    <script src="https://cdn.socket.io/4.0.1/socket.io.js"></script> <!-- Socket.io CDN -->
    <script defer src="./js/client.js"></script>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column; /* Ensures elements are laid out in a column */
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212;
            overflow: hidden;
            color: white;
        }
        canvas {
            border: 2px solid white;
            background-color: rgb(255, 255, 255);
            max-height: 90vh;
            height: auto;
            width: 100%;
            max-width: 100vw;
            display: block;
            image-rendering: pixelated;
        }
        #playerList {
            display: flex; /* This enables Flexbox for the container */
            flex-direction: row; /* This makes its children align horizontally */
            justify-content: center; /* This centers the children horizontally */
            align-items: center; /* This centers the children vertically */
            gap: 10px; /* Optional: Adds some space between the children */
        }
        p {
            margin: 0px;
            height: 15px;
            font-size: 15px;
        }
    </style>
</head>
<body>
    <p>Welcome back, <?=htmlspecialchars($_SESSION['username'], ENT_QUOTES)?>!</p>
    <canvas width="480" height="270" id="game"></canvas>
    <div id="playerList">
    </div>
</body>
</html>