'use strict';

angular.module('mean.missoes').controller('MissoesController', ['$scope', '$stateParams', '$location', 'Global', 'Missoes',
  function($scope, $stateParams, $location, Global, Missoes) {
    $scope.global = Global;

    $scope.hasAuthorization = function(missao) {
      if (!missao || !missao.user) return false;
      return $scope.global.isAdmin || missao.user._id === $scope.global.user._id || sessionStorage.roles.indexOf('administrador') >= 0 || sessionStorage.roles.indexOf('policial/bombeiro') >= 0;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var missao = new Missoes({
          title: this.title,
          content: this.content,
          acidente: this.acidente,
          recursos: this.recursos
        });
        missao.$save(function(response) {
          $location.path('missoes/' + response._id);
        });

        this.title = '';
        this.content = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(missao) {
      if (missao) {
        missao.$remove();

        for (var i in $scope.missoes) {
          if ($scope.missoes[i] === missao) {
            $scope.missoes.splice(i, 1);
          }
        }
      } else {
        $scope.missao.$remove(function(response) {
          $location.path('missoes');
        });
      }
    };

    $scope.save = function(missao) {
      if (!missao.updated) {
        missao.updated = [];
      }
      missao.updated.push(new Date().getTime());

      missao.$update(function() {
      });
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var missao = $scope.missao;
        if (!missao.updated) {
          missao.updated = [];
        }
        missao.updated.push(new Date().getTime());

        missao.$update(function() {
          $location.path('missoes/' + missao._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Missoes.query(function(missoes) {
        $scope.missoes = missoes;
      });
    };

    $scope.findOne = function() {
      Missoes.get({
        missaoId: $stateParams.missaoId
      }, function(missao) {
        $scope.missao = missao;
      });
    };
  }
]);
