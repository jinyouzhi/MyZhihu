;(function () {
    'use strict';

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
                        template: '<div ui-view></div>'
                    })
                    .state('question.add', {
                        url: '/add',
                        templateUrl: 'tpl/page/question_add'
                    })
            }])

        .service('UserService', [
            '$state',
            '$http',
            function ($state, $http) {
                var me = this;
                me.signup_data = {};
                me.login_data = {};
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
            }

        ])

        .service('AnswerService', [
            '$http',
            function ($http) {
                var me = this;
                me.count_vote = function (answers) {
                    for (var i = 0; i < answers.length; ++i)
                    {
                        var votes, item = answers[i];
                        if( !item['question_id'] || ! item['users']) continue;
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
            }
        ])

        .controller('QuestionAddController', [
            '$scope',
            'QuestionService',
            function ($scope, QuestionService) {
                $scope.Question = QuestionService;
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
            }
        ])

        .controller('HomeController', [
            '$scope',
            'TimelineService',
            function ($scope, TimelineService) {
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
            }
        ])


    // .controller('TestController', function ($scope) {
    //     $scope.name = 'Bob';
    // })
})();