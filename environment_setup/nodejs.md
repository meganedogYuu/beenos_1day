# Node.jsのインストール

[Node.js](https://nodejs.org/en/)はHomebrewを使ってもインストールできますが、ここでは[nodebrew](https://github.com/hokaccha/nodebrew)というNode.jsのバージョンマネージャーを用いてインストールを行います。

## nodebrewを使うと何が嬉しいか

nodebrewを使うと、現在公開されているNode.jsのバージョンの中から、好きなバージョンを容易にインストールでき、容易にバージョンの切り替えを行うことができます。

使っているソフトウェアによって、使用するプログラミング言語のバージョンによって動かなくなることは(特にNode.jsは)珍しくありません。

Homebrewの最新のバージョンでNode.jsをインストールすると、現時点(2015-12-09)で最新の `v5.2.0` がインストールされると思いますが、まだまだ5系はサポートされてないライブラリも多いため、ここでは4系の最新安定版である `v4.2.3` をインストールします。

# nodebrewのインストール

インストールは、下記コマンドで行えます。

```sh
$ curl -L git.io/nodebrew | perl - setup

#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
#   0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
#   0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0
# 100 23642  100 23642    0     0  13413      0  0:00:01  0:00:01 --:--:--  384k
# Fetching nodebrew...
# Installed nodebrew in $HOME/.nodebrew
# 
# ========================================
# Export a path to nodebrew:
# 
# export PATH=$HOME/.nodebrew/current/bin:$PATH
# ========================================
```

## パスを通す

nodebrewをインストールすると、ホームディレクトリに `.nodebrew` というディレクトリが作成されます。
nodebrewを使えるようにするためには、環境変数 `PATH` にこのディレクトリを設定する必要があります。

- BEENOSが貸し出したMacを使用していて、既にHomebrewをインストールしている人向けの手順

```sh
$ echo 'export PATH="/usr/local/bin:$HOME/.nodebrew/current/bin:$PATH"' > ~/.bash_profile
$ source ~/.bash_profile
```

- 私物Macの人向け手順

```sh
# ユーザーのログインシェルを取得
# fish, csh, tcsh, Reishとか使ってる人は自分で分かると思うので自分でなんとかしてください

$ dscl localhost -read Local/Default/Users/$USER UserShell | cut -d' ' -f2

#=> /usr/local/bin/zsh

# 設定ファイルにパスを設定する記述を行い、設定ファイルを再読み込みする
# 再読み込みを行ってもうまくいかない場合、セッションを新しく作成してください
# 私物のMacの人は、既に色々設定を行っている可能性があるので、各自修正してください
# よくわからない人は、このあたりはメンターに聞きながら行ってください

# bashの場合
$ echo 'export PATH="$HOME/.nodebrew/current/bin:$PATH"' >> ~/.bash_profile
$ source ~/.bash_profile

# zshの場合
$ echo 'export PATH="$HOME/.nodebrew/current/bin:$PATH"' >> ~/.zsh
$ source ~/.zshrc
```

## 確認

```sh
$ nodebrew -v

# nodebrew 0.9.2
# 
# Usage:
#     nodebrew help                         Show this message
#     nodebrew install <version>            Download and install a <version> (compile from source)
#     nodebrew install-binary <version>     Download and install a <version> (binary file)
#     nodebrew uninstall <version>          Uninstall a version
#     nodebrew use <version>                Use <version>
#     nodebrew list                         List installed versions
#     nodebrew ls                           Alias for `list`
#     nodebrew ls-remote                    List remote versions
#     nodebrew ls-all                       List remote and installed versions
#     nodebrew alias <key> <version>        Set alias to version
#     nodebrew unalias <key>                Remove alias
#     nodebrew clean <version> | all        Remove source file
#     nodebrew selfupdate                   Update nodebrew
#     nodebrew migrate-package <version>    Install global NPM packages contained in <version> to current version
#     nodebrew exec <version> -- <command>  Execute <command> specified <version>
# 
# Example:
#     # install from binary
#     nodebrew install-binary v0.10.22
# 
#     # use a specific version number
#     nodebrew use v0.10.22
# 
#     # io.js
#     nodebrew install-binary io@v1.0.0
#     nodebrew use io@v1.0.0
```

# Node.jsのインストール

## 現在インストールできるNode.jsのバージョンを確認

```sh
$ nodebrew ls-remote

# v0.0.1    v0.0.2    v0.0.3    v0.0.4    v0.0.5    v0.0.6
# 
# v0.1.0    v0.1.1    v0.1.2    v0.1.3    v0.1.4    v0.1.5    v0.1.6    v0.1.7
# v0.1.8    v0.1.9    v0.1.10   v0.1.11   v0.1.12   v0.1.13   v0.1.14   v0.1.15
# v0.1.16   v0.1.17   v0.1.18   v0.1.19   v0.1.20   v0.1.21   v0.1.22   v0.1.23
# v0.1.24   v0.1.25   v0.1.26   v0.1.27   v0.1.28   v0.1.29   v0.1.30   v0.1.31
# v0.1.32   v0.1.33   v0.1.90   v0.1.91   v0.1.92   v0.1.93   v0.1.94   v0.1.95
# v0.1.96   v0.1.97   v0.1.98   v0.1.99   v0.1.100  v0.1.101  v0.1.102  v0.1.103
# v0.1.104
# ...
```

## Node.js v4.2.3をインストール

```sh
$ nodebrew install-binary v4.2.3

# Fetching: http://nodejs.org/dist/v4.2.3/node-v4.2.3-darwin-x64.tar.gz
# ######################################################################## 100.0%
# Installed successfully

$ nodebrew ls

# v4.2.3
# 
# current: none
```

## 使用するNode.jsのバージョンを設定

```sh
$ nodebrew use v4.2.3
#=> use v4.2.3

nodebrew ls

# v4.2.3
#
# current: v4.2.3

$ node -v
#=> v4.2.3
```

以上でインストールは完了です。
