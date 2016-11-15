<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;


class User extends Model
{
    //注册API
    public function signup()
    {
        $has_username_and_password = $this->has_username_and_password();
        //检查用户名和密码是否为空
        if(!($has_username_and_password))
            return err('用户名或密码不可为空');

        $username = $has_username_and_password[0];
        $password = $has_username_and_password[1];
        //检查用户名是否存在
        $user_exists = $this
            ->where('username', $username)
            ->exists();
        if ($user_exists)
            return err('用户名已存在');

        //加密密码
        $hashed_password = Hash::make($password);

        //存入数据库
        $user = $this;
        $user->password = $hashed_password;
        $user->username = $username;
        if ($user->save())
        {
            return suc($user->id);
        }
        else
        {
            return err('DB INSERT Failed!!!');
        }
    }

    //登陆API
    public function login()
    {


        $has_username_and_password = $this->has_username_and_password();
        //检查用户名和密码是否为空
        if(!$has_username_and_password)
            return err('username and password are required');

        $username = $has_username_and_password[0];
        $password = $has_username_and_password[1];

        //检查用户是否存在
        $user = $this->where('username', $username)->first();
        if (!$user)
            return err('user not exists');

        //检查密码是否正确
        $hashed_password = $user->password;
        if (!Hash::check($password, $hashed_password))
        {
            return err('invalid password');
        }

        //将用户信息写入Session
        session()->put('username', $user->username);
        session()->put('user_id', $user->id);
        //dd(session()->all());

        return suc($user->id);
    }


    //检查用户名和密码是否为空
    public function has_username_and_password()
    {
        $username = rq('username');
        $password = rq('password');

        if ($username && $password)
            return [$username, $password];
        else
            return false;
    }

    //登出api
    public function logout()
    {
        //清除username
        session()->forget('username');
        //清除user_id
        session()->forget('user_id');
        //清除所有信息
        //session()->flush();
        return ['status' => 1];
        //return redirect('/');
        //dd(session()->all());
    }

    //检测用户是否登录
    public function is_logged_in()
    {
        //如果Session中存在user_id，返回id，否则返回false
        return session('user_id') ?:false;
    }

    //跟改密码api
    public function change_password()
    {
        if (!$this->is_logged_in())
            return err('login required');

        if (!rq('old_password') || !rq('new_password'))
            return err('old_password and new_password are required');

        $user = $this->find(session('user_id'));

        if (!Hash::check(rq('old_password'), $user->password))
            return err('invalid old_password');

        $user->password = bcrypt(rq('new_password'));
        return $user->save() ?
            ['status' => 1]:
            err('db update failed');
    }

    //找回密码
    public function reset_password()
    {
        return 1;
    }

    public function answers()
    {
        return $this
            ->belongsToMany('App\Answer')
            ->withPivot('vote')
            ->withTimestamps();
    }

}
