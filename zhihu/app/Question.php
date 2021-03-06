<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Request;

class Question extends Model
{

    //创建问题
    public function add()
    {
        //检查用户是否登录
        if (!user_ins()->is_logged_in())
            err('login required');

        //检查是否存在标题
        if (!rq('title'))
            err('required title');

        $this->title = rq('title');
        $this->user_id = session('user_id');

        if (rq('desc')) //如果存在描述就添加描述
            $this->desc = rq('desc');

        //保存
        return $this->save() || $this->users()->attach([session('user_id')]) ?
            ['status' => 1, 'id' => $this->id] :
            ['status' => 0, 'msg' => 'db insert failed'];
    }

    //更改问题
    public function change()
    {
        //检查用户是否登录
        if (!user_ins()->is_logged_in())
            err('login required');

        //检查传参中是否有id
        if (!rq('id'))
            err('id is required');

        //获取指定问题的id
        $question = $this->find(rq('id'));
        if ($question->user_id != session('user_id'))
            err('permission denied');

        if (rq('title'))
            $question->title = rq('title');

        if (rq('desc'))
            $question->desc = rq('desc');

        //更新
        return $question->save() ?
            suc() :
            err('db update failed');
    }

    public function read_by_user_id($user_id)
    {
        $user = user_ins()->find($user_id);
        if (!$user)
            return err('user not exists');

        return suc($this->where('user_id', $user_id)
            ->get()->keyBy('id')->toArray());
    }

    //查看问题API
    public function read()
    {
        //请求参数中是否有id，如果有id直接返回id所在的行
        if (rq('id'))
            return ['status' => 1, 'data' => $this->with('answers_with_user_info')->find(rq('id'))];

        if (rq('user_id')) {
            $user_id = rq('user_id') == 'self' ?
                session('user_id') :
                rq('user_id');
            return $this->read_by_user_id($user_id);
        }

        list($limit, $skip) = paginate(rq('page'), rq('limit'));

        //构建query并返回collection对象
        $r = $this
            ->orderBy('created_at')
            ->limit($limit)
            ->skip($skip)
            ->get(['id', 'title', 'desc', 'user_id', 'created_at', 'updated_at'])
            ->keyBy('id');

        return ['status' => 1, 'data' => $r];
    }

    //删除问题api
    public function remove()
    {
        //判断是否登录
        if (!user_ins()->is_logged_in())
            err('login required');

        if (!rq('id'))
            err('id is required');

        $question = $this->find(rq('id'));
        if (!$question) err('question not exists');

        if (session('user_id') != $question->user_id)
            err('permission denied');

        return $question->delete() ?
            suc() :
            err('db delete failed');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function users()
    {
        return $this
            ->belongsToMany('App\User')
            ->withTimestamps();
    }
    public function answers()
    {
        return $this
            ->hasMany('App\Answer');
    }

    public function answers_with_user_info()
    {
        return $this->answers()->with('user')->with('users');
    }
}
