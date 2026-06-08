<?php
$page = "home";

if (isset($_GET['page'])) {
    $page = $_GET['page'];
    switch ($page) {
        case "home":
            $page = "home";
            break;
        case "clothes":
            $page = "clothes";
            break;
        case "contact":
            $page = "contact";
            break;
        default:
            header("Location: ?page=home");
            break;
    }
} else {
    header("Location: ?page=home");
}

?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous">
    <link href="assets/style.css" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

</head>

<body class="main-bg">
    <!-- navbar -->
    <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand nav-logo ps-3" href="#">
                <img src="assets/img/nav-logo.png" alt="Bootstrap">
            </a>
        </div>
    </nav>

    <!-- menu -->
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-12 col-md-2 p-3">
                <a class="btn btn-white animated-btn w-100 mb-3" href="?page=home">Home</a>
                <a class="btn btn-white animated-btn w-100 mb-3" href="?page=clothes">Collection</a>
                <a class="btn btn-white animated-btn w-100 mb-3" href="?page=contact">About</a>
            </div>

            <!-- Content -->
            <div class="col-12 col-md-10">
                <div class="card shadow rounded-5 p-3 content-container" style="height: 85vh; overflow: scroll;">
                    <?php include("shared/" . $page . ".php"); ?>
                </div>
            </div>
        </div>
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq"
        crossorigin="anonymous"></script>
</body>
<script>
    function swapImage(swap) {
        const mainImg = swap.closest('.product-card').querySelector('.main-img');
        mainImg.src = swap.src;
    }
</script>

</html>