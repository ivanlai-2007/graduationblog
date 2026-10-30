# Time. Photography Club

React + Vite 社團網站；使用 Supabase 存放成員、回憶錄、留言、商品和訂單，HashRouter 支援靜態部署。

## 本地開發

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

前端可設定 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`，否則沿用原專案的公開連線設定。前端不可放 service role key、Turnstile secret 或管理密碼。

## 圖片和相簿

首頁與相簿使用自帶圖形。商品圖可由管理員上傳至 Supabase Storage 的 `site-images` 桶，或使用站內路徑；其他外部圖片不會載入。文章圖片遵循相同原則。請只上傳有權公開使用的圖片。網盤分享連結依社團後續整理。

## 安全部署順序

現有資料需先備份，並確認資料表結構與 `backend/security-migration.sql` 相符。建立 Supabase Auth 網站管理員，由資料庫管理者以該帳號的 UUID 加入 `private.site_admins`；只允許指定帳號管理資料。先測試遷移與函式，再協調切換，以免舊前端和新 API 不相容。SQL 限制匿名權限、保留既有資料及新增訂單查詢雜湊與翻譯欄位。後台使用 Supabase Auth，而非前端密碼或 `admin-action`。

`backend/functions/` 是 Edge Function 原始碼：`add-contact.ts` 部署為現有 `hyper-handler`、`post-message.ts` 和 `submit-order.ts` 部署到同名函式，`admin-action.ts` 用於停用舊管理端點。需要現有 `TURNSTILE_SECRET_KEY`；請確認密鑰及允許的域名。訂單價格由服務端查庫計算，查詢碼只在建立時顯示一次，舊訂單不會憑原本連續編號公開查詢。請用管理後台處理舊訂單。

部署完成後應檢查匿名帳號無法讀取或修改訂單、匿名帳號不能改動資料、管理員可登入與管理，並以測試資料驗證留言、成員、上傳、下單與查詢。`npm test` 只覆蓋訂單函式邏輯，不能替代線上驗證。
