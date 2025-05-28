<?php
session_start();

if (!isset($_SESSION['otp'])) {
    echo "invalid";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input_otp = $_POST['otp'] ?? '';

    if ($input_otp == $_SESSION['otp']) {
        // OTP correcto
        unset($_SESSION['otp']);  // borrar OTP para no reutilizar
        echo "valid";
    } else {
        echo "invalid";
    }
} else {
    echo "invalid";
}
