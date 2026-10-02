/* SHOWDAY INFO 모바일 메뉴 + 보정 (mobile.css 와 함께 사용) */
(function () {
  'use strict';
  var d = document;
  function ready(fn) { d.readyState === 'loading' ? d.addEventListener('DOMContentLoaded', fn) : fn(); }

  ready(function () {
    var row = d.querySelector('nav .navrow');
    var links = d.querySelector('nav .nav-links');
    if (!row || !links) return;

    var path = location.pathname.replace(/index\.html$/, '');
    var cta = row.querySelector('.nav-cta');

    // ---- 드로어 구성: 데스크톱 메뉴(드롭다운 포함)를 그대로 복사 ----
    var drawer = d.createElement('div');
    drawer.className = 'm-drawer'; drawer.id = 'm-drawer';
    drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-label', '전체 메뉴');
    var head = d.createElement('div'); head.className = 'm-drawer-head';
    head.innerHTML = '<b>SHOWDAY</b>';
    var close = d.createElement('button');
    close.type = 'button'; close.className = 'nav-toggle'; close.setAttribute('aria-label', '메뉴 닫기');
    close.style.display = 'block'; close.setAttribute('aria-expanded', 'true');
    close.innerHTML = '<span></span><span></span><span></span>';
    head.appendChild(close); drawer.appendChild(head);

    function add(a, cls) {
      var c = d.createElement('a');
      c.href = a.getAttribute('href'); if (a.target) { c.target = a.target; c.rel = 'noopener'; }
      c.innerHTML = a.innerHTML; if (cls) c.className = cls;
      var h = a.getAttribute('href') || '';
      if (h.charAt(0) === '/' && h.split('#')[0] === path) c.setAttribute('aria-current', 'page');
      drawer.appendChild(c);
    }
    Array.prototype.forEach.call(links.children, function (el) {
      if (el.classList.contains('nav-dd')) {
        var main = el.querySelector(':scope > a');
        if (main) { var g = d.createElement('div'); g.className = 'm-group'; g.textContent = main.textContent.trim(); drawer.appendChild(g); }
        Array.prototype.forEach.call(el.querySelectorAll('.dd-menu a'), function (a) { add(a, 'm-sub'); });
      } else if (el.tagName === 'A') { add(el); }
    });
    if (cta) { var c2 = d.createElement('a'); c2.className = 'm-cta'; c2.href = cta.getAttribute('href'); c2.textContent = '제휴 · 사업 문의'; drawer.appendChild(c2); }

    var scrim = d.createElement('div'); scrim.className = 'm-scrim';
    var btn = d.createElement('button');
    btn.type = 'button'; btn.className = 'nav-toggle'; btn.setAttribute('aria-label', '메뉴 열기');
    btn.setAttribute('aria-controls', 'm-drawer'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    row.appendChild(btn); d.body.appendChild(scrim); d.body.appendChild(drawer);

    function open(v) {
      d.body.classList.toggle('m-open', v);
      btn.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (v) { close.focus(); } else if (d.activeElement && drawer.contains(d.activeElement)) { btn.focus(); }
    }
    btn.addEventListener('click', function () { open(true); });
    close.addEventListener('click', function () { open(false); });
    scrim.addEventListener('click', function () { open(false); });
    drawer.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) open(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900) open(false); });
    window.addEventListener('pageshow', function () { open(false); });
  });

  // ---- 파트너 유형 탭: 현재 탭을 화면 안으로 ----
  ready(function () {
    var on = d.querySelector('.ptabs a.on'); var wrap = d.querySelector('.ptabs .wrap');
    if (on && wrap && wrap.scrollWidth > wrap.clientWidth) {
      wrap.scrollLeft = Math.max(0, on.offsetLeft - 20 - (wrap.firstElementChild && wrap.firstElementChild.className === 'lbl' ? 0 : 0));
    }
  });

  // ---- 모바일에서 12.5px 미만 글씨 보정 (인쇄용 QR 카드는 제외) ----
  function bump() {
    if (window.innerWidth > 640) return;
    var els = d.body.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.closest('.qrc,.qr-card,.m-drawer,script,style,svg')) continue;
      var t = false, n = e.childNodes;
      for (var j = 0; j < n.length; j++) if (n[j].nodeType === 3 && n[j].textContent.trim()) { t = true; break; }
      if (t && parseFloat(getComputedStyle(e).fontSize) < 12.5) e.classList.add('m-fs');
    }
  }
  ready(function () { bump(); window.addEventListener('load', bump); });
})();

/* SHOWDAY mobile app-style navigation layer */
(function(){
  'use strict';
  var d=document;
  function ready(fn){d.readyState==='loading'?d.addEventListener('DOMContentLoaded',fn):fn();}
  ready(function(){
    if(d.querySelector('.sd-bottom-nav')) return;
    if(/^\/(terms|privacy|qr)\//.test(location.pathname)) return;

    var nav=d.querySelector('nav');
    if(!nav) return;

    /* Compact mobile entry card: service first, business pages second */
    if(location.pathname==='/' || /\/index\.html$/.test(location.pathname)){
      var entry=d.createElement('section');
      entry.className='sd-mobile-entry';
      entry.setAttribute('aria-label','SHOWDAY 모바일 빠른 시작');
      entry.innerHTML='\
        <div class="sd-entry-head"><span>SHOWDAY MOBILE</span><b>오늘 공연, 무엇부터 할까요?</b></div>\
        <div class="sd-entry-primary">\
          <a href="https://showday.kr/" target="_blank" rel="noopener"><i>⌕</i><strong>공연 찾기</strong><small>오늘·주말·내 주변</small></a>\
          <a href="https://map.showday.kr/" target="_blank" rel="noopener"><i>⌖</i><strong>지도</strong><small>가까운 공연·문화생활</small></a>\
          <a href="/live/"><i>●</i><strong>공연 당일</strong><small>입장·혼잡·주차·주변</small></a>\
        </div>\
        <div class="sd-entry-context">\
          <a href="/50plus/">50+ 문화생활</a><a href="/parents/">부모·동행자</a><a href="/partner/">파트너 참여</a>\
        </div>';
      nav.insertAdjacentElement('afterend',entry);
    }

    var bottom=d.createElement('div');
    bottom.className='sd-bottom-nav'; bottom.setAttribute('role','navigation'); bottom.setAttribute('aria-label','SHOWDAY 모바일 주요 메뉴');
    var items=[
      ['⌂','홈','/','internal'],
      ['⌕','공연찾기','https://showday.kr/','external'],
      ['●','공연당일','/live/','internal'],
      ['♡','내 공연','https://showday.kr/','external'],
      ['≡','더보기','#','more']
    ];
    var path=location.pathname.replace(/index\.html$/,'');
    items.forEach(function(it){
      var a=d.createElement('a'); a.href=it[2]; a.dataset.kind=it[3];
      if(it[3]==='external'){a.target='_blank';a.rel='noopener';}
      if((it[2]==='/'&&path==='/')||(it[2]!=='/'&&it[3]==='internal'&&path.indexOf(it[2])===0))a.className='on';
      a.innerHTML='<span class="ico">'+it[0]+'</span><span class="label">'+it[1]+'</span>';
      bottom.appendChild(a);
    });
    d.body.appendChild(bottom);

    var sheet=d.createElement('div'); sheet.className='sd-more-sheet'; sheet.setAttribute('aria-hidden','true');
    sheet.innerHTML='<button class="sd-sheet-scrim" aria-label="더보기 닫기"></button><div class="sd-sheet-panel"><div class="sd-sheet-handle"></div><div class="sd-sheet-title"><b>더보기</b><button type="button" aria-label="닫기">×</button></div><div class="sd-sheet-grid"><a href="https://map.showday.kr/" target="_blank" rel="noopener"><b>지도</b><small>내 주변 문화생활</small></a><a href="/50plus/"><b>50+</b><small>문화생활 큐레이션</small></a><a href="/parents/"><b>부모·동행자</b><small>기다리는 시간 활용</small></a><a href="/partner/store/"><b>매장 파트너</b><small>예약·주문·픽업</small></a><a href="/partner/agency/"><b>공연장·기획사</b><small>공연 등록·공식 안내</small></a><a href="/partner/collab/"><b>기관·기업</b><small>지역·브랜드 협업</small></a></div></div>';
    d.body.appendChild(sheet);
    function openSheet(v){sheet.classList.toggle('open',v);sheet.setAttribute('aria-hidden',v?'false':'true');d.body.classList.toggle('sd-sheet-open',v);}
    var more=bottom.querySelector('[data-kind="more"]');
    more.addEventListener('click',function(e){e.preventDefault();openSheet(true);});
    sheet.querySelector('.sd-sheet-scrim').addEventListener('click',function(){openSheet(false);});
    sheet.querySelector('.sd-sheet-title button').addEventListener('click',function(){openSheet(false);});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')openSheet(false);});
  });
})();
