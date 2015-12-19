# GitHub-flowについて

## はじめに

### Gitとは

分散型バージョン管理システム

- [Git](http://www.atmarkit.co.jp/ait/articles/1307/05/news028.html)

### Gitを使う為の手順

```sh
$ brew update
$ brew install git
```

## 複数人でGitを活用する際のワークフロー

Gitは現在、ソフトウェアを開発する上で欠かせないものとなっていますが、複数人で何もルールを決めずに1つのソフトウェアの開発を行った場合、しばしば混乱を招くことがあります。（とは言え、SubversionやCVSよりはずっとマシですが）  
複数人でGitリポジトリを運用する際の混乱を解決するために、以下のようなワークフローがあります。

- [git-flow](http://danielkummer.github.io/git-flow-cheatsheet/index.ja_JP.html)
- [GitHub-flow](https://gist.github.com/Gab-km/3705015)
- [GitLab-flow](http://postd.cc/gitlab-flow/)
- [gitworkflows](http://daretoku-unix.blogspot.jp/2014/01/git-flowgithub-flowgit.html)
- 上記をベースに、プロジェクトごとにカスタマイズを行ったもの
  - [github を用いた開発フロー テンプレート(GMOペパボ)](http://pepabo.github.io/docs/github/workflow.html)

Buyeeでは、シンプルで分かりやすいという理由からGitHub-flowを採用しています。  

参考: [プロジェクトGit運用手順まとめ](http://qiita.com/Sanche/items/9b2b50f065c9042414f0)


## GitHub-flow

### メリット(GitHubが掲げているもの)

- シンプルなので、すぐに覚えることができる
- シンプルなので、日々の開発において考えなければならないことが減る
- Pull Request、マージの過程にコードレビューが組み込まれている
- 開発中のフィーチャーのみが、トピックブランチにあるため仕掛り作業が把握しやすい
  - トピックブランチの説明的な命名が活きる
- master ブランチの内容はいつでもリリース可能
  - ビジネスのスピードを上げる
    1. 顧客の要求変化が激しい分野
    2. スタートアップ企業
  - 技術的負債返却の敷居を下げる

### メリット(その他)

- レビューの習慣がつく

### 原則

- masterブランチは常時デプロイ可能である
- 機能追加、バグフィックスなどは 説明的な名前のブランチ をmasterから作成する
  - 機能追加の例: add_user_notice (ユーザーの通知機能追加)
  - バグフィックスの例: fix_user_login_validation_error (ユーザーのログイン認証のVlidation修正)
- 作成したブランチでローカル開発。小さい単位でこまめにコミットし、リモートにもこまめにPush
- フィードバックや助言が欲しい時、ブランチをマージしてもよいと思ったときは、 Pull Request を作成する
- レビューOKになったら、masterへマージ
- masterへpushしたら、即デプロイをする

### 手順

<a id="gitPreparation"></a>
#### 準備

1. [GitHub](https://github.com)にてアカウントを作成
2. [SSHの公開鍵を作成し、GitHubに登録する](http://qiita.com/shizuma/items/2b2f873a0034839e47ce)
3. [GitHub](https://github.com/new)にてリポジトリを作成
4. リモートリポジトリをローカルに複製
```
git clone branchName
```


#### 開発手順


```sh
$ git checkout master
$ git pull
$ git checkout -b add_user_notice

# 必要なプログラムの追加、修正を行う（ここではuserNotice.phpを追加したとする）

$ git add userNotice.php
$ git commit -m 'ユーザーの通知機能追加'
$ git push origin add_user_notice

# プルリクエストのコードレビューを誰かに行ってもらう
# コードレビューがOKであれば、masterへのプルリクのマージを行う
# masterのデプロイを行う
```


## 現状のBuyeeの開発flow

### 原則

- masterブランチは 常時デプロイ可能である
- 機能追加、バグフィックスなどは Redminenのチケット番号から命名したブランチをmasterから作成する（例: fix_ticket_0000）
- 空コミットを作成しサーバー上に同じ名前のリモートブランチを作成
- 作成したリモートブランチから、名称に「[WIP]」を入れたプルリクエストをmasterに対して出す
- 作成したブランチにローカルでコミットし、サーバー上の同じ名前のリモートブランチにも定期的に作業内容をpushする
- masterに更新が入った際にはrebaseを行う
- 他の誰かがレビューをして機能にOKを出してくれたら、プルリクエストの名称から「[WIP]」を除き、コードをmasterへマージすることができる
- 基本はmasterへpushしたら、即デプロイをする

### 手順

#### 準備

※ GitHub-flowの[準備](#gitPreparation)項目を参照

#### 開発手順

```sh
$ git checkout master
$ git pull
$ git checkout -b fix_ticket_0000
$ git commit --allow-empty 'make pull request'
$ git push origin fix_ticket_0000

# githubにて名称に「[WIP]」が入ったプルリクエストをmasterに出す
# 必要なプログラムの追加、修正を行う（ここではindex.phpを編集したとする）

$ git add index.php
$ git commit -m '0000 不要な変数の削除'
$ git checkout master
$ git pull origin master
$ git checkout fix_ticket_0000

# masterに更新があればrebaseを行う

$ git rebase master
$ git push origin fix_ticket_0000

# プルリクエストのコードレビューを誰かに行ってもらう
# 他の誰かがレビューをして機能にOKを出してくれたら、プルリクエストの名称から「[WIP]」を除き、コードをmasterへマージすることができる
# masterのデプロイを行う
```

## その他

### WIP PR ワークフローとは

作業途中の状態でGitHubにPull Requestを出して開発を行うフロー

- [WIP PR ワークフロー](http://qiita.com/a-suenami/items/129e09f8550f31e4c2da)


