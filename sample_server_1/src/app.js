// アプリケーション用関数はこちら。
// 本当はモジュール化して使いたいが、今回はモジュール化はせずに実装する。
// そのため、読み込みの順番が重要になる。
// 必ずjQuery, resource.js, flickr.jsを先に読ませる事。
var App = {};

(($) => {
  "use strict";

  // 仮引数同士が等しいかを比較する関数を生成する規定関数
  // プレディケート関数（必ずboolean値を返す関数）を返す
  App.equal = (correctValue) => {
    // equal#1
    return (value) => {
      return (value === correctValue);
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
  App.message = (message) => {
    // alert#1
    return (messaging) => {
      // alert#2
      return () => {
        messaging(message);
      };
    };
  };

  // 「何か入力してください」
  // というメッセージを、window.alertで出力する例
  App.emptyRequiredParamAlert = App.message('何か入力してください')(window.alert);

  // flickrAPIの結果から、画像一覧の画面を生成するcallback
  App.searchResult = (response) => {
    let results  = '';
    let $results = $('#js-flickr-results');

    if (parseInt(response.photos.total) <= 0) {
      $results.html('<p>No Results Found.</p>');
      return;
    }

    results = '<ul>';
    // 写真の画像
    $.each(response.photos.photo, (key, obj) => {
      results += '<li><img src="' + Flickr.imageUrl(obj.farm, obj.server, obj.id, obj.secret) + '"></li>';
    });
    results += '</ul>';

    $results.html(results);
  };


  // ここから先は、DOMにイベントを付与する処理

  // 検索ボタンを押下した際の挙動
  $('#js-search').on('click', () => {
    let tag          = $('#js-flickr-tag').val();
    let pagerOptions = {};
    let criteria     = {};

    if (App.isEmpty(tag)) {
      App.emptyRequiredParamAlert();
    }

    pagerOptions = Flickr.pagerOptions();
    criteria     = {text: tag};

    Flickr.search(pagerOptions)(criteria)
    .done((response) => {
      let results  = '';
      let $results = $('#js-flickr-results');

      if (parseInt(response.photos.total) <= 0) {
        $results.html('<p>No Results Found.</p>');
        return;
      }

      results = '<ul>';
      // 写真の画像
      $.each(response.photos.photo, (key, obj) => {
        results += '<li><img src="' + Flickr.imageUrl(obj.farm, obj.server, obj.id, obj.secret) + '"></li>';
      });
      results += '</ul>';

      $results.html(results);
    })
    .fail((response) => {
      console.log(res);
    })
    .always((response) => {
    });
  });

  // タグ入力テキストボックスにフォーカスがある状態で
  // エンターキーを押下された際の挙動
  $('#js-flickr-tag').on('keyup', (e) => {
    if (App.isEnterKey(e.keyCode)) {
      $('#js-search').trigger('click');
    }
  });

})(jQuery);
