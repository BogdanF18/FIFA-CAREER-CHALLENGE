# Career Challenge Generator — FC26

Site simplu (HTML/CSS/JS, fără framework, fără build) care generează provocări
random pentru cariera din EA Sports FC 26 — mod **Manager** sau **Player**.

## Cum îl rulezi în VS Code

1. Deschide folderul `fifa-career-challenge` în VS Code.
2. Instalează extensia **Live Server** (dacă n-o ai deja).
3. Click dreapta pe `index.html` → **Open with Live Server**.
   (Merge și doar deschizând `index.html` direct în browser, dar Live Server
   e mai comod pentru dezvoltare live.)

Nu ai nevoie de `npm install`, backend sau bază de date externă — tot rulează
client-side, în browser.

## Structura proiectului

```
fifa-career-challenge/
├── index.html          → structura paginii
├── style.css            → tema vizuală (verde de teren + auriu, fonturi Oswald/Inter)
├── script.js             → leagă UI-ul de generatoare, istoric, export
└── data/
    ├── clubs.js          → 735 cluburi, 43 ligi FC26 (sursă: liste publice oficiale, aug. 2026)
    └── challenges.js      → toate pool-urile de provocări + funcțiile de generare
```

## Ce face site-ul

- Alegi modul (**Manager** / **Jucător**), dificultatea (Ușor → Legendar) și
  opțional doar ligi masculine/feminine.
- Apeși **Generează provocarea** și primești un „card” cu:
  - **Manager**: echipă, buget (regulă de buget, nu sumă fixă), obiectiv de sezon,
    restricție de transferuri, regulă specială.
  - **Player**: naționalitate, vârstă de start, echipă de start, OVR de start,
    post principal, obiectiv final de carieră, regulă specială.
- Fiecare câmp are un buton 🎲 — rerulezi *doar* acel câmp, fără să pierzi restul.
- **Copiază** sau **descarcă .txt** provocarea curentă.
- Istoricul ultimelor 20 de provocări se salvează local în browser (`localStorage`).

## De ce nu e chiar 1 la 1 cu numărul random posibil

Fiecare categorie (buget, obiectiv, restricție, regulă specială etc.) are
20-30 de variante scrise de mână, nu doar 3. Combinate cu ~735 de cluburi și
cu variantele de vârstă/OVR/poziție, numărul de provocări unice posibile e în
zeci de mii — nu vei da peste aceeași provocare de două ori prea curând.

## Cum adaugi mai multe cluburi sau ligi

Deschide `data/clubs.js`. Fiecare ligă e un obiect simplu:

```js
{ name: "Numele ligii", country: "Țara", tier: 2, gender: "M", clubs: [
  "Club 1", "Club 2", "Club 3"
]}
```

- `tier`: 1 = ligă de elită (Top 5 Europa), 2 = ligă puternică, 3 = ligă medie,
  4 = ligă mică/inferioară. Dificultatea din generator filtrează cluburile
  după acest `tier`.
- `gender`: `"M"` sau `"F"`.

Baza de date curentă acoperă cele mai importante ~40 de ligi din FC26
(peste 700 de cluburi), dar FC26 are peste 750 de cluburi în total — dacă
vrei completare 100%, adaugă ligile/cluburile lipsă în același format
(de ex. restul din Liga MX, Brasileirão, J-League etc.).

## Cum adaugi provocări noi

Deschide `data/challenges.js` și adaugă un rând nou de text în lista
potrivită (`BUDGET_MODIFIERS`, `SEASON_OBJECTIVES`, `TRANSFER_RESTRICTIONS`,
`MANAGER_SPECIAL_RULES`, `FINAL_OBJECTIVES_PLAYER`, `PLAYER_SPECIAL_RULES`
etc.) — nu trebuie schimbat nimic altundeva, generatorul le alege automat
din listă.
