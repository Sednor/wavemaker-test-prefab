Application.$controller("FacebookController",["$scope", "Utils", function($scope, Utils) {
    "use strict";
    var LOGIN_MODE = {
            'AUTOMATIC': "auto"
        },
        autoLogin = $scope.loginmode === LOGIN_MODE.AUTOMATIC;

    $scope.isInsideIframe = window.self != window.top;
    /*
     * This function will be invoked when any of this prefab's property is changed
     * @key: property name
     * @newVal: new value of the property
     * @oldVal: old value of the property
     */
    function propertyChangeHandler(key, newVal, oldVal) {

        /*
         switch (key) {
         case "prop1":
         // do something with newVal for property 'prop1'
         break;
         case "prop2":
         // do something with newVal for property 'prop2'
         break;
         }
         */

    }
    /* register the property change handler */
    $scope.propertyManager.add($scope.propertyManager.ACTIONS.CHANGE, propertyChangeHandler);

    function toggleSignInButton(enable) {
        var signInBtn = $scope.Widgets.signInButton.$element;
        if (!enable) {
            signInBtn.attr('disabled', 'disabled');
        } else {
            signInBtn.removeAttr('disabled');
        }
    }

    function openWindow(href) {
        if (!href) {
            return;
        }
        window.open(href, $scope.isInsideIframe ? '_blank' : '_self', "width=600,height=700");
    }

    $scope.OAuthHandlerServiceGetLoginURLonSuccess = function(variable, data) {
        $scope.loginurl = data;
        toggleSignInButton(!$scope.accesstoken);
        if (autoLogin && !$scope.accesstoken) {
            openWindow(data);
        }
    };

    function login() {
        $scope.Widgets.signInButton.$element.click();
    }

    $scope.onInitPrefab = function() {
        $scope.login = login;
    };

    $scope.signInButtonClick = function($event, $isolateScope) {
        openWindow($scope.loginurl);
    };

    $scope.OAuthHandlerServiceGetAccessTokenonSuccess = function(variable, data) {
        var callbackParams;
        if (data) {
            $scope.accesstoken = data;
            $scope.Widgets.signInButton.disabled = true;
            toggleSignInButton(false);
            if ($scope.loginsuccessmessage) {
                $scope.Variables.loginSuccess.invoke();
            }
            Utils.triggerFn($scope.onLoginsuccess);
        } else {
            if ($scope.isInsideIframe) {
                callbackParams = JSON.stringify({
                    'WMOAuthState': true
                });
            } else {
                callbackParams = "csrf8888";
            }
            $scope.Variables.OAuthHandlerServiceGetLoginURL.setInput('state', callbackParams);
            $scope.Variables.OAuthHandlerServiceGetLoginURL.invoke();
        }
    };

}]);