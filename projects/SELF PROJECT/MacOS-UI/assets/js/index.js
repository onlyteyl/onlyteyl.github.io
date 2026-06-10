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
}

function closeApp(id) {
    var win = document.getElementById('win-' + id);
    if (!win) return;
    win.style.display = 'none';
    setDockDot(id, false);
}

// Draggable windows
document.querySelectorAll('.titlebar[data-win]').forEach(function (tb) {
    var win = tb.closest('.win');
    var id = tb.getAttribute('data-win');
    var sx, sy, sl, st, dragging = false;
    var closeBtn = tb.querySelector('.tl-r');
    if (closeBtn) closeBtn.addEventListener('mousedown', function (e) { e.stopPropagation(); e.preventDefault(); closeApp(id); });
    tb.addEventListener('mousedown', function (e) {
        if (e.target.classList.contains('tl')) return;
        e.preventDefault(); dragging = true; bringToFront(win);
        var r = win.getBoundingClientRect();
        sx = e.clientX; sy = e.clientY; sl = r.left; st = r.top;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });
    function onMove(e) {
        if (!dragging) return;
        var nx = Math.max(0, Math.min(sl + (e.clientX - sx), window.innerWidth - win.offsetWidth));
        var ny = Math.max(28, Math.min(st + (e.clientY - sy), window.innerHeight - 40));
        win.style.left = nx + 'px'; win.style.top = ny + 'px';
    }
    function onUp() { dragging = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
    win.addEventListener('mousedown', function () { bringToFront(win); });
});

// Draggable icons
document.querySelectorAll('.app-icon').forEach(function (el) {
    var sx, sy, sl, st, dragging = false, moved = false;
    el.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return; e.preventDefault(); dragging = true; moved = false;
        var r = el.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; sl = r.left; st = r.top;
        document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
    });
    function onMove(e) {
        if (!dragging) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
        if (moved) {
            var dr = document.getElementById('desktop').getBoundingClientRect();
            el.style.left = Math.max(0, Math.min(sl + dx - dr.left, dr.width - el.offsetWidth)) + 'px';
            el.style.top = Math.max(32, Math.min(st + dy - dr.top, dr.height - el.offsetHeight - 80)) + 'px';
        }
    }
    function onUp() {
        dragging = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
        if (moved) el.addEventListener('click', function (e) { e.stopPropagation(); }, { capture: true, once: true });
    }
});


//  CLOCK & CALENDAR

function tick() {
    var n = new Date();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var mos = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    function p(v) { return String(v).padStart(2, '0'); }
    document.getElementById('mb-time').textContent = p(n.getHours()) + ':' + p(n.getMinutes());
    document.getElementById('ico-mo').textContent = mos[n.getMonth()];
    document.getElementById('ico-d').textContent = n.getDate();
    document.getElementById('dock-day').textContent = n.getDate();
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
function fetchWeather() {
    if (wxLoaded && (Date.now() - wxLoadedTime) < 600000) return;
    var body = document.getElementById('wx-body');
    body.innerHTML = '<div class="wx-loading">Loading weather… ☁️</div>';
    fetch('https://api.open-meteo.com/v1/forecast?latitude=14.1053&longitude=121.1413&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max&forecast_days=5&timezone=Asia%2FManila')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            wxLoaded = true; wxLoadedTime = Date.now();
            var c = data.current, d = data.daily;
            var uvLbl = c.uv_index <= 2 ? 'Low' : c.uv_index <= 5 ? 'Moderate' : c.uv_index <= 7 ? 'High' : 'Very High';
            var fc = '';
            for (var i = 0; i < 5; i++) {
                var dt = new Date(d.time[i] + 'T12:00:00');
                fc += '<div class="wx-day"><div class="wx-dn">' + dayNames[dt.getDay()] + '</div><div class="wx-di">' + (wmoDesc[d.weather_code[i]] || '☀️').split(' ').pop() + '</div><div class="wx-dt">' + Math.round(d.temperature_2m_max[i]) + '°</div></div>';
            }
            body.innerHTML = '<div class="wx-hero"><div class="wx-city">Santo Tomas, Calabarzon</div><div class="wx-temp">' + Math.round(c.temperature_2m) + '°</div><div class="wx-desc">' + (wmoDesc[c.weather_code] || 'Clear ☀️') + '</div></div><div class="wx-row"><div class="wx-stat"><div class="wx-sl">Humidity</div><div class="wx-sv">' + c.relative_humidity_2m + '%</div></div><div class="wx-stat"><div class="wx-sl">Wind</div><div class="wx-sv">' + Math.round(c.wind_speed_10m) + ' km/h</div></div><div class="wx-stat"><div class="wx-sl">UV Index</div><div class="wx-sv">' + uvLbl + '</div></div><div class="wx-stat"><div class="wx-sl">Feels like</div><div class="wx-sv">' + Math.round(c.apparent_temperature) + '°</div></div></div><div class="wx-forecast">' + fc + '</div>';
        })
        .catch(function () { document.getElementById('wx-body').innerHTML = '<div class="wx-loading">Could not load weather. 🌐</div>'; });
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
        document.getElementById('playbtn').textContent = '⏸';
        document.getElementById('vinyl').className = 'vinyl spin';
    } else {
        audioEl.pause();
        document.getElementById('playbtn').textContent = '▶';
        document.getElementById('vinyl').className = 'vinyl';
    }
}
function audioPrev() {
    if (!MUSIC_FILES.length) return;
    audioIdx = (audioIdx - 1 + MUSIC_FILES.length) % MUSIC_FILES.length;
    loadAudioTrack(audioIdx); audioEl.play();
    document.getElementById('playbtn').textContent = '⏸';
    document.getElementById('vinyl').className = 'vinyl spin';
}
function audioNext() {
    if (!MUSIC_FILES.length) return;
    audioIdx = (audioIdx + 1) % MUSIC_FILES.length;
    loadAudioTrack(audioIdx); audioEl.play();
    document.getElementById('playbtn').textContent = '⏸';
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
        html += '<div class="pl-item' + (i === audioIdx ? ' active' : '') + '" onclick="audioIdx=' + i + ';loadAudioTrack(' + i + ');audioEl.play();document.getElementById(\'playbtn\').textContent=\'⏸\';document.getElementById(\'vinyl\').className=\'vinyl spin\';">' + (i === audioIdx ? '▶ ' : '') + label + '</div>';
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

//  FLASHCARDS  —  persisted

var defaultCards = [
    { q: 'What is the powerhouse of the cell?', a: 'The mitochondria!' },
    { q: 'What is the formula for water?', a: 'H₂O — two hydrogen, one oxygen.' },
    { q: "What is Newton's Second Law?", a: 'F = ma — Force equals mass × acceleration.' }
];
var cards = LS.get('flashcards', defaultCards);
fcIdx = LS.get('fc_idx', 0);
if (fcIdx >= cards.length) fcIdx = 0;

function renderCard() {
    document.getElementById('fc-hint').textContent = fcFlipped ? 'Answer' : 'Question — click to flip';
    document.getElementById('fc-text').textContent = fcFlipped ? cards[fcIdx].a : cards[fcIdx].q;
    document.getElementById('fc-counter').textContent = (fcIdx + 1) + ' / ' + cards.length;
}
function flipCard() { fcFlipped = !fcFlipped; renderCard(); }
function fcNav(dir) {
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
renderCard();

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
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
renderTodos();