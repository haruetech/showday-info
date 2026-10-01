/*
 * 유입 경로 기록: QR·전단지 등으로 ?src=값 이 붙어 들어오면 기억해 두었다가,
 * 제휴·사업 문의 양식(숨은 입력칸 #srcField)에 함께 담아 보냅니다.
 */
(function () {
  var KEY = 'showday_src';
  try {
    var p = new URLSearchParams(location.search).get('src');
    if (p) sessionStorage.setItem(KEY, p.slice(0, 60));
  } catch (e) {}
  var f = document.getElementById('srcField');
  if (!f) return;
  var v = '';
  try { v = sessionStorage.getItem(KEY) || ''; } catch (e) {}
  if (!v && document.referrer) { try { v = 'ref:' + new URL(document.referrer).hostname; } catch (e) {} }
  f.value = v || 'direct';
})();
