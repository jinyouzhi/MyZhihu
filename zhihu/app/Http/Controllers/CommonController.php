<?php

namespace App\Http\Controllers;


class CommonController extends Controller
{
    //时间线api
    public function timeline()
    {
        list($limit, $skip) = paginate(rq('page'), rq('limit'));
        //获取问题数据
        $questions = question_ins()
            ->limit($limit)
            ->skip($skip)
            ->orderBy('created_at', 'desc')
            ->get();

        //获取回答数剧
        $answers = answer_ins()
            ->limit($limit)
            ->skip($skip)
            ->orderBy('created_at', 'desc')
            ->get();

        //合并数据
        $data = $questions->merge($answers);
        //按时间倒序排列
        $data = $data->sortByDesc(function ($item)
        {
            return $item->created_at;
        });

        //获取值
        $data = $data->values()->all();
        return $data;
    }
}
