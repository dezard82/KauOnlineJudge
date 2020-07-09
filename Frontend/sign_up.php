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
            <h4 class="card-title mb-4 mt-1">회원가입</h4>
            <form name="sign_up" action="http://dofh.iptime.org:8000/api/register/" method="POST" target="_blank">
                <!--버그 방지용 빈 input-->
                <div class="form-group">
                    <label for="username">아이디</label>
                    <input 
                    id="username"
                    name="username" 
                    type="username" 
                    class="form-control" 
                    placeholder="username">
                </div>

                <!--이메일-->
                <div class="form-group">
                    <label for="email">이메일</label>
                    <input 
                    id="email"
                    name="email" 
                    type="email" 
                    class="form-control" 
                    placeholder="example@example.com">
                </div>

                <!--비밀번호-->
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    class="form-control" 
                    placeholder="******">
                </div>

                <!--비밀번호 확인-->
                <div class="form-group">
                    <label for="password_check">비밀번호 확인</label>
                    <input 
                    id="password_check"
                    name="password_check" 
                    type="password" 
                    class="form-control" 
                    placeholder="******">
                </div>

                <!--약관 동의-->
                <div class="form-group">
                    <label>약관 동의</label>
                    <div data-toggle="buttons">
                        <label class="btn btn-primary active">
                            <input id="agree" type="checkbox" autocomplete="off" checked>
                        </label>
                        <a href="#">이용약관</a>에 동의합니다.
                    </div>
                </div>
                
                <!--제출하기-->
                <div class="form-group text-center">
                    <button type="button" id="join-submit" class="btn btn-primary" onclick="submit_button()">
                        회원가입<i class="fa fa-check spaceLeft"></i>
                    </button>
                    <button type="button" class="btn btn-warning">
                        가입취소<i class="fa fa-times spaceLeft"></i>
                    </button>
                </div>

                <output></output>

            </form>
        </article>
    </div> <!-- card.// -->
    
    <script>

        function submit_button()
        {
            if (document.getElementById("password").value !== document.getElementById("password_check").value)
                alert("비밀번호와 비밀번호 획인이 서로 같지 않습니다!");
            else
            {
                alert("회원가입에 성공하였습니다!")
                document.sign_up.submit();
                location.href = "http://115.136.47.152/login.php";
            }
        }
    </script>
    <?php include "html/footer.html" ?>
</body>
</html>