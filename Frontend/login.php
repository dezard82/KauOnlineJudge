<!doctype html>
<html>
<head>
    <?php include "html/head.html" ?>
    <title>KAU Online Judge</title>
</head>
<body>
    <?php include "html/menu_bar.php" ?>
        
    <div class="container card">
        <article class="card-body">
            <a href="http://115.136.47.152/sign_up.php" class="float-right btn btn-outline-primary">회원가입</a>
            <h4 class="card-title mb-4 mt-1">로그인</h4>

            <form name="login" action="http://dofh.iptime.org:8000/api/login/" method="POST">
                <!--버그 방지용 빈 input-->
                <div class="form-group">
                    <label for="username">아이디 / 이메일</label>
                    <input name="username" type="username" class="form-control" placeholder="아이디 / 이메일">
                </div>

                <!--이메일-->
                <div class="form-group" style="display:none">
                    <label for="email">이메일</label>
                    <input name="email" type="email" class="form-control" placeholder="example@example.com">
                </div>

                <!--비밀번호-->
                <div class="form-group">    
                    <!--<a class="float-right" href="#">비밀번호 찾기</a>-->
                    <label for="password">비밀번호</label>
                    <input name="password" type="password" class="form-control" placeholder="******">
                </div>
                
                <!--비밀번호 웹페이지에 저장할지 여부
                <div class="form-group"> 
                    <div class="checkbox">
                        <label> <input type="checkbox"> 비밀번호 저장</label>
                    </div>
                </div>-->

                <!--캡챠-->
                <!--
                <div class="form-group">
                <?php/*
                    $file = file_get_contents('http://dofh.iptime.org:8000/api/captcha/');
                    $json = json_decode($file, true);
                    if ($json['error'] == null) echo '<img src="'.$json['data'].'" />';
                    else echo "captcha image error!"
                     */
                    ?>
                    <input name="captcha" type="captcha" placeholder="captcha">
                </div>
                <br>
                -->
                
                <br>
                
                <!--제출하기-->
                <div class="form-group">
                    <button 
                    type="submit" 
                    class="btn btn-primary btn-block text-white" 
                    role="button"
                    onclick="submit_button()">제출</button>
                </div>

            </form>
        </article>
    </div> <!-- card.// -->
    
    <script type="text/javascript">
        function submit_button()
        {
            document.getElementById("email").value = document.getElementById("username").value;
        }
    </script>

    <?php include "html/footer.html" ?>
</body>
</html>