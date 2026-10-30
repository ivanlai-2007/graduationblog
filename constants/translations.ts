import { Language, TranslationDictionary } from '../types';

export const TRANSLATIONS: TranslationDictionary = {
  'gallery.pending': { [Language.EN]: 'Coming soon', [Language.ZH_CN]: '整理中，敬请期待', [Language.ZH_TW]: '整理中，敬請期待' },
  'common.loading': { [Language.EN]: 'Loading…', [Language.ZH_CN]: '加载中…', [Language.ZH_TW]: '載入中…' },
  'common.back': { [Language.EN]: 'Back', [Language.ZH_CN]: '返回', [Language.ZH_TW]: '返回' },
  'common.error': { [Language.EN]: 'Unable to load. Please check your connection.', [Language.ZH_CN]: '加载失败，请检查网络连接。', [Language.ZH_TW]: '載入失敗，請檢查網路連線。' },
  'memories.empty': { [Language.EN]: 'No stories yet.', [Language.ZH_CN]: '暂时还没有故事。', [Language.ZH_TW]: '暫時還沒有故事。' },
  'memories.missing': { [Language.EN]: 'Story not found', [Language.ZH_CN]: '未找到这篇故事', [Language.ZH_TW]: '找不到這篇故事' },
  'guestbook.empty': { [Language.EN]: 'No messages yet. Be the first to write something!', [Language.ZH_CN]: '还没有留言，来写下第一条吧！', [Language.ZH_TW]: '還沒有留言，來寫下第一則吧！' },
  'common.verify': { [Language.EN]: 'Please complete the security check.', [Language.ZH_CN]: '请先完成安全验证。', [Language.ZH_TW]: '請先完成安全驗證。' },
  'common.submitError': { [Language.EN]: 'Submission failed. Please try again.', [Language.ZH_CN]: '提交失败，请稍后重试。', [Language.ZH_TW]: '送出失敗，請稍後重試。' },
  'common.sending': { [Language.EN]: 'Sending…', [Language.ZH_CN]: '提交中…', [Language.ZH_TW]: '送出中…' },
  // Navigation
  'nav.home': {
    [Language.EN]: 'Home',
    [Language.ZH_CN]: '首页',
    [Language.ZH_TW]: '首頁',
  },
  'nav.gallery': {
    [Language.EN]: 'Photo Gallery',
    [Language.ZH_CN]: '相册网盘',
    [Language.ZH_TW]: '相簿網盤',
  },
  'nav.guestbook': {
    [Language.EN]: 'Guestbook',
    [Language.ZH_CN]: '留言板',
    [Language.ZH_TW]: '留言板',
  },
  'nav.memories': {
    [Language.EN]: 'Memories',
    [Language.ZH_CN]: '回忆录',
    [Language.ZH_TW]: '回憶錄',
  },
  'nav.contact': {
    [Language.EN]: 'Members',
    [Language.ZH_CN]: '成员',
    [Language.ZH_TW]: '成員',
  },
  'nav.souvenirs': {
    [Language.EN]: 'Souvenirs',
    [Language.ZH_CN]: '纪念品',
    [Language.ZH_TW]: '紀念品',
  },
  'nav.cont': {
    [Language.EN]: 'Members',
    [Language.ZH_CN]: '成员',
    [Language.ZH_TW]: '成員',
  },

  // Home
  'home.title': {
    [Language.EN]: 'Time. Photography Club',
    [Language.ZH_CN]: '时光摄影社',
    [Language.ZH_TW]: '時光攝影社',
  },
  'home.subtitle': {
    [Language.EN]: 'Let life be beautiful like summer flowers and death like autumn leaves.',
    [Language.ZH_CN]: '生如夏花之绚烂，死如秋叶之静美',
    [Language.ZH_TW]: '生如夏花之絢爛，死如秋葉之靜美',
  },
  'home.welcome': {
    [Language.EN]: 'Welcome to our digital memory capsule.',
    [Language.ZH_CN]: '欢迎来到我们的数字记忆胶囊。',
    [Language.ZH_TW]: '歡迎來到我們的數位記憶膠囊。',
  },
  'home.cta': {
    [Language.EN]: 'View Photos',
    [Language.ZH_CN]: '查看相册',
    [Language.ZH_TW]: '查看相簿',
  },
  'home.cta.guestbook': {
    [Language.EN]: 'Sign Guestbook',
    [Language.ZH_CN]: '签写留言',
    [Language.ZH_TW]: '簽寫留言',
  },
  'home.cta.memories': {
    [Language.EN]: 'Read Memories',
    [Language.ZH_CN]: '阅读回忆',
    [Language.ZH_TW]: '閱讀回憶',
  },

  // Gallery
  'gallery.title': {
    [Language.EN]: 'Memory Cloud',
    [Language.ZH_CN]: '云端记忆',
    [Language.ZH_TW]: '雲端記憶',
  },
  'gallery.desc': {
    [Language.EN]: 'Explore our shared albums. Access depends on each album’s sharing settings.',
    [Language.ZH_CN]: '浏览共享相册，访问权限以各相册的分享设置为准。',
    [Language.ZH_TW]: '瀏覽共享相簿，存取權限以各相簿的分享設定為準。',
  },
  'gallery.upload.title': {
    [Language.EN]: 'Contribute Photos',
    [Language.ZH_CN]: '上传照片',
    [Language.ZH_TW]: '上傳照片',
  },
  'gallery.upload.desc': {
    [Language.EN]: 'Do you have photos to share? Upload them to our shared collection via the link below.',
    [Language.ZH_CN]: '你有照片想要分享吗？通过下方链接上传到我们的社团收藏中。',
    [Language.ZH_TW]: '你有照片想要分享嗎？通過下方連結上傳到我們的社團收藏中。',
  },
  'gallery.upload.linkText': {
    [Language.EN]: 'Go to Upload Page (External)',
    [Language.ZH_CN]: '前往上传页面 (外部链接)',
    [Language.ZH_TW]: '前往上傳頁面 (外部連結)',
  },
  'album.campus': {
    [Language.EN]: 'Pending',
    [Language.ZH_CN]: '雲盤整理中',
    [Language.ZH_TW]: '雲盤整理中',
  },
  'album.campus.desc': {
    [Language.EN]: 'This collection is being prepared.',
    [Language.ZH_CN]: '雲盤整理中',
    [Language.ZH_TW]: '雲盤整理中',
  },
  'album.sports': {
    [Language.EN]: 'Shared collection',
    [Language.ZH_CN]: '共享相册',
    [Language.ZH_TW]: '共享相簿',
  },
  'album.sports.desc': {
    [Language.EN]: 'Browse the club’s shared OneDrive collection.',
    [Language.ZH_CN]: '浏览社团的 OneDrive 共享照片。',
    [Language.ZH_TW]: '瀏覽社團的 OneDrive 共享照片。',
  },
  'album.grad': {
    [Language.EN]: 'Coming soon',
    [Language.ZH_CN]: '雲盤整理中',
    [Language.ZH_TW]: '雲盤整理中',
  },
  'album.grad.desc': {
    [Language.EN]: 'This collection is being prepared.',
    [Language.ZH_CN]: '雲盤整理中',
    [Language.ZH_TW]: '雲盤整理中',
  },
  'btn.access': {
    [Language.EN]: 'Access Drive',
    [Language.ZH_CN]: '访问网盘',
    [Language.ZH_TW]: '訪問網盤',
  },

  // Guestbook
  'guestbook.title': {
    [Language.EN]: 'Leave a Message',
    [Language.ZH_CN]: '留下想法',
    [Language.ZH_TW]: '留下想法',
  },
  'guestbook.input.name': {
    [Language.EN]: 'Your Name',
    [Language.ZH_CN]: '你的名字',
    [Language.ZH_TW]: '你的名字',
  },
  'guestbook.input.msg': {
    [Language.EN]: 'Your Message...',
    [Language.ZH_CN]: '写下你的想法...',
    [Language.ZH_TW]: '寫下你的想法...',
  },
  'guestbook.submit': {
    [Language.EN]: 'Post Message',
    [Language.ZH_CN]: '发布想法',
    [Language.ZH_TW]: '發佈想法',
  },
  // Contact
  'contact.title': {
    [Language.EN]: 'Members',
    [Language.ZH_CN]: '社团成员',
    [Language.ZH_TW]: '社團成員',
  },
  'contact.add': {
    [Language.EN]: 'Add Your Contact Info',
    [Language.ZH_CN]: '添加你的联系方式',
    [Language.ZH_TW]: '添加你的聯繫方式',
  },
  'contact.role': {
    [Language.EN]: 'Role',
    [Language.ZH_CN]: '身份',
    [Language.ZH_TW]: '身份',
  },
  'contact.email': {  // 已經修改此處
    [Language.EN]: 'E-mail (Optional)',
    [Language.ZH_CN]: 'E-mail(选填)',
    [Language.ZH_TW]: 'E-mail (選填)',
    /*
    [Language.EN]: 'Wechat/QQ',
    [Language.ZH_CN]: '微信/QQ',
    [Language.ZH_TW]: '微信/QQ',*/
  },
  'contact.social': { //此處同上
    [Language.EN]: 'Wechat/QQ',
    [Language.ZH_CN]: '微信/QQ',
    [Language.ZH_TW]: '微信/QQ',
    /*
    [Language.EN]: 'E-mail (Optional)',
    [Language.ZH_CN]: 'E-mail(选填)',
    [Language.ZH_TW]: 'E-mail (選填)',*/
  },

  // Memories
  'memories.title': {
    [Language.EN]: 'Time we shared',
    [Language.ZH_CN]: '时光回忆录',
    [Language.ZH_TW]: '時光回憶錄',
  },
  'memories.readMore': {
    [Language.EN]: 'Read More',
    [Language.ZH_CN]: '阅读全文',
    [Language.ZH_TW]: '閱讀全文',
  },

  // Admin
  'admin.title': {
    [Language.EN]: 'Admin Dashboard',
    [Language.ZH_CN]: '后台管理',
    [Language.ZH_TW]: '後台管理',
  },
  'admin.login': {
    [Language.EN]: 'Login',
    [Language.ZH_CN]: '登录',
    [Language.ZH_TW]: '登錄',
  },
  'admin.pass': {
    [Language.EN]: 'Password',
    [Language.ZH_CN]: '密码',
    [Language.ZH_TW]: '密碼',
  },
  'admin.tab.contacts': {
    [Language.EN]: 'Manage Contacts',
    [Language.ZH_CN]: '管理联系人',
    [Language.ZH_TW]: '管理聯繫人',
  },
  'admin.tab.memories': {
    [Language.EN]: 'Manage Memories',
    [Language.ZH_CN]: '管理回忆录',
    [Language.ZH_TW]: '管理回憶錄',
  },
  'admin.addMemory': {
    [Language.EN]: 'Write New Memory',
    [Language.ZH_CN]: '撰写新文章',
    [Language.ZH_TW]: '撰寫新文章',
  },
  'add.cart': {
    [Language.EN]: 'Add to Cart',
    [Language.ZH_CN]: '加入购物车',
    [Language.ZH_TW]: '加入購物車',
  },
  'empty.cart': {
    [Language.EN]: 'Cart is empty',
    [Language.ZH_CN]: '购物车是空的',
    [Language.ZH_TW]: '購物車是空的',
  },
  'buy.contact':{
    [Language.EN]: 'Email, Wechat ID',
    [Language.ZH_CN]: '联系方式（电话，微信号）',
    [Language.ZH_TW]: '聯絡方式 (Email 或 Wechat ID)',
  }, 
  'sending.order':{
    [Language.EN]: 'Confirm Order',
    [Language.ZH_CN]: '确认送出订单',
    [Language.ZH_TW]: '確認送出訂單',
  },
  'title.souvenirs':{
    [Language.EN]: 'Souvenirs',
    [Language.ZH_CN]: '周边纪念品',
    [Language.ZH_TW]: '周邊紀念品',
  },
  'subtitle.souvenirs':{
    [Language.EN]: 'Purchase exclusive club souvenirs to support Time. Photography\'s continued creation.',
    [Language.ZH_CN]: '选购社团专属周边，支持 Time. Photography 继续创作。',
    [Language.ZH_TW]: '選購社團專屬周邊，支持 Time. Photography 繼續創作。',
  },
  'all.items': {
    [Language.EN]: 'All Items',
    [Language.ZH_CN]: '全部商品',
    [Language.ZH_TW]: '全部商品',
  },
  'sumup': {
    [Language.EN]: 'Total',
    [Language.ZH_CN]: '总金额 Total',
    [Language.ZH_TW]: '總金額 Total',
  },
};