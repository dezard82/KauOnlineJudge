function tags (tagList) {
    ret = ``;
    
    tagList.forEach(function (tag) { 
        ret += `<span class="`;
        switch(tag) {
            case('쉬움'): {ret += `easy`; break;}
            case('중간'): {ret += `medium`; break;}
            case('어려움'): {ret += `hard`; break;}
            case('정답'): {ret += `correct`; break;}
            case('오답'): {ret += `wrong`; break;}
            default: {ret += `tag`; break;}
        }
        ret += `">${tag}</span> `; 
    });

    return ret;
}
function copyToClipboard (elementId) {
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

function show (app, code, message, title, body) {
    app.get('*', function (req, res) {
        //에러가 발생하지 않았다면 console에 log를, 발생했다면 error를 출력
        if (code == 200) console.log(message)
        else console.error(message)
        
        res.status(code).render('page', {
            title: title, 
            body: body
        });
    })
}

module.exports.tags = tags;
module.exports.copyToClipboard = copyToClipboard
module.exports.show = show