<?php
    header('Access-Control-Allow-Origin: https://localhost:3000');
    $username = $_POST["username"];
    $password = $_POST["password"];
    echo ("Hello from server: $username. Your password is: $password");
?>
