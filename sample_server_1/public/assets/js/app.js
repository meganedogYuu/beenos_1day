'use strict';

// jQueryを用いた非同期用関数はこちら。
// 本当はモジュール化して使いたいが、今回はモジュール化はせずに実装する。
// そのため、読み込みの順番が重要になる
var Resource = {};

(function ($) {
  "use strict";

  // trueとfalseだと分かりづらいため、スイッチの変数を定義しておく。
  // es6だと定数定義使えるけど、今回は使用しない

  var ALLOW_CROSSDOMAIN = true;
  var DENY_CROSSDOMAIN = false;

  // jQueryのajax関数を汎用的にするための基底関数
  // optionに設定を溜め込んで行き、$.ajaxに渡す様にしている。
  // すべての設定が終わった状態にならないと、$.ajaxが発火しない。
  Resource.promise = function (dataType, crossDomain) {
    var option = {
      dataType: dataType,
      crossDomain: crossDomain
    };

    // promise#1
    return function (method) {
      option.method = method;

      // promise#2
      return function (url, data) {
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
  Resource.json = Resource.promise('json', DENY_CROSSDOMAIN);

  // JSONPを用いた非同期通信を行う
  // JSONPを使用する場合は、crossDomainをtrueに設定しておかないと、ajax使用した時にfailが動く
  // promise#1の関数が返される
  Resource.jsonp = Resource.promise('jsonp', ALLOW_CROSSDOMAIN);
})(jQuery);

// flickrのapiを使用した関数はこちら。
// 本当はモジュール化して使いたいが、今回はモジュール化はせずに実装する。
// そのため、読み込みの順番が重要になる。
// 必ずjQuery, resource.jsを先に読ませる事。
var Flickr = {};

(function () {
  "use strict";

  // ページャー生成用設定情報

  Flickr.pagerOptions = function (options) {
    var baseOptions = {
      per_page: 20,
      page: 1
    };

    return $.extend(baseOptions, options);
  };

  // 検索を行う
  Flickr.search = function (pagerOptions) {
    return function (criteria) {
      return Resource.json('get')('/photos/search', $.extend(pagerOptions, criteria));
    };
  };

  // 画像のURLを生成する
  Flickr.imageUrl = function (farm, server, id, secret) {
    return 'http://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg';
  };
})();

// アプリケーション用関数はこちら。
// 本当はモジュール化して使いたいが、今回はモジュール化はせずに実装する。
// そのため、読み込みの順番が重要になる。
// 必ずjQuery, resource.js, flickr.jsを先に読ませる事。
var App = {};

(function ($) {
  "use strict";

  // 仮引数同士が等しいかを比較する関数を生成する規定関数
  // プレディケート関数（必ずboolean値を返す関数）を返す

  App.equal = function (correctValue) {
    // equal#1
    return function (value) {
      return value === correctValue;
    };
  };

  // エンターキーを押下の判断
  // equal#1の関数
  App.isEnterKey = App.equal(13);

  // 空文字かどうかの判断
  // equal#1の関数
  App.isEmpty = App.equal('');

  // 規定アラート関数
  // 同じメッセージを使い回す事がある場合を考えて、関数化ができる様にしておく。
  // 1. 使用するメッセージを最初に設定。
  // 2. 次に、メッセージの表示を行うための関数を指定。
  // 1と2を分けておく事により、標準関数のalertで出す場合や、オリジナルのポップアップで表示する場合
  // といった具合に、使い分けをする事が可能になる。
  App.message = function (message) {
    // alert#1
    return function (messaging) {
      // alert#2
      return function () {
        messaging(message);
      };
    };
  };

  // 「何か入力してください」
  // というメッセージを、window.alertで出力する例
  App.emptyRequiredParamAlert = App.message('何か入力してください')(window.alert);

  // flickrAPIの結果から、画像一覧の画面を生成するcallback
  App.searchResult = function (response) {
    var results = '';
    var $results = $('#js-flickr-results');

    if (parseInt(response.photos.total) <= 0) {
      $results.html('<p>No Results Found.</p>');
      return;
    }

    results = '<ul>';
    // 写真の画像
    $.each(response.photos.photo, function (key, obj) {
      results += '<li><img src="' + Flickr.imageUrl(obj.farm, obj.server, obj.id, obj.secret) + '"></li>';
    });
    results += '</ul>';

    $results.html(results);
  };

  // ここから先は、DOMにイベントを付与する処理

  // 検索ボタンを押下した際の挙動
  $('#js-search').on('click', function () {
    var tag = $('#js-flickr-tag').val();
    var pagerOptions = {};
    var criteria = {};

    if (App.isEmpty(tag)) {
      App.emptyRequiredParamAlert();
    }

    pagerOptions = Flickr.pagerOptions();
    criteria = { text: tag };

    Flickr.search(pagerOptions)(criteria).done(function (response) {
      var results = '';
      var $results = $('#js-flickr-results');

      if (parseInt(response.photos.total) <= 0) {
        $results.html('<p>No Results Found.</p>');
        return;
      }

      results = '<ul>';
      // 写真の画像
      $.each(response.photos.photo, function (key, obj) {
        results += '<li><img src="' + Flickr.imageUrl(obj.farm, obj.server, obj.id, obj.secret) + '"></li>';
      });
      results += '</ul>';

      $results.html(results);
    }).fail(function (response) {
      console.log(res);
    }).always(function (response) {});
  });

  // タグ入力テキストボックスにフォーカスがある状態で
  // エンターキーを押下された際の挙動
  $('#js-flickr-tag').on('keyup', function (e) {
    if (App.isEnterKey(e.keyCode)) {
      $('#js-search').trigger('click');
    }
  });
})(jQuery);