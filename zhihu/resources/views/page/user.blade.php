<div ng-controller='UserController'>
    <div class="user card container">
        <h1>用户详情</h1>
        <div class="hr"></div>
        <div class="basic">
            <div class="info_item clearfix">
                <div>用户名：</div>
                <div>[: User.self_data.username :]</div>
            </div>
            <div class="info_item clearfix">
                <div>一句话简介：</div>
                <div>[: User.self_data.intro || '暂无介绍' :]</div>
            </div>
        </div>
        <h2>用户提问</h2>
        <div ng-repeat="(key, value) in User.his_questions">
            [: value.title :]
            <div class="hr"></div>
        </div>
        <h2>用户回答</h2>
        <div class="hr"></div>
        <div ng-repeat="(key, value) in User.his_answers" class="feed item">
            <div class="feed-item-content">
                <div class="title"> [: value.question.title :]</div>
                <div class="content-main">[: value.content :]</div>
                <div class="action-set">
                    <div class="comment">更新时间：[: value.updated_at :]</div>
                </div>
            </div>
            <div class="hr"></div>
        </div>
    </div>
</div>