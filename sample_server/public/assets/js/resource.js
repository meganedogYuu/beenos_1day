// jQueryを用いた非同期用関数はこちら。
// 本当はモジュール化して使いたいが、今回はモジュール化はせずに実装する。
// そのため、読み込みの順番が重要になる
var Resource = {};

(function($) {
  "use strict";

  // trueとfalseだと分かりづらいため、スイッチの変数を定義しておく。
  // es6だと定数定義使えるけど、今回は使用しない
  Resource.ALLOW_CROSSDOMAIN = true;
  Resource.DENY_CROSSDOMAIN  = false;

  // jQueryのajax関数を汎用的にするための基底関数
  // optionに設定を溜め込んで行き、$.ajaxに渡す様にしている。
  // すべての設定が終わった状態にならないと、$.ajaxが発火しない。
  Resource.promise = function(dataType, crossDomain) {
    var option = {
      dataType: dataType,
      crossDomain: crossDomain
    };

    // promise#1
    return function(method) {
      option.method = method;

      // promise#2
      return function(url, data) {
        var deferred = null;

        option.url = url;
        option.data = data;

        deferred = $.ajax(option);

        return deferred.promise();
      };
    };
  };

  // JSONが返される非同期通信を行う
  // promise#1の関数が返される
  Resource.json = Resource.promise('json', Resource.DENY_CROSSDOMAIN);

  // JSONPを用いた非同期通信を行う
  // JSONPを使用する場合は、crossDomainをtrueに設定しておかないと、ajax使用した時にfailが動く
  // promise#1の関数が返される
  Resource.jsonp = Resource.promise('jsonp', Resource.ALLOW_CROSSDOMAIN);

})(jQuery);
