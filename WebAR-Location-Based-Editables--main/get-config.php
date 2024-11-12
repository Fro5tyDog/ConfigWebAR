<?php
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *'); // Optional: Adjust CORS settings if needed
    echo file_get_contents('./config/model_positions.json');
?>
