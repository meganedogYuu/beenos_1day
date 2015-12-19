# Node.jsでflickrのフォト検索APIの結果を返すAPIを実装する

## 手順
#### nodejsがインストールされていることを確認
```
% node -v
v4.2.3
```

#### 適当なディレクトリを作って、package.jsonを生成する  
enter連打
```
% mkdir sample_server
% cd sample_server
% npm init
```

#### MVCフレームワーク「express」をインストールする
```
% npm install express --save
```
package.jsonに下記が追記される
```
"dependencies": {
  "express": "^4.13.3"
}
```

#### hello worldを表示しましょう  
```javascript
% vi app.js

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```

#### サーバー起動
```
node app.js
```

ブラウザでHello World!が表示されていることを確認  
http://localhost:3000/

#### 静的コンテンツの配置先を作る
app.jsに下記を追記する
```
app.use(express.static('public'));
```
publicディレクトリを作成してサンプルのhtmlファイルを作る
```
% mkdir public
% cd public
% vi index.html
```
ブラウザでhtmlが表示されることを確認  
http://localhost:3000/index.html

#### ライブドアの天気予報APIで東京の天気でも取得してみる
requestライブラリをインストール
```
% npm install request --save
```

app.jsに追記
```javascript
app.get('/weather/tokyo', function (req, res) {
  request('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.header("Content-Type", "application/json; charset=utf-8");
      res.send(body);
    }
  })
});
```
ブラウザから確認  
http://localhost:3000/weather/tokyo

#### flickr apiでフォト検索した結果を返すAPIを実装する
api_keyは環境変数から取得する  
app.jsに追記
```javascript
app.get('/photos/search', function (req, res) {
  var options = {
    url: 'https://api.flickr.com/services/rest/',
    qs: {
      method: 'flickr.photos.search',
      api_key: process.env.FLICKR_API_KEY,
      format: 'json',
      nojsoncallback: 1,
      text: req.query.text
    },
    method: 'GET',
    json: true
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.header("Content-Type", "application/json; charset=utf-8");
      res.send(body);
    }
  })
});
```
api_keyを環境変数に設定
```
$ export FLICKR_API_KEY=xxxxxxxxxxxxx
```
ブラウザから確認  
http://localhost:3000/photos/search?text=dog

