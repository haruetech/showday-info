/*
 * SHOWDAY INFO 공통 푸터 동기화
 * 메인 사이트(showday.kr)의 관리자 화면에서 등록한 값을 푸터에 자동 반영합니다.
 *  - 관리자 > 채널 설정  : 카카오톡 채널 ID  → "카카오톡 채널 추가" 버튼 + QR
 *  - 관리자 > 사업자 정보 : 상호·대표·사업자번호·통신판매업·주소·고객센터
 * 값을 불러오지 못하면 HTML에 적어 둔 기본 문구가 그대로 보입니다.
 */
(function () {
  var API = 'https://showday.kr/api/settings';
  var $ = function (id) { return document.getElementById(id); };
  var foot = document.querySelector('.site-footer');
  if (!foot) return;

  fetch(API, { mode: 'cors' }).then(function (r) { return r.json(); }).then(function (d) {
    applyHero(d);
    applyPolicy(d);
    applyBusiness(d);
    applyKakao(d.kakao_channel_id);
  }).catch(function () { /* 기본 문구 유지 */ });

  // 관리자에서 상단 이미지를 등록하면(info_hero_main / info_hero_50plus) 기본 이미지 대신 노출합니다.
  function applyHero(d) {
    var map = { main: d.info_hero_main, '50plus': d.info_hero_50plus };
    Object.keys(map).forEach(function (k) {
      var url = String(map[k] || '').trim();
      var img = document.querySelector('img[data-hero="' + k + '"]');
      if (url && img) { img.style.display = ''; if (img.parentNode) img.parentNode.style.display = ''; img.src = url; }
    });
  }

  // 이용약관·개인정보처리방침 페이지의 시행일·회사명·연락처 (관리자 > 사업자 정보 값)
  function applyPolicy(d) {
    var map = { effective: d.policy_effective_date, company: d.business_name, contact: d.support_contact, officer: d.ceo_name };
    document.querySelectorAll('[data-fill]').forEach(function (el) {
      var v = String(map[el.getAttribute('data-fill')] || '').trim();
      if (v) el.textContent = v;
    });
  }

  function applyBusiness(d) {
    if (!(d.business_name || d.ceo_name || d.business_reg_no)) return;
    var l1 = $('sfBiz1'), l2 = $('sfBiz2');
    if (l1) {
      var t = '상호명 ' + (d.business_name || '-') + ' · 대표 ' + (d.ceo_name || '-') + ' · 사업자등록번호 ' + (d.business_reg_no || '-');
      if (d.mail_order_no) t += ' 통신판매업신고 ' + d.mail_order_no;
      if (d.address) t += ' · 주소 ' + d.address;
      l1.textContent = t;
    }
    if (l2 && d.support_contact) {
      var no = String(d.business_reg_no || '').replace(/\D/g, '');
      var url = 'https://www.ftc.go.kr/bizCommPop.do' + (no ? '?wrkr_no=' + no : '');
      l2.textContent = '';
      l2.appendChild(document.createTextNode('고객센터 ' + d.support_contact + ' · 사업자등록번호는 '));
      var a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = '공정거래위원회 사업자정보확인';
      l2.appendChild(a);
      l2.appendChild(document.createTextNode('에서 조회하실 수 있습니다.'));
    }
  }

  function applyKakao(id) {
    id = String(id || '').trim();
    if (!id) return;
    var url = 'https://pf.kakao.com/' + encodeURIComponent(id) + '';
    var btn = $('sfKakao'), qr = $('sfQr');
    if (btn) { btn.href = url; btn.hidden = false; }
    if (!qr) return;
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    s.onload = function () {
      try {
        var box = qr.querySelector('.sf-qr-img');
        box.innerHTML = '';
        new QRCode(box, { text: 'https://pf.kakao.com/' + id, width: 64, height: 64, colorDark: '#241a10', colorLight: '#ffffff' });
        qr.hidden = false;
      } catch (e) {}
    };
    document.head.appendChild(s);
  }
})();
