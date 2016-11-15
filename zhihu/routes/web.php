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


function rq($key = null , $default=null)
{
    if (!$key) return Request::all();
    return Request::get($key, $default);
}


Route::get('/', function () {
    return view('welcome');
});

Route::any('test', function () {
    dd(user_ins()->is_logged_in());
});

Route::any('timeline', 'CommonController@timeline');

