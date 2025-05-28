<?php
session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(400);
    echo "noemail";
    exit;
}

$email = $_SESSION['email'];

// Generar código OTP de 6 dígitos
$otp = rand(100000, 999999);

// Guardar en sesión
$_SESSION['otp'] = $otp;

// Aquí va tu clave API Resend
$api_key = 're_gk2DKcbD_5c7KwxKrza93RbBVcWawvD6u';

// Preparar el cuerpo para Resend API
$data = [
    'from' => 'Practica de Hablar en Publico <onboarding@resend.dev>', // Cambia esto al remitente que tengas configurado
    'to' => [$email],
    'subject' => 'Tu código de verificación ',
    'html' => "<p>Tu código  es: <strong>$otp</strong></p>"
];

// Usamos cURL para llamar al API
$ch = curl_init('https://api.resend.com/emails');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode == 200 || $httpcode == 202) {
    echo "success";
} else {
    // Opcional: log $response para depurar
    echo "error";
}
