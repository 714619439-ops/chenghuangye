/* ===== 城隍法脉 · 全局功能 ===== */

// === 导航切换（移动端汉堡菜单） ===
document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.addEventListener('click', function() {
      navLinks.classList.remove('open');
    });
  });

  // 高亮当前页面导航
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    if (a.getAttribute('href') === currentPath) {
      a.classList.add('active');
    }
  });

  // 返回顶部按钮
  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function() {
      window.scrollY > 400 ? backTop.classList.add('visible') : backTop.classList.remove('visible');
    });
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// === 复制文本 ===
function copyText(text, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      if (btn) { btn.classList.add('copied'); var orig = btn.textContent; btn.textContent = '已复制 ✓'; setTimeout(function() { btn.textContent = orig; btn.classList.remove('copied'); }, 2000); }
    }).catch(function() { fallbackCopy(text, btn); });
  } else { fallbackCopy(text, btn); }
}

function fallbackCopy(text, btn) {
  var ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); if (btn) { btn.classList.add('copied'); var orig = btn.textContent; btn.textContent = '已复制 ✓'; setTimeout(function() { btn.textContent = orig; btn.classList.remove('copied'); }, 2000); } }
  catch(e) { alert('复制失败'); }
  document.body.removeChild(ta);
}

// === 渲染各司详情页 — 兼容 SIXI_DATA 数据格式 ===
function renderSiPage(si) {
  if (!si) return;
  document.title = si.name + ' - 城隍法脉·二十一司护法系统';

  // 头部
  var headerEl = document.getElementById('si-header');
  if (headerEl) {
    var num = (si.id < 10 ? '0' : '') + si.id;
    var gods = si.god1 + (si.god2 ? ' · ' + si.god2 : '');
    headerEl.innerHTML =
      '<div class="si-detail-header fade-in">' +
        '<div class="si-number-badge">第' + num + '司</div>' +
        '<h1>' + si.name + '</h1>' +
        '<p class="gods">' + gods + '</p>' +
        '<p style="color:var(--text-light);margin-top:0.5rem;font-size:0.9rem">' + (si.pinyin || '') + '</p>' +
        '<p style="color:var(--text-light);margin-top:0.5rem;font-size:0.9rem">' + si.keyword + '</p>' +
      '</div>';
  }

  // 职能
  var funcEl = document.getElementById('si-funcs');
  if (funcEl && si.funcs) {
    funcEl.innerHTML = si.funcs.map(function(f) { return '<li>' + f + '</li>'; }).join('');
  }

  // 适用场景
  var sceneEl = document.getElementById('si-scenarios');
  if (sceneEl && si.scenarios) {
    sceneEl.innerHTML = si.scenarios.map(function(s) { return '<span class="tag">' + s + '</span>'; }).join('');
  }

  // 养护要点
  var careEl = document.getElementById('si-care');
  if (careEl && si.care) {
    careEl.innerHTML = si.care.map(function(c) { return '<li>' + c + '</li>'; }).join('');
  }

  // 祈请文 — 使用 formatPrayer 动态生成
  var prayerEl = document.getElementById('si-prayer');
  if (prayerEl) {
    prayerEl.textContent = formatPrayer(si);
  }

  // 复制按钮
  var copyBtn = document.getElementById('copy-prayer');
  if (copyBtn) {
    copyBtn.onclick = function() {
      var text = document.getElementById('si-prayer').textContent;
      copyText(text, copyBtn);
    };
  }
}

// === 格式化祈请文 — 根据 SIXI_DATA 生成 ===
function formatPrayer(si) {
  var gods = si.god1 + (si.god2 ? '、' + si.god2 : '');
  return '弟子___（法号___），一心顶礼。\n\n' +
    '愿以此心，代佛行化；愿以此身，代当境城隍、土地、山神及家宅六神护佑一方。\n\n' +
    '冥阳苦未尽，誓不成佛道；十方若有苦，寻声必救度。\n\n' +
    '今发正心正念，恭请城隍法脉二十一司护法，慈悲降临，威光护持。\n\n' +
    '特请：' + gods + '\n\n' +
    '伏愿' + (si.funcs ? si.funcs.join('，') : '') + '。\n' +
    '令弟子及一切众生，远离' + si.name + '相关之苦，身心安泰。\n\n' +
    '恭请' + si.name + '护法慈悲加持，护持弟子' + (si.funcs ? si.funcs.slice(0,2).join('，') : '') + '，\n' +
    '令' + (si.keyword || '身心') + '调和，内外清净。\n\n' +
    '南无' + si.name + '护法菩萨（三遍）\n\n' +
    '愿以此祈请' + si.name + '功德，回向尽虚空遍法界一切众生，\n' +
    '愿众生远离' + si.name + '诸苦，身心康宁[合十]\n\n' +
    '【恭请鉴察】\n' +
    '南无幽冥教主地藏王菩萨\n' +
    '南无护法韦驮尊天菩萨\n' +
    '当境城隍尊神、土地正神、' + si.name + '护法鉴察\n' +
    '弟子___顶礼 🙏🙏🙏';
}
