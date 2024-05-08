# はじめよう

（注意）このドキュメントはMacまたはLinuxを使用していることを前提とします。一応POSIXなら動くはず...

Windowsユーザは[WSLをインストール](https://learn.microsoft.com/ja-jp/windows/wsl/install)するか、Codespaces等のリモート環境を使用してください。

## はじめの一歩: これがないとソフトのインストールすらできない...

まずは次のソフトウェアをインストールしましょう。
* 任意のエディタ
  * 原則としてVisual Studio Codeを推奨しますが、コード品質が保てるならvimでもPyCharmでも構いません
* pnpm
  * [https://pnpm.io/ja/installation](https://pnpm.io/ja/installation) を参考にインストールする。
  * NodeJSもインストールすること。pnpmからインストールしても良いし、別個でインストールしても良い

## パッケージのインストール、諸々の準備
次のコマンドを実行しましょう。

```bash
pnpm i
pnpm gen:client
pnpm run wrangler d1 migrations apply PET_D1 --local
```

## 開発サーバを立ち上げる

```bash
pnpm dev
```
