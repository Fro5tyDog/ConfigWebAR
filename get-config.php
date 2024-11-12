<?php
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *'); // Optional: Adjust CORS settings if needed
    echo file_get_contents('./config/config.json');
?>
