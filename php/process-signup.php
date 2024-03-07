<?php

if (empty($_POST['username'])) {
    die('Username is required');
}

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    die('Invalid email');
}

if (empty($_POST['password'])) {
    die('Password is required');
}


if ($_POST['password'] !== $_POST['confirm_password']) {
    die('Password and confirm password do not match');
}

if (strlen($_POST['password']) < 5) {
    die('Password must be at least 5 characters long');
}

$password_hash = password_hash($_POST['password'], PASSWORD_DEFAULT);


print_r($_POST);