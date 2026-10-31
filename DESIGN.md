# Time. 本期設計與素材說明

本期將網站重構為攝影刊物風格：暖白底色、炭黑文字、朱紅點綴，配合大字排版、不對稱影像和留白。

## 已完成

- 首頁：文字分段進場、相片遮罩展開與縮放、手動切換封面、段落錯落浮現、末段輕微視差。
- 全站：頁面過場、收合式導覽、手機選單分段展開、相片懸停細節；頁尾可關閉動態效果，首次使用遵循系統減少動態效果設定。
- 實用功能：Ctrl / Command K 搜尋頁面、公開文章標題與成員姓名；相片分類與收藏、鍵盤相片檢視器；文章搜尋、排序、閱讀清單、閱讀進度、字級調整、分享連結；成員姓名與屆別聯合篩選。
- 收藏、閱讀字級和動效偏好僅存在當前瀏覽器，沒有跨裝置同步。相簿分享連結沿用原設定。

## 圖片來源與儲存

以下三張是透過內建 image_gen 工具產生的概念性編輯影像，非真實社團活動或投稿作品；頁面與檢視器均有 AI 標示。使用內建工具模式，沒有使用 API CLI。圖片隨網站原始碼自託管，沒有使用公共圖床。上線時可改成社團自有且取得公開同意的攝影作品。

原圖保留於本機 generated_images，網站使用 JPEG 壓縮版本。素材、文字與分類的入口為 `constants/editorial.ts`。

### 1. red-hour.jpg

網站素材：`public/editorial/red-hour.jpg`

最終生成提示詞（原文）：

```text
Use case: photorealistic-natural. Asset type: high-end photography club website editorial cover, landscape 1536x1024. Create a single beautiful fine-art analog photograph: a deep red sculptural fabric ribbon hanging vertically in an empty weathered concrete seaside pavilion, broad cobalt ocean horizon visible through the geometric rectangular opening, warm late afternoon light casting very long graphic shadows, subtle 35mm film grain, muted warm limestone and russet red against desaturated blue. Architectural precision, quiet poetic tension, tangible tactile imperfections, inspired by contemporary independent photography journals, not a product rendering. Wide shot, asymmetric editorial composition, red fabric toward center-right, powerful negative space at left. No people, no logos, no text, no watermark. This is an original conceptual image, not documentary evidence of a real club activity.
```

### 2. still-court.jpg

網站素材：`public/editorial/still-court.jpg`

最終生成提示詞（原文）：

```text
Use case: photorealistic-natural. Asset type: portrait editorial photograph for an independent photography journal, 1024x1536 portrait. A solitary red orange plastic chair in an empty quiet outdoor basketball court after rain, textured sage green concrete, distant simple cream wall and the soft shadows of palm leaves cast diagonally, early morning soft sunlight, subtle imperfect 35mm film grain, evocative everyday still life, asymmetrical fine-art composition, observed and tactile rather than glossy. Wide enough to see geometric court markings, chair small in frame. Muted sage and warm cream with a single red accent. No people, logos, writing, watermark or typography. Original conceptual editorial image, not a real club activity.
```

### 3. last-light.jpg

網站素材：`public/editorial/last-light.jpg`

最終生成提示詞（原文）：

```text
Use case: photorealistic-natural. Asset type: fine-art editorial photograph for photography club website, landscape 1536x1024. A close-up of soft ivory translucent linen curtains billowing into a tall sunlit window, a slice of vivid but soft red orange sunset seen through the glass, deep charcoal window frame, subtle grain, long soft shadows across a warm plaster wall. Highly atmospheric yet natural analog photography, restrained contemporary art magazine aesthetic, tactile fibers visible, beautiful chiaroscuro, strong composition with negative space and a curved fold of curtain. No people, logos, text or watermark. Original conceptual editorial image, not a documentary image.
```

## 驗證範圍

桌面 1440px 與手機 390px 已檢查排版和橫向溢出；在本機實際操作公開文章與成員搜尋、屆別篩選、相片瀏覽、收藏、閱讀字級、投稿入口、手機導覽及動效開關。`npm run typecheck`、`npm test`、`npm run build`、`git diff --check` 通過。既有測試涵蓋訂單計價、查詢碼和輸入驗證；本輪沒有提交正式留言、建立訂單或修改正式社團資料。

## 後續建議

1. 優先選出 6–12 張社團代表作品，加入作者、年份與拍攝簡介，逐步替換概念影像。真實而一致的作品，比增加更多動畫更能建立網站個性。
2. 讓每次攝影活動對應一篇短記錄，內含代表影像、成員署名與相簿入口，形成可以持續更新的刊物。
3. 先維持每季一次的小型更新節奏；內容累積後，再增設作品主題徵集或活動日曆，避免空白欄目。
