<div ng-controller="QuestionDetailController" class="container questoin-detail">
    <div class="card">
        <h1>[: Question.current_question.title :]</h1>
        <div class="desc">[: Question.current_question.desc :]</div>
        <div>
            <span class="gray">回答数 [: Question.current_question.answers_with_user_info.length :]</span>
        </div>
        <div class="hr"></div>
        <div class="feed item">
            <div ng-repeat="item in Question.current_question.answers_with_user_info" class="feed item clearfix">
                <div class="vote">
                    <div ng-click="Question.vote({id: item.id, vote:1})" class="up">赞同[: item.upvote_count :]</div>
                    <div ng-click="Question.vote({id: item.id, vote:2})"  class="down">反对[: item.downvote_count :]</div>
                </div>
                <div class="feed-item-content">
                <div><span ui-sref="user({user_id: item.user.id})">[: item.user.username :]</span></div>
                <div class="content-main">[: item.content :]</div>
                <div class="action-set">
                    <span class="comment">评论</span>
                    <span class="comment">更新时间：[: item.updated_at :]</span>
                </div>
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
                <div class="hr"></div>
            </div>
        </div>
        <form \name="answer_form" class="answer_form" ng-submit="Answer.add_or_update(Question.current_question.id)">
            <div class="input-group">
                <textarea name="content"
                          type="text"
                          ng-minlength="1"
                          ng-maxlength="5000"
                          ng-model="Answer.answer_form.content"
                          required
                >
                    </textarea>
            </div>
            <button class="primary"
                    ng-disabled="answer_form.$invalid"
                    type="submit"
            >
                提交
            </button>
        </form>
    </div>
</div>