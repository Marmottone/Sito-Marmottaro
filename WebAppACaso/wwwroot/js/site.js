let celleScoperte = 0;

function scopriCella(elemento) {
  if (elemento.style.display === 'none') return; // Evita loop infiniti
  elemento.style.display = 'none'

  const cella = elemento.parentElement;
  const contenutoSpan = cella.querySelector('.cella-contenuto');
  const contenuto = contenutoSpan.innerText.trim();

  // Controllo aggiornato: se c'è un'immagine o l'emoji bomba
  const isBomba = contenutoSpan.querySelector('img') !== null || contenutoSpan.innerText.trim() === '💣';
  const totaleSicure = parseInt(document.getElementById('gioco-container').getAttribute('data-totale-sicure'));

  if (isBomba) {
    setTimeout(function () {
      alert('AAAAAHHH! Hai calpestato una marmotta! 💥');
      location.reload();
    }, 100);
  } else {
    celleScoperte++;

    //Scopertura a cascata delle celle completamente vuote
    if (contenuto === "" || contenuto === "0") {
      cliccaNumero(cella);
    }

    if (celleScoperte === totaleSicure) {
      setTimeout(function () {
        alert('CONGRATULAZIONI! Hai schivato tutte le marmotte! 🏆');
        location.reload();
      }, 200);
    }
  }
}

function mettiBandiera(e, elemento) {
  // 1. Impedisce l'apertura del menu del tasto destro del browser
  e.preventDefault();

  if (elemento.style.display === 'none') return;

  // 3. Logica "Toggle": se c'è già la bandiera la toglie, altrimenti la mette
  if (elemento.innerText === '🚩') {
    elemento.innerText = '';
    elemento.style.backgroundColor = ""; // Torna al colore originale
  } else {
    elemento.innerText = '🚩';
    elemento.style.fontSize = "20px";
    elemento.style.color = "red";
  }
}

function cliccaNumero(cella) {
  // 1. Controlla se la cella è già stata scoperta
  const btnCentrale = cella.querySelector('.btn-copertura');
  if (btnCentrale.style.display !== 'none') return;

  // 2. Leggi il contenuto della cella
  const contenuto = cella.querySelector('.cella-contenuto').innerText.trim();

  // Gestione dello 0: se è vuoto o è proprio "0", trattalo come numero 0
  let numero = parseInt(contenuto);
  if (contenuto === "" || contenuto === "0") {
    numero = 0;
  }

  if (isNaN(numero)) return;

  // 3. Recupera coordinate della cella cliccata
  const riga = parseInt(cella.getAttribute('data-riga'));
  const colonna = parseInt(cella.getAttribute('data-colonna'));

  // 4. Conta quante bandiere ci sono intorno
  let bandiereVicine = 0;
  let vicini = [];

  for (let r = riga - 1; r <= riga + 1; r++) {
    for (let c = colonna - 1; c <= colonna + 1; c++) {
      if (r === riga && c === colonna) continue; // Salta la cella stessa

      // Trova la cella vicina tramite gli attributi data
      const cellaVicina = document.querySelector(`td[data-riga="${r}"][data-colonna="${c}"]`);

      if (cellaVicina) {
        vicini.push(cellaVicina);
        const btn = cellaVicina.querySelector('.btn-copertura');
        if (btn && btn.innerText === '🚩') {
          bandiereVicine++;
        }
      }
    }
  }

  // 5. Se il numero di bandiere è corretto, scopri le altre
  if (bandiereVicine === numero) {
    vicini.forEach(v => {
      const btn = v.querySelector('.btn-copertura');
      // Scopri solo se il bottone è visibile e NON ha una bandiera
      if (btn && btn.style.display !== 'none' && btn.innerText !== '🚩') {
        // Riutilizziamo la tua funzione esistente per gestire bomba/vittoria
        scopriCella(btn);
      }
    });
  }
}

function evidenziaVicini(cella, attiva) {
  // 1. Controlla se la cella è già stata scoperta (il bottone deve essere nascosto)
  const btnCentrale = cella.querySelector('.btn-copertura');
  if (btnCentrale.style.display !== 'none') return;

  const riga = parseInt(cella.getAttribute('data-riga'));
  const colonna = parseInt(cella.getAttribute('data-colonna'));

  // 2. Scansiona i 3x3 vicini
  for (let r = riga - 1; r <= riga + 1; r++) {
    for (let c = colonna - 1; c <= colonna + 1; c++) {
      if (r === riga && c === colonna) continue;

      const cellaVicina = document.querySelector(`td[data-riga="${r}"][data-colonna="${c}"]`);
      if (cellaVicina) {
        const btnVicina = cellaVicina.querySelector('.btn-copertura');
        // Evidenzia solo se la cella vicina è ancora coperta e non ha una bandiera
        if (btnVicina && btnVicina.style.display !== 'none' && btnVicina.innerText !== '🚩') {
          if (attiva) {
            btnVicina.classList.add('cella-evidenziata');
          } else {
            btnVicina.classList.remove('cella-evidenziata');
          }
        }
      }
    }
  }
}