<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
	header('Location: php/login.php');
	exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Websocket Test</title>
    <script src="https://cdn.socket.io/4.0.1/socket.io.js"></script> <!-- Socket.io CDN -->
    <script defer src="./js/client.js"></script>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: rgb(23, 23, 33);
        }
        canvas {
            border: 2px solid white;
            background-color: rgb(255, 255, 255);
        }
        p {
            color: white;
        }
    </style>
</head>
<body>
    <p>Welcome back, <?=htmlspecialchars($_SESSION['username'], ENT_QUOTES)?>!</p>
    <canvas width="480" height="270" id="game"></canvas>
</body>
</html>