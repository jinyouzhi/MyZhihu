<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/


function paginate($page = 1, $limit = 16)
{
    $limit = $limit ?: 16;
    $skip = ($page ? $page - 1 : 0) * $limit;
    return [$limit, $skip];
}

function err($msg = null)
{
    return ['status' => 0, 'msg' => $msg];
}

function suc($data_to_merge = [])
{
    $data = ['status' => 1, 'data' => []];
    if ($data_to_merge)
        $data['data'] = array_merge($data['data'], $data_to_merge);
    return $data;
}

function is_logged_in()
{
    return session('user_id') ?: false;
}

function user_ins()
{
    return new App\User();
}

function question_ins()
{
    return new App\Question();
}

function answer_ins()
{
    return new App\Answer();
}

function comment_ins()
{
    return new App\Comment();
}

function rq($key = null, $default = null)
{
    if (!$key) {
        return Request::all();
    }
    return Request::get($key, $default);
}

Route::get('/', function () {
    return view('index');
});
Route::group(['prefix' => 'api'], function () {
    Route::group(['prefix' => 'user'], function () {
        Route::any('signup', function () {
            return user_ins()->signUp();
        });
        Route::any('login', function () {
            return user_ins()->login();
        });
        Route::any('logout', function () {
            return user_ins()->logout();
        });
        Route::any('read', function () {
            return user_ins()->read();
        });
        Route::any('change_password', function () {
            return user_ins()->change_password ();
        });
        Route::any('reset_password', function () {
            return user_ins()->reset_password();
        });
        Route::any('validate_reset_password', function () {
            return user_ins()->validate_reset_password();
        });
    });
    Route::group(['prefix' => 'question'], function () {
        Route::any('add', function () {
            return question_ins()->add();
        });
        Route::any('change', function () {
            return question_ins()->change();
        });
        Route::any('read', function () {
            return question_ins()->read();
        });
        Route::any('remove', function () {
            return question_ins()->remove();
        });
    });
    Route::group(['prefix' => 'answer'], function () {
        Route::any('add', function () {
            return answer_ins()->add();
        });
        Route::any('change', function () {
            return answer_ins()->change();
        });
        Route::any('read', function () {
            return answer_ins()->read();
        });
        Route::any('vote', function () {
            return answer_ins()->vote();
        });
    });
    Route::group(['prefix' => 'comment'], function () {
        Route::any('add', function () {
            return comment_ins()->add();
        });
        Route::any('read', function () {
            return comment_ins()->read();
        });
        Route::any('remove', function () {
            return comment_ins()->remove();
        });
    });
});

Route::any('api/timeline','CommonController@timeline');

Route::get('tpl/page/home', function (){
    return view('page.home');
});
Route::get('tpl/page/login', function (){
    return view('page.login');
});
Route::get('tpl/page/signup', function (){
    return view('page.signup');
});
Route::get('tpl/page/question_add', function (){
    return view('page.question_add');
});
Route::get('tpl/page/user', function (){
    return view('page.user');
});



