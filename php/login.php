<?php 
session_start();

$host_name = 'db5015759728.hosting-data.io';
$database = 'dbs12859313';
$user_name = 'dbu723475';
$password = 'H^3@ah#8f9Mu5]xFN&J{dVYPW[72_%';
$errorMessage = "";
$dbh = null;

try {
  $dbh = new PDO("mysql:host=$host_name; dbname=$database;", $user_name, $password);
  echo "Connected to db!";
} catch (PDOException $e) {
  echo "Fehler!:" . $e->getMessage() . "<br/>";
  die();
}

$showFormular = true; // Variable ob das Registrierungsformular angezeigt werden soll

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    //$credentials = array(
    //    'username' => $username,
    //    'password' => $password
    //);

    //echo '<pre>';
    //print_r($credentials);
    //echo '</pre>';

    $statement = $dbh->prepare("SELECT * FROM users WHERE username = :username");
    $statement->execute(array('username' => $username));
    $user = $statement->fetch();

    if ($user !== false) {
        // Store the result of password verification
        $password_verify_result = password_verify($password, $user['passwort']);

        // Print out the result of password_verify
        echo '<pre>';
        var_dump($password_verify_result);
        echo '</pre>';

        // Based on the result, perform the login check
        if ($password_verify_result) {
           session_regenerate_id();
            $_SESSION['loggedin'] = TRUE;
            $_SESSION['username'] = $user['username'];

            header('Location: client.php');
            //echo "Erfolgreich eingeloggt.";
            $showFormular = false;
        } else {
            $errorMessage = "Username oder Passwort war ungültig<br>";
        }
    } else {
        $errorMessage = "Benutzer nicht gefunden<br>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="../Css/login.css">
</head>
<body>

<?php 
if (isset($errorMessage)) {
    echo $errorMessage;
}

if ($showFormular) {
?>

    <a href="../home.html" class="button" id="login-button">Back</a>
    <form action="" method="post">
    <div class="login-container">
        <h1>Login</h1>
        <div class="input-container">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="input-container">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div class="button-container">
            <input type="submit" value="Login" class="button">
        </div>
        <p>No account? <a href="register.php">Register</a></p>
    </div>
    </form>

<?php
}
?>
</body>
</html>
