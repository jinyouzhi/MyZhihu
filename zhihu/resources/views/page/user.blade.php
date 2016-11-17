<div ng-controller='UserController'>
    user page
    <h2>用户提问</h2>
    <div ng-repeat="(key, value) in User.his_questions">
        [: value.title :]
    </div>
    <h2>用户回答</h2>
    <div ng-repeat="(key, value) in User.his_answers">
        [: value.content :]
    </div>
</div>