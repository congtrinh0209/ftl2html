<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta http-equiv="Content-type" content="text/html;charset=utf-8"/>
        <title>${gTitle!} g</title>
        <meta http-equiv="Content-Style-Type" content="text/css"/>
        <meta http-equiv="Content-Script-Type" content="text/javascript"/>
        <meta name="Author" content="netease"/>
        <link type="text/css" href="../style/css/base.css" rel="stylesheet"/>
        <script type="text/javascript" src="../js/jquery-1.8.3.js"></script>
    </head>
    <body>
    <#include "/tmpl/test1.ftl">
    <div class="success">
        <h1>${user.name?html}</h1>
        <h2>${realHost}</h2>
        <div>
            <span>服务器时间：</span> <span id="time"></span>
        </div>
        <a href="/demo/test1.jsp">test1.jsp</a>
        <a href="/demo/test2.jsp">test2.jsp</a>
    </div>

    <script type="text/javascript">
    var user = ${JSONObject.fromObject(user)};
    var fids = ${JSONArray.fromObject(user.lockStatus.fids)};
    $.ajax({
        url : '/demo/xhr/user/getServerTime.do',
        success : function (res) {
            $('#time').html(new Date(res.data).toString());
        }
    });
    </script>
    </body>
</html>