#MyZhihu 
##常规API调用原则
- `xxx.com/api/...` 开头
- `xxx.com/api/part_1/part_2`
    * `part_1`:model名称，如`user`、`question`……
    * `part_2`:行为名称，`login`、`logout`
- CRUD
    * model一般含有增删改查四个方法，分别对应`add`、`remove`、`change`、`read`


##Model

###User 用户模块
#### - `login` 登陆
#### - `logout` 注销
#### - `signup` 注册
#### - `change_password` 更改密码
#### - `reset_password` 重置密码：发送请求
#### - `validate_reset_password` 重置密码：验证（与上条配合使用）
#### - `read` 读取用户信息

###Question 问题模块
#### - `add` 添加问题
#### - `change` 更改问题
#### - `read` 查看问题
#### - `remove` 删除问题

###Answer 回答模块
#### - `add` 添加回答
#### - `change` 更改回答
#### - `read` 查看回答
#### - `vote` 投票

###Comment 评论模块
#### - `add` 添加评论
#### - `read` 查看评论
#### - `remove` 删除评论