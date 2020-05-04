 // 클립보드로 복사하는 기능을 생성
 function copyToClipboard(elementId) {
    // 글을 쓸 수 있는 란을 만든다.
    var aux = document.createElement("input");
    // 지정된 요소의 값을 할당 한다.
    aux.setAttribute("value", document.getElementById(elementId).innerHTML);
    // bdy에 추가한다.
    document.body.appendChild(aux);
    // 지정된 내용을 강조한다.
    aux.select();
    // 텍스트를 카피 하는 변수를 생성
    document.execCommand("copy");
    // body 로 부터 다시 반환 한다.
    document.body.removeChild(aux);
}