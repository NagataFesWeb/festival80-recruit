# 第80代文化祭 WEBサイト開発班募集

「その『好き』で、文化祭を動かせ。」をテーマにした、長田高校文化祭の開発班募集ページです。

- 公開先: https://nagatafesweb.github.io/festival80-recruit/
- 立体的な80のモーション、システムの画面イメージ、15秒のミニゲーム
- 開発内容・歓迎する経験・身につく技術・11月〜5月の活動目安・FAQ
- スマホ対応、キーボード操作、動きの停止、OSの「動きを減らす」設定に対応

## 応募リンクの設定

Googleフォーム・LINEオープンチャットのURLは設定済みです。変更する場合は `config.js` のURLを置き換えてコミットしてください。

```js
window.RECRUIT_CONFIG = Object.freeze({
  googleFormUrl: 'https://forms.gle/実際のID',
  lineOpenChatUrl: 'https://line.me/ti/g2/実際のID',
});
```

未設定の場合は「準備中」と表示し、外部には移動しません。設定後はボタンが自動的に有効になります。フォームは `forms.gle` または `docs.google.com/forms/`、LINEは `line.me/ti/g2/` のHTTPS URLに対応します。リンク設定はページ上のJavaScriptで行うため、JavaScript無効時は募集情報の閲覧のみ可能です。

## ローカル表示

Node.js 22以降で実行します。サイト自体の実行時依存パッケージはありません。

```sh
npm run dev
```

表示先: http://127.0.0.1:4173

## 構成・公開

`index.html` が本文、`styles.css` がデザイントークンとスタイル、`app.js` が動きとゲーム、`config.js` が応募先設定です。`scripts/` に表示・ビルド、`tests/` にブラウザ確認、`docs/` に仕様があります。デザインの判断は `DESIGN.md` を参照してください。

`npm run build` は公開用の7ファイルだけを `dist/` にコピーします。GitHub Actionsで検証してからPagesに公開します。`main` に変更をpushすると自動更新されます。ビルド出力や秘密情報はリポジトリに含めません。

SNS共有用画像は `og-image.png`。デザイン変更後、開発サーバーを起動して `node scripts/social.mjs` で再生成できます。

## 内容について

活動期間は11月から翌5月。年の指定がないため、年号は掲載していません。活動スケジュール・制作機能は目安で、チームで調整する旨を掲載しています。前年の実装技術は参考情報で、今年度の採用技術として確定していません。画面イメージは実データではありません。
