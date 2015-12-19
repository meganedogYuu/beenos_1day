// jQueryを用いた非同期用関数はこちら。
// 本当はモジュール化して使いたいが、今回はモジュール化はせずに実装する。
// そのため、読み込みの順番が重要になる
var Resource = {};

(($) => {
  "use strict";

  // trueとfalseだと分かりづらいため、スイッチの変数を定義しておく。
  // es6だと定数定義使えるけど、今回は使用しない
  const ALLOW_CROSSDOMAIN = true;
  const DENY_CROSSDOMAIN  = false;

  // jQueryのajax関数を汎用的にするための基底関数
  // optionに設定を溜め込んで行き、$.ajaxに渡す様にしている。
  // すべての設定が終わった状態にならないと、$.ajaxが発火しない。
  Resource.promise = (dataType, crossDomain) => {
    let option = {
      dataType: dataType,
      crossDomain: crossDomain
    };

    // promise#1
    return (method) => {
      option.method = method;

      // promise#2
      return (url, data) => {
        let deferred = null;

        option.url = url;
        option.data = data;

        deferred = $.ajax(option);

        return deferred.promise();
      };
    };
  };

  // JSONが返される非同期通信を行う
  // promise#1の関数が返される
  Resource.json = Resource.promise('json', DENY_CROSSDOMAIN);

  // JSONPを用いた非同期通信を行う
  // JSONPを使用する場合は、crossDomainをtrueに設定しておかないと、ajax使用した時にfailが動く
  // promise#1の関数が返される
  Resource.jsonp = Resource.promise('jsonp', ALLOW_CROSSDOMAIN);

})(jQuery);
