<?php
    $fp = fopen('/columnTypes.json', 'w');
    fwrite($fp, json_encode($_POST['columnTypes']));
    fclose($fp);
?>