<?php
    session_start();
?>
<!--상단바 시작-->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="http://115.136.47.152">항공대 OJ</a> 
    <!--메뉴 드롭다운 버튼-->
    <button 
        class="navbar-toggler" 
        type="button" 
        data-toggle="collapse" 
        data-target="#navbarSupportedContent" 
        aria-controls="navbarSupportedContent" 
        aria-expanded="false" 
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <!--메뉴 시작-->
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown">
                <a 
                    class="nav-link dropdown-toggle" 
                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded="false">
                    문제
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" href="#">추천 문제</a>
                    <a class="dropdown-item" href="#">태그별 문제</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="http://115.136.47.152/question_list.php">문제</a>
                </div>
            </li>
            <li class="nav-item">
                
                <?php
                    if (isset($_SESSION['username']))
                    {
                        $href = "http://115.136.47.152/index.php?p=my_stats.html";
                        echo '<a class="nav-link" href="'.$href.'">'.$_SESSION['username'].'의 정보</a>';
                    }
                    else
                    {
                        $href = "http://115.136.47.152/login.php";
                        echo '<a class="nav-link" href="'.$href.'">내 정보</a>';
                    }
                    
                ?> 
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">랭킹</a>
            </li>
        </ul>

        <?php
            if (isset($_SESSION['username']))
                echo '<a href="http://115.136.47.152/logout.php">로그아웃</a>';
            else echo '<a href="http://115.136.47.152/login.php">로그인</a>';
        ?> 
        <!--검색창-->
        <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="검색" aria-label="Search">
            <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">
                <i class="fa fa-search"></i>
            </button>
        </form>
    </div> <!--메뉴 끝-->
</nav> <!--상단바 끝-->
<br>