<!doctype html>
<html lang="en">
<head>
    <?php echo file_get_contents("html/head.html") ?>
    <title>KAU Online Judge</title>
</head>
<body>
    <?php echo file_get_contents("html/menu_bar.html") ?>

    <div class="container card">
        <article class="card-body">
            <h4 class="card-title mb-4 mt-1">회원가입</h4>

            <form id="login" action="http://dofh.iptime.org:8000/api/register/" method="POST">
                <!--버그 방지용 빈 input-->
                <div class="form-group" style="display:none">
                    <label for="email">아이디</label>
                    <input name="username" type="username" class="form-control" placeholder="username">
                </div>

                <!--이메일-->
                <div class="form-group">
                    <label for="email">이메일</label>
                    <input name="email" type="email" class="form-control" placeholder="example@example.com">
                </div>

                <!--비밀번호-->
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input name="password" type="password" class="form-control" placeholder="******">
                </div>

                <!--비밀번호 확인-->
                <div class="form-group">
                    <label for="password_check">비밀번호 확인</label>
                    <input name="password_check" type="password_check" class="form-control" placeholder="******">
                </div>

                <!--약관 동의-->
                <div class="form-group">
                    <label>약관 동의</label>
                    <div data-toggle="buttons">
                        <label class="btn btn-primary active">
                            <span class="fa fa-check"></span>
                            <input id="agree" type="checkbox" autocomplete="off" checked>
                        </label>
                        <a href="#">이용약관</a>에 동의합니다.
                    </div>
                </div>
                
                <!--제출하기-->
                <div class="form-group text-center">
                    <button type="submit" id="join-submit" class="btn btn-primary">
                        회원가입<i class="fa fa-check spaceLeft"></i>
                    </button>
                    <button type="submit" class="btn btn-warning">
                        가입취소<i class="fa fa-times spaceLeft"></i>
                    </button>
                </div>

            </form>
        </article>
    </div> <!-- card.// -->
    <?php echo file_get_contents("html/footer.html") ?>
</body>
</html>