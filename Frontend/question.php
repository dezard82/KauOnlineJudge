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

        <!-- 문제 이름 -->
        <div id="problem_name">
            <h1><?php #코드 제출 페이지로 이동
                echo $json['name'].
                '<button 
                    type="button" 
                    class="btn btn-link"
                    onclick="location.href=\'http://115.136.47.152/question_solver.php?num='.$num.'\'">
                    코드 제출
                </button>'
            ?></h1>
        </div>

        <!-- 문제의 시간/메모리 제한과 태그, 제출 정보를 나타내는 table -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>시간 제한</th>
                    <th>메모리 제한</th>
                    <th>태그</th>
                    <th>제출</th>
                    <th>정답자 수</th>
                    <th>정답률</th>
                </tr>
            </thead>
            <tbody>
                </tr>
                <tr>
                    <td><?php echo $json['table']['time_limit'] ?>초</td>
                    <td><?php echo $json['table']['mem_limit'] ?>MB</td>
                    <td>
                    <?php 
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
                        };
                    ?>
                    </td>
                    <td><span class="correct">정답</span></td>
                    <td><?php echo $json['table']['cnt_correct'] ?></td>
                    <td><?php echo $json['table']['pcnt_correct'] ?>%</td>
                </tr>
            </tbody>
        </table> <br>
        
        <div id="problem_info">
            <div id="problem_explanation">
                <h3>문제 설명</h3>
                <p><?php echo $json['info'] ?></p>
            </div><br>
            <div id="problem_input">
                <h3>입력 조건</h3>
                <p><?php echo $json['input'] ?></p>
            </div><br>
            <div id="problem_output">
                <h3>출력 조건</h3>
                <p><?php echo $json['output'] ?></p>
            </div><br><br>

            <?php
            #
                $cnt = 0;
                foreach ($json['sample'] as $sample)
                {
                    echo '
                    <div class="row">'.
                        #예제 입력 시작
                        '<div class="col-md-6">
                            <div class="headline">
                                <h3>예제 입력 '.(string)($cnt + 1).
                                    #예제 입출력 복사를 위한 버튼
                                    '<button 
                                    type="button" 
                                    class="btn btn-link"
                                    onclick="copyToClipboard(\'input_'.(string)$cnt.'\')">
                                        복사
                                    </button>
                                </h3>
                            </div>
                            <pre class="sampledata" id="input_'.(string)$cnt.'">'.
                                $sample['input']
                            .'</pre>
                        </div>'.
                        #예제 입력 끝 / 예제 출력 시작
                        '<div class="col-md-6">
                            <div class="headline">
                                <h3>예제 출력 '.(string)($cnt + 1).
                                #예제 입출력 복사를 위한 버튼
                                '<button 
                                    type="button" 
                                    class="btn btn-link"  
                                    onclick="copyToClipboard(\'output_'.(string)$cnt.'\')">
                                        복사
                                    </button>
                                </h3>
                            </div>
                            <pre class="sampledata" id="output_'.(string)$cnt.'">'.
                                $sample['output']
                            .'</pre>
                        </div>'.
                        #예제 출력 끝
                    '</div>';
                    $cnt += 1;
                }
            ?>
        </div> <!--문제 정보 끝-->
    </div>

    <script>
        // 클립보드로 복사하는 기능을 생성
        function copyToClipboard(elementId) {
            // 글을 쓸 수 있는 란을 만든다.
            var aux = document.createElement("input");
            // 지정된 요소의 값을 할당 한다.
            aux.setAttribute("value", document.getElementById(elementId).innerHTML);
            // body에 추가한다.
            document.body.appendChild(aux);
            // 지정된 내용을 강조한다.
            aux.select();
            // 텍스트를 카피하는 변수를 생성
            document.execCommand("copy");
            // body로 부터 다시 반환 한다.
            document.body.removeChild(aux);
        }
    </script>

    <?php include "html/footer.html" ?>
</body>
</html>