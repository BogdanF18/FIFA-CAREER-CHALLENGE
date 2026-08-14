/**
 * Baza de date cu ligi si cluburi din EA Sports FC 26.
 * Sursa: liste oficiale publice de ligi/cluburi FC26 (fifauteam.com, august 2026).
 * NU este 100% exhaustiva (FC26 are 750+ cluburi in 35+ ligi) - contine cele mai
 * importante ~40 de ligi si peste 600 de cluburi reale. Poti adauga usor mai multe
 * cluburi/ligi mai jos, respectand acelasi format { name, country, tier, gender, clubs }.
 *
 * tier: 1 = elita (Top 5 Europa), 2 = liga puternica, 3 = liga medie, 4 = liga mica/inferioara
 * gender: "M" sau "F"
 */

const LEAGUES = [
  { name: "Premier League", country: "Anglia", region: "Europa", tier: 1, gender: "M", clubs: [
    "Arsenal","Aston Villa","Bournemouth","Brentford","Brighton & Hove Albion","Burnley",
    "Chelsea","Crystal Palace","Everton","Fulham","Leeds United","Liverpool","Manchester City",
    "Manchester United","Newcastle United","Nottingham Forest","Sunderland","Tottenham",
    "West Ham","Wolverhampton"
  ]},
  { name: "EFL Championship", country: "Anglia", region: "Europa", tier: 2, gender: "M", clubs: [
    "Birmingham City","Blackburn Rovers","Bristol City","Charlton Athletic","Coventry City",
    "Derby County","Hull City","Ipswich Town","Leicester City","Middlesbrough","Millwall",
    "Norwich City","Oxford United","Portsmouth","Preston North End","Queens Park Rangers",
    "Sheffield United","Sheffield Wednesday","Southampton","Stoke City","Swansea City",
    "Watford","West Bromwich Albion","Wrexham"
  ]},
  { name: "EFL League One", country: "Anglia", region: "Europa", tier: 3, gender: "M", clubs: [
    "Barnsley","Blackpool","Bolton Wanderers","Bradford City","Burton Albion","Cardiff City",
    "Doncaster Rovers","Exeter City","Huddersfield Town","Leyton Orient","Lincoln City",
    "Luton Town","Mansfield Town","Northampton Town","Peterborough United","Plymouth Argyle",
    "Port Vale","Reading","Rotherham United","Stevenage","Stockport County","Wigan Athletic",
    "AFC Wimbledon","Wycombe Wanderers"
  ]},
  { name: "EFL League Two", country: "Anglia", region: "Europa", tier: 4, gender: "M", clubs: [
    "Accrington Stanley","Barnet","Barrow","Bristol Rovers","Bromley","Cambridge United",
    "Cheltenham Town","Chesterfield","Colchester United","Crawley Town","Crewe Alexandra",
    "Fleetwood Town","Gillingham","Grimsby Town","Harrogate Town","Milton Keynes Dons",
    "Newport County","Notts County","Oldham Athletic","Salford City","Shrewsbury Town",
    "Swindon Town","Tranmere Rovers","Walsall"
  ]},
  { name: "Women's Super League", country: "Anglia (Feminin)", region: "Europa", tier: 2, gender: "F", clubs: [
    "Arsenal","Aston Villa","Brighton & Hove Albion","Chelsea","Everton","Leicester City",
    "Liverpool","London City Lionesses","Manchester City","Manchester United","Tottenham","West Ham"
  ]},
  { name: "LaLiga EA Sports", country: "Spania", region: "Europa", tier: 1, gender: "M", clubs: [
    "Alavés","Athletic Bilbao","Atlético Madrid","Celta Vigo","Elche","Espanyol","FC Barcelona",
    "Getafe","Girona","Levante","Mallorca","Osasuna","Rayo Vallecano","Real Betis","Real Madrid",
    "Real Oviedo","Real Sociedad","Sevilla","Valencia","Villarreal"
  ]},
  { name: "LaLiga Hypermotion", country: "Spania", region: "Europa", tier: 2, gender: "M", clubs: [
    "Albacete","Almería","Andorra","Burgos","Cádiz","Castellón","Ceuta","Córdoba CF",
    "Cultural Leonesa","Deportivo La Coruña","Eibar","Granada","Huesca","Las Palmas","Leganés",
    "Málaga","Mirandés","Racing Santander","Real Sociedad B","Sporting de Gijón","Valladolid","Zaragoza"
  ]},
  { name: "Liga F", country: "Spania (Feminin)", region: "Diverse", tier: 2, gender: "F", clubs: [
    "Alhama","Athletic Bilbao","Atlético Madrid","Deportivo Abanca","DUX Logroño","Espanyol",
    "FC Barcelona","Granada","Levante","Levante Las Planas","Madrid CFF","Real Madrid",
    "Real Sociedad","Sevilla","SD Eibar","UDG Tenerife"
  ]},
  { name: "Bundesliga", country: "Germania", region: "Europa", tier: 1, gender: "M", clubs: [
    "1. FC Heidenheim","1. FC Köln","1899 Hoffenheim","Bayer Leverkusen","Bayern Munich",
    "Borussia Dortmund","Borussia Mönchengladbach","Eintracht Frankfurt","FC Augsburg",
    "FC St. Pauli","Hamburger SV","Mainz 05","RB Leipzig","SC Freiburg","Union Berlin",
    "VfB Stuttgart","VfL Wolfsburg","Werder Bremen"
  ]},
  { name: "2. Bundesliga", country: "Germania", region: "Europa", tier: 2, gender: "M", clubs: [
    "1. FC Kaiserslautern","1. FC Magdeburg","1. FC Nürnberg","Arminia Bielefeld","Darmstadt 98",
    "Dynamo Dresden","Eintracht Braunschweig","Fortuna Düsseldorf","Greuther Fürth","Hannover 96",
    "Hertha BSC","Holstein Kiel","Karlsruher SC","Preußen Münster","SC Paderborn","Schalke 04",
    "SV Elversberg","VfL Bochum"
  ]},
  { name: "3. Liga", country: "Germania", region: "Europa", tier: 4, gender: "M", clubs: [
    "1. FC Saarbrücken","1. FC Schweinfurt","Alemannia Aachen","Energie Cottbus","Erzgebirge Aue",
    "FC Ingolstadt 04","FC Viktoria Köln","Hansa Rostock","Jahn Regensburg","MSV Duisburg",
    "Rot-Weiss Essen","SC Verl","SSV Ulm","SV Waldhof Mannheim","TGS Hoffenheim II",
    "TSV 1860 München","TSV Havelse","VfB Stuttgart II","VfL Osnabrück","Wehen Wiesbaden"
  ]},
  { name: "Frauen-Bundesliga", country: "Germania (Feminin)", region: "Europa", tier: 2, gender: "F", clubs: [
    "1. FC Köln","1. FC Nürnberg","1899 Hoffenheim","Bayer Leverkusen","Bayern Munich",
    "Carl Zeiss Jena","Eintracht Frankfurt","Hamburger SV","SC Freiburg","RB Leipzig",
    "Rot-Weiss Essen","Union Berlin","VfL Wolfsburg","Werder Bremen"
  ]},
  { name: "Serie A", country: "Italia", region: "Europa", tier: 1, gender: "M", clubs: [
    "AS Roma","Bologna","Cagliari","Como","Cremonese","Fiorentina","Genoa","Hellas Verona",
    "Juventus","Lecce","Napoli","Parma","Pisa","Sassuolo","Torino","Udinese",
    "Atalanta","Inter","Lazio","Milan"
  ]},
  { name: "Serie BKT", country: "Italia", region: "Europa", tier: 2, gender: "M", clubs: [
    "Avellino","Bari","Carrarese","Catanzaro","Cesena","Empoli","Frosinone","Juve Stabia",
    "Mantova","Modena","Padova","Palermo","Pescara","Reggiana","Sampdoria","Spezia",
    "Südtirol","Venezia","Virtus Entella","AC Monza"
  ]},
  { name: "Women's Serie A", country: "Italia (Feminin)", region: "Europa", tier: 2, gender: "F", clubs: [
    "Como","Fiorentina","Genoa","Inter","Juventus","Lazio","Milan","Napoli","Parma",
    "AS Roma","Sassuolo","Ternana"
  ]},
  { name: "Ligue 1", country: "Franța", region: "Europa", tier: 1, gender: "M", clubs: [
    "Angers SCO","AS Monaco","Auxerre","FC Lorient","FC Nantes","FC Metz","Havre AC",
    "LOSC Lille","OGC Nice","Olympique de Marseille","Olympique Lyonnais","Paris FC",
    "Paris Saint-Germain","Racing Club de Lens","RC Strasbourg Alsace","Stade Brestois 29",
    "Stade Rennais FC","Toulouse FC"
  ]},
  { name: "Ligue 2", country: "Franța", region: "Europa", tier: 2, gender: "M", clubs: [
    "Amiens SC","AS Saint-Étienne","Beauleroix FC","Clermont Foot","Dunkerque","En Avant Guingamp",
    "FC Annecy","Grenoble Foot 38","Laval","Le Mans","Montpellier HSC","Nancy","Pau FC",
    "Red Star FC","Stade de Reims","Rodez Averyron","SC Bastia","Troyes"
  ]},
  { name: "Arkema D1", country: "Franța (Feminin)", region: "Europa", tier: 2, gender: "F", clubs: [
    "AS Saint-Étienne","Dijon","Fleury","Le Havre","Montpellier HSC","Nantes","OL Lyonnes",
    "Olympique de Marseille","Paris FC","Paris Saint-Germain","Racing Club de Lens","Strasbourg"
  ]},
  { name: "Eredivisie", country: "Olanda", region: "Europa", tier: 2, gender: "M", clubs: [
    "Ajax","AZ","Excelsior","FC Utrecht","FC Volendam","Feyenoord","Fortuna Sittard",
    "Go Ahead Eagles","Groningen","Heracles Almelo","NAC Breda","NEC Nijmegen","PEC Zwolle",
    "PSV","SC Heerenveen","Sparta Rotterdam","Telstar","Twente"
  ]},
  { name: "Liga Portugal", country: "Portugalia", region: "Europa", tier: 2, gender: "M", clubs: [
    "Alverca","Arouca","AVS","Casa Pia","CD Nacional","Estoril","Estrela Amadora","Famalicão",
    "FC Porto","Gil Vicente","Moreirense","Rio Ave","Santa Clara","SL Benfica","Sporting",
    "Sporting de Braga","Tondela","Vitória de Guimarães"
  ]},
  { name: "1A Pro League", country: "Belgia", region: "Europa", tier: 2, gender: "M", clubs: [
    "Cercle Brugge","Charleroi","Club Brugge","Dender EH","Genk","Gent","La Louvière","Leuven",
    "Mechelen","Royal Antwerp FC","R.S.C Anderlecht","Sint-Truiden","Standard Liège","Union SG",
    "Westerlo","Zulte Waregem"
  ]},
  { name: "Süper Lig", country: "Turcia", region: "Europa", tier: 2, gender: "M", clubs: [
    "Alanyaspor","Antalyaspor","Beşiktaş","Eyüpspor","Fatih Karagümrük","Fenerbahçe","Galatasaray",
    "Gazişehir Gaziantep FK","Gençlerbirliği","Göztepe","Istanbul Başakşehir FK","Kasımpaşa",
    "Kayserispor","Kocaelispor","Konyaspor","Rizespor","Samsunspor","Trabzonspor"
  ]},
  { name: "MBS Pro League", country: "Arabia Saudită", region: "Asia", tier: 2, gender: "M", clubs: [
    "Al Ahli","Al-Fateh","Al Fayha","Al Hazem","Al Hilal","Al Ittihad","Al Khaleej","Al Kholood",
    "Al Najma","Al Nassr","Al Okhdood","Al Qadsiah","Al Riyadh SC","Al Shabab","Al Taawoun",
    "Damac","Ettifaq FC","Neom"
  ]},
  { name: "Major League Soccer", country: "SUA / Canada", region: "America de Nord", tier: 2, gender: "M", clubs: [
    "Atlanta United","Austin FC","CF Montreal","Charlotte FC","Chicago Fire","Colorado Rapids",
    "Columbus Crew SC","D.C. United","FC Cincinnati","FC Dallas","Houston Dynamo","Inter Miami CF",
    "LA Galaxy","Los Angeles FC","Minnesota United FC","Nashville SC","New England Revolution",
    "New York City FC","New York Red Bulls","Orlando City","Philadelphia Union","Portland Timbers",
    "Real Salt Lake","San Diego","San Jose Earthquakes","Seattle Sounders FC","Sporting Kansas City",
    "St Louis City","Toronto FC","Vancouver Whitecaps FC"
  ]},
  { name: "NWSL", country: "SUA (Feminin)", region: "America de Nord", tier: 2, gender: "F", clubs: [
    "Angel City","Bay FC","Chicago Red Stars","Houston Dash","Kansas City Current","NJ/NY Gotham",
    "North Carolina Courage","Orlando Pride","Portland Thorns","Racing Louisville","San Diego Wave",
    "Seattle Reign","Utah Royals","Washington Spirit"
  ]},
  { name: "Liga Profesional de Fútbol", country: "Argentina", region: "America de Sud", tier: 2, gender: "M", clubs: [
    "Aldosivi","Atlético Tucumán","Argentinos Jrs","Barracas Central","Banfield","Belgrano",
    "Boca Juniors","Central Córdoba","Defensa y Justicia","Deportivo Riestra","Estudiantes",
    "Gimnasia","Godoy Cruz","Huracán","Independiente","Independiente Rivadavia","Instituto Córdoba",
    "Lanús","Newell's","Platense","Racing Club","River Plate","Rosario Central","San Martín",
    "San Lorenzo","Sarmiento","Talleres","Tigre","Unión","Vélez Sarsfield"
  ]},
  { name: "Liga MX", country: "Mexic", region: "America de Nord", tier: 2, gender: "M", clubs: [
    "America","Atlas","Atlético San Luis","Cruz Azul","Guadalajara","FC Juárez","León",
    "Mazatlán","Monterrey","Necaxa","Pachuca"
  ]},
  { name: "Chinese Super League", country: "China", region: "Asia", tier: 3, gender: "M", clubs: [
    "Beijing Sinobo Guoan","Changchun Yatai","Chengdu Rongcheng","Dalian Yingbo","Henan Jianye",
    "Meizhou Hakka","Qingdao Hainiu","Qingdao West Coast","Shandong Luneng Taishan",
    "Shanghai Greenland Shenhua","Shanghai Port","Shenzhen Peng City","Tianjin TEDA",
    "Yunnan Yukun","Wuhan Three Towns","Zhejiang"
  ]},
  { name: "K League 1", country: "Coreea de Sud", region: "Asia", tier: 3, gender: "M", clubs: [
    "Daegu FC","Daejeon Hana Citizen","FC Anyang","FC Seoul","Gangwon FC","Gimcheon Sangmu",
    "Gwangju FC","Jeonbuk Hyundai Motors","Jeju United","Pohang Steelers","Suwon FC","Ulsan Hyundai"
  ]},
  { name: "K League 2", country: "Coreea de Sud", region: "Asia", tier: 4, gender: "M", clubs: [
    "Ansan Greeners","Bucheon FC 1995","Busan IPark","Cheonan City","Chungbuk Cheongju",
    "Chungnam Asan","FC Anyang","Gimcheon Sangmu","Gimpo FC","Gyeongnam FC","Jeonnam Dragons",
    "Seongnam FC","Seoul E-Land"
  ]},
  { name: "Hero ISL", country: "India", region: "Asia", tier: 4, gender: "M", clubs: [
    "ATK Mohun Bagan","Bengaluru","Chennaiyin","East Bengal","Goa","Hyderabad","Jamshedpur",
    "Kerala Blasters","Mohammedan","Mumbai City","NorthEast United","Odisha","RoundGlass Punjab",
    "United Tigers"
  ]},
  { name: "Isuzu UTE A-League", country: "Australia", region: "Oceania", tier: 3, gender: "M", clubs: [
    "Adelaide United","Auckland FC","Brisbane Roar","Central Coast Mariners","Macarthur FC",
    "Melbourne City","Melbourne Victory","Newcastle Jets","Perth Glory","Sydney FC",
    "Western Sydney Wanderers","Wellington Phoenix","Western United"
  ]},
  { name: "Admiral Bundesliga", country: "Austria", region: "Europa", tier: 3, gender: "M", clubs: [
    "Blau-Weiß Linz","FC Red Bull Salzburg","FK Austria Wien","Grazer AK","LASK","SCR Altach",
    "SK Rapid Wien","SK Sturm Graz","SV Ried","TSV Hartberg","Wolfsberger AC","WSG Tirol"
  ]},
  { name: "3F Superliga", country: "Danemarca", region: "Europa", tier: 3, gender: "M", clubs: [
    "Aarhus","Brøndby IF","FC København","FC Midtjylland","FC Nordsjælland","Fredericia",
    "OB Odense","Randers FC","Silkeborg IF","SønderjyskE","Vejle Boldklub","Viborg FF"
  ]},
  { name: "Eliteserien", country: "Norvegia", region: "Europa", tier: 3, gender: "M", clubs: [
    "Bodø/Glimt","Bryne","Fredrikstad","Hamarkameratene","Haugesund","KFUM Oslo","Kristiansund",
    "Molde","Rosenborg","Sandefjord","Sarpsborg 08","SK Brann","Strømsgodset","Tromsø",
    "Vålerenga","Viking"
  ]},
  { name: "PKO Ekstraklasa", country: "Polonia", region: "Europa", tier: 3, gender: "M", clubs: [
    "Arka Gdynia","Bruk-Bet Termalica","Cracovia","GKS Katowice","Górnik Zabrze",
    "Jagiellonia Białystok","Korona Kielce","Lechia Gdańsk","Lech Poznań","Legia Warszawa",
    "Motor Lublin","Piast Gliwice","Pogoń Szczecin","Radomiak Radom","Raków Częstochowa",
    "Widzew Łódź","Wisła Płock","Zagłębie Lubin"
  ]},
  { name: "SSE Airtricity Premier Division", country: "Irlanda", region: "Europa", tier: 4, gender: "M", clubs: [
    "Bohemians","Cork City","Derry City","Drogheda","Galway United","Shamrock Rovers",
    "Sligo Rovers","Shelbourne","St Patrick's Athletic","Waterford"
  ]},
  { name: "Superliga", country: "România", region: "Europa", tier: 3, gender: "M", clubs: [
    "Argeș Pitești","Botoșani","Csíkszereda Ciuc","CFR Cluj","Dinamo București","Farul Constanța",
    "FCSB","Hermannstadt","Metaloglobus București","Oțelul Galați","Petrolul","Rapid București",
    "Unirea Slobozia","Universitatea Cluj","Universitatea Craiova","UTA Arad"
  ]},
  { name: "Cinch Premiership", country: "Scoția", region: "Europa", tier: 3, gender: "M", clubs: [
    "Aberdeen","Celtic","Dundee","Dundee United","Falkirk","Heart of Midlothian","Hibernian",
    "Kilmarnock","Livingston","Motherwell","Rangers","St Mirren"
  ]},
  { name: "Allsvenskan", country: "Suedia", region: "Europa", tier: 3, gender: "M", clubs: [
    "AIK","BK Häcken","Degerfors IF","Djurgårdens IF","GAIS","Halmstads BK","Hammarby IF",
    "IF Brommapojkarna","IF Elfsborg","IFK Göteborg","IFK Norrköping","IFK Värnamo","IK Sirius",
    "Malmö FF","Mjällby AI","Östers IF"
  ]},
  { name: "Credit Suisse Super League", country: "Elveția", region: "Europa", tier: 3, gender: "M", clubs: [
    "BSC Young Boys","FC Basel","FC Lausanne-Sport","FC Lugano","FC Luzern","FC Sion",
    "FC St. Gallen","FC Zürich","Grasshopper","Servette FC","Thun","Winterthur"
  ]},
  { name: "Botola Pro", country: "Maroc", region: "Africa", tier: 4, gender: "M", clubs: [
    "Chabab Mohammedia","CR Khemis","FAR Rabat","FUS Rabat","Hassania Agadir","Ittihad Tanger",
    "MAS Fes","MAT Tetouan","MCO Oujda","Olympic Club de Safi","Raja Casablanca","RSB Berkane",
    "Salmi","Union Touarga Sport","Wydad Casablanca","Youssoufia Berrechid"
  ]},
  { name: "Cluburi neliceniate / generice", country: "Diverse", region: "Diverse", tier: 3, gender: "M", clubs: [
    "AEK Athens","Al Ahly","Al Ain FC","APOEL FC","Atlético Nacional","Dinamo Kiev",
    "Dinamo Zagreb","Ferencvárosi TC","Hajduk Split","HJK Helsinki","Kaizer Chiefs",
    "Mamelodi Sundowns","Olympiacos FC","Orlando Pirates","Panathinaikos","PAOK","Qarabağ FK",
    "Shakhtar Donetsk","Slavia Praha","Sparta Praha","Viktoria Plzeň","Universidad Católica"
  ]}
];

// Toate regiunile disponibile pentru filtrare (ordine fixa, pentru UI)
const REGIONS = ["Europa", "America de Nord", "America de Sud", "Asia", "Africa", "Oceania", "Diverse"];

// Util: flatten toate cluburile intr-o singura lista, pastrand referinta catre liga
function getAllClubs() {
  const all = [];
  LEAGUES.forEach(league => {
    league.clubs.forEach(clubName => {
      all.push({
        name: clubName,
        league: league.name,
        country: league.country,
        region: league.region,
        tier: league.tier,
        gender: league.gender
      });
    });
  });
  return all;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LEAGUES, REGIONS, getAllClubs };
}
