<?php

    header("Access-Control-Allow-Origin: *");
    include "dbconfig.php";

    $token = $_REQUEST["token"];
    $pageName = $_REQUEST["newPage"];
    $parentPage = "";

    if (isset($_REQUEST["parentPage"]))
        $parentPage = $_REQUEST["parentPage"];
    else
        $parentPage = "";

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

        $insertQuery = "";

        if ($parentPage != "") { // Is sub page.
            $insertQuery = "INSERT INTO sub_pages (main_page_name, name, content, can_delete)
                                           VALUES ('$parentPage', '$pageName', '<p>Your text here.</p>', 1);";
        } else { // Is main page.
            $insertQuery = "INSERT INTO main_pages (name, content, can_delete)
                                           VALUES ('$pageName', '<p>Your text here.</p>', 1);";
        }

        if ($mysqli->query($insertQuery)) {
            echo "Success!";
        } else {
            echo $mysqli->error;
        }

    } else {
        echo "403 - Unauthorized.";
    }
?>