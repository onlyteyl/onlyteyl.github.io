var PROFILE_IMG = 'img9.jpg';

var MUSIC_FILES = [
    { file: 'Over October - Intertwine (Official Lyric Video) ft. The Ridleys.mp3', title: 'Intertwine', artist: 'Over October' },
    { file: 'Niki Playlist.mp3', title: 'Niki Playlist', artist: 'Niki' },
    { file: 'fave.mp3', title: 'I love you', artist: 'Allen Playlist' },
];

var IMG_FILES = [
    'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg',
    'img7.jpg', 'img8.jpg', 'img9.jpg',
];

var MUSIC_PATH = 'assets/music/';
var IMG_PATH = 'assets/img/';


//  STORAGE HELPERS

var LS = {
    get: function (key, def) {
        try {
            var v = localStorage.getItem('loveos_' + key);
            return v !== null ? JSON.parse(v) : def;
        } catch (e) { return def; }
    },
    set: function (key, val) {
        try { localStorage.setItem('loveos_' + key, JSON.stringify(val)); } catch (e) { }
    }
};


//  STATE

var topZ = 300;
var lastCalMin = -1;
var cdTarget = null;
var pomSecs = 0, pomTotal = 1500, pomRunning = false, pomTimer = null, pomSessions = 0;
var fcIdx = 0, fcFlipped = false;
var todos = [];
var nidx = 0;
var audioEl, audioIdx = 0;
var photoViewIdx = 0;
var wxLoaded = false, wxLoadedTime = 0;

//  WINDOW MANAGEMENT

function bringToFront(win) { topZ++; win.style.zIndex = topZ; }

function setDockDot(id, open) {
    var item = document.querySelector('#dock .dock-item[data-app="' + id + '"]');
    if (!item) return;
    var dot = item.querySelector('.dock-dot');
    if (dot) dot.classList.toggle('open', open);
}

function openApp(id) {
    var win = document.getElementById('win-' + id);
    if (!win) return;
    win.style.display = 'flex';
    if (!win.dataset.opened) {
        win.dataset.opened = '1';
        var vw = window.innerWidth, vh = window.innerHeight;
        var mw = win.offsetWidth || 360;
        var mh = win.offsetHeight || 400;
        win.style.left = Math.max(0, Math.round((vw - mw) / 2)) + 'px';
        win.style.top = Math.max(32, Math.round((vh - mh) / 2)) + 'px';
    }
    bringToFront(win);
    setDockDot(id, true);
    if (id === 'notes') renderNotes();
    if (id === 'cal') { lastCalMin = -1; buildCal(new Date()); }
    if (id === 'wx') fetchWeather();
    if (id === 'mem') renderMemories();
    if (id === 'music') renderPlaylist();
    if (id === 'blast') blastInit();
    if (id === 'quiz') quizStart();
    if (id === 'rev') renderReviewerNotes();
    if (id === 'pdf' && pdfDoc) setTimeout(function () { pdfRenderPage(pdfCurPage); }, 60);
}

function closeApp(id) {
    var win = document.getElementById('win-' + id);
    if (!win) return;
    win.style.display = 'none';
    setDockDot(id, false);
}

// Draggable windows
// Perf note: the old handler re-read win.offsetWidth (forces a synchronous
// layout) on every single mousemove, and applied the style change immediately
// instead of batching with the browser's paint cycle. Both cause the laggy
// cursor-trailing feeling on window drag, especially for windows with heavier
// content (PDF canvas, block puzzle grid). Fixed by caching the window's size
// once at drag-start and batching position updates with requestAnimationFrame.
document.querySelectorAll('.titlebar[data-win]').forEach(function (tb) {
    var win = tb.closest('.win');
    var id = tb.getAttribute('data-win');
    var sx, sy, sl, st, ww, wh, dragging = false;
    var rafId = null, pendingX = 0, pendingY = 0;
    var closeBtn = tb.querySelector('.tl-r');
    if (closeBtn) closeBtn.addEventListener('mousedown', function (e) { e.stopPropagation(); e.preventDefault(); closeApp(id); });
    tb.addEventListener('mousedown', function (e) {
        if (e.target.classList.contains('tl')) return;
        e.preventDefault(); dragging = true; bringToFront(win);
        var r = win.getBoundingClientRect();
        sx = e.clientX; sy = e.clientY; sl = r.left; st = r.top;
        ww = r.width; wh = r.height;
        win.style.willChange = 'left, top';
        document.body.classList.add('dragging-active');
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });
    function onMove(e) {
        if (!dragging) return;
        pendingX = e.clientX; pendingY = e.clientY;
        if (rafId) return;
        rafId = requestAnimationFrame(applyMove);
    }
    function applyMove() {
        rafId = null;
        var nx = Math.max(0, Math.min(sl + (pendingX - sx), window.innerWidth - ww));
        var ny = Math.max(28, Math.min(st + (pendingY - sy), window.innerHeight - 40));
        win.style.left = nx + 'px'; win.style.top = ny + 'px';
    }
    function onUp() {
        dragging = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        win.style.willChange = '';
        document.body.classList.remove('dragging-active');
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }
    win.addEventListener('mousedown', function () { bringToFront(win); });
});

// Draggable icons
// Perf note: two things made this feel laggy. (1) The CSS transition on
// left/top (used for the smooth auto-grid snap) was also active during manual
// drags, so every mousemove queued up a ~250ms eased animation instead of
// moving instantly with the cursor. (2) The desktop's bounding rect and the
// icon's own offsetWidth/offsetHeight were re-read (forcing layout) on every
// mousemove. Fixed by removing the transition for the duration of the drag,
// caching all rects once at drag-start, and batching moves with
// requestAnimationFrame.
document.querySelectorAll('.app-icon').forEach(function (el) {
    var sx, sy, sl, st, dragging = false, moved = false;
    var dr, iw, ih, rafId = null, pendingDx = 0, pendingDy = 0;
    el.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return; e.preventDefault(); dragging = true; moved = false;
        el.classList.remove('snap');
        var r = el.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; sl = r.left; st = r.top;
        dr = document.getElementById('desktop').getBoundingClientRect();
        iw = el.offsetWidth; ih = el.offsetHeight;
        document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
    });
    function onMove(e) {
        if (!dragging) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
        pendingDx = dx; pendingDy = dy;
        if (rafId) return;
        rafId = requestAnimationFrame(applyMove);
    }
    function applyMove() {
        rafId = null;
        if (!moved) return;
        el.style.left = Math.max(0, Math.min(sl + pendingDx - dr.left, dr.width - iw)) + 'px';
        el.style.top = Math.max(32, Math.min(st + pendingDy - dr.top, dr.height - ih - 80)) + 'px';
    }
    function onUp() {
        dragging = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
        if (moved) el.addEventListener('click', function (e) { e.stopPropagation(); }, { capture: true, once: true });
    }
});

//  DESKTOP ICON AUTO-GRID LAYOUT
// Icons are laid out programmatically so they always line up cleanly,
// regardless of how many apps exist or the screen size.
function layoutIcons() {
    var icons = Array.prototype.slice.call(document.querySelectorAll('.app-icon'));
    if (!icons.length) return;
    var desktop = document.getElementById('desktop');
    var dw = desktop.clientWidth;
    var cols = dw < 420 ? 3 : dw < 620 ? 4 : dw < 900 ? 4 : 5;
    var colGap = Math.max(84, Math.min(100, Math.floor((dw - 40) / cols)));
    var rowGap = 128;
    var totalW = (cols - 1) * colGap;
    var startLeft = dw / 2 - totalW / 2;
    var startTop = 118;
    icons.forEach(function (el, i) {
        el.classList.add('snap');
        var col = i % cols, row = Math.floor(i / cols);
        var iw = el.offsetWidth || 84;
        el.style.left = Math.round(startLeft + col * colGap - iw / 2) + 'px';
        el.style.top = Math.round(startTop + row * rowGap) + 'px';
    });
    clearTimeout(layoutIcons._snapT);
    layoutIcons._snapT = setTimeout(function () {
        icons.forEach(function (el) { el.classList.remove('snap'); });
    }, 260);
}
var iconResizeRaf = null;
window.addEventListener('resize', function () {
    if (iconResizeRaf) cancelAnimationFrame(iconResizeRaf);
    iconResizeRaf = requestAnimationFrame(layoutIcons);
});
layoutIcons();
setTimeout(layoutIcons, 50); // re-run once fonts/icons have their real width


//  CLOCK & CALENDAR

var elMbTime = document.getElementById('mb-time');
var elIcoMo = document.getElementById('ico-mo');
var elIcoD = document.getElementById('ico-d');
var elDockDay = document.getElementById('dock-day');

function tick() {
    var n = new Date();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var mos = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    function p(v) { return String(v).padStart(2, '0'); }
    elMbTime.textContent = p(n.getHours()) + ':' + p(n.getMinutes());
    elIcoMo.textContent = mos[n.getMonth()];
    elIcoD.textContent = n.getDate();
    elDockDay.textContent = n.getDate();
    var calWin = document.getElementById('win-cal');
    if (calWin && calWin.style.display !== 'none') {
        document.getElementById('mod-mo').textContent = months[n.getMonth()];
        document.getElementById('mod-dn').textContent = n.getDate();
        document.getElementById('mod-wd').textContent = days[n.getDay()];
        document.getElementById('mod-clk').textContent = p(n.getHours()) + ':' + p(n.getMinutes()) + ':' + p(n.getSeconds());
        var curMin = n.getHours() * 60 + n.getMinutes();
        if (curMin !== lastCalMin) { lastCalMin = curMin; buildCal(n); }
    }
    if (cdTarget) updateCd();
    syncAudioProgress();
}
setInterval(tick, 1000); tick();

function buildCal(now) {
    var dh = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var today = now.getDate();
    var first = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    var last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    var prev = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    document.getElementById('cal-hd').innerHTML = dh.map(function (d) { return '<div>' + d + '</div>'; }).join('');
    var html = '';
    for (var i = 0; i < first; i++) html += '<div class="cal-cell other">' + (prev - first + i + 1) + '</div>';
    for (var d = 1; d <= last; d++) html += '<div class="cal-cell' + (d === today ? ' today' : '') + '">' + d + '</div>';
    var total = first + last, rows = Math.ceil(total / 7) * 7;
    for (var j = 1; j <= rows - total; j++) html += '<div class="cal-cell other">' + j + '</div>';
    document.getElementById('cal-body').innerHTML = html;
}


//  WEATHER

var wmoDesc = { 0: 'Clear sky ☀️', 1: 'Mainly clear 🌤️', 2: 'Partly cloudy ⛅', 3: 'Overcast ☁️', 45: 'Foggy 🌫️', 48: 'Icy fog 🌫️', 51: 'Light drizzle 🌦️', 53: 'Drizzle 🌦️', 55: 'Heavy drizzle 🌦️', 61: 'Light rain 🌧️', 63: 'Rain 🌧️', 65: 'Heavy rain 🌧️', 71: 'Light snow 🌨️', 73: 'Snow 🌨️', 75: 'Heavy snow 🌨️', 80: 'Showers 🌦️', 81: 'Showers 🌧️', 82: 'Heavy showers 🌧️', 95: 'Thunderstorm ⛈️', 96: 'Thunderstorm ⛈️', 99: 'Thunderstorm ⛈️' };
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function fetchWeather(force, attempt) {
    attempt = attempt || 1;
    if (!force && wxLoaded && (Date.now() - wxLoadedTime) < 600000) return;
    var body = document.getElementById('wx-body');
    body.innerHTML = '<div class="wx-loading"><i class="bi bi-cloud-fill"></i> Loading weather' + (attempt > 1 ? ' (retry ' + attempt + '/3)' : '') + '…</div>';

    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 12000) : null;

    fetch('https://api.open-meteo.com/v1/forecast?latitude=14.1053&longitude=121.1413&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,uv_index_max&forecast_days=5&timezone=Asia%2FManila', controller ? { signal: controller.signal } : undefined)
        .then(function (r) {
            if (timeoutId) clearTimeout(timeoutId);
            if (!r.ok) throw new Error('Weather service returned status ' + r.status);
            return r.json();
        })
        .then(function (data) {
            if (!data || !data.current || !data.daily) throw new Error('Unexpected weather response shape');
            wxLoaded = true; wxLoadedTime = Date.now();
            var c = data.current, d = data.daily;
            var uvVal = (d.uv_index_max && d.uv_index_max[0] != null) ? d.uv_index_max[0] : 0;
            var uvLbl = uvVal <= 2 ? 'Low' : uvVal <= 5 ? 'Moderate' : uvVal <= 7 ? 'High' : 'Very High';
            var fc = '';
            for (var i = 0; i < 5; i++) {
                var dt = new Date(d.time[i] + 'T12:00:00');
                fc += '<div class="wx-day"><div class="wx-dn">' + dayNames[dt.getDay()] + '</div><div class="wx-di">' + (wmoDesc[d.weather_code[i]] || '☀️').split(' ').pop() + '</div><div class="wx-dt">' + Math.round(d.temperature_2m_max[i]) + '°</div></div>';
            }
            body.innerHTML = '<div class="wx-hero"><div class="wx-city">Santo Tomas, Calabarzon</div><div class="wx-temp">' + Math.round(c.temperature_2m) + '°</div><div class="wx-desc">' + (wmoDesc[c.weather_code] || 'Clear ☀️') + '</div></div><div class="wx-row"><div class="wx-stat"><div class="wx-sl">Humidity</div><div class="wx-sv">' + c.relative_humidity_2m + '%</div></div><div class="wx-stat"><div class="wx-sl">Wind</div><div class="wx-sv">' + Math.round(c.wind_speed_10m) + ' km/h</div></div><div class="wx-stat"><div class="wx-sl">UV Index</div><div class="wx-sv">' + uvLbl + '</div></div><div class="wx-stat"><div class="wx-sl">Feels like</div><div class="wx-sv">' + Math.round(c.apparent_temperature) + '°</div></div></div><div class="wx-forecast">' + fc + '</div>';
        })
        .catch(function (err) {
            if (timeoutId) clearTimeout(timeoutId);
            console.error('Weather fetch failed (attempt ' + attempt + '):', err);
            if (attempt < 3) {
                setTimeout(function () { fetchWeather(true, attempt + 1); }, 1500 * attempt);
                return;
            }
            wxLoaded = false;
            var msg = err && err.name === 'AbortError' ? 'Connection to the weather server timed out.' : (err && err.message ? err.message : 'Unknown error');
            body.innerHTML = '<div class="wx-loading">Could not load weather. 🌐<br><small style="opacity:.6;">' + msg + '</small><br><small style="opacity:.5;">This can happen if your network blocks the weather API. Try a different network, or wait — it often clears up on its own.</small><br><button class="wx-retry-btn" onclick="fetchWeather(true)">Try again</button></div>';
        });
}


//  LOVE NOTES 
var defaultNotes = [
    'Hi love! Welcome to the webpage that I made for you. I hope you enjoy it. If you encounter any problems, you can message me on my website or email me... char! No need, message mo na lang ako directly, okii? I love you. Enjoy!',
    'I hope this website helps kahit konti sa studies mo because I know hindi ka naman nagpa-Pomodoro. You already have Spotify, pero you can use this anytime naman. No ads \'to ah! HAHAHAHA.',
    'Hi love, I just want you to know that I love you so much. Thank you for these almost 2 years together. Ikaw talaga yung pinaka-lucky na gift na natanggap ko, promise. ',
    'I swear, this website was supposed to stay hidden because it\'s still not finished, but yeah, enjoy the current features muna. Soon, I\'ll add games here so you can play directly on the web, okii? I love you so much. ',
    'wait lang ikaw sa ibang notes........',
];
var notes = LS.get('notes', defaultNotes);
nidx = LS.get('nidx', 0);
if (nidx >= notes.length) nidx = 0;

function renderNotes() {
    document.getElementById('note-body').textContent = notes[nidx];
    document.getElementById('note-nav').innerHTML = notes.map(function (_, i) {
        return '<div class="ndot' + (i === nidx ? ' on' : '') + '" onclick="goNote(' + i + ')"></div>';
    }).join('');
}
function goNote(i) { nidx = i; LS.set('nidx', nidx); renderNotes(); }
function addNote() {
    var inp = document.getElementById('ninp'), t = inp.value.trim();
    if (!t) return;
    notes.push(t);
    nidx = notes.length - 1;
    inp.value = '';
    LS.set('notes', notes);
    LS.set('nidx', nidx);
    renderNotes();
}

//  MEMORIES + PHOTO VIEWER

function renderMemories() {
    var grid = document.getElementById('gal-grid');
    grid.innerHTML = '';
    if (IMG_FILES.length === 0) {
        grid.innerHTML = '<div style="grid-column:span 3;text-align:center;padding:30px 0;font-size:13px;color:#ccc;line-height:2;">No images yet.<br>Add filenames to <code style=\'font-size:11px;background:rgba(0,0,0,.06);padding:2px 6px;border-radius:5px;\'>IMG_FILES</code> at the top of the script.</div>';
        return;
    }
    IMG_FILES.forEach(function (fname, i) {
        var div = document.createElement('div');
        div.className = 'gi';
        var img = document.createElement('img');
        img.src = IMG_PATH + fname;
        img.alt = fname;
        img.onerror = function () {
            div.innerHTML = '<div class="gi-empty-inner"><span>🖼️</span><small>Not found</small></div>';
        };
        div.appendChild(img);
        var ov = document.createElement('div');
        ov.className = 'gi-overlay';
        ov.innerHTML = '<span>🔍</span>';
        div.appendChild(ov);
        div.onclick = (function (idx) { return function () { openPhotoViewer(idx); }; })(i);
        grid.appendChild(div);
    });
}

function openPhotoViewer(idx) {
    photoViewIdx = idx;
    var win = document.getElementById('win-photo');
    win.style.display = 'flex';
    if (!win.dataset.opened) {
        win.dataset.opened = '1';
        var vw = window.innerWidth, vh = window.innerHeight;
        win.style.left = Math.max(0, Math.round((vw - 520) / 2)) + 'px';
        win.style.top = Math.max(32, Math.round((vh - 500) / 2)) + 'px';
    }
    bringToFront(win);
    showPhoto(photoViewIdx);
}

function showPhoto(idx) {
    var fname = IMG_FILES[idx];
    document.getElementById('photo-viewer-img').src = IMG_PATH + fname;
    document.getElementById('photo-win-title').textContent = fname;
    document.getElementById('photo-counter').textContent = (idx + 1) + ' / ' + IMG_FILES.length;
}

function photoNav(dir) {
    photoViewIdx = (photoViewIdx + dir + IMG_FILES.length) % IMG_FILES.length;
    showPhoto(photoViewIdx);
}


//  COUNTDOWN  —  persisted

function setCd() {
    var name = document.getElementById('cd-name-inp').value.trim() || 'Our Special Day 💕';
    var date = document.getElementById('cd-date-inp').value;
    if (!date) return;
    cdTarget = new Date(date + 'T00:00:00');
    document.getElementById('cd-title').textContent = name;
    LS.set('cd', { name: name, date: date });
    updateCd();
}
function updateCd() {
    if (!cdTarget) return;
    var diff = cdTarget - new Date();
    if (diff <= 0) {
        ['cd-d', 'cd-h', 'cd-m', 'cd-s'].forEach(function (id) { document.getElementById(id).textContent = '🎉'; });
        return;
    }
    document.getElementById('cd-d').textContent = Math.floor(diff / 86400000);
    document.getElementById('cd-h').textContent = Math.floor((diff % 86400000) / 3600000);
    document.getElementById('cd-m').textContent = Math.floor((diff % 3600000) / 60000);
    document.getElementById('cd-s').textContent = Math.floor((diff % 60000) / 1000);
}

(function () {
    var saved = LS.get('cd', null);
    if (saved) {
        cdTarget = new Date(saved.date + 'T00:00:00');
        document.getElementById('cd-date-inp').value = saved.date;
        document.getElementById('cd-name-inp').value = saved.name;
        document.getElementById('cd-title').textContent = saved.name;
    } else {
        var yr = new Date().getFullYear();
        var sep = new Date(yr + '-09-01T00:00:00');
        if (sep < new Date()) sep = new Date((yr + 1) + '-09-01T00:00:00');
        cdTarget = sep;
        var d = sep.toISOString().split('T')[0];
        document.getElementById('cd-date-inp').value = d;
        document.getElementById('cd-name-inp').value = '2nd Anniversary 💕';
        document.getElementById('cd-title').textContent = '2nd Anniversary 💕 ';
    }
    updateCd();
})();

//  MY LOVE

(function () {
    var start = new Date('2024-09-01T00:00:00');
    var days = Math.max(0, Math.floor((new Date() - start) / 86400000));
    document.getElementById('days-together').textContent = days;
    if (PROFILE_IMG) {
        var av = document.getElementById('profile-av-wrap');
        av.innerHTML = '<img src="' + IMG_PATH + PROFILE_IMG + '" alt="My Love" onerror="this.parentNode.innerHTML=\'\'"/>';
    }
})();

//  MUSIC

audioEl = document.getElementById('audio-player');

// Restore saved volume
var savedVol = LS.get('music_vol', 70);
audioEl.volume = savedVol / 100;
var volSlider = document.querySelector('.vol-row input[type=range]');
if (volSlider) volSlider.value = savedVol;

audioEl.addEventListener('ended', function () { audioNext(); });
audioEl.addEventListener('loadedmetadata', function () {
    if (!isFinite(audioEl.duration)) return;
    var m = Math.floor(audioEl.duration / 60), s = Math.floor(audioEl.duration % 60);
    document.getElementById('ptot').textContent = m + ':' + String(s).padStart(2, '0');
});
document.getElementById('prog-bar-click').addEventListener('click', function (e) {
    if (!audioEl.duration) return;
    var r = this.getBoundingClientRect();
    audioEl.currentTime = ((e.clientX - r.left) / r.width) * audioEl.duration;
});

// Restore last track
audioIdx = LS.get('music_idx', 0);
if (audioIdx >= MUSIC_FILES.length) audioIdx = 0;

function loadAudioTrack(idx) {
    if (!MUSIC_FILES.length) return;
    var track = MUSIC_FILES[idx];
    var fname = track.file || track;
    var title = track.title || fname.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    var artist = track.artist || '—';
    audioEl.src = MUSIC_PATH + fname;
    document.getElementById('sname').textContent = title;
    document.getElementById('sartist').textContent = artist;
    document.getElementById('pcur').textContent = '0:00';
    document.getElementById('ptot').textContent = '—:——';
    document.getElementById('pfill').style.width = '0%';
    audioEl.load();
    LS.set('music_idx', idx);
    renderPlaylist();
}

function audioToggle() {
    if (!MUSIC_FILES.length) return;
    if (!audioEl.src || audioEl.src === window.location.href) { loadAudioTrack(0); }
    if (audioEl.paused) {
        audioEl.play();
        document.getElementById('playbtn').innerHTML = '<i class="bi bi-pause-fill"></i>';
        document.getElementById('vinyl').className = 'vinyl spin';
    } else {
        audioEl.pause();
        document.getElementById('playbtn').innerHTML = '<i class="bi bi-play-fill"></i>';
        document.getElementById('vinyl').className = 'vinyl';
    }
}
function audioPrev() {
    if (!MUSIC_FILES.length) return;
    audioIdx = (audioIdx - 1 + MUSIC_FILES.length) % MUSIC_FILES.length;
    loadAudioTrack(audioIdx); audioEl.play();
    document.getElementById('playbtn').innerHTML = '<i class="bi bi-pause-fill"></i>';
    document.getElementById('vinyl').className = 'vinyl spin';
}
function audioNext() {
    if (!MUSIC_FILES.length) return;
    audioIdx = (audioIdx + 1) % MUSIC_FILES.length;
    loadAudioTrack(audioIdx); audioEl.play();
    document.getElementById('playbtn').innerHTML = '<i class="bi bi-pause-fill"></i>';
    document.getElementById('vinyl').className = 'vinyl spin';
}
function setVol(v) {
    audioEl.volume = v / 100;
    LS.set('music_vol', parseInt(v));
}
function syncAudioProgress() {
    if (!audioEl || audioEl.paused || !audioEl.duration) return;
    var pct = (audioEl.currentTime / audioEl.duration) * 100;
    document.getElementById('pfill').style.width = pct + '%';
    var m = Math.floor(audioEl.currentTime / 60), s = Math.floor(audioEl.currentTime % 60);
    document.getElementById('pcur').textContent = m + ':' + String(s).padStart(2, '0');
}
function renderPlaylist() {
    var wrap = document.getElementById('music-playlist-wrap');
    if (!MUSIC_FILES.length) {
        wrap.innerHTML = '<div class="music-empty">Add filenames to <code>MUSIC_FILES</code> at the top of the script.<br>Files go in <code>assets/music/</code></div>';
        return;
    }
    var html = '<div class="music-playlist">';
    MUSIC_FILES.forEach(function (f, i) {
        var title = f.title || (f.file || f).replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        var artist = f.artist || '';
        var label = title + (artist ? ' — ' + artist : '');
        html += '<div class="pl-item' + (i === audioIdx ? ' active' : '') + '" onclick="audioIdx=' + i + ';loadAudioTrack(' + i + ');audioEl.play();document.getElementById(\'playbtn\').innerHTML=\'<i class=\\\'bi bi-pause-fill\\\'></i>\';document.getElementById(\'vinyl\').className=\'vinyl spin\';">' + (i === audioIdx ? '▶ ' : '') + label + '</div>';
    });
    html += '</div>';
    wrap.innerHTML = html;
}

if (MUSIC_FILES.length) { loadAudioTrack(audioIdx); }
renderPlaylist();


//  POMODORO  —  sessions count persisted

pomSessions = LS.get('pom_sessions', 0);
(function () {
    document.querySelectorAll('.pom-dot').forEach(function (d, i) {
        d.classList.toggle('done', i < pomSessions);
    });
})();

function setPomMode(mins, label, btn) {
    document.querySelectorAll('.pom-mode').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active'); pomTotal = mins * 60; resetPom();
    document.getElementById('pom-label').textContent = label;
}
function togglePom() {
    pomRunning = !pomRunning;
    document.getElementById('pom-start').textContent = pomRunning ? 'Pause' : 'Start';
    if (pomRunning) {
        pomTimer = setInterval(function () {
            pomSecs++;
            if (pomSecs >= pomTotal) {
                clearInterval(pomTimer); pomRunning = false;
                pomSessions = Math.min(pomSessions + 1, 4);
                LS.set('pom_sessions', pomSessions);
                document.querySelectorAll('.pom-dot').forEach(function (d, i) { d.classList.toggle('done', i < pomSessions); });
                document.getElementById('pom-start').textContent = 'Start';
                resetPom(); return;
            }
            var rem = pomTotal - pomSecs;
            document.getElementById('pom-time').textContent = String(Math.floor(rem / 60)).padStart(2, '0') + ':' + String(rem % 60).padStart(2, '0');
            document.getElementById('pom-arc').style.strokeDashoffset = 377 * (rem / pomTotal);
        }, 1000);
    } else { clearInterval(pomTimer); }
}
function resetPom() {
    clearInterval(pomTimer); pomRunning = false; pomSecs = 0;
    document.getElementById('pom-start').textContent = 'Start';
    document.getElementById('pom-time').textContent = String(Math.floor(pomTotal / 60)).padStart(2, '0') + ':00';
    document.getElementById('pom-arc').style.strokeDashoffset = 0;
}

//  FLASHCARDS  —  persisted, with 3D flip animation

var defaultCards = [
    { q: 'What is the powerhouse of the cell?', a: 'The mitochondria!' },
    { q: 'What is the formula for water?', a: 'H₂O — two hydrogen, one oxygen.' },
    { q: "What is Newton's Second Law?", a: 'F = ma — Force equals mass × acceleration.' }
];
var cards = LS.get('flashcards', defaultCards);
fcIdx = LS.get('fc_idx', 0);
if (fcIdx >= cards.length) fcIdx = 0;

function renderCard() {
    var flipEl = document.getElementById('fc-flip-card');
    if (!cards.length) {
        flipEl.classList.remove('flipped');
        document.getElementById('fc-text-front').textContent = 'Add a card below to get started ♥';
        document.getElementById('fc-text-back').textContent = '';
        document.getElementById('fc-counter').textContent = '0 / 0';
        var delBtn0 = document.getElementById('fc-del-btn');
        if (delBtn0) delBtn0.disabled = true;
        return;
    }
    document.getElementById('fc-text-front').textContent = cards[fcIdx].q;
    document.getElementById('fc-text-back').textContent = cards[fcIdx].a;
    flipEl.classList.toggle('flipped', fcFlipped);
    document.getElementById('fc-counter').textContent = (fcIdx + 1) + ' / ' + cards.length;
    var delBtn = document.getElementById('fc-del-btn');
    if (delBtn) delBtn.disabled = false;
}
function flipCard() {
    if (!cards.length) return;
    fcFlipped = !fcFlipped; renderCard();
}
function fcNav(dir) {
    if (!cards.length) return;
    fcIdx = (fcIdx + dir + cards.length) % cards.length;
    fcFlipped = false;
    LS.set('fc_idx', fcIdx);
    renderCard();
}
function addCard() {
    var q = document.getElementById('fc-q').value.trim(), a = document.getElementById('fc-a').value.trim();
    if (!q || !a) return;
    cards.push({ q: q, a: a });
    document.getElementById('fc-q').value = '';
    document.getElementById('fc-a').value = '';
    fcIdx = cards.length - 1;
    fcFlipped = false;
    LS.set('flashcards', cards);
    LS.set('fc_idx', fcIdx);
    renderCard();
}
function deleteCard(e) {
    if (e) e.stopPropagation();
    if (!cards.length) return;
    cards.splice(fcIdx, 1);
    if (fcIdx >= cards.length) fcIdx = Math.max(0, cards.length - 1);
    fcFlipped = false;
    LS.set('flashcards', cards);
    LS.set('fc_idx', fcIdx);
    renderCard();
}
renderCard();


//  QUIZ  —  auto-generated from the flashcard deck

var quizQuestions = [], quizIdx = 0, quizScore = 0, quizAnswered = false;

function shuffleArr(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

function quizStart() {
    var body = document.getElementById('quiz-body');
    if (cards.length < 2) {
        body.innerHTML = '<div class="quiz-empty">Add at least 2 flashcards first so I can build a quiz from them! Open the Flashcards app to add some. ♥</div>';
        return;
    }
    quizQuestions = shuffleArr(cards);
    quizIdx = 0; quizScore = 0; quizAnswered = false;
    quizRender();
}

function quizPickDistractors(q) {
    var pool = cards.filter(function (c) { return c !== q; }).map(function (c) { return c.a; });
    pool = shuffleArr(pool);
    var uniq = [];
    pool.forEach(function (a) { if (uniq.indexOf(a) === -1 && a !== q.a) uniq.push(a); });
    return uniq.slice(0, 3);
}

function quizRender() {
    var body = document.getElementById('quiz-body');
    if (quizIdx >= quizQuestions.length) {
        body.innerHTML =
            '<div class="quiz-result">' +
            '<div class="quiz-result-score">' + quizScore + ' / ' + quizQuestions.length + '</div>' +
            '<div class="quiz-result-label">Great job studying! ♥</div>' +
            '<button class="quiz-btn" onclick="quizStart()">Try Again</button>' +
            '</div>';
        return;
    }
    var q = quizQuestions[quizIdx];
    var distractors = quizPickDistractors(q);
    var choices = shuffleArr([q.a].concat(distractors));
    var html = '<div class="quiz-progress">Question ' + (quizIdx + 1) + ' / ' + quizQuestions.length + ' &nbsp;•&nbsp; Score: ' + quizScore + '</div>';
    html += '<div class="quiz-q">' + escHtml(q.q) + '</div>';
    html += '<div class="quiz-choices">';
    choices.forEach(function (c, i) {
        html += '<button class="quiz-choice" data-correct="' + (c === q.a ? '1' : '0') + '" onclick="quizAnswer(this)">' + escHtml(c) + '</button>';
    });
    html += '</div>';
    body.innerHTML = html;
}

function quizAnswer(btn) {
    if (quizAnswered) return;
    quizAnswered = true;
    var correct = btn.dataset.correct === '1';
    document.querySelectorAll('.quiz-choice').forEach(function (b) {
        b.disabled = true;
        if (b.dataset.correct === '1') b.classList.add('correct');
    });
    if (correct) { quizScore++; } else { btn.classList.add('wrong'); }
    setTimeout(function () { quizIdx++; quizAnswered = false; quizRender(); }, 900);
}


//  STUDY REVIEWER  —  persisted subject notes

var reviewerNotes = LS.get('reviewer_notes', []);

function renderReviewerNotes() {
    var list = document.getElementById('rev-list');
    if (!reviewerNotes.length) {
        list.innerHTML = '<div class="rev-empty">No review notes yet. Add a topic and some notes above to help you study! ♥</div>';
        return;
    }
    list.innerHTML = reviewerNotes.map(function (n, i) {
        return '<div class="rev-card"><div class="rev-card-top"><div class="rev-card-title">' + escHtml(n.title) + '</div><button class="rev-del" onclick="deleteReviewerNote(' + i + ')">✕</button></div><div class="rev-card-body">' + escHtml(n.body) + '</div></div>';
    }).join('');
}
function addReviewerNote() {
    var t = document.getElementById('rev-title-inp').value.trim();
    var b = document.getElementById('rev-body-inp').value.trim();
    if (!t || !b) return;
    reviewerNotes.unshift({ title: t, body: b });
    document.getElementById('rev-title-inp').value = '';
    document.getElementById('rev-body-inp').value = '';
    LS.set('reviewer_notes', reviewerNotes);
    renderReviewerNotes();
}
function deleteReviewerNote(i) {
    reviewerNotes.splice(i, 1);
    LS.set('reviewer_notes', reviewerNotes);
    renderReviewerNotes();
}


//  TO-DO  —  fully persisted

todos = LS.get('todos', []);

function renderTodos() {
    document.getElementById('todo-list').innerHTML = todos.map(function (t, i) {
        return '<div class="todo-item"><div class="todo-cb' + (t.done ? ' done' : '') + '" onclick="toggleTodo(' + i + ')">' + (t.done ? '✓' : '') + '</div><div class="todo-text' + (t.done ? ' done' : '') + '">' + escHtml(t.text) + '</div><button class="todo-del" onclick="deleteTodo(' + i + ')">✕</button></div>';
    }).join('');
    var done = todos.filter(function (t) { return t.done; }).length;
    document.getElementById('todo-stats').textContent = todos.length ? (done + ' of ' + todos.length + ' completed') : '';
}
function addTodo() {
    var inp = document.getElementById('todo-inp'), t = inp.value.trim();
    if (!t) return;
    todos.push({ text: t, done: false });
    inp.value = '';
    LS.set('todos', todos);
    renderTodos();
}
function toggleTodo(i) {
    todos[i].done = !todos[i].done;
    LS.set('todos', todos);
    renderTodos();
}
function deleteTodo(i) {
    todos.splice(i, 1);
    LS.set('todos', todos);
    renderTodos();
}
function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
renderTodos();


//  PDF EDITOR  —  fit-to-view rendering

var pdfDoc = null;          // pdf.js document (for rendering)
var pdfBytes = null;        // original file bytes (ArrayBuffer) kept for pdf-lib re-save
var pdfCurPage = 1;
var pdfTotalPages = 1;
var pdfTool = 'select';     // 'select' | 'text'
var pdfAnnotations = {};    // { pageNum: [ {id, x, y, w, text, fontSize} ... ] } x/y/w in PDF points (unscaled, from top-left of page)
var pdfScale = 1;
var pdfFitScale = 1;
var pdfZoom = 1;
var pdfAnnIdSeq = 1;
var pdfSelectedAnn = null;
var pdfResizeTimer = null;

if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

function loadPdfFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
        pdfBytes = ev.target.result;
        pdfAnnotations = {};
        pdfAnnIdSeq = 1;
        pdfSelectedAnn = null;
        var loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
        loadingTask.promise.then(function (doc) {
            pdfDoc = doc;
            pdfTotalPages = doc.numPages;
            pdfCurPage = 1;
            document.getElementById('pdf-add-text-btn').disabled = false;
            document.getElementById('pdf-select-btn').disabled = false;
            document.getElementById('pdf-del-ann-btn').disabled = false;
            document.getElementById('pdf-prev-btn').disabled = false;
            document.getElementById('pdf-next-btn').disabled = false;
            document.getElementById('pdf-save-btn').disabled = false;
            document.getElementById('pdf-zoom-out-btn').disabled = false;
            document.getElementById('pdf-zoom-in-btn').disabled = false;
            document.getElementById('pdf-zoom-fit-btn').disabled = false;
            pdfZoom = 1;
            pdfSetTool('text');
            pdfRenderPage(pdfCurPage);
        }).catch(function (err) {
            alert('Could not open this PDF: ' + err.message);
        });
    };
    reader.readAsArrayBuffer(file);
}

function pdfSetTool(tool) {
    pdfTool = tool;
    document.getElementById('pdf-add-text-btn').classList.toggle('active', tool === 'text');
    document.getElementById('pdf-select-btn').classList.toggle('active', tool === 'select');
}

// Compute a scale that fits the page fully inside the visible canvas area
// (both width and height), so nothing gets cropped or forces a scrollbar.
function pdfComputeFitScale(naturalVp, wrap) {
    var padding = 20; // matches .pdf-canvas-wrap padding (10px each side)
    var availW = Math.max(120, wrap.clientWidth - padding);
    var availH = Math.max(160, wrap.clientHeight - padding);
    var scaleW = availW / naturalVp.width;
    var scaleH = availH / naturalVp.height;
    var s = Math.min(scaleW, scaleH);
    if (!isFinite(s) || s <= 0) s = 1;
    // Old cap of 2.5 kept the page small even when the window had plenty of
    // room (e.g. a narrow PDF in a wide window). Raised so the page can
    // actually fill the available viewer space.
    return Math.min(s, 4.5);
}

function pdfRenderPage(num) {
    pdfDoc.getPage(num).then(function (page) {
        var wrap = document.getElementById('pdf-canvas-wrap');
        var naturalVp = page.getViewport({ scale: 1 });
        pdfFitScale = pdfComputeFitScale(naturalVp, wrap);
        pdfScale = pdfFitScale * pdfZoom;
        var viewport = page.getViewport({ scale: pdfScale });
        var zoomLbl = document.getElementById('pdf-zoom-lbl');
        if (zoomLbl) zoomLbl.textContent = Math.round(pdfZoom * 100) + '%';

        wrap.innerHTML = '';
        var stage = document.createElement('div');
        stage.className = 'pdf-page-stage';
        stage.id = 'pdf-page-stage';
        stage.style.width = viewport.width + 'px';
        stage.style.height = viewport.height + 'px';

        var canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        stage.appendChild(canvas);
        wrap.appendChild(stage);

        var ctx = canvas.getContext('2d');
        page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
            pdfRenderAnnotationsForPage(num);
        });

        stage.addEventListener('click', function (e) {
            if (e.target !== stage && e.target !== canvas) return;
            if (pdfTool !== 'text') { pdfDeselectAll(); return; }
            var r = stage.getBoundingClientRect();
            var xPx = e.clientX - r.left, yPx = e.clientY - r.top;
            var xPt = xPx / pdfScale, yPt = yPx / pdfScale;
            var ann = { id: pdfAnnIdSeq++, x: xPt, y: yPt, w: 140, text: 'Type here...', fontSize: 14 };
            if (!pdfAnnotations[num]) pdfAnnotations[num] = [];
            pdfAnnotations[num].push(ann);
            pdfRenderAnnotationsForPage(num);
        });

        document.getElementById('pdf-page-lbl').textContent = num + ' / ' + pdfTotalPages;
    });
}

function pdfZoomIn() {
    if (!pdfDoc) return;
    pdfZoom = Math.min(pdfZoom + 0.25, 4);
    pdfRenderPage(pdfCurPage);
}
function pdfZoomOut() {
    if (!pdfDoc) return;
    pdfZoom = Math.max(pdfZoom - 0.25, 0.3);
    pdfRenderPage(pdfCurPage);
}
function pdfZoomFit() {
    if (!pdfDoc) return;
    pdfZoom = 1;
    pdfRenderPage(pdfCurPage);
}

// Ctrl/Cmd + scroll wheel to zoom in and out, like a real PDF viewer.
document.getElementById('pdf-canvas-wrap').addEventListener('wheel', function (e) {
    if (!pdfDoc || !(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    if (e.deltaY < 0) pdfZoomIn(); else pdfZoomOut();
}, { passive: false });

// Re-fit the page whenever the window (or the PDF window) is resized.
window.addEventListener('resize', function () {
    clearTimeout(pdfResizeTimer);
    pdfResizeTimer = setTimeout(function () {
        if (pdfDoc && document.getElementById('win-pdf').style.display !== 'none') {
            pdfRenderPage(pdfCurPage);
        }
    }, 200);
});

function pdfRenderAnnotationsForPage(num) {
    var stage = document.getElementById('pdf-page-stage');
    if (!stage) return;
    stage.querySelectorAll('.pdf-annotation').forEach(function (el) { el.remove(); });
    var list = pdfAnnotations[num] || [];
    list.forEach(function (ann) {
        var el = document.createElement('div');
        el.className = 'pdf-annotation';
        el.contentEditable = 'true';
        el.spellcheck = false;
        el.style.left = (ann.x * pdfScale) + 'px';
        el.style.top = (ann.y * pdfScale) + 'px';
        el.style.fontSize = (ann.fontSize * pdfScale) + 'px';
        el.textContent = ann.text;
        el.dataset.annId = ann.id;

        el.addEventListener('input', function () { ann.text = el.textContent; });
        el.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            pdfSelectAnnotation(el, ann);
        });

        // dragging
        var dragging = false, sx, sy, ox, oy;
        el.addEventListener('mousedown', function (e) {
            if (pdfTool !== 'select') return;
            dragging = true; sx = e.clientX; sy = e.clientY;
            ox = ann.x; oy = ann.y;
            e.preventDefault();
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragUp);
        });
        function onDragMove(e) {
            if (!dragging) return;
            var dxPt = (e.clientX - sx) / pdfScale, dyPt = (e.clientY - sy) / pdfScale;
            ann.x = ox + dxPt; ann.y = oy + dyPt;
            el.style.left = (ann.x * pdfScale) + 'px';
            el.style.top = (ann.y * pdfScale) + 'px';
        }
        function onDragUp() {
            dragging = false;
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragUp);
        }

        stage.appendChild(el);
    });
}

function pdfSelectAnnotation(el, ann) {
    document.querySelectorAll('.pdf-annotation.selected').forEach(function (e) { e.classList.remove('selected'); });
    el.classList.add('selected');
    pdfSelectedAnn = ann;
}
function pdfDeselectAll() {
    document.querySelectorAll('.pdf-annotation.selected').forEach(function (e) { e.classList.remove('selected'); });
    pdfSelectedAnn = null;
}
function pdfDeleteSelected() {
    if (!pdfSelectedAnn) { alert('Click a text box first (with the Move tool) to select it, then delete.'); return; }
    var list = pdfAnnotations[pdfCurPage] || [];
    var idx = list.findIndex(function (a) { return a.id === pdfSelectedAnn.id; });
    if (idx > -1) list.splice(idx, 1);
    pdfSelectedAnn = null;
    pdfRenderAnnotationsForPage(pdfCurPage);
}

function pdfPage(dir) {
    if (!pdfDoc) return;
    var next = pdfCurPage + dir;
    if (next < 1 || next > pdfTotalPages) return;
    pdfCurPage = next;
    pdfRenderPage(pdfCurPage);
}

function pdfSaveFile() {
    if (!pdfBytes || !window.PDFLib) { alert('PDF library not ready yet, try again in a moment.'); return; }
    var saveBtn = document.getElementById('pdf-save-btn');
    saveBtn.disabled = true;
    var origLabel = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving…';

    PDFLib.PDFDocument.load(pdfBytes.slice(0)).then(function (pdfLibDoc) {
        return pdfLibDoc.embedFont(PDFLib.StandardFonts.Helvetica).then(function (font) {
            var pages = pdfLibDoc.getPages();
            Object.keys(pdfAnnotations).forEach(function (pageNumStr) {
                var pageNum = parseInt(pageNumStr, 10);
                var page = pages[pageNum - 1];
                if (!page) return;
                var ph = page.getHeight();
                (pdfAnnotations[pageNum] || []).forEach(function (ann) {
                    if (!ann.text || !ann.text.trim()) return;
                    var lines = ann.text.split('\n');
                    lines.forEach(function (line, li) {
                        page.drawText(line, {
                            x: ann.x,
                            y: ph - ann.y - ann.fontSize - (li * (ann.fontSize + 2)),
                            size: ann.fontSize,
                            font: font,
                            color: PDFLib.rgb(0.1, 0.1, 0.1)
                        });
                    });
                });
            });
            return pdfLibDoc.save();
        });
    }).then(function (outBytes) {
        var blob = new Blob([outBytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'edited.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
        saveBtn.disabled = false;
        saveBtn.innerHTML = origLabel;
    }).catch(function (err) {
        alert('Could not save PDF: ' + err.message);
        saveBtn.disabled = false;
        saveBtn.innerHTML = origLabel;
    });
}


//  BLOCK PUZZLE  —  pixel-accurate drag & drop placement
//
// Root cause of the old inaccuracy: the dragged "ghost" piece was always
// drawn with fixed 30px cells, while the real board's cell size changes
// with screen width (it's a responsive aspect-ratio grid). Those two
// mismatched sizes meant the cell the game *thought* you were over was
// never quite the cell you were visually over.
//
// Fix: measure the real board grid (origin + cell pitch) directly from
// the rendered DOM cells, size the ghost piece to match that same pitch,
// and compute the target cell purely from the ghost's own screen
// position — no more relying on elementFromPoint() with a magic offset.

var BLAST_SIZE = 8;
var blastGrid = [];          // BLAST_SIZE x BLAST_SIZE, 0 empty / color string when filled
var blastScore = 0;
var blastBest = 0;
var blastTray = [];          // current 3 pieces [{shape, color}] or null if used
var blastInited = false;
var blastLastPlaced = [];    // "r,c" keys of cells placed this turn, used to trigger the pop-in animation
var blastColors = ['#ef5350', '#ffca28', '#66bb6a', '#42a5f5', '#ab47bc', '#ff7043', '#26c6da'];

var BLAST_SHAPES = [
    [[1]],
    [[1, 1]],
    [[1], [1]],
    [[1, 1, 1]],
    [[1], [1], [1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[0, 1], [0, 1], [1, 1]],
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1], [1, 0]],
    [[1, 1], [0, 1]],
    [[1, 0], [1, 1]],
    [[0, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0]],
];

function blastPulse(el) {
    if (!el) return;
    el.classList.remove('pop');
    void el.offsetWidth; // restart the CSS animation
    el.classList.add('pop');
}

function blastInit() {
    if (blastInited) return;
    blastInited = true;
    blastBest = LS.get('blast_best', 0);
    document.getElementById('blast-best').textContent = blastBest;
    blastNewGame();
}

function blastNewGame() {
    blastGrid = [];
    for (var r = 0; r < BLAST_SIZE; r++) {
        blastGrid.push(new Array(BLAST_SIZE).fill(0));
    }
    blastScore = 0;
    document.getElementById('blast-score').textContent = 0;
    document.getElementById('blast-over').style.display = 'none';
    blastRenderBoard();
    blastFillTray();
}

function blastRandomPiece() {
    var shape = BLAST_SHAPES[Math.floor(Math.random() * BLAST_SHAPES.length)];
    var color = blastColors[Math.floor(Math.random() * blastColors.length)];
    return { shape: shape, color: color, used: false };
}

function blastFillTray() {
    blastTray = [blastRandomPiece(), blastRandomPiece(), blastRandomPiece()];
    blastRenderTray();
    blastCheckGameOver();
}

function blastRenderBoard() {
    var board = document.getElementById('blast-board');
    board.innerHTML = '';
    for (var r = 0; r < BLAST_SIZE; r++) {
        for (var c = 0; c < BLAST_SIZE; c++) {
            var cell = document.createElement('div');
            cell.className = 'blast-cell';
            cell.dataset.r = r; cell.dataset.c = c;
            if (blastGrid[r][c]) {
                cell.classList.add('filled');
                cell.style.background = blastGrid[r][c];
                if (blastLastPlaced.indexOf(r + ',' + c) !== -1) cell.classList.add('placed');
            }
            board.appendChild(cell);
        }
    }
    blastLastPlaced = [];
}

function blastRenderTray() {
    var tray = document.getElementById('blast-tray');
    tray.innerHTML = '';
    blastTray.forEach(function (piece, idx) {
        var pieceEl = document.createElement('div');
        if (piece.used) {
            pieceEl.style.visibility = 'hidden';
            pieceEl.style.width = '40px';
            tray.appendChild(pieceEl);
            return;
        }
        pieceEl.className = 'blast-piece tray-in';
        var rows = piece.shape.length, cols = piece.shape[0].length;
        pieceEl.style.gridTemplateColumns = 'repeat(' + cols + ', 16px)';
        pieceEl.style.gridTemplateRows = 'repeat(' + rows + ', 16px)';
        piece.shape.forEach(function (row) {
            row.forEach(function (v) {
                var c = document.createElement('div');
                c.className = 'blast-piece-cell' + (v ? '' : ' empty');
                if (v) c.style.background = piece.color;
                pieceEl.appendChild(c);
            });
        });
        pieceEl.addEventListener('mousedown', function (e) { blastStartDrag(e, idx); });
        pieceEl.addEventListener('touchstart', function (e) { blastStartDrag(e, idx); }, { passive: false });
        tray.appendChild(pieceEl);
    });
}

// Measure the real board grid directly from its rendered cells.
function blastGetGridMetrics() {
    var boardEl = document.getElementById('blast-board');
    var c00 = boardEl.querySelector('.blast-cell[data-r="0"][data-c="0"]');
    var c10 = boardEl.querySelector('.blast-cell[data-r="0"][data-c="1"]');
    var r00 = c00.getBoundingClientRect();
    var pitch = r10Left(c10) - r00.left;
    return { originX: r00.left, originY: r00.top, cellSize: r00.width, pitch: pitch || r00.width };
    function r10Left(el) { return el.getBoundingClientRect().left; }
}

function blastStartDrag(e, idx) {
    var piece = blastTray[idx];
    if (!piece || piece.used) return;
    e.preventDefault();
    var isTouch = e.type === 'touchstart';
    var pt = isTouch ? e.touches[0] : e;

    var boardEl = document.getElementById('blast-board');
    var metrics = blastGetGridMetrics();
    var pitch = metrics.pitch;
    var rows = piece.shape.length, cols = piece.shape[0].length;

    var ghost = document.createElement('div');
    ghost.className = 'blast-drag-ghost';
    ghost.style.gridTemplateColumns = 'repeat(' + cols + ', ' + pitch + 'px)';
    ghost.style.gridTemplateRows = 'repeat(' + rows + ', ' + pitch + 'px)';
    piece.shape.forEach(function (row) {
        row.forEach(function (v) {
            var c = document.createElement('div');
            c.className = 'blast-piece-cell' + (v ? '' : ' empty');
            if (v) c.style.background = piece.color;
            c.style.width = pitch + 'px';
            c.style.height = pitch + 'px';
            ghost.appendChild(c);
        });
    });
    document.body.appendChild(ghost);

    // Lift the ghost above the touch point so a finger doesn't hide it.
    var lift = isTouch ? (pitch * rows) / 2 + 46 : 0;
    var lastLeft = 0, lastTop = 0;

    function positionGhost(clientX, clientY) {
        lastLeft = clientX - (cols * pitch) / 2;
        lastTop = clientY - (rows * pitch) / 2 - lift;
        ghost.style.left = lastLeft + 'px';
        ghost.style.top = lastTop + 'px';
    }
    positionGhost(pt.clientX, pt.clientY);

    function getTargetCell() {
        var m = blastGetGridMetrics();
        var c0 = Math.round((lastLeft - m.originX) / m.pitch);
        var r0 = Math.round((lastTop - m.originY) / m.pitch);
        return { r0: r0, c0: c0 };
    }

    function clearPreview() {
        boardEl.querySelectorAll('.blast-cell').forEach(function (c) {
            c.classList.remove('preview-ok', 'preview-bad');
        });
    }

    function showPreview(target) {
        var fits = blastCanPlace(piece.shape, target.r0, target.c0);
        piece.shape.forEach(function (row, dr) {
            row.forEach(function (v, dc) {
                if (!v) return;
                var rr = target.r0 + dr, cc = target.c0 + dc;
                if (rr >= 0 && rr < BLAST_SIZE && cc >= 0 && cc < BLAST_SIZE) {
                    var cellEl = boardEl.querySelector('.blast-cell[data-r="' + rr + '"][data-c="' + cc + '"]');
                    if (cellEl) cellEl.classList.add(fits ? 'preview-ok' : 'preview-bad');
                }
            });
        });
        return fits;
    }

    function onMove(ev) {
        var p = isTouch ? ev.touches[0] : ev;
        positionGhost(p.clientX, p.clientY);
        clearPreview();
        showPreview(getTargetCell());
        if (ev.cancelable) ev.preventDefault();
    }

    function onUp(ev) {
        clearPreview();
        ghost.remove();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
        var target = getTargetCell();
        if (blastCanPlace(piece.shape, target.r0, target.c0)) {
            blastPlacePiece(piece, target.r0, target.c0);
            piece.used = true;
            blastRenderTray();
            blastRenderBoard();
            blastClearLines(function () {
                if (blastTray.every(function (p2) { return p2.used; })) {
                    blastFillTray();
                } else {
                    blastCheckGameOver();
                }
            });
        }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
}

function blastCanPlace(shape, r0, c0) {
    for (var dr = 0; dr < shape.length; dr++) {
        for (var dc = 0; dc < shape[dr].length; dc++) {
            if (!shape[dr][dc]) continue;
            var rr = r0 + dr, cc = c0 + dc;
            if (rr < 0 || rr >= BLAST_SIZE || cc < 0 || cc >= BLAST_SIZE) return false;
            if (blastGrid[rr][cc]) return false;
        }
    }
    return true;
}

function blastPlacePiece(piece, r0, c0) {
    var count = 0;
    blastLastPlaced = [];
    piece.shape.forEach(function (row, dr) {
        row.forEach(function (v, dc) {
            if (!v) return;
            blastGrid[r0 + dr][c0 + dc] = piece.color;
            blastLastPlaced.push((r0 + dr) + ',' + (c0 + dc));
            count++;
        });
    });
    blastScore += count;
    var scoreEl = document.getElementById('blast-score');
    scoreEl.textContent = blastScore;
    blastPulse(scoreEl);
}

function blastClearLines(callback) {
    var fullRows = [], fullCols = [];
    for (var r = 0; r < BLAST_SIZE; r++) {
        if (blastGrid[r].every(function (v) { return v; })) fullRows.push(r);
    }
    for (var c = 0; c < BLAST_SIZE; c++) {
        var full = true;
        for (var r2 = 0; r2 < BLAST_SIZE; r2++) { if (!blastGrid[r2][c]) { full = false; break; } }
        if (full) fullCols.push(c);
    }
    if (!fullRows.length && !fullCols.length) {
        if (callback) callback();
        return;
    }

    var board = document.getElementById('blast-board');
    board.classList.remove('shake');
    void board.offsetWidth;
    board.classList.add('shake');

    var cellsToClear = [];
    fullRows.forEach(function (r) {
        for (var cc = 0; cc < BLAST_SIZE; cc++) cellsToClear.push([r, cc]);
    });
    fullCols.forEach(function (c3) {
        for (var rr = 0; rr < BLAST_SIZE; rr++) cellsToClear.push([rr, c3]);
    });
    cellsToClear.forEach(function (rc) {
        var cellEl = board.querySelector('.blast-cell[data-r="' + rc[0] + '"][data-c="' + rc[1] + '"]');
        if (cellEl) cellEl.classList.add('clearing');
    });

    // Let the flash/shrink animation play before the data actually changes,
    // instead of the old instant clear which felt abrupt.
    setTimeout(function () {
        fullRows.forEach(function (r) { blastGrid[r] = new Array(BLAST_SIZE).fill(0); });
        fullCols.forEach(function (c4) { for (var r3 = 0; r3 < BLAST_SIZE; r3++) blastGrid[r3][c4] = 0; });
        var cleared = fullRows.length + fullCols.length;
        blastScore += cleared * BLAST_SIZE * 2;
        var scoreEl = document.getElementById('blast-score');
        scoreEl.textContent = blastScore;
        blastPulse(scoreEl);
        blastRenderBoard();
        if (blastScore > blastBest) {
            blastBest = blastScore;
            var bestEl = document.getElementById('blast-best');
            bestEl.textContent = blastBest;
            blastPulse(bestEl);
            LS.set('blast_best', blastBest);
        }
        if (callback) callback();
    }, 300);
}

function blastCheckGameOver() {
    var anyFits = blastTray.some(function (piece) {
        if (piece.used) return false;
        for (var r = 0; r < BLAST_SIZE; r++) {
            for (var c = 0; c < BLAST_SIZE; c++) {
                if (blastCanPlace(piece.shape, r, c)) return true;
            }
        }
        return false;
    });
    if (!anyFits) {
        document.getElementById('blast-over').style.display = 'block';
        if (blastScore > blastBest) {
            blastBest = blastScore;
            document.getElementById('blast-best').textContent = blastBest;
            LS.set('blast_best', blastBest);
        }
    }
}