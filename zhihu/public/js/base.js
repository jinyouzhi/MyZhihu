;(function () {
    'use strict';

    var his = {
        id: parseInt($('html').attr('user_id'))
    }

    angular.module('zhihu', [
        'ui.router'
    ])
        .config([
            '$interpolateProvider',
            '$stateProvider',
            '$urlRouterProvider',
            function ($interpolateProvider,
                      $stateProvider,
                      $urlRouterProvider) {
                $interpolateProvider.startSymbol('[:');
                $interpolateProvider.endSymbol(':]');

                $urlRouterProvider.otherwise('/home');

                $stateProvider
                    .state('home', {
                        url: '/home',
                        templateUrl: 'tpl/page/home'
                    })
                    .state('login', {
                        url: '/login',
                        templateUrl: 'tpl/page/login'
                    })
                    .state('signup', {
                        url: '/signup',
                        templateUrl: 'tpl/page/signup'
                    })
                    .state('question', {
                        abstract: true,
                        url: '/question',
                        template: '<div ui-view></div>',
                        controller: 'QuestionController'
                    })
                    .state('question.add', {
                        url: '/add',
                        templateUrl: 'tpl/page/question_add'
                    })
                    .state('question.detail', {
                        url: '/detail/:id',
                        templateUrl: 'tpl/page/question_detail'
                    })
                    .state('user', {
                        url: '/user/:user_id',
                        templateUrl: 'tpl/page/user'
                    })
            }])
        
        .controller('BaseController', [
            '$scope', 
            function ($scope) {
                $scope.his = his;
            }
        ])

        .service('UserService', [
            '$state',
            '$http',
            function ($state, $http) {
                var me = this;
                me.signup_data = {};
                me.login_data = {};

                me.read = function (param) {
                    return $http.post('/api/user/read', param)
                        .then(function (r) {
                            if (r.data.status) {
                                me.self_data = r.data.data;
                            }
                            else {
                                if (r.data.msg == "login required")
                                    $state.go('login');
                            }
                        })
                }
                me.signup = function () {
                    $http.post('/api/user/signup', me.signup_data)
                        .then(function (r) {
                                if (r.data.status) {
                                    me.signup_data = {};
                                    $state.go('login');
                                }
                            },
                            function (e) {
                            })
                }
                me.logout = function () {
                    $http.post('/api/user/logout', me.logout_data)
                        .then(function (r) {
                                if (r.data.status) {
                                    me.login_data = {};
                                    location.href = '/';
                                    $state.go('home');
                                }
                            },
                            function (e) {
                            })
                }
                me.login = function () {
                    $http.post('/api/user/login', me.login_data)
                        .then(function (r) {
                            if (r.data.status) {
                                $state.go('home');
                                location.href = '/';
                            }
                            else {
                                me.login_failed = true;
                            }
                        }, function () {

                        })
                }
                me.username_exists = function () {
                    $http.post('/api/user/exists',
                        {username: me.signup_data.username})
                        .then(function (r) {
                            if (r.data.status && r.data.data.count)
                                me.signup_username_exists = true;
                            else
                                me.signup_username_exists = false;
                        }, function (e) {
                            console.log('e', e);
                        })
                }
            }
        ])

        .controller('SignupController', [
            '$scope',
            'UserService',
            function ($scope, UserService) {
                $scope.User = UserService;
                $scope.$watch(function () {
                    return UserService.signup_data;
                }, function (n, o) {
                    if (n.username != o.username)
                        UserService.username_exists();
                }, true)
            }
        ])

        .controller('LoginController', [
            '$scope',
            'UserService',
            function ($scope, UserService) {
                $scope.User = UserService;
            }
        ])

        .service('QuestionService', [
            '$http',
            '$state',
            'AnswerService',
            function ($http, $state, AnswerService) {
                var me = this;
                me.new_question = {};
                me.go_add_question = function () {
                    $state.go('question.add');
                }
                me.update_answer = function (answer_id) {
                    $http.post('/api/answer/read', {id: answer_id})
                        .then(function (r) {
                            if (r.data.status) {
                                for (var i = 0; i < me.its_answers.length; ++i) {
                                    var answer = me.its_answers[i];
                                    if (answer.id == answer_id) {
                                        me.its_answers[i] = r.data.data;
                                        console.log(r.data.data);
                                    }
                                }
                            }
                        })

                }
                me.add = function () {
                    if (!me.new_question.title)
                        return;

                    $http.post('/api/question/add', me.new_question)
                        .then(function (r) {
                            if (r.data.status) {
                                me.new_question = {};
                                $state.go('home');
                            }

                        }, function (e) {

                        })
                }

                me.read = function (params) {
                    return $http.post('/api/question/read', params)
                        .then(function (r) {
                            if (r.data.status)
                                if (params.id) {
                                    console.log(params.id);
                                    console.log(r.data.data);
                                    me.data = me.current_question = r.data.data;
                                    me.its_answers = me.current_question.answers_with_user_info;
                                    console.log('me.its_answers', me.its_answers);
                                    me.its_answers = AnswerService.count_vote(me.its_answers);
                                    console.log('me.its_answers', me.its_answers);
                                }
                                else
                                    me.data = angular.merge({}, me.data, r.data.data);
                            return r.data.data;
                        })
                }

                //在时间线中投票
                me.vote = function (conf) {
                    //调用核心投票功能
                    AnswerService.vote(conf)
                    //如果投票成功，就更新AnswerService数据
                        .then(function (r) {
                            console.log('r', r);
                            if (r) {
                                me.update_answer(conf.id);
                                4
                            }
                            // if (r)
                            //     AnswerService.update_data(conf.id);
                        })
                }
            }

        ])


        .service('AnswerService', [
            '$http',
            '$state',
            function ($http, $state) {
                var me = this;
                me.data = {};
                me.answer_form = {};
                me.count_vote = function (answers) {
                    for (var i = 0; i < answers.length; ++i) {
                        var votes, item = answers[i];
                        me.data[item.id] = item;
                        if (!item['question_id'] || !item['users']) continue;
                        votes = item['users'];
                        item.upvote_count = 0;
                        item.downvote_count = 0;

                        if (votes)
                            for (var j = 0; j < votes.length; ++j) {
                                var v = votes[j];
                                if (v['pivot'].vote === 1)
                                    item.upvote_count++;
                                if (v['pivot'].vote === 2)
                                    item.downvote_count++;
                            }
                    }
                    return answers;
                }
                me.add_or_update = function (question_id) {
                    if (!question_id) {
                        console.error('question_id is required')
                        return;
                    }
                    me.answer_form.question_id = question_id;
                    if (me.answer_form.id)
                        $http.post('/api/answer/change', me.answer_form)
                    .then(function (r) {
                        if (r.data.status)
                        {
                            console.log('change success');
                            $state.reload();
                        }
                    })
                    else
                        $http.post('/api/answer/add', me.answer_form)
                    .then(function (r) {
                        if (r.data.status)
                        {
                            console.log('add success');
                            $state.reload();
                        }
                    })
                }
                me.delete = function (id) {
                    if (!id)
                    {
                        console.log('id is required');
                        return;
                    }
                    $http.post('/api/answer/remove', {id: id})
                    .then(function (r) {
                        if (r.data.status)
                        {
                            console.log('delete success');
                            $state.reload();
                        }
                    })
                }
                me.vote = function (conf) {
                    if (!conf.id || !conf.vote) {
                        console.log('id and vote are required');
                        return;
                    }

                    var answer = me.data[conf.id];
                    var users = answer.users;
                    for (var i = 0; i < users.length; ++i) {
                        if (users[i].id == his.id && conf.vote == users[i].pivot.vote)
                            conf.vote = 3;
                    }
                    console.log(conf.vote);

                    return $http.post('api/answer/vote', conf)
                        .then(function (r) {
                            if (r.data.status)
                                return true;
                            else if (r.data.msg == 'login required')
                                $state.go('login');
                            else
                                return false;
                        }, function () {
                            return false;
                        })
                }
                me.update_data = function (id) {
                    return $http.post('/api/answer/read', {id: id})
                        .then(function (r) {
                            me.data[id] = r.data.data;
                        })
                    // if(angular.isNumeric(input))
                    //     var id = input;
                    // if(angular.isArray(input))
                    //     var id_set = input;
                }

                me.read = function (params) {
                    return $http.post('/api/answer/read', params)
                        .then(function (r) {
                            if (r.data.status)
                                me.data = angular.merge({}, me.data, r.data.data);
                            return r.data.data;
                        })
                }

            }
        ])

        .controller('QuestionController', [
            '$scope',
            'QuestionService',
            function ($scope, QuestionService) {
                $scope.Question = QuestionService;
            }
        ])
        .controller('QuestionDetailController', [
            '$scope',
            '$stateParams',
            'QuestionService',
            'AnswerService',
            function ($scope, $stateParams, QuestionService, AnswerService) {
                $scope.Answer = AnswerService
                QuestionService.read($stateParams);
                if ($stateParams.answer_id)
                    QuestionService.current_answer_id = $stateParams.answer_id;
                else
                    QuestionService.current_answer_id = null;
            }
        ])

        .controller('UserController', [
            '$scope',
            '$stateParams',
            'UserService',
            'QuestionService',
            'AnswerService',
            function ($scope, $stateParams, UserService, QuestionService, AnswerService) {
                $scope.User = UserService;
                console.log('$stateParams', $stateParams);
                UserService.read($stateParams);
                AnswerService.read($stateParams)
                    .then(function (r) {
                        if (r)
                            UserService.his_answers = r;
                    })
                QuestionService.read($stateParams)
                    .then(function (r) {
                        if (r)
                            UserService.his_questions = r;
                    })
            }
        ])

        .service('TimelineService', [
            '$http',
            'AnswerService',
            function ($http, AnswerService) {
                var me = this;
                me.data = [];
                me.current_page = 1;
                me.no_more_data = false;
                //获取首页数据
                me.get = function (conf) {
                    conf = conf || {page: me.current_page};
                    if (me.no_more_data)
                        return;
                    $http.post('/api/timeline', conf)
                        .then(function (r) {
                            if (r.data.status) {
                                if (r.data.data.length) {
                                    me.current_page++;
                                    me.data = me.data.concat(r.data.data);
                                    //统计每条回答票数
                                    me.data = AnswerService.count_vote(me.data);
                                }
                                else {
                                    me.no_more_data = true;
                                    console.log(1);
                                }
                            }
                            else
                                console.error('network error');
                        }, function () {
                            console.error('network error');
                        })
                }
                //在时间线中投票
                me.vote = function (conf) {
                    //调用核心投票功能
                    AnswerService.vote(conf)
                    //如果投票成功，就更新AnswerService数据
                        .then(function (r) {
                            console.log('r', r);
                            if (r)
                                AnswerService.update_data(conf.id);
                        })
                }
            }
        ])

        .controller('HomeController', [
            '$scope',
            'TimelineService',
            'AnswerService',
            function ($scope, TimelineService, AnswerService) {
                var $win;
                $scope.Timeline = TimelineService;
                TimelineService.get();

                $win = $(window);
                $win.on('scroll', function () {
                    //console.log('$win.scrollTop()', $win.scrollTop());
                    if ($win.scrollTop() == $(document).height() - $win.height()) {
                        //console.log(1);
                        TimelineService.get();
                    }
                })
                //监控数据变化，如果数据有变化同时更新其他模块
                $scope.$watch(function () {
                    return AnswerService.data;
                }, function (new_data, old_data) {
                    var timeline_data = TimelineService.data;
                    for (var k in new_data) {
                        //更新时间线中的数据
                        for (var i = 0; i < timeline_data.length; ++i) {
                            if (k == timeline_data[i].id) {
                                timeline_data[i] = new_data[k];
                            }
                        }
                    }
                    TimelineService.data = AnswerService.count_vote(TimelineService.data);
                }, true)
            }
        ])


    // .controller('TestController', function ($scope) {
    //     $scope.name = 'Bob';
    // })
})();