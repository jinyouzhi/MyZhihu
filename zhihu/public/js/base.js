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
                        url: '/detail:id',
                        templateUrl: 'tpl/page/question_detail'
                    })
                    .state('user', {
                        url: '/user/:user_id',
                        templateUrl: 'tpl/page/user'
                    })
            }])

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
            function ($http, $state) {
                var me = this;
                me.new_question = {};
                me.go_add_question = function () {
                    $state.go('question.add');
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
                                me.data = angular.merge({}, me.data, r.data.data);
                            return r.data.data;
                        })
                }
            }

        ])


        .service('AnswerService', [
            '$http',
            function ($http) {
                var me = this;
                me.data = {};
                me.count_vote = function (answers) {
                    for (var i = 0; i < answers.length; ++i) {
                        var votes, item = answers[i];
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
                me.vote = function (conf) {
                    if (!conf.id || !conf.vote) {
                        console.log('id and vote are required');
                        return;
                    }


                    return $http.post('api/answer/vote', conf)
                        .then(function (r) {
                            if (r.data.status)
                                return true;
                            else
                                false;
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