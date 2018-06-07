'use restrict';
var app = angular.module('njTransitApp'); 

app.directive('formatPhone', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attr, formatCtrl) {
            var phoneFormat = function (value) {
                var numbers = value && value.replace(/-/g,"");
                var matches = numbers && numbers.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (matches) {
                    return matches[1] + "-" + matches[2] + "-" + matches[3];
                }

                return undefined;
            }
          
           formatCtrl.$formatters.push(phoneFormat);
            
            element.bind("blur", function () {
                var value = phoneFormat(element.val());
                 formatCtrl.$setViewValue(value);
                 formatCtrl.$render();
                 scope.$apply();
            });
        }
    };
});