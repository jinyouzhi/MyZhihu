<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Request;

class Answer extends Model
{
    //添加回答api
    public function add()
    {
        //检查是否登录
        if (!user_ins()->is_logged_in())
            return ['status' => 0, 'msg' => 'login required'];

        //question_id和content不能为空
        if (!rq('question_id') || !rq('content'))
            return ['status' => 0, 'msg' => 'question_id and content are required'];

        //检查问题是否存在
        $question = question_ins()->find(rq('question_id'));
        if (!$question)
            return ['status' => 0, 'msg' => 'question not exists'];

        //检查是否重复回答
        $answered = $this
            ->where(['question_id' => rq('question_id'), 'user_id' => session('user_id')])
            ->count();
        if ($answered)
            return ['status' => 0, 'msg' => 'duplicate answers'];

        //保存数据
        $this->content = rq('content');
        $this->question_id = rq('question_id');
        $this->user_id = session('user_id');

        return $this->save() ?
            ['status' => 1, 'id' => $this->id] :
            ['status' => 0, 'msg' => 'db insert failed'];
    }

    //更新回答api
    public function change()
    {
        //检查是否登录
        if (!user_ins()->is_logged_in())
            return ['status' => 0, 'msg' => 'login required'];

        //检查id和content是否存在
        if (!rq('id') || !rq('content'))
            return ['status' => 0, 'msg' => 'id and content are required'];

        //检查用户
        $answer = $this->find(rq('id'));
        if ($answer->user_id != session('user_id'))
            return ['status' => 0, 'msg' => 'permission denied'];

        //更新数据
        $answer->content = rq('content');
        return $answer->save() ?
            ['status' => 1] :
            ['status' => 0, 'msg' => 'db update failed'];
    }

    //查看回答api
    public function read()
    {
        if (!rq('id') && !rq('question_id'))
            return ['status' => 0, 'msg' => 'id or question_id is required'];

        //查看单个回答
        if (rq('id'))
        {
            $answer = $this->find(rq('id'));
            if (!$answer)
                return ['status' => 0, 'msg' => 'answer not exists'];
            return ['status' => 1, 'data' => $answer];
        }

        //在查看问题前，检查问题是否存在
        if (!question_ins()->find(rq('question_id')))
            return ['status' => 0, 'msg' => 'question not exists'];

        //查看同一问题下的所有回答
        $answers = $this
            ->where('question_id', rq('question_id'))
            ->get()
            ->keyBy('id');

        return ['status' => 1, 'data' => $answers];
    }

    public function vote()
    {
        //检查是否登录
        if (!user_ins()->is_logged_in())
            return ['status' => 0, 'msg' => 'login required'];

        if (!rq('id') || !rq('vote'))
            return ['status' => 0, 'msg' => 'id and vote are required'];

        $answer = $this->find(rq('id'));
        if (!$answer) return ['status' => 0, 'msg' => 'answer not exists'];

        //1赞同2反对
        $vote = rq('vote') <= 1 ? 1 : 2;

        //如果投过票， 清空删除投票结果
        $answer->users()
            ->newPivotStatement()
            ->where('user_id', session('user_id'))
            ->where('answer_id', rq('id'))
            ->delete();

        $answer->users()->attach(session('user_id'), ['vote' => $vote]);
        return ['status' => 1];
    }

    public function users()
    {
        return $this
            ->belongsToMany('App\User')
            ->withPivot('vote')
            ->withTimestamps();
    }
}
