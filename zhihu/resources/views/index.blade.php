<!doctype html>
<html lang="zh" ng-app="zhihu" user-id="{{session('user_id')}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>知乎-发现更大的世界</title>
    <link rel="stylesheet" href="/node_modules/normalize-css/normalize.css">
    <link rel="stylesheet" href="/css/base.css">
    <script src="/node_modules/jquery/dist/jquery.js"></script>
    <script src="/node_modules/angular/angular.js"></script>
    <script src="/node_modules/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="/js/base.js"></script>
</head>
<body>

<div class="navbar clearfix">
    <div class="container">
        <div class="fl">
            <a ui-sref="home" class="navbar-item brand">知乎</a>
            <form ng-submit="Question.go_add_question()" ng-controller="QuestionController" id="quick_ask">
                <div class="navbar-item">
                    <input ng-model="Question.new_question.title" type="text">
                </div>
                <div class="navbar-item">
                    <button type="submit">提问</button>
                </div>
            </form>
        </div>
        <div class="fr">
            <a ui-sref="home" class="navbar-item">首页</a>
            @if(is_logged_in())
                <a ui-sref="user({user_id:'self'})" class="navbar-item">{{session('username')}}</a>
                <a ng-controller="UserController" ng-click="User.logout()" class="navbar-item">注销</a>
            @else
                <a ui-sref="login" class="navbar-item">登陆</a>
                <a ui-sref="signup" class="navbar-item">注册</a>
            @endif
        </div>
    </div>
</div>
<div class="page">
    <div ui-view></div>
</div>
</body>



</html>