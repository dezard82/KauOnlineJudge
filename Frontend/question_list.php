<!doctype html>
<html>
<head>
    <?php include "html/head.html" ?>
    <title>KAU Online Judge</title>
</head>
<body>
    <?php include "html/menu_bar.php" ?>
    
    <div class="container">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>#</th>
                    <th>문제 이름</th>
                    <th>태그</th>
                    <th>채점</th>
                    <th>정답자 수</th>
                    <th>정답률</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    //디렉토리를 스캔한다
                    $dir = scandir('question');
                    foreach ($dir as $file)
                    {
                        if ($file[0] == '.') continue;
                        $num = substr($file, 0, -5);
                        $json = json_decode(file_get_contents("question/".$file), true);
                        echo '
                        <tr>
                            <td>'.$num.'</td>
                            <td><a href="http://115.136.47.152/question.php?num='.$num.'">'.$json['name'].'</a></td>
                            <td>';
                        foreach ($json['table']['tag'] as $tag)
                        {
                            echo '<span class=';
                            switch ($tag)
                            {
                                case "쉬움": echo '"easy"'; break;
                                case "중간": echo '"medium"'; break;
                                case "어려움": echo '"hard"'; break;
                                default: echo '"tag"'; break;
                            }
                            echo '>'.$tag.'</span> ';
                        }
                        echo '</td>
                            <td><span class="correct">정답</span></td>
                            <td>'.$json['table']['cnt_correct'].'</td>
                            <td>'.$json['table']['pcnt_correct'].'%</td>
                        </tr>';
                    }
                ?>
            </tbody>
        </table>
    </div>

    <?php include "html/footer.html" ?>
</body>
</html>