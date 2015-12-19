# 課題: Node.js のプログラムから環境変数を参照する

## やること

* heroku-toolbelt を使って、heroku 上のアプリに環境変数 FLICKER_API_KEY を設定する。
サーバアプリから環境変数 FLICKER_API_KEY の内容を参照し、console.log に表示させる。

## ヒント

```
$ heroku config:add FLICKER_API_KEY="(flickerのAPIキー)"
```

設定した環境変数は、Node.js のソースコードからは以下のように利用します。

```javascript:
flicker_api_key = process.env.FLICKER_API_KEY;
console.log('flicker_api_key: ' . flicker_api_key);
```

### 参考: heroku でのログの確認の仕方

以下のコマンドで、 console.log でログ出力したものを確認できます。

```
heroku logs --tail
```
