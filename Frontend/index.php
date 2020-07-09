<!doctype html>
<html>
<head>
    <?php include "html/head.html" ?>
    <title>KAU Online Judge</title>
</head>
<body>
    <?php include "html/menu_bar.php" ?>
        
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

    <?php include "html/footer.html" ?>
</body>
</html>