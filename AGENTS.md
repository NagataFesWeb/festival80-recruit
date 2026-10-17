# 作業規約

- 静的HTML / CSS / JavaScript。GitHub Pagesのプロジェクト配下で動作させるため、資産の参照は相対パスにする。
- 応募先URLは `config.js`、デザイントークンは `styles.css` の `:root` に集約する。
- 新しい事実・日付・参加条件を創作しない。未設定の応募先を架空のURLで埋めない。
- `npm run check` と `npm run build` を実行。操作・レイアウト変更は `npm ci` 後に `npm test` で検証する。ブラウザがなければ `npx playwright install chromium`。
- 広いUI変更は390pxと1440pxの撮影画像を開いて確認する。キーボード、スマホ幅、動きを減らす設定を維持する。
- 仕様や挙動を変えたら `docs/spec.md`、必要ならREADME・DESIGNを同じ変更で更新する。docsを増減したら `docs/README.md` の索引も更新する。
- 変更を検証し、受け入れ条件と照合し、問題を修正して再確認してから完了とする。
