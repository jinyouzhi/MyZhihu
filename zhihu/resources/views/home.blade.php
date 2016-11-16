{{--/**--}}
{{--* Created by PhpStorm.--}}
{{--* User: iLeGend--}}
{{--* Date: 2016/11/16--}}
{{--* Time: 20:08--}}
{{--*/--}}

<div ng-controller="HomeController" class="home card container">
    <h1>最近动态</h1>
    <div class="hr"></div>
    <div class="item-set">
        <div ng-repeat="item in Timeline.data" class="feed item clearfix">
                <div ng-if="item.question_id" class="vote">
                    <div class="up">[: item.upvote_count :]</div>
                    <div class="down">反对</div>
                </div>
                <div class="feed-item-content">
                    <div ng-if="item.question_id" class="content-act"> [: item.user.username :] 添加了回答</div>
                    <div ng-if="!item.question_id" class="content-act"> [: item.user.username :] 添加了提问</div>
                    <div class="title"> [: item.title :]</div>
                    <div class="content-owner">
                        [: item.user.username :] <span class="desc">[: item.user.intro :]</span>
                    </div>
                    <div class="content-main">[: item.desc :]</div>
                    <div class="action-set">
                        <div class="comment">评论</div>
                    </div>
                    <div class="comment-block">
                        <div class="hr"></div>
                        <div class="rect"></div>
                        <div class="comment-item-set">
                            <div class="comment-item clearfix">
                                <div class="user">黎明</div>
                                <div class="comment-content">Lorem ipsum dolor sit amet, consectetur adipisicing
                                    elit. Itaque, saepe sit? Accusantium ea nobis repellendus suscipit! Aliquam
                                    architecto commodi dicta eligendi, facere facilis laboriosam laborum modi
                                    provident quisquam ratione tempora.
                                </div>
                            </div>
                            <div class="comment-item clearfix">
                                <div class="user">黎明</div>
                                <div class="comment-content">Lorem ipsum dolor sit amet, consectetur adipisicing
                                    elit. Itaque, saepe sit? Accusantium ea nobis repellendus suscipit! Aliquam
                                    architecto commodi dicta eligendi, facere facilis laboriosam laborum modi
                                    provident quisquam ratione tempora.
                                </div>
                            </div>
                            <div class="comment-item clearfix">
                                <div class="user">黎明</div>
                                <div class="comment-content">Lorem ipsum dolor sit amet, consectetur adipisicing
                                    elit. Itaque, saepe sit? Accusantium ea nobis repellendus suscipit! Aliquam
                                    architecto commodi dicta eligendi, facere facilis laboriosam laborum modi
                                    provident quisquam ratione tempora.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hr"></div>
        </div>
        <div ng-if="Timeline.no_more_data" class="tac">没有更多数据啦</div>
    </div>
</div>