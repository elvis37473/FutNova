let appData = JSON.parse(localStorage.getItem('futnova_db')) || { leagues: [] };
let activeId = null;

const save = () => localStorage.setItem('futnova_db', JSON.stringify(appData));

function showHome() {
    document.querySelectorAll('.container > div').forEach(d => d.classList.add('hidden'));
    document.getElementById('home').classList.remove('hidden');
}

function addLeague() {
    const name = document.getElementById('leagueName').value;
    const logo = document.getElementById('leagueLogo').value || "https://cdn-icons-png.flaticon.com/512/3133/3133100.png";
    const mode = document.getElementById('leagueMode').value;
    if (!name) return alert("Escribe el nombre del torneo");
    appData.leagues.push({ id: Date.now(), name, logo, mode, teams: [] });
    save(); renderLeaguesList();
}

function renderLeaguesList() {
    document.querySelectorAll('.container > div').forEach(d => d.classList.add('hidden'));
    const list = document.getElementById('leagues-container');
    document.getElementById('leagues-list').classList.remove('hidden');
    list.innerHTML = "<h4 style='text-align:center; color:var(--primary); margin-bottom:15px;'>MIS PROYECTOS</h4>";
    appData.leagues.forEach(l => {
        list.innerHTML += `<div class="nav-bar-item" onclick="openLeague(${l.id})">🏆 <strong>${l.name}</strong></div>`;
    });
}

function openLeague(id) {
    activeId = id;
    const league = appData.leagues.find(l => l.id === id);
    document.querySelectorAll('.container > div').forEach(d => d.classList.add('hidden'));
    document.getElementById('league-detail').classList.remove('hidden');
    if (league.mode === 'liga') {
        document.getElementById('liga-controls').classList.remove('hidden');
        renderTabla(league);
    } else {
        document.getElementById('liga-controls').classList.add('hidden');
        renderLlaves(league);
    }
}

function renderTabla(league) {
    league.teams.sort((a,b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));
    let html = `
        <div style="text-align:center; margin-bottom:15px;">
            <img src="${league.logo}" style="width:40px; height:40px; object-fit:contain;">
            <h3 style="margin:5px 0; font-size:1.1rem;">${league.name}</h3>
        </div>
        <div class="table-wrapper">
            <table>
                <tr>
                    <th>#</th><th style="text-align:left; padding-left:15px;">Club</th>
                    <th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th class="pts-highlight">Pts</th>
                </tr>`;
    league.teams.forEach((t, i) => {
        const escudo = t.logo || "https://cdn-icons-png.flaticon.com/512/5323/5323982.png";
        html += `<tr>
            <td>${i+1}</td>
            <td><div class="club-info"><img src="${escudo}" class="club-logo-table">${t.name}</div></td>
            <td>${t.pj}</td><td>${t.g||0}</td><td>${t.e||0}</td><td>${t.p||0}</td>
            <td>${t.gf}</td><td>${t.gc}</td><td>${t.gf-t.gc}</td>
            <td class="pts-highlight">${t.pts}</td>
        </tr>`;
    });
    html += "</table></div>";
    document.getElementById('main-view').innerHTML = html;
    updateSelects(league);
}

// LLAVES RECUPERADAS: Octavos, Cuartos, Semis y Final
function renderLlaves(league) {
    document.getElementById('main-view').innerHTML = `
        <div style="text-align:center; margin-bottom:10px;">
            <img src="${league.logo}" style="width:40px; height:40px; object-fit:contain;">
            <h3 style="margin:5px 0; font-size:1.1rem;">${league.name} (Playoffs)</h3>
        </div>
        <div class="bracket-wrapper">
            <div class="bracket-col">
                <div class="match-box"><span class="label-stage label-octavos">Octavos</span><input type="text"><input type="text"></div>
                <div class="match-box"><span class="label-stage label-octavos">Octavos</span><input type="text"><input type="text"></div>
            </div>
            <div class="bracket-col"><div class="match-box"><span class="label-stage label-cuartos">Cuartos</span><input type="text"><input type="text"></div></div>
            <div class="bracket-col"><div class="match-box"><span class="label-stage label-semis">Semifinal</span><input type="text"><input type="text"></div></div>
            
            <div style="text-align:center;">
                <div class="match-box" style="margin:0 auto; border: 2px solid var(--primary); width:150px;">
                    <span class="label-stage label-final">Gran Final</span>
                    <input type="text" placeholder="Finalista 1" style="font-weight:bold; color:var(--primary)">
                    <input type="text" placeholder="Finalista 2" style="font-weight:bold; color:var(--primary)">
                </div>
                <p style="color:var(--primary); font-size:0.7rem; font-weight:800; margin-top:10px;">🏆 CAMPEÓN</p>
            </div>

            <div class="bracket-col"><div class="match-box"><span class="label-stage label-semis">Semifinal</span><input type="text"><input type="text"></div></div>
            <div class="bracket-col"><div class="match-box"><span class="label-stage label-cuartos">Cuartos</span><input type="text"><input type="text"></div></div>
            <div class="bracket-col">
                <div class="match-box"><span class="label-stage label-octavos">Octavos</span><input type="text"><input type="text"></div>
                <div class="match-box"><span class="label-stage label-octavos">Octavos</span><input type="text"><input type="text"></div>
            </div>
        </div>`;
}

function addTeam() {
    const nameInput = document.getElementById('tName');
    const logoInput = document.getElementById('tLogo');
    if(!nameInput.value) return;
    const league = appData.leagues.find(l => l.id === activeId);
    league.teams.push({id: Date.now(), name: nameInput.value, logo: logoInput.value, pj:0, g:0, e:0, p:0, gf:0, gc:0, pts:0});
    save(); 
    nameInput.value = ""; logoInput.value = "";
    renderTabla(league);
}

function updateSelects(league) {
    const s1 = document.getElementById('hSelect'), s2 = document.getElementById('aSelect');
    if(!s1 || !s2) return;
    s1.innerHTML = s2.innerHTML = "";
    league.teams.forEach(t => {
        let op = `<option value="${t.id}">${t.name}</option>`;
        s1.innerHTML += op; s2.innerHTML += op;
    });
}

function registerMatch() {
    const idH = document.getElementById('hSelect').value, idA = document.getElementById('aSelect').value;
    const gH = parseInt(document.getElementById('hG').value)||0, gA = parseInt(document.getElementById('aG').value)||0;
    if(idH === idA) return alert("Selecciona equipos distintos");
    const league = appData.leagues.find(l => l.id === activeId);
    const tH = league.teams.find(t => t.id == idH), tA = league.teams.find(t => t.id == idA);
    tH.pj++; tA.pj++; tH.gf += gH; tH.gc += gA; tA.gf += gA; tA.gc += gH;
    if(gH > gA) { tH.g=(tH.g||0)+1; tH.pts+=3; tA.p=(tA.p||0)+1; }
    else if(gA > gH) { tA.g=(tA.g||0)+1; tA.pts+=3; tH.p=(tH.p||0)+1; }
    else { tH.e=(tH.e||0)+1; tA.e=(tA.e||0)+1; tH.pts++; tA.pts++; }
    save(); renderTabla(league);
}

function resetApp() { if(confirm("¿Borrar todo?")) { localStorage.clear(); location.reload(); } }