# JSONPについて

1. [説明](#説明)
2. [参考](#参考)

## 説明

セキュリティ上のリスクを緩和するために、ブラウザー等に実装されている「同一生成元ポリシー（厳密には異なりますが、クロスドメイン、クロスサイトの制限と表記されている場合もあります）」という制約により、Webページは通常、自分を生成したドメイン以外のドメインのサーバーと通信することは出来ません。

なぜこのような制約があるのかと言うと、この制限がない場合、例えばログインしないと見ることのできない情報（Wikipediaのウォッチリストや、Webメールなど）のあるサイトにログインしている時に、他の生成元のサイトからそれを取得される等の危険が生じるからです。

では「同一生成元」とは何でしょうか？Webブラウザーは「スキーム」「ホスト」「ポート」の三つ全てが同一の元を、同じ生成元とみなします。`http://beenos.com`を例に挙げると、正確には`http://beenos.com:80/`となりますが、`http`が「スキーム」、`beenos.com`が「ホスト」、`80`が「ポート」になります。

今回使用するFlickr APIは、私たちが作成する生成元とはもちろん異なります。しかし私たちは、Flickr APIに、望むハッシュタグ値を渡し、該当した画像情報を取得したい（非同一生成元のサーバーと通信を行いたい）と考えています。

これを解決するのがJSONPという技術です。まずはWikipediaからの抜粋を読んでみてください。

> HTMLのscriptタグのsrc属性には別ドメインのURLを指定して通信することができる、
> という点を利用することによって別ドメインのサーバからデータを取得することが可能になる。
> JSONPでは、通常、上記src属性のレスポンスの内容はJavascript関数呼び出しの形式となるため、
> src属性に指定するURLにその関数の名前をクエリ文字列の形式で付加する。
> 一般的な方法では、この時に指定する関数名はWebページ側ですでに定義されている
> コールバック用の関数の名前になる。
>
> JSONP https://ja.wikipedia.org/wiki/JSONP

それでは以下、具体的にコードを書いてみましょう。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JSONPその1</title>
  </head>
  <script>
  function greeting(name) {
    alert("Hello, " + name);
  }
  </script>
  <body>
  </body>
</html>
```

`greeting`という関数を理解してください。次に`greeting`が実行されるようにしてみます。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JSONPその2</title>
  </head>
  <script>
  function greeting(name) {
    alert("Hello, " + name);
  }
  </script>
  <body>
  <script>
  greeting("freshmen");
  </script>
  </body>
</html>
```

上記をWebブラウザーで表示してください。`Hello, freshmen`と表示されるはずです。この、

```html
<script>
greeting("freshmen");
</script>
```

の部分をscript要素のsrc属性に置き換える事で、JSONPの技術が完成します。書き換える前に、JSONPを返すサーバーサイドを実装します。今回はPHPで実装します。

適当なディレクトリーに移動して、`index.php`という名前で次の内容のファイルを作成してください。

```php
<?php
$name = $_GET['name'];
echo "greeting(\"$name\");";
```

同一ディレクトリーで次のコマンドを実行してください。PHPのビルトインウェブサーバーが起動します。

```sh
$ php -S localhost:8080
```

Webブラウザーで`http://localhost:8080?name=freshmen`にアクセスしてみましょう。`greeting("freshmen");`という文字列が表示されるはずです。それでは書き換えます。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JSONPその3</title>
  </head>
  <script>
  function greeting(name) {
    alert("Hello, " + name);
  }
  </script>
  <body>
  <script src="http://localhost:8080?name=freshmen"></script>
  </body>
</html>
```

実際にWeb APIを使用する際は、Web APIに指定する変数は、画面の状態等によって動的に指定したい事がほとんどです。上記では静的に変数を指定（`name=freshmen`の部分）していますが、このままでは「ユーザーが画面で入力した名前に挨拶がしたい」という要求は満たせません。

動的に生成したURLをsrc属性に指定する形で、`document.createElement`によってscript要素を動的に生成することで、これを解決します。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JSONPその4</title>
  </head>
  <script>
  function greeting(name) {
    alert("Hello, " + name);
  }
  </script>
  <body>
    <input type="text" id="name">
    <input type="button" value="Call greeting" onclick="javascript:callJsonp();">
    <script>
    function callJsonp() {
      var e = document.createElement('script');
      e.type = 'text/javascript';
    
      var name = document.getElementById("name").value;
      e.src = "http://localhost:8080?name=" + name;
      
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(e, s);
    }
    </script>
  </body>
</html>
```

## 参考

[JSONP](https://ja.wikipedia.org/wiki/JSONP)  
[同一生成元ポリシー](https://ja.wikipedia.org/wiki/%E5%90%8C%E4%B8%80%E7%94%9F%E6%88%90%E5%85%83%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC)
