<!doctype html>
<html lang="en">
<head>
    <?php echo file_get_contents("html/head.html") ?>
    <title>KAU Online Judge</title>
</head>
<body>
    <?php echo file_get_contents("html/menu_bar.html") ?>
        
    <!--
        작성할 내용
    -->

    <div class="container">
        <?php 
        $p = "index";
        if(isset($_GET['p'])) $p = $_GET['p'];

        echo file_get_contents("html/".$p.".html");
        ?>
    </div>

    <?php echo file_get_contents("html/footer.html") ?>
</body>
</html>