<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


function paginate($page=1, $limit=16)
{
    $limit = $limit?:16;
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

function user_ins()
{
    return new App\User;
}

function question_ins()
{
    return new App\Question;
}

function answer_ins()
{
    return new App\Answer;
}

function comment_ins()
{
    return new App\Comment;
}


//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:api');

Route::any('/', function () {
    return ['version' => 0.1];
});

//User
Route::any('user/signup', function () {
    return user_ins()->signup();
});

Route::any('user/login', function () {
    return user_ins()->login();
});

Route::any('user/logout', function () {
    return user_ins()->logout();
});

Route::any('user/change_password', function () {
    return user_ins()->change_password();
});

Route::any('user/reset_password', function () {
    return user_ins()->reset_password();
});

Route::any('user/validate_reset_password', function () {
    return user_ins()->validate_reset_password();
});

Route::any('user/read', function () {
    return user_ins()->read();
});

//Question
Route::any('question/add', function () {
    return question_ins()->add();
});

Route::any('question/change', function () {
    return question_ins()->change();
});

Route::any('question/read', function () {
    return question_ins()->read();
});

Route::any('question/remove', function () {
    return question_ins()->remove();
});

//Answer
Route::any('answer/add', function () {
    return answer_ins()->add();
});

Route::any('answer/change', function () {
    return answer_ins()->change();
});

Route::any('answer/read', function () {
    return answer_ins()->read();
});

Route::any('answer/vote', function () {
    return answer_ins()->vote();
});

//Comment
Route::any('comment/add', function () {
    return comment_ins()->add();
});

Route::any('comment/read', function () {
    return comment_ins()->read();
});

Route::any('comment/remove', function () {
    return comment_ins()->remove();
});


