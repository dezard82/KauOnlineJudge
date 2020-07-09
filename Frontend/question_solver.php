<!doctype html>
<html>
<head>
    <?php include "html/head.html" ?>
    <title>KAU Online Judge</title>
</head>
<body>
    <?php include "html/menu_bar.php" ?>

    <div class="container">
        <?php 
        #url에 적혀있는 num값을 변수 num에 저장한다
        $num = 0;
        if(isset($_GET['num'])) $num = $_GET['num'];

        #url에 적힌 num이 유효한지 확인한다
        $q = "question/".$num.".json";
        if(!file_exists($q)) {
            echo '<div class="jumbotron text-center">'.$num.'번 문제가 존재하지 않습니다.</div>';
            exit;
        }
    
        #num.json 파일을 찾아 연 뒤 json 함수에 저장한다
        $file = file_get_contents($q);
        $json = json_decode($file, true);
        ?>

        <h1><?php #문제 페이지로 이동
            echo $json['name'].
            '<button 
                type="button" 
                class="btn btn-link"
                onclick="location.href=\'http://115.136.47.152/question.php?num='.$num.'\'">
                문제로
            </button>'
        ?></h1>
        <hr>

        <h6>언어</h6>
        <select
        name="lang"
        id="lang">
            <option value="0">C</option>
            <option value="1">C++</option>
            <option value="2">Java</option>
            <option value="3">Python</option>
        </select>
        <br> <br> <br>
        <h6>소스 코드</h6>
        <textarea
        id="code"
        class="form-control" 
        onkeydown="resize(this)" 
        onkeyup="resize(this)"
        rows="5"></textarea>
        <br>
        <a class="btn btn-primary text-white" role="button">제출</a>
    </div>

    <script>
        function resize(obj) {
            obj.style.height = "1px";
            obj.style.height = (12 + obj.scrollHeight)+"px";
        }
    </script>
    <?php include "html/footer.html" ?>
</body>
</html>