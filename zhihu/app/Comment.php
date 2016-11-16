<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Request;

class Comment extends Model
{
    //添加评论api
    public function add()
    {
        if (!user_ins()->is_logged_in())
            return ['status' => 0, 'msg' => 'login required'];

        if (!rq('content'))
            return ['status' => 0, 'msg' => 'empty content'];

        //检查是否存在问题id或者回答id
        if (
            (!rq('question_id') && !rq('answer_id')) ||  //none
            (rq('question_di') && rq('answer_id'))       //all
        )
            return ['status' => 0, 'msg' => 'question_id or answer_id is required'];

        //评论问题
        if (rq('question_id'))
        {
            $question = question_ins()->find(rq('question_id'));
            if (!$question) return ['status' => 0, 'msg' => 'question not exists'];
            $this->question_id = rq('question_id');
        }
        //评论答案
        else
        {
            $answer = answer_ins()->find(rq('answer_id'));
            if (!$answer) return ['status' => 0, 'msg' => 'answer not exists'];
            $this->answer_id = rq('answer_id');
        }

        //检查是否存在回复
        if (rq('reply_to'))
        {
            $target = $this->find(rq('reply_to'));
            if (!$target)
                return ['status' => 0, 'msg' => 'target not exists'];
            //检查是否回复自己的评论
            if ($target->user_id == session('user_id'))
                return ['status' => 0, 'msg' => 'commot reply to your self'];
            $this->reply_to = rq('reply_to');
        }

        //保存数据
        $this->content = rq('content');
        $this->user_id = session('user_id');
        return $this->save() ?
            ['status' => 1, 'id' => $this->id]:
            ['status' => 0, 'msg' => 'db insert failed'];
    }

    //查看评论api
    public function read()
    {
        if (!rq('question_id') && !rq('answer_id'))
            return ['status' => 0, 'msg' => 'question_id or answer_id is required'];

        if (rq('question_id'))
        {
            $question = question_ins()->find(rq('question_id'));
            if (!$question) return ['status' => 0, 'msg' => 'question not exists'];
            $data = $this->where('question_id', rq('question_id'))->get();
        }
        else
        {
            $answer = answer_ins()->find(rq('answer_id'));
            if (!$answer) return ['status' => 0, 'msg' => 'answer not exists'];
            $data = $this->where('answer_id', rq('answer_id'))->get();
        }

        return ['status' => 1, 'data' => $data];
    }

    //删除评论api
    public function remove()
    {
        if (!user_ins()->is_logged_in())
            return ['status' => 0, 'msg' => 'login required'];

        if (!rq('id'))
            return ['status' => 0, 'msg' => 'id is required'];

        $comment = $this->find(rq('id'));
        if(!$comment) return ['status' => 0, 'msg' => 'comment not exists'];
        if ($comment->user_id != session('user_id'))
            return ['status' => 0, 'msg' => 'permission denied'];

        //先删除评论
        $comment->where('reply_to', rq('id'))->delete();

        return $comment->delete()?
            ['status' => 1]:
            ['status' => 0, 'msg' => 'db delete failed'];
    }
}
