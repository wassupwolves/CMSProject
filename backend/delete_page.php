<?php
    header("Access-Control-Allow-Origin: *");
    include "dbconfig.php";

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
        $deleteQuery = "
            DELETE FROM " . ($isSubPage == "true" ? "sub_pages" : "main_pages") . "
            WHERE name='$pageName';
        ";

        $mysqli->query($deleteQuery);
    } else {
        echo "403 - Unauthorized.";
    }

?>