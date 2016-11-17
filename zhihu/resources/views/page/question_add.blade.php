<div ng-controller="QuestionController" class="questoin-add container">
    <div class="card">
        <h1>提问</h1>

        <form name="question_add_form" ng-submit="Question.add()">
            <div class="input-group">
                <label>问题标题：</label>
                <input name="title"
                       type="text"
                       ng-minlength="5"
                       ng-maxlength="255"
                       ng-model="Question.new_question.title"
                       required
                >
            </div>
            <div class="input-group">
                <label>问题描述：</label>
                <textarea name="desc"
                          type="text"
                          ng-model="Question.new_question.desc"
                          required
                >
                    </textarea>
            </div>
            <div ng-if="User.login_failed" class="input-error-set">
                用户名或密码有误
            </div>
            <button class="primary"
                    ng-disabled="Question.new_question.title.$error.required || Question.new_question.desc.$error.required"
                    type="submit"
            >
                提问
            </button>
        </form>
    </div>
</div>