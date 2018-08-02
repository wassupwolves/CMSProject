<?php
    //set connection variables

    $host = "10.10.16.205";
    $username = "root";
    $password = "Luigi1704372";
    $db_name = "pokemon"; //database name
    //connect to mysql server
    $mysqli = new mysqli($host, $username, $password, $db_name);

    //check if any connection error was encountered
    if(mysqli_connect_errno()) {
    echo "Error: Could not connect to database.";
    exit;
    }
?>