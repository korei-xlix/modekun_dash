# modekun dash
**～取扱説明書 兼 設計仕様書～**  


# システム概要 <a name="aSystemSummary"></a>
Youtube Liveチャットのフィルターをおこなうブラウザ拡張modです。  
modekun dashの画面で設定した閾値を超えたコメントが表示除外処理されます。  
* コメントが削除されるわけではありません。  
* 除外処理は時間がかかることがあり、全てのコメントが瞬時に除外されるわけではありません。  
  
なお本ソースはオリジナルの「modekun」を少し機能変更してます。  
オリジナルの詳細は、オリジナルのリポジトリを参照ください。（以下謝辞に掲載）  




# 目次 <a name="aMokuji"></a>
* [システム概要](#aSystemSummary)
* [前提](#aPremise)
* [セットアップ手順](#aSetup)
* [起動方法](#aStart)
* [アップデート手順](#aUpdate)
* [運用方法](#aHowtoUnyou)
* [本リポジトリの規約](#aRules)
* [参考記事](#aReference)
* [謝辞](#aAcknowledgments)




# 前提 <a name="aPremise"></a>
* nodejs
* npm




# 環境セットアップ（for Windows） <a name="aSetup"></a>
Windows版のnode.jsを使用します。  

* 1.インストーラーのダウンロード  
  下記サイトからインストーラーをダウンロードします。  
    [nodejs](http://nodejs.org/)
  
  Download > Windows Installer をクリックするとカレントバージョンの自身のPCに合わせたインストーラーがダウンロードされます。  
  明示的に、32bit版、64bit版、バイナリ版など指定したい場合は、それぞれの項目をクリックするとダウンロードが開始します。  

* 2.msiセットアップを起動します  
  セットアップに従ってインストールします。  
  基本デフォルトのままで問題ありません。  

* 3.動作を確認します  

コマンドプロンプトから下記のコマンドを実行して、nodejs、nmpの動作を確認します。  
各コマンドでバージョンが表示されれば問題ありません。  

```
node --version
[バージョン]

npm --version
[バージョン]
```

* 4.Windowsのシステムの変更をおこないます  
  nodejs、nmp実行時のエラー回避のため、パスを通す作業です。  
  これをおこなわないと、*.cmdの実行に支障があるそうです。  
  
  * 1.コントロールパネルのシステムを開く  
  * 2.システムの詳細設定を開く  
  * 3.環境変数画面で、下段の「PATHEXT」の編集で末尾に ;.cmd を追記  
  * 4.OKを押して、開いた全てのウィンドウを閉じる  

* 5.本家（うち）のリポジトリを、自分のgithubアカウントにcloneします  
  
  [botリポジトリ](https://github.com/korei-xlix/modekun_dash)  
  の右上あたりの[Fork]ボタンを押してください。  
  すると、自分のアカウントに[自垢名 / koreibot_win]というリポジトリができます。  

* 6.githubデスクトップで1項でForkしたリポジトリから自PCにクローンをダウンロードします。  
  githubデスクトップのCurrent repository→Add→Cloneを選択します。  
  任意のフォルダを選択してCloneを押してください。  

* 7.自分のブランチを作ります（任意）  
  githubデスクトップのCurrent branch→New branchで任意の名前を入力します。  
  バックアップ用の作業となります。  

8.プロンプトを起動して、6でコピーしたフォルダにチェンジ移動し、以下のコマンドを入力します  
```
このコマンドは初回だけでOKです
npm install

これはビルドコマンドです
npm run build

```
ビルドすると、distフォルダに成果物ができあがります。  
成果物のインストールはアップデート手順を参照ください。  




# アップデート手順 <a name="aUpdate"></a>
リポジトリのmasterから最新版をpullする方法です。  

* 1. githubデスクトップを起動します。  

* 2. 自分のKoreibotリポジトリを選択し、Current branchをクリックします。  

* 3. New branchをクリックし、バックアップ用のブランチを作成します。  
  名前はわかりやすいように。

* 4. ブランチを[main]に切り替えます。  

* 5. [Fetch Origin]をクリックします。  

* 6. [Puch]をクリックします。  
  ここまでで、自分のリポジトリの[main]と、自PCのソースに最新が反映されてます。  

> **もし不具合があったら...？**  
>	3項で保存したブランチに切り替えると、自PC側にアップデート前のソースが戻ってきます。  
>	以後、アップデートがあったら[main]に切り替えて[Fetch]すれば、修正後のソースが反映されます。  

* 7.プロンプトでフォルダチェンジしたあと、ビルドします  
```
npm run build

```

* 8.ブラウザにインストールします  
  chromeの場合、「その他のツール」→「拡張機能」を開きます。  
  競合するので、事前に古いmodは削除します。  
  
  デベロッパーモードをONにして、「パッケージされていない拡張機能を読み込む」で dist フォルダを指定すると、modが読まれます。  




# 運用方法 <a name="aHowtoUnyou"></a>
modekun dashの画面で設定した閾値を超えたコメントが表示除外処理されます。  

> **＜注意事項＞**  
> コメントが削除されるわけではありません。  
> また、webのフロントエンドで処理するため、除外処理が遅延することがあるらしいです。  
> よって、全てのコメントが瞬時に除外されるわけではありません。  


## **[Home]**  
![aaa.jpg](https://bn02pap001files.storage.live.com/y4my3oA2o3_aXy9YbN4NkWkATDAvszr3pn9urmEjgE5z6zSVernypXz3ZoHWFAzjr2czw4OrkDLD10QjA_1Y0n4yns6RPk05rWlt4tF1CocrH4bfuPcmWx-W6rTenWukXEt5cgBULHFK5Ck7tond8u4DuI7uvHmE_3oy62dgVsGsI5kYDqJXr-hNIO8f_kd7dM3?width=640&height=870&cropmode=none)  

基本画面です。  
この画面では以下の閾値が設定できます。  
  
**連投閾値**  
設定回数以上、同じ文字列のコメントを連投した場合、表示除外します。  
  
**単語繰り返し閾値**  
設定回数を超えた文字のコメントを表示除外します。  
「ああああ」や「こよこよ」など。  
  
**投稿頻度**  
1回の処理で、1人のユーザが設定回数を超えた回数のコメントがあった場合、表示除外します。  
  
**文字数上限**  
設定以上の文字数のコメントを表示除外します。  
  
**制御対象コメント数**  
1回の処理実行におけるコメント数です。  
大きければ1回で多くのコメントを処理できますが、後発の処理で除外しきれなくなる可能性があります。  
コメントのトラヒックに応じて調整してください。  
  
**実行間隔**  
除外処理の実行間隔です。  
大きいと負荷が少ないですが、1回の処理で除外しきれなくなる可能性があります。  
コメントのトラヒックに応じて調整してください。  


## **[NG Word]**  
ここで設定されたワードを含むコメントを表示除外します。  
  


## **[Option]**  
その他の設定です。  

![aaa.jpg](https://bn02pap001files.storage.live.com/y4mPltwchzfJDXPLk5umtjHhik9iVZFlSwTDJaSbwwN7bFLrV6k_iLtj_yrR0BT9HNgFYtwTRn5iCA_T1qdp-4R8U_l0ngqCygtZBDMUEd7ai-K7msDN9Cu1j44MmnWukgHVIDdmjOG-pCwSjOQ-Lx3RpWVGQPZ05HjWCfKZqgJTMnxx3bVDVW0evb0pEzhu571?width=640&height=733&cropmode=none)  

**modekunを有効にする**  
チェックすると、本modを有効にします。  
  
**非表示の理由を表示する**  
チェックすると、表示除外した場合、除外した列に除外した理由を表示します。  
  
**投稿者名をNGワード判定対象にする**  
チェックすると、NG Wordで設定したワードを含むユーザのコメントを表示除外します。  
  
**投稿者名を文字数上限対象にする**  
チェックすると、文字数上限以上のユーザ名のユーザのコメントを表示除外します。  
  
**完全に非表示にする**  
チェックすると、空欄を開けることなく表示除外します。  
チャット欄の見た目がスッキリしますが、除外されたことが分かりません。  




# 本リポジトリの規約 <a name="aRules"></a>
* 素材の改造、流用、配布について。  
  このリポジトリ配下のソースの改造、改造物の配布、クローンは禁止とします。  
  が、フリーウェア規約には準拠します。  
* 著作権について。
  * このソースはfork流用ですので、当方改造部分の著作権は放棄しません。
  * 別に著作権表記のある素材の利用については、各自で許諾を取得ください。  
    当方では責任を負いません。  
* 免責事項について。
  * 当ソースを使用したことによる不具合、損害について当方は責任を持ちません。  
    全て自己責任でお願いします。  
  * Web上やSNS上、オンライン上で発生した、わたしが関知していないトラブル、損害については、  
    一切責任を負いません。各自でご対応をお願いします。  
* 当ソースの仕様、不具合についての質問は受け付けません。自己解析、自己対応でお願いします。  
  * fork元開発者へ、当リポジトリについてのお問い合わせをすることは  
    先方にご迷惑となりますので、やめてください。  
* このリポジトリに含まれるファイル構成を変えたり、消したりしないでください。誤動作の原因となります。  
* その他、ご意見、ご要望については、開発者ホームページを参照ください。  



# 参考記事 <a name="aReference"></a>
**※敬称略**  
* [Node.js / npmをインストールする（for Windows）](https://qiita.com/taiponrock/items/9001ae194571feb63a5e)



# 謝辞 <a name="aAcknowledgments"></a>
**※敬称略**  
* [momochi29（for fork souse master）](https://github.com/tjmtmmnk)  
  source : [https://github.com/tjmtmmnk/modekun](https://github.com/tjmtmmnk/modekun)



***
::Project= Korei bot  
::Admin= Korei (@korei-xlix)  
::github= https://github.com/korei-xlix/  
::Homepage= https://koreixlix.wixsite.com/profile  
