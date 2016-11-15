#MyZhihu 后端API文档 v1.0.0
##常规API调用原则
- 'xxx.com/api/...' 开头
- 'xxx.com/api/part_1/part_2'
    * part_1:model名称，如user、question……
    * part_2:行为名称，login、logout
- CRUD
    * model一般含有增删改查四个方法，分别对应add、remove、change、read
##Model

###User
####login
####logout
####signup
####change_password
####reset_password
####validate_reset_password
####read

###Question
####add
####change
####read
####remove

###Answer
####add
####change
####read
####vote

###Comment
####add
####read
####remove