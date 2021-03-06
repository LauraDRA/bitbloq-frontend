'use strict';

/**
 * @ngdoc function
 * @name bitbloqApp.controller:Under14AuthorizationCtrl
 * @description
 * # Under14AuthorizationCtrl
 * Controller of the bitbloqApp
 */
angular.module('bitbloqApp')
    .controller('Under14AuthorizationCtrl', function($scope, $routeParams, _, userApi, alertsService, $translate, $location) {

        function goToSupport() {

            if (alertId) {
                alertsService.close(alertId);
            }
            $location.path('bitbloq-help');
        }

        $scope.acceptSubmit = function(form) {
            if (_.isEmpty(form.$error) && $scope.user.cookiePolicyAccepted) {
                alertsService.add({
                    text: 'under14-saving-data',
                    id: 'under14-auth',
                    type: 'loading'
                });
                $scope.user.tutor.validation = {
                    result: true
                };
                userApi.authorizeUnder14User(updateUserToken, $scope.user).then(function() {
                    alertsService.add({
                        text: 'under14-auth-done',
                        id: 'under14-auth',
                        type: 'ok',
                        time: 5000
                    });
                    $location.path('');
                }).catch(function(error) {
                    alertId = alertsService.add({
                        text: error.data + ' : ' + $translate.instant('error-under14-auth'),
                        id: 'under14-auth',
                        type: 'error',
                        linkText: $translate.instant('from-here'),
                        link: goToSupport
                    });
                });
            }
        };

        $scope.cancelSubmit = function() {
            var user = {
                tutor: {
                    validation: {
                        result: false
                    }
                }
            };
            userApi.authorizeUnder14User(updateUserToken, user).then(function() {
                alertsService.add({
                    text: 'under14-auth-cancelbyuser',
                    id: 'under14-auth',
                    type: 'ok',
                    time: 5000
                });
                $location.path('');
            }).catch(function(error) {
                alertId = alertsService.add({
                    text: error.data + ' : ' + $translate.instant('error-under14-auth'),
                    id: 'under14-auth',
                    type: 'error',
                    linkText: $translate.instant('from-here'),
                    link: goToSupport
                });
            });
        };

        var alertId,
            updateUserToken = $routeParams.token;

        $scope.user = null;
        $scope.showForm = false;

        alertsService.add({
            text: 'under14-getting-data',
            id: 'under14-auth',
            type: 'loading'
        });
        userApi.getUnder14User(updateUserToken).then(function(response) {
            $scope.showForm = true;

            $scope.user = response.data;
            alertsService.closeByTag('under14-auth');
        }).catch(function(error) {

            alertId = alertsService.add({
                text: error.data + ' : ' + $translate.instant('error-under14-auth'),
                id: 'under14-auth',
                type: 'error',
                linkText: $translate.instant('from-here'),
                link: goToSupport
            });
            $location.path('');
        });
    });