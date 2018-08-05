<?php

    header("Access-Control-Allow-Origin: *");
    include "dbconfig.php";

    $newData = file_get_contents('php://input');
    $token = $_REQUEST["token"];
    $isSubPage = $_REQUEST["isSubPage"];
    $pageName = $_REQUEST["pageName"];

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
        $updateQuery = "
            UPDATE " . ($isSubPage == "true" ? "sub_pages" : "main_pages") . "
            SET content='$newData'
            WHERE name='$pageName';
        ";

        $mysqli->query($updateQuery);
        echo "Success!";
    } else {
        echo "403 - Unauthorized.";
    }
?>