<?php

    header("Access-Control-Allow-Origin: *");
    include "dbconfig.php";

    $token = $_REQUEST["token"];
    $style = $_REQUEST["style"];

    function utf8ize($d) {
        if (is_array($d)) {
            foreach ($d as $k => $v) {
                $d[$k] = utf8ize($v);
            }
        } else if (is_string ($d)) {
            return utf8_encode($d);
        }
        return $d;
    }

    $resultsArray = array();

    $sessionValidityQuery = "
        SELECT COUNT(username) AS matchingUsername
        FROM users WHERE session_token='$token';
    ";

    $sessionValidityResults = $mysqli->query($sessionValidityQuery);

    while ($row = mysqli_fetch_assoc($sessionValidityResults)) {
        $resultsArray[] = utf8ize($row);
    }

    if ($resultsArray[0]["matchingUsername"]) {

        $insertQuery = "UPDATE saved_style SET style_path='style$style';";

        if ($mysqli->query($insertQuery)) {
            echo "Success!";
        } else {
            echo $mysqli->error;
        }

    } else {
        echo "403 - Unauthorized.";
    }
?>