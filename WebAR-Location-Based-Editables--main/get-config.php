<?php
    header('Content-Type: application/json');
    echo file_get_contents('./config/model_positions.json');
