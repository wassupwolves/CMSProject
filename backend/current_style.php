<?php

    header("Access-Control-Allow-Origin: *");
    include "dbconfig.php";

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

    $styleQuery = "
        SELECT * FROM saved_style;
    ";

    $styleResults = $mysqli->query($styleQuery);

    while ($row = mysqli_fetch_assoc($styleResults)) {
        $resultsArray[] = utf8ize($row);
    }

    if ($resultsArray[0]["style_path"]) {

        $fname = $resultsArray[0]["style_path"];
        $fullPath = "./styles/" . $fname . ".css";
        $fileContents = fopen($fullPath, "r") or die("Failed to get the current theme");
        echo fread($fileContents, filesize($fullPath));
        fclose($fileContents);

    } else {
        echo "403 - Unauthorized.";
    }
?>