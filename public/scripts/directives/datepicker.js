'use strict';

angular.module('corsNgApp')
  .directive('datepicker', function () {
    return {
     // template: '<div></div>',
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
          $(element).on('click',WdatePicker);
          console.log(attrs.value,attrs);

          scope.$watch(attrs.value,function(o,n){
              console.log(o,n);
          })
      }
    };
  });
