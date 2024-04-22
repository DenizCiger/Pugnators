<?php 
session_start();
$pdo = new PDO('mysql:host=localhost;dbname=user', 'root', '');
 
$showFormular = true; //Variable ob das Registrierungsformular anezeigt werden soll

if(isset($_GET['login'])) {
    $username = $_POST['username'];
    $passwort = $_POST['passwort'];
    
    $statement = $pdo->prepare("SELECT * FROM users WHERE username = :username");
    $result = $statement->execute(array('username' => $username));
    $user = $statement->fetch();
        
    //Überprüfung des Passworts
    if ($user !== false && password_verify($passwort, $user['passwort'])) {
        $_SESSION['username'] = $user['username'];
        echo "Erfolgreich eingeloggt.";
        $showFormular = false;
    } else {
        $errorMessage = "Username oder Passwort war ungültig<br>";
    }
    
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link rel="stylesheet" type="text/css" href="Css/login.css">
    </head>
    <body>

    <?php 
        if(isset($errorMessage)) {
            echo $errorMessage;
        }

        if($showFormular) {
    ?>

        <a href="home.html" class="button" id="login-button">Back</a>
        <form action="?login=1" method="post">
        <div class="login-container">
            <h1>Login</h1>
            <div class="input-container">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-container">
                <label for="password">Password</label>
                <input type="password" id="password" name="passwort" required>
            </div>
            <div class="button-container">
                <input type="submit" value="Login" class="button">
            </div>
            <p>No account? <a href="register.php">Register</a></p>
        </div>

        <?php
        }
        ?>
    </body>
</html>