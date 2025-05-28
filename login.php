<?php
session_start();
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT password FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hash);
        $stmt->fetch();

        if (password_verify($password, $hash)) {
            $_SESSION['email'] = $email;  // Guardar email en sesión
            echo "success";
        } else {
            echo "invalid";
        }
    } else {
        echo "notfound";
    }

    $stmt->close();
    $conn->close();
}
?>
