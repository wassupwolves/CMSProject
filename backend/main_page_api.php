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

    $myArray = array();
    $query = "select name, content, mainpage_id
                from main_pages
                order by mainpage_id";
                
    $result = $mysqli->query($query);

    while($row = mysqli_fetch_assoc($result)) {
        $myArray[] = utf8ize($row);
    }

    echo json_encode($myArray);

    $result->free();
    $mysqli->close();
?>