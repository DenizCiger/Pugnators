<?php 
session_start();

$host_name = 'db5015759728.hosting-data.io';
$database = 'dbs12859313';
$user_name = 'dbu723475';
$password = 'H^3@ah#8f9Mu5]xFN&J{dVYPW[72_%';
$errorMessage = "";
$pdo = null;

try {
  $pdo = new PDO("mysql:host=$host_name; dbname=$database;", $user_name, $password);
  echo "Connected to db!";
} catch (PDOException $e) {
  echo "Fehler!:" . $e->getMessage() . "<br/>";
  die();
}
    
?>
<!DOCTYPE html> 
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Register</title>
        <link rel="stylesheet" type="text/css" href="../Css/login.css">
    </head> 
<body>
 
<?php
$showFormular = true; //Variable ob das Registrierungsformular anezeigt werden soll
 
if(isset($_GET['register'])) {
    $error = false;
    $email = $_POST['email'];
    $passwort = $_POST['passwort'];
    $passwort2 = $_POST['passwort2'];
    $username = $_POST['username'];
  
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Bitte eine gültige E-Mail-Adresse eingeben<br>';
        $error = true;
    }     
    if(strlen($passwort) == 0) {
        echo 'Bitte ein Passwort angeben<br>';
        $error = true;
    }
    if($passwort != $passwort2) {
        echo 'Die Passwörter müssen übereinstimmen<br>';
        $error = true;
    }
    
    //Überprüfe, dass die E-Mail-Adresse noch nicht registriert wurde
    if(!$error) { 
        $statement = $pdo->prepare("SELECT * FROM users WHERE username = :username");
        $result = $statement->execute(array('username' => $username));
        $user = $statement->fetch();
        
        if($user !== false) {
            echo 'Dieser Username ist bereits vergeben<br>';
            $error = true;
        }    
    }
    
    //Keine Fehler, wir können den Nutzer registrieren
    if(!$error) {    
        $passwort_hash = password_hash($passwort, PASSWORD_DEFAULT);
        
        $statement = $pdo->prepare("INSERT INTO users (email, passwort, username) VALUES (:email, :passwort, :username)");
        $result = $statement->execute(array('email' => $email, 'passwort' => $passwort_hash, 'username' => $username));
        
        if($result) {  
            echo "Erfolgreich registriert.";
            $showFormular = false;
        } else {
            echo 'Beim Abspeichern ist leider ein Fehler aufgetreten<br>';
        }
    } 
}
 
if($showFormular) {
?>
 
 <a href="../home.html" class="button" id="login-button">Back</a>
        <div class="login-container">
            <h1>Register</h1>
            <form action="?register=1" method="post">
            <div class="input-container">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-container">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="input-container">
                <label for="password">Password</label>
                <input type="password" id="password" name="passwort" required>
            </div>
            <div class="input-container">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="passwort2" required>
            </div>
            <div class="button-container">
                <input type="submit" class="button" value="Register">
            </div>
            </form>
            <p>Already have an account? <a href="login.php">Login</a></p>
        </div>
 
<?php
} //Ende von if($showFormular)
?>
 
</body>
</html>
