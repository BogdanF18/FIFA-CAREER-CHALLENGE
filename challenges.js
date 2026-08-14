/**
 * Toate "pool"-urile din care se genereaza provocarile.
 * Fiecare categorie are multe variante (20-30+), asa ca prin combinatii
 * numarul de provocari posibile e in mii, nu doar cateva fixe.
 * Poti adauga oricand randuri noi in aceste liste - e text simplu.
 */

const BUDGET_MODIFIERS = [
  "Buget de transfer: 0€ — poți aduce doar jucători liberi de contract sau prin împrumut.",
  "Bugetul de transfer e înjumătățit față de cel oferit de club, tot sezonul.",
  "Poți cheltui doar banii obținuți din vânzări de jucători (self-funding total).",
  "Buget dublu, dar nu ai voie să vinzi niciun jucător din lot.",
  "Fără achiziții în fereastra de vară — cumperi doar iarna.",
  "Fără achiziții în fereastra de iarnă — cumperi doar vara.",
  "Poți cheltui tot bugetul într-un singur transfer, restul sezonului fără achiziții.",
  "Salariile sunt înghețate — niciun contract oferit nu poate depăși media echipei.",
  "Bugetul de transfer crește cu 20% doar dacă termini sezonul anterior în primele 6.",
  "Ai voie să cumperi doar jucători sub 21 de ani.",
  "Fiecare transfer de intrare trebuie compensat cu o vânzare din lot.",
  "70% din buget trebuie folosit pe un singur transfer 'vedetă', restul pe toate celelalte nevoi.",
  "Nu poți folosi bugetul pentru portari — te descurci cu ce ai sau produci din academie.",
  "Minim un sfert din buget trebuie folosit obligatoriu pe jucători din academia proprie.",
  "Fără împrumuturi — doar transferuri definitive.",
  "Doar împrumuturi — fără transferuri definitive tot sezonul.",
  "Bugetul devine disponibil doar după ce vinzi cel puțin un titular.",
  "Trebuie să cheltui minim 80% din buget încă din prima fereastră de mercato.",
  "Poți folosi bugetul doar pentru jucători din liga ta.",
  "Poți folosi bugetul doar pentru jucători din afara ligii tale.",
  "Board-ul reduce bugetul cu 10% dacă nu prinzi play-off / cupă europeană.",
  "Fiecare transfer costă cel puțin o taxă simbolică — fără agenți liberi 'ieftini'.",
  "Bugetul e valabil doar în prima jumătate a sezonului, apoi înghețat.",
  "Buget nelimitat, dar fiecare jucător cumpărat trebuie să aibă sub 23 de ani."
];

const SEASON_OBJECTIVES = [
  "Termină sezonul în primele 4 din campionat.",
  "Evită retrogradarea, ideal cu minim 3 etape rămase din campionat.",
  "Câștigă un trofeu (cupă sau campionat) până la finalul celui de-al 2-lea sezon.",
  "Realizează o serie de minim 8 meciuri consecutive fără înfrângere.",
  "Califică-te într-o competiție europeană/continentală chiar din primul sezon.",
  "Ajungi în semifinala unei cupe naționale.",
  "Termină sezonul cu cel mult 6 înfrângeri în total.",
  "Câștigă campionatul intern în maxim 5 sezoane de la preluare.",
  "Rămâi neînvins pe teren propriu tot sezonul.",
  "Marchezi în fiecare meci jucat acasă, tot sezonul.",
  "Câștigă campionatul cu un lot format din minim 60% jucători din academie.",
  "Promovează echipa într-o ligă superioară chiar în primul sezon.",
  "Câștigă cel puțin un meci împotriva unei echipe cu rating cu minim 5 puncte peste al tău.",
  "Termină sezonul cu un golaveraj pozitiv de minim +20.",
  "Nu pierde niciun meci în ultimele 10 etape ale campionatului.",
  "Câștigă toate meciurile de tip 'derby' / rivalitate din sezon.",
  "Ajungi în finala unei competiții europene în maxim 3 sezoane.",
  "Ai cel mai bun atac din întreaga ligă la finalul sezonului.",
  "Ai cea mai bună apărare din întreaga ligă la finalul sezonului.",
  "Câștigă campionatul fără să pierzi mai mult de 3 meciuri în tot sezonul.",
  "Termină în primele 3 în fiecare din primele 3 sezoane la club.",
  "Câștigă dubla (campionat + cupă) în același sezon.",
  "Menține un jucător sub 21 de ani ca golgheter al echipei, tot sezonul.",
  "Nu faci niciun transfer 'de panică' (panic buy) în ultima zi de mercato.",
  "Câștigă cel puțin un meci în care ai fost condus cu 2 goluri.",
  "Duci echipa la play-off de promovare venind dintr-o ligă inferioară.",
  "Câștigă campionatul folosind o singură formație tactică tot sezonul.",
  "Salvezi echipa de la retrogradare, fiind angajat abia la jumătatea sezonului."
];

const TRANSFER_RESTRICTIONS = [
  "Poți aduce doar jucători sub 23 de ani.",
  "Poți aduce doar jucători liberi de contract (transfer Bosman).",
  "Poți aduce doar jucători promovați din propria academie.",
  "Nu ai voie să cumperi jucători din echipele din top 5 ligi europene.",
  "Un singur transfer definitiv permis pe fiecare fereastră de mercato.",
  "Poți cumpăra doar jucători de aceeași naționalitate cu majoritatea lotului.",
  "Nu cumperi niciun portar — te bazezi doar pe ce ai sau produci din academie.",
  "Poți cumpăra doar jucători cu potențial minim stabilit de tine la început.",
  "Fără transferuri de jucători peste 30 de ani.",
  "Doar împrumuturi cu opțiune de cumpărare, fără transfer definitiv direct.",
  "Fiecare transfer nou trebuie să vină dintr-o ligă diferită de precedentul.",
  "Nu poți cumpăra de la echipe din același campionat cu tine.",
  "Fiecare jucător cumpărat trebuie titularizat în primele 5 meciuri de la sosire.",
  "Cumperi doar jucători recomandați de scouting, fără căutare liberă pe piață.",
  "Nu poți cumpăra niciodată de la rivala ta directă din campionat.",
  "Poți aduce doar jucători eligibili pentru echipa națională a țării clubului tău.",
  "Trebuie să vinzi orice jucător pentru care primești o ofertă, indiferent de sumă.",
  "Nu poți reînnoi niciun contract care expiră — refaci lotul organic, prin transferuri.",
  "Fiecare fereastră de mercato trebuie să aducă cel puțin un jucător sub 18 ani.",
  "Fără schimburi de tip 'jucător + bani' — doar transferuri simple.",
  "Maxim 3 transferuri de intrare permise pe tot sezonul.",
  "Nu poți cumpăra niciun jucător cu rating mai mare decât căpitanul echipei.",
  "Poți cumpăra doar jucători aflați în ultimul an de contract la clubul actual.",
  "Fiecare transfer de intrare trebuie urmat obligatoriu de o vânzare pe același post."
];

const MANAGER_SPECIAL_RULES = [
  "Trebuie să joci minim un jucător crescut în academie în fiecare meci oficial.",
  "Formație tactică fixă tot sezonul — nicio schimbare de sistem de joc.",
  "Fără substituții în ultimele 10 minute ale meciului, indiferent de scor.",
  "Căpitanul echipei trebuie să fie mereu cel mai tânăr jucător din lot.",
  "Nu ai voie să concediezi niciun jucător sau membru al staff-ului tehnic.",
  "Trebuie să ai minim 2 jucători sub 21 de ani titulari, tot sezonul.",
  "Fără antrenamente individuale — doar antrenamente de echipă.",
  "Schimbi portarul titular la fiecare 5 meciuri jucate.",
  "Dacă ești demis, provocarea se încheie — nu poți relua din același punct.",
  "Fiecare meci trebuie jucat cu o formație de start diferită față de precedentul.",
  "Jucătorii accidentați nu pot fi înlocuiți prin transfer — aștepți recuperarea lor.",
  "Ești obligat să joci toate meciurile amicale din pre-sezon.",
  "Alegi un singur 'stil' de răspuns la interviuri (agresiv sau calm) și îl păstrezi tot sezonul.",
  "Niciun jucător nu poate fi lăsat să plece liber în ultimul an de contract fără să încerci vânzarea.",
  "Trebuie să promovezi minim un jucător din academie în lotul principal în fiecare sezon.",
  "Nu poți cumpăra niciun jucător cu rating peste media actuală a echipei.",
  "Păstrezi același căpitan minim 2 sezoane la rând.",
  "Fiecare înfrângere e urmată obligatoriu de o 'conferință de presă' notată într-un jurnal de carieră.",
  "Nu schimbi niciodată kit-ul sau stadionul echipei, indiferent de oferte.",
  "Toți portarii din lot trebuie să provină din academie.",
  "Joci tot sezonul cu o formație cu minim 3 fundași centrali.",
  "Nu împrumuți niciun jucător către alte echipe, tot sezonul.",
  "Nu ceri niciodată buget suplimentar board-ului, indiferent de rezultate.",
  "Antrenorul secund/staff-ul tehnic nu poate fi schimbat toată cariera de manager.",
  "Trebuie să oferi minute de joc (minim 15) fiecărui jucător din lot cel puțin o dată pe sezon.",
  "Fiecare fereastră de mercato se închide cu lotul exact la limita de jucători permisă de regulament."
];

const NATIONALITIES = [
  "România","Anglia","Spania","Franța","Germania","Italia","Portugalia","Brazilia","Argentina",
  "Olanda","Belgia","Croația","Serbia","Polonia","Ucraina","Turcia","Maroc","Senegal","Nigeria",
  "Ghana","Coreea de Sud","Japonia","SUA","Mexic","Uruguay","Columbia","Chile","Danemarca",
  "Suedia","Norvegia","Elveția","Austria","Scoția","Irlanda","Egipt","Algeria","Tunisia",
  "Australia","Canada","Țara Galilor"
];

const GENERIC_MALE_FIRST_NAMES = ['James', 'Harry', 'Jack', 'Oliver', 'George', 'Thomas', 'Charlie', 'Jacob', 'Alfie', 'Freddie', 'Luca', 'Mateo', 'Theo', 'Noah', 'Leo', 'Daniel', 'Milan'];
const GENERIC_FEMALE_FIRST_NAMES = ['Emma', 'Olivia', 'Sophia', 'Amelia', 'Isabella', 'Charlotte', 'Mia', 'Ava', 'Lucy', 'Grace', 'Layla', 'Zoe', 'Ella', 'Sofia', 'Eva', 'Harper'];
const GENERIC_LAST_NAMES = ['Smith', 'Taylor', 'Johnson', 'Brown', 'Wilson', 'Clarke', 'Wright', 'Evans', 'Walker', 'Robinson', 'Garcia', 'Martinez', 'Gomez', 'Nielsen', 'Müller'];

// ---------- Generator de nume pe nationalitate ----------
const NAMES_BY_NATIONALITY = {
  'România': { first: ['Andrei', 'Alexandru', 'Mihai', 'Ionuț', 'Cristian', 'Gabriel', 'Florin', 'Darius', 'Vlad', 'Ștefan'], last: ['Popescu', 'Ionescu', 'Popa', 'Stan', 'Dumitru', 'Constantin', 'Gheorghe', 'Marin', 'Rusu', 'Munteanu'] },
  'Anglia': { first: ['James', 'Harry', 'Jack', 'Oliver', 'George', 'Thomas', 'Charlie', 'Jacob', 'Alfie', 'Freddie'], last: ['Smith', 'Taylor', 'Johnson', 'Brown', 'Wilson', 'Clarke', 'Wright', 'Evans', 'Walker', 'Robinson'] },
  'Spania': { first: ['Alejandro', 'Pablo', 'Javier', 'Diego', 'Sergio', 'Adrián', 'Iker', 'Mario', 'Hugo', 'Marcos'], last: ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'Fernández', 'Gómez', 'Díaz', 'Ruiz', 'Moreno'] },
  'Franța': { first: ['Lucas', 'Hugo', 'Léo', 'Nathan', 'Enzo', 'Louis', 'Gabriel', 'Tom', 'Mathis', 'Rayan'], last: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon'] },
  'Germania': { first: ['Lukas', 'Finn', 'Jonas', 'Leon', 'Paul', 'Felix', 'Maximilian', 'Noah', 'Elias', 'Tim'], last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'] },
  'Italia': { first: ['Matteo', 'Lorenzo', 'Andrea', 'Francesco', 'Marco', 'Alessandro', 'Davide', 'Simone', 'Riccardo', 'Gabriele'], last: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'] },
  'Portugalia': { first: ['João', 'Pedro', 'Rui', 'Tiago', 'Bruno', 'Diogo', 'André', 'Miguel', 'Gonçalo', 'Rodrigo'], last: ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Carvalho', 'Gomes'] },
  'Brazilia': { first: ['Gabriel', 'Lucas', 'Matheus', 'Rafael', 'Bruno', 'Thiago', 'Felipe', 'Diego', 'Vinícius', 'Guilherme'], last: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Pereira', 'Almeida', 'Ferreira', 'Ribeiro', 'Carvalho'] },
  'Argentina': { first: ['Santiago', 'Mateo', 'Franco', 'Nicolás', 'Agustín', 'Facundo', 'Joaquín', 'Tomás', 'Lautaro', 'Ignacio'], last: ['Fernández', 'González', 'Rodríguez', 'Pérez', 'Sosa', 'Romero', 'Díaz', 'Torres', 'Acosta', 'Molina'] },
  'Olanda': { first: ['Daan', 'Sem', 'Lucas', 'Milan', 'Levi', 'Finn', 'Bram', 'Thijs', 'Jesse', 'Luuk'], last: ['de Jong', 'Jansen', 'de Vries', 'van den Berg', 'Bakker', 'Visser', 'Smit', 'Meijer', 'de Boer', 'Mulder'] },
  'Belgia': { first: ['Arthur', 'Louis', 'Adam', 'Noah', 'Liam', 'Victor', 'Lucas', 'Nathan', 'Oscar', 'Milan'], last: ['Peeters', 'Janssens', 'Maes', 'Jacobs', 'Mertens', 'Willems', 'Claes', 'Goossens', 'Wouters', 'De Smet'] },
  'Croația': { first: ['Luka', 'Ivan', 'Marko', 'Josip', 'Ante', 'Filip', 'Karlo', 'Dario', 'Nikola', 'Petar'], last: ['Horvat', 'Kovačić', 'Babić', 'Marić', 'Jurić', 'Novak', 'Vuković', 'Kovač', 'Perić', 'Matić'] },
  'Serbia': { first: ['Nikola', 'Stefan', 'Marko', 'Miloš', 'Aleksandar', 'Filip', 'Lazar', 'Dušan', 'Vuk', 'Bogdan'], last: ['Jovanović', 'Petrović', 'Nikolić', 'Marković', 'Đorđević', 'Stojanović', 'Ilić', 'Stanković', 'Pavlović', 'Milošević'] },
  'Polonia': { first: ['Jakub', 'Kacper', 'Szymon', 'Filip', 'Antoni', 'Wojciech', 'Mateusz', 'Michał', 'Piotr', 'Bartosz'], last: ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak'] },
  'Ucraina': { first: ['Oleksandr', 'Andriy', 'Dmytro', 'Yevhen', 'Ivan', 'Vitaliy', 'Serhiy', 'Bohdan', 'Maksym', 'Roman'], last: ['Kovalenko', 'Shevchenko', 'Bondarenko', 'Tkachenko', 'Kravchenko', 'Melnyk', 'Boyko', 'Rudenko', 'Marchenko', 'Kovalchuk'] },
  'Turcia': { first: ['Emre', 'Mert', 'Berat', 'Yusuf', 'Ahmet', 'Mustafa', 'Burak', 'Kerem', 'Onur', 'Serkan'], last: ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Öztürk', 'Aydın', 'Arslan', 'Doğan'] },
  'Maroc': { first: ['Youssef', 'Amine', 'Anas', 'Yassine', 'Adam', 'Hamza', 'Ayoub', 'Zakaria', 'Karim', 'Nabil'], last: ['El Amrani', 'Benali', 'Alaoui', 'Idrissi', 'Bennani', 'El Fassi', 'Chraibi', 'Tazi', 'Belkacemi', 'Cherkaoui'] },
  'Senegal': { first: ['Mamadou', 'Ibrahima', 'Cheikh', 'Ousmane', 'Moussa', 'Alassane', 'Sadio', 'Pape', 'Amadou', 'Babacar'], last: ['Diop', 'Ndiaye', 'Diallo', 'Sarr', 'Fall', 'Gueye', 'Sow', 'Kane', 'Ba', 'Cissé'] },
  'Nigeria': { first: ['Chidi', 'Emeka', 'Ifeanyi', 'Tunde', 'Femi', 'Segun', 'Kelechi', 'Obinna', 'Chukwuemeka', 'Ayo'], last: ['Okafor', 'Okoye', 'Adeyemi', 'Balogun', 'Eze', 'Nwosu', 'Adekunle', 'Obi', 'Chukwu', 'Bello'] },
  'Ghana': { first: ['Kwame', 'Kofi', 'Kwabena', 'Yaw', 'Kwesi', 'Emmanuel', 'Isaac', 'Samuel', 'Daniel', 'Prince'], last: ['Mensah', 'Owusu', 'Boateng', 'Asante', 'Osei', 'Appiah', 'Agyemang', 'Amoah', 'Darko', 'Yeboah'] },
  'Coreea de Sud': { first: ['Min-jun', 'Seo-jun', 'Do-yun', 'Ji-ho', 'Joon-ho', 'Hyun-woo', 'Jun-seo', 'Tae-yang', 'Sung-min', 'Woo-jin'], last: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim'] },
  'Japonia': { first: ['Haruto', 'Yuto', 'Sota', 'Ren', 'Riku', 'Kaito', 'Sho', 'Daiki', 'Yuma', 'Kenta'], last: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Saito'] },
  'SUA': { first: ['Ethan', 'Mason', 'Logan', 'Jackson', 'Aiden', 'Caleb', 'Ryan', 'Tyler', 'Brandon', 'Cameron'], last: ['Johnson', 'Williams', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Anderson', 'Thompson', 'Martinez', 'Harris'] },
  'Mexic': { first: ['Emiliano', 'Santiago', 'Diego', 'Leonardo', 'Ángel', 'José', 'Iván', 'Fernando', 'Alan', 'Jesús'], last: ['Hernández', 'García', 'Martínez', 'López', 'González', 'Ramírez', 'Flores', 'Vázquez', 'Reyes', 'Torres'] },
  'Uruguay': { first: ['Federico', 'Nicolás', 'Sebastián', 'Rodrigo', 'Gonzalo', 'Martín', 'Bruno', 'Emiliano', 'Diego', 'Agustín'], last: ['Rodríguez', 'Pereira', 'Fernández', 'González', 'Silva', 'Suárez', 'Machado', 'Correa', 'Bentancur', 'Araújo'] },
  'Columbia': { first: ['Juan', 'Santiago', 'Andrés', 'Camilo', 'Sebastián', 'Daniel', 'Miguel', 'Cristian', 'Julián', 'David'], last: ['Rodríguez', 'García', 'Martínez', 'López', 'Ramírez', 'Torres', 'Muñoz', 'Vargas', 'Castillo', 'Rojas'] },
  'Chile': { first: ['Matías', 'Benjamín', 'Vicente', 'Cristóbal', 'Joaquín', 'Agustín', 'Diego', 'Felipe', 'Tomás', 'Ignacio'], last: ['González', 'Muñoz', 'Rojas', 'Díaz', 'Fuentes', 'Contreras', 'Silva', 'Espinoza', 'Reyes', 'Morales'] },
  'Danemarca': { first: ['Mikkel', 'Lasse', 'Frederik', 'Christian', 'Nikolaj', 'Magnus', 'Anders', 'Emil', 'Oliver', 'Jonas'], last: ['Nielsen', 'Jensen', 'Hansen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen', 'Sørensen', 'Rasmussen', 'Jørgensen'] },
  'Suedia': { first: ['Erik', 'Oskar', 'Viktor', 'Filip', 'Anton', 'William', 'Alexander', 'Elias', 'Isak', 'Emil'], last: ['Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson'] },
  'Norvegia': { first: ['Sondre', 'Magnus', 'Kristian', 'Martin', 'Henrik', 'Emil', 'Jonas', 'Sander', 'Fredrik', 'Thomas'], last: ['Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen'] },
  'Elveția': { first: ['Noah', 'Luca', 'Nico', 'Yann', 'Elias', 'Timo', 'Sven', 'Fabio', 'Michael', 'Simon'], last: ['Müller', 'Meier', 'Schmid', 'Keller', 'Weber', 'Huber', 'Schneider', 'Meyer', 'Steiner', 'Fischer'] },
  'Austria': { first: ['Lukas', 'Maximilian', 'Jakob', 'Felix', 'Paul', 'David', 'Julian', 'Simon', 'Fabian', 'Florian'], last: ['Gruber', 'Huber', 'Bauer', 'Wagner', 'Müller', 'Pichler', 'Steiner', 'Moser', 'Mayer', 'Hofer'] },
  'Scoția': { first: ['Callum', 'Euan', 'Fraser', 'Lewis', 'Ross', 'Ewan', 'Angus', 'Rory', 'Kyle', 'Connor'], last: ['MacDonald', 'Stewart', 'Campbell', 'Fraser', 'Robertson', 'Wallace', 'Anderson', 'Murray', 'Reid', 'Scott'] },
  'Irlanda': { first: ['Cian', 'Sean', 'Liam', 'Conor', 'Aidan', 'Ronan', 'Declan', 'Eoin', 'Darragh', 'Cormac'], last: ['O\'Brien', 'Murphy', 'Kelly', 'Ryan', 'Walsh', 'O\'Sullivan', 'Byrne', 'Gallagher', 'Doyle', 'Kennedy'] },
  'Egipt': { first: ['Ahmed', 'Mohamed', 'Omar', 'Mahmoud', 'Youssef', 'Karim', 'Amir', 'Hassan', 'Khaled', 'Mostafa'], last: ['El Sayed', 'Hassan', 'Ibrahim', 'Mansour', 'Abdel Rahman', 'Farouk', 'Salem', 'Fathy', 'Gaber', 'Hamdy'] },
  'Algeria': { first: ['Riyad', 'Islam', 'Ismaël', 'Yacine', 'Sofiane', 'Rayan', 'Nassim', 'Adel', 'Karim', 'Amine'], last: ['Belkacem', 'Bouazza', 'Cherif', 'Djaballah', 'Hamidi', 'Kaci', 'Larbi', 'Meziane', 'Rahmani', 'Zaidi'] },
  'Tunisia': { first: ['Youssef', 'Wajdi', 'Anis', 'Firas', 'Skander', 'Seifeddine', 'Montassar', 'Aymen', 'Bilel', 'Karim'], last: ['Ben Ali', 'Trabelsi', 'Jebali', 'Chaabane', 'Gharbi', 'Bouazizi', 'Sassi', 'Karray', 'Mansouri', 'Hammami'] },
  'Australia': { first: ['Jack', 'Lachlan', 'Oliver', 'Cooper', 'Ethan', 'William', 'Riley', 'Noah', 'Harrison', 'Mitchell'], last: ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Clarke', 'White'] },
  'Canada': { first: ['Liam', 'Noah', 'Ethan', 'William', 'Owen', 'Benjamin', 'Jack', 'Lucas', 'Nathan', 'Alexander'], last: ['Tremblay', 'Roy', 'Gagnon', 'Martin', 'Smith', 'Brown', 'Wilson', 'Campbell', 'MacDonald', 'Bergeron'] },
  'Țara Galilor': { first: ['Rhys', 'Gareth', 'Dylan', 'Owen', 'Ioan', 'Aled', 'Emrys', 'Huw', 'Gruffudd', 'Cai'], last: ['Evans', 'Jones', 'Williams', 'Davies', 'Thomas', 'Roberts', 'Hughes', 'Griffiths', 'Pugh', 'Morgan'] },
};

const FEMALE_NAME_OVERRIDES = {
  'România': ['Andreea', 'Ioana', 'Maria', 'Ana', 'Elena', 'Cristina', 'Roxana', 'Adriana', 'Diana', 'Mirela'],
  'Anglia': ['Emma', 'Olivia', 'Sophia', 'Amelia', 'Isabella', 'Charlotte', 'Mia', 'Ava', 'Lucy', 'Ella'],
  'Spania': ['Lucía', 'Sofía', 'María', 'Paula', 'Valeria', 'Clara', 'Irene', 'Carmen', 'Nerea', 'Alicia'],
  'Franța': ['Emma', 'Louise', 'Camille', 'Inès', 'Manon', 'Léa', 'Jade', 'Eva', 'Chloé', 'Sarah'],
  'Germania': ['Anna', 'Lea', 'Lena', 'Sophie', 'Julia', 'Mila', 'Selina', 'Emma', 'Hannah', 'Mia'],
  'Italia': ['Sofia', 'Giulia', 'Chiara', 'Martina', 'Sara', 'Aurora', 'Alessia', 'Emma', 'Livia', 'Beatrice'],
  'Portugalia': ['Maria', 'Joana', 'Sofia', 'Inês', 'Carolina', 'Marta', 'Laura', 'Ana', 'Beatriz', 'Raquel'],
  'Brazilia': ['Maria', 'Ana', 'Beatriz', 'Julia', 'Letícia', 'Sofia', 'Gabriela', 'Luiza', 'Thais', 'Camila'],
  'Argentina': ['Sofía', 'Agustina', 'Lucía', 'Micaela', 'Camila', 'Valentina', 'Florencia', 'María', 'Belén', 'Julieta'],
  'Olanda': ['Emma', 'Sophie', 'Mila', 'Julia', 'Lotte', 'Noor', 'Eva', 'Sara', 'Demi', 'Joelle'],
  'Belgia': ['Emma', 'Louise', 'Lotte', 'Noa', 'Julia', 'Camille', 'Elsa', 'Mila', 'Sophie', 'Ines'],
  'Croația': ['Ana', 'Mia', 'Ivana', 'Lucija', 'Katarina', 'Sara', 'Tea', 'Marija', 'Nika', 'Lea'],
  'Polonia': ['Anna', 'Zofia', 'Julia', 'Maja', 'Kasia', 'Oliwia', 'Alicja', 'Iga', 'Natalia', 'Weronika'],
  'Ucraina': ['Anna', 'Maria', 'Olha', 'Katya', 'Mila', 'Sofia', 'Daria', 'Viktoria', 'Natalia', 'Alina'],
  'Turcia': ['Ece', 'Elif', 'Azra', 'Ada', 'Zeynep', 'Sude', 'Defne', 'Melek', 'Yagmur', 'Duru'],
  'Maroc': ['Amina', 'Salma', 'Yasmine', 'Nadia', 'Imane', 'Lina', 'Hind', 'Sofia', 'Meryem', 'Aya'],
  'Nigeria': ['Chiamaka', 'Adaeze', 'Evelyn', 'Amara', 'Victoria', 'Joy', 'Nneka', 'Aisha', 'Grace', 'Zainab'],
  'Ghana': ['Ama', 'Efua', 'Akosua', 'Mabel', 'Abena', 'Serwaa', 'Esi', 'Adjoa', 'Naa', 'Nana'],
  'Japonia': ['Yui', 'Sakura', 'Hina', 'Aoi', 'Yuna', 'Mio', 'Rio', 'Haruka', 'Mika', 'Rina'],
  'SUA': ['Emma', 'Olivia', 'Sophia', 'Ava', 'Mia', 'Charlotte', 'Isabella', 'Grace', 'Harper', 'Ella'],
  'Mexic': ['Valentina', 'Gabriela', 'María', 'Sofía', 'Renata', 'Ximena', 'Camila', 'Alejandra', 'Lucía', 'Fernanda'],
  'Australia': ['Emma', 'Olivia', 'Charlotte', 'Isla', 'Ava', 'Mia', 'Lily', 'Ella', 'Sophie', 'Grace'],
  'Canada': ['Emma', 'Olivia', 'Charlotte', 'Sophie', 'Mia', 'Ava', 'Amelia', 'Lily', 'Ella', 'Eva']
};

function generateMaleNames(nationality, count = 1) {
  const pool = NAMES_BY_NATIONALITY[nationality] || { first: GENERIC_MALE_FIRST_NAMES, last: GENERIC_LAST_NAMES };
  const names = [];
  for (let i = 0; i < count; i += 1) {
    const first = pool.first[Math.floor(Math.random() * pool.first.length)];
    const last = pool.last[Math.floor(Math.random() * pool.last.length)];
    names.push(`${first} ${last}`);
  }
  return names;
}

function generateFemaleNames(nationality, count = 1) {
  const nationalityPool = FEMALE_NAME_OVERRIDES[nationality] || GENERIC_FEMALE_FIRST_NAMES;
  const lastPool = (NAMES_BY_NATIONALITY[nationality] && NAMES_BY_NATIONALITY[nationality].last) || GENERIC_LAST_NAMES;
  const names = [];
  for (let i = 0; i < count; i += 1) {
    const first = nationalityPool[Math.floor(Math.random() * nationalityPool.length)];
    const last = lastPool[Math.floor(Math.random() * lastPool.length)];
    names.push(`${first} ${last}`);
  }
  return names;
}

function generatePlayerName(nationality, gender = 'M') {
  if (gender === 'F') return generateFemaleNames(nationality, 1)[0];
  return generateMaleNames(nationality, 1)[0];
}

const POSITIONS = [
  "ST (vârf)","CF (atacant secund)","LW (extremă stânga)","RW (extremă dreapta)",
  "CAM (mijlocaș ofensiv)","CM (mijlocaș central)","CDM (mijlocaș defensiv)","LM (mijlocaș stânga)",
  "RM (mijlocaș dreapta)","LB (fundaș stânga)","RB (fundaș dreapta)","LWB (fundaș lateral stânga)",
  "RWB (fundaș lateral dreapta)","CB (fundaș central)","GK (portar)"
];

const AGE_PROFILES = [
  { age: 16, note: "talent precoce, direct din academie" },
  { age: 17, note: "proaspăt semnat ca junior de club" },
  { age: 18, note: "debut oficial la echipa mare" },
  { age: 19, note: "trimis inițial în împrumut pentru experiență" },
  { age: 20, note: "abia promovat definitiv la lotul mare" },
  { age: 21, note: "jucător de bază la un club mic" },
  { age: 22, note: "primul sezon ca titular cert" },
  { age: 23, note: "transferul care deschide cariera mare" },
  { age: 25, note: "în prime fizic, dar la un club modest" },
  { age: 27, note: "poveste de 'late bloomer' — nedescoperit până acum" },
  { age: 29, note: "ultima șansă reală de a ajunge sus" },
  { age: 31, note: "veteran care încearcă un ultim transfer important" }
];

const FINAL_OBJECTIVES_PLAYER = [
  "Câștigă Balonul de Aur (sau echivalent) până la 30 de ani.",
  "Ajungi la echipa națională de seniori până la 21 de ani.",
  "Devii golgheter all-time al clubului la care ai debutat.",
  "Ajungi la un rating OVR de 90 sau mai mult.",
  "Joci pentru cluburi din minim 3 țări diferite pe parcursul carierei.",
  "Câștigă Liga Campionilor (sau echivalentul competiției) cu un club considerat 'mic'.",
  "Devii căpitanul echipei naționale.",
  "Marchezi 300 de goluri în cariera de club.",
  "Oferi 200 de pase decisive (assist-uri) în cariera de club.",
  "Ești transferat la un club din top 6 european până la 23 de ani.",
  "Câștigi campionatul intern cu 3 cluburi diferite de-a lungul carierei.",
  "Termini cariera cu cel puțin 5 trofee majore câștigate.",
  "Devii cel mai tânăr marcator din istoria clubului tău de start.",
  "Joci o finală de Cupă Mondială cu echipa națională.",
  "Termini golgheter al unei ediții de cupă continentală sau mondială.",
  "Faci parte dintr-un transfer-record (cea mai mare taxă din 'univers' la momentul respectiv).",
  "Rămâi la un singur club toată cariera, minim 10 sezoane — devii 'legendă locală'.",
  "Joci pe minim 4 posturi diferite de-a lungul carierei.",
  "Urci de la liga a doua până în cupele europene în maxim 4 sezoane.",
  "Câștigi trofeul de 'Jucătorul Anului' în liga în care evoluezi.",
  "Ești golgheterul ligii timp de 3 sezoane consecutive.",
  "Joci 500 de meciuri oficiale de club.",
  "Clubul tău de start îți retrage numărul de pe tricou la finalul carierei.",
  "Ajungi coleg de echipă cu un jucător de rating 90+ printr-un transfer la un club mare.",
  "Câștigi un trofeu individual (gheata de aur, best playmaker etc.) într-o țară străină.",
  "Termini cariera cu o medie de minim 0.6 goluri pe meci.",
  "Reușești un hattrick într-un meci de rivalitate/derby important.",
  "Readuci clubul de start (dacă retrogradează) înapoi în prima ligă, ca jucător cheie."
];

const PLAYER_SPECIAL_RULES = [
  "Nu poți refuza niciun împrumut oferit de club.",
  "Trebuie să folosești mereu piciorul slab la antrenamentele individuale.",
  "Nu poți cere transfer până la vârsta de 23 de ani.",
  "Trebuie să accepți primul transfer oferit, fără negociere.",
  "Nu poți refuza nicio convocare la echipa națională.",
  "Fiecare contract nou trebuie semnat pe minim 3 sezoane.",
  "Nu poți rămâne 2 sezoane consecutive la același club fără să ceri măcar un împrumut.",
  "Trebuie să înveți toate mișcările de skill posibile pentru postul tău.",
  "Refuzi orice ofertă din partea echipelor de top 3 din clasament, până la 25 de ani.",
  "Trebuie să joci un sezon complet ca rezervă înainte de a cere titularizare.",
  "Nu poți schimba niciodată numărul de pe tricou.",
  "Porți banderola de căpitan imediat ce ți-e oferită, indiferent de vârstă.",
  "Refuzi mereu prima ofertă de prelungire a contractului — negociezi cel puțin o dată.",
  "Nu accepți transfer la un club din aceeași țară de două ori la rând.",
  "Trebuie să joci minim un sezon în afara ligilor 'mari' (non top-5 european).",
  "Faci obligatoriu minim un împrumut într-o ligă inferioară, pentru experiență.",
  "Nu poți avea agent — negociezi tot personal și accepți prima ofertă de salariu primită.",
  "Nu accepți niciodată rolul de rezervă fără să lupți minim un sezon pentru titularizare.",
  "Nu poți juca pentru mai mult de 2 cluburi din top 5 campionate europene.",
  "Trebuie să revii cel puțin o dată în carieră la clubul de start (împrumut sau transfer).",
  "Refuzi orice transfer către un rival direct al clubului tău actual.",
  "Ultimele 2 sezoane din carieră le joci obligatoriu într-o ligă mai slabă, ca mentor.",
  "Fiecare interviu de presă trebuie să menționeze clubul tău de start, indiferent unde joci.",
  "Nu poți respinge o mutare pe alt post decât cel principal, dacă antrenorul o cere.",
  "Nu accepți nicio prelungire de contract cu salariu mai mic decât cel anterior.",
  "Trebuie să joci minim 20 de meciuri într-un singur sezon la un club nou, înainte de a cere plecarea."
];

// ---------- Durata provocarii (filtru optional) ----------
const DURATIONS = {
  "": { label: "Oricare", note: "" },
  scurt: { label: "1 sezon", note: "Provocarea se joacă și se evaluează într-un singur sezon." },
  mediu: { label: "3 sezoane", note: "Provocarea se întinde pe 3 sezoane consecutive la același club/jucător." },
  lung: { label: "Carieră completă", note: "Provocarea urmărește întreaga carieră, până la retragere sau abandon." }
};

// ---------- Tip echipa (filtru optional, independent de dificultate) ----------
const TEAM_TYPES = {
  "": { label: "Oricare", tierPool: null },
  top: { label: "Club de top", tierPool: [1] },
  puternic: { label: "Club puternic", tierPool: [2] },
  mediu: { label: "Club mediu", tierPool: [3] },
  mic: { label: "Club mic / outsider", tierPool: [4] }
};

// ---------- Career Path generic pentru Player (harta de etape a carierei) ----------
const CAREER_PATH_STAGES = [
  {
    title: "Etapa 1 — Debut",
    offsetStart: 0,
    offsetEnd: 2,
    tasks: [
      "Debutează oficial pentru echipa mare chiar în primul sezon la club.",
      "Prinde minim 10 meciuri oficiale în primul sezon la club.",
      "Marchezi/oferi primul gol sau assist oficial în tricoul clubului.",
      "Fii convocat măcar o dată la reprezentativa națională (tineret sau seniori).",
      "Semnează primul contract profesionist cu clubul de start.",
      "Câștigă un loc de titular până la finalul acestei etape."
    ]
  },
  {
    title: "Etapa 2 — Consacrare",
    offsetStart: 3,
    offsetEnd: 8,
    tasks: [
      "Devii titular cert, cu minim 25 de meciuri într-un sezon.",
      "Primești prima convocare la echipa națională de seniori.",
      "Realizezi un transfer către un club dintr-o ligă mai puternică.",
      "Câștigi primul trofeu (cupă sau campionat) din carieră.",
      "Devii cel mai bun marcator/pasator al echipei într-un sezon.",
      "Ajungi la un OVR de club considerat 'titular de bază' pentru postul tău."
    ]
  },
  {
    title: "Etapa 3 — Vârful carierei",
    offsetStart: 9,
    offsetEnd: 14,
    tasks: [
      "Joci pentru un club din top 6 european sau echivalent.",
      "Câștigi un trofeu individual (golgheter, best player etc.) în liga ta.",
      "Devii căpitanul echipei de club sau naționale.",
      "Ajungi la un rating OVR de 85+ (sau echivalent pentru dificultatea aleasă).",
      "Joci o finală de cupă continentală sau mondială.",
      "Rămâi titular incontestabil minim 3 sezoane consecutive."
    ]
  },
  {
    title: "Etapa 4 — Declin & moștenire",
    offsetStart: 15,
    offsetEnd: null, // null = deschis ("X+ ani")
    tasks: [
      "Mentorezi minim un jucător tânăr din academie/lot până la debut.",
      "Termini cariera la un club la care ai mai jucat anterior.",
      "Ajungi la un total de peste 400 de meciuri oficiale de club.",
      "Joci ultimul sezon într-o ligă mai slabă decât vârful carierei, ca lider de vestiar.",
      "Primești un meci/tur de onoare la retragere din partea unui club la care ai jucat.",
      "Rămâi în istoria clubului de start ca unul dintre cei mai buni jucători crescuți acolo."
    ]
  }
];

// Construieste eticheta de varsta pentru o etapa, relativ la varsta REALA de start
// a jucatorului (evita contradictii de tipul "debut 16-20 ani" pentru un start la 29 ani).
function ageRangeLabel(startAge, stageDef) {
  const from = startAge + stageDef.offsetStart;
  if (stageDef.offsetEnd === null) return `${from}+ ani`;
  const to = startAge + stageDef.offsetEnd;
  return `${from}-${to} ani`;
}

function generateCareerPath(startAge) {
  const base = typeof startAge === "number" ? startAge : 18;
  return CAREER_PATH_STAGES.map(s => ({
    stage: `${s.title} (${ageRangeLabel(base, s)})`,
    task: pick(s.tasks)
  }));
}

function rerollCareerPathStage(index, startAge) {
  const base = typeof startAge === "number" ? startAge : 18;
  const stageDef = CAREER_PATH_STAGES[index];
  return {
    stage: `${stageDef.title} (${ageRangeLabel(base, stageDef)})`,
    task: pick(stageDef.tasks)
  };
}

// Recalculeaza doar etichetele de varsta ale unui career path existent (pastreaza task-urile deja alese)
// - folosit cand jucatorul isi reruleaza campul "Varsta start", ca sa nu ramana etape contradictorii.
function rebuildCareerPathLabels(careerPath, startAge) {
  const base = typeof startAge === "number" ? startAge : 18;
  return careerPath.map((entry, i) => {
    const stageDef = CAREER_PATH_STAGES[i];
    return { stage: `${stageDef.title} (${ageRangeLabel(base, stageDef)})`, task: entry.task };
  });
}

const DIFFICULTIES = {
  usor: { label: "Ușor", ovrMin: 70, ovrMax: 78, tierPool: [1, 2] },
  normal: { label: "Normal", ovrMin: 63, ovrMax: 70, tierPool: [2, 3] },
  greu: { label: "Greu", ovrMin: 56, ovrMax: 64, tierPool: [3, 4] },
  legendar: { label: "Legendar", ovrMin: 48, ovrMax: 58, tierPool: [4] }
};

const PENALTIES = [
  "Pedeapsă: pierzi 20% din bugetul de transfer în sezonul următor dacă obiectivul eșuează.",
  "Pedeapsă: clubul îți reduce bugetul cu 10% și îți blochează un transfer important.",
  "Pedeapsă: nu ai voie să cumperi niciun jucător pentru următorul mercat, dacă eșuezi." ,
  "Pedeapsă: o parte din lot este forțată să plece la împrumut în următorul sezon." 
];

const CONTRACT_RENEWAL_RULES = [
  "Reînnoire de contract: la finalul fiecărui sezon, poți relua provocarea cu datele actuale ale carierei și primi un nou obiectiv contextual.",
  "Reînnoire de contract: dacă obiectivul eșuează, te confrunți cu o nouă misiune mai dificilă în sezonul următor.",
  "Reînnoire de contract: fiecare sezon schimbă prioritatea, în funcție de clasament, trofee, buget și performanțe de transfer."
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCompetitiveContext(club, mode = 'manager') {
  const leagueName = (club && club.league) ? club.league : '';
  const gender = (club && club.gender) ? club.gender : 'M';
  const isFemaleLeague = /feminin|women|women's|liga f|arkema|nwsl|frauen/i.test(leagueName) || gender === 'F';
  const isEuropeanLeague = !!(club && club.region === 'Europa' && !isFemaleLeague);
  const tier = club ? (Number(club.tier) || 99) : 99;
  const directEuropeanQualification = isEuropeanLeague && tier === 1;
  const canQualifyForEurope = directEuropeanQualification || (isEuropeanLeague && tier === 2 && /premier league|laliga ea sports|bundesliga|serie a|ligue 1/i.test(leagueName));
  const realisticObjective = mode === 'manager'
    ? { minTier: 3, canChooseEuropean: canQualifyForEurope, allowPromotion: true }
    : { minTier: 2, canChooseEuropean: canQualifyForEurope, allowPromotion: tier <= 3 };

  return {
    club,
    gender,
    leagueName,
    tier,
    isFemaleLeague,
    isEuropeanLeague,
    directEuropeanQualification,
    canQualifyForEurope,
    realisticObjective,
    canCompeteInCup: isEuropeanLeague && tier <= 3 && !isFemaleLeague
  };
}

function buildMissionTimeframe(type, context, age) {
  if (type === 'player') {
    if (age >= 29) return '2 sezoane';
    if (age <= 18) return '3-4 sezoane';
    return '2-3 sezoane';
  }
  if (context && context.tier >= 3) return '2 sezoane';
  return '1-2 sezoane';
}

function getObjectiveAgeTarget(objective) {
  if (!objective) return null;
  const text = objective.toLowerCase();
  const matches = [
    text.match(/(?:până\s+la|înainte\s+de|sub|mai\s+mic\s+de)\s+(\d{1,2})\s*(?:de\s+ani|ani)?/i),
    text.match(/(?:la|de)\s+(\d{1,2})\s+ani/i),
    text.match(/(\d{1,2})\s+de\s+ani/i)
  ];

  for (const match of matches) {
    if (match && match[1]) {
      const value = Number(match[1]);
      if (Number.isFinite(value)) return value;
    }
  }

  return null;
}

function buildContextualObjective(context, type = 'manager', age = 18, difficultyKey = 'normal') {
  const pool = type === 'manager' ? SEASON_OBJECTIVES : FINAL_OBJECTIVES_PLAYER;
  const normalized = pool.filter(objective => {
    const lower = objective.toLowerCase();
    const hasEuropeanKeyword = /europ|continental|champions|ucl|play[- ]?off|finala unei competitii europene|finala unei cupe|az|finala/i.test(lower);
    const ageTarget = type === 'player' ? getObjectiveAgeTarget(objective) : null;

    if (!context) return true;
    if (!context.canQualifyForEurope && hasEuropeanKeyword) return false;
    if (type === 'player' && ageTarget !== null && ageTarget < age) return false;
    if (type === 'player' && age >= 29 && /23 de ani|21 de ani|sub 21|sub 23|până la 21|până la 23|înainte de 21|înainte de 23|30 de ani|30 ani/i.test(lower)) return false;
    if (context.tier >= 3 && /promovează|promovare|retrogradare|câștigă campionatul|top 4|primele 4/i.test(lower)) return true;
    if (context.tier <= 2 && /retrogradare|promovare/i.test(lower) && !/promovează|promovare/i.test(lower)) return true;
    return true;
  });

  const options = normalized.length ? normalized : pool.filter(objective => {
    const ageTarget = type === 'player' ? getObjectiveAgeTarget(objective) : null;
    if (type === 'player' && ageTarget !== null) return ageTarget >= age;
    return true;
  });

  return pick(options.length ? options : pool);
}

function buildPenaltyText(type) {
  return pick(PENALTIES);
}

function buildContractRenewalRule() {
  return pick(CONTRACT_RENEWAL_RULES);
}

// filters: { gender, region, league, teamType }
function pickClub(allClubs, diffTierPool, filters) {
  filters = filters || {};
  const forcedTierPool = filters.teamType && TEAM_TYPES[filters.teamType] && TEAM_TYPES[filters.teamType].tierPool;
  const tierPool = forcedTierPool || diffTierPool;

  let filtered = allClubs.filter(c =>
    tierPool.includes(c.tier) &&
    (!filters.gender || c.gender === filters.gender) &&
    (!filters.region || c.region === filters.region) &&
    (!filters.league || c.league === filters.league)
  );

  // Relaxam treptat filtrele daca nu gasim niciun club, ca sa nu blocam generatorul
  if (!filtered.length && filters.league) {
    filtered = allClubs.filter(c => c.league === filters.league &&
      (!filters.gender || c.gender === filters.gender));
  }
  if (!filtered.length && filters.region) {
    filtered = allClubs.filter(c => c.region === filters.region &&
      tierPool.includes(c.tier) && (!filters.gender || c.gender === filters.gender));
  }
  if (!filtered.length) {
    filtered = allClubs.filter(c => tierPool.includes(c.tier) && (!filters.gender || c.gender === filters.gender));
  }
  const pool = filtered.length ? filtered : allClubs;
  return pick(pool);
}

function generateManagerChallenge(allClubs, difficultyKey, filters) {
  filters = filters || {};
  const diff = DIFFICULTIES[difficultyKey] || DIFFICULTIES.normal;
  const club = pickClub(allClubs, diff.tierPool, filters);
  const context = getCompetitiveContext(club, 'manager');
  const durationKey = filters.duration || "";
  const objective = buildContextualObjective(context, 'manager', 0, difficultyKey);
  return {
    type: "manager",
    difficulty: diff.label,
    duration: DURATIONS[durationKey] ? DURATIONS[durationKey].label : DURATIONS[""].label,
    club,
    budget: pick(BUDGET_MODIFIERS),
    objective,
    restriction: pick(TRANSFER_RESTRICTIONS),
    specialRule: pick(MANAGER_SPECIAL_RULES),
    penalty: buildPenaltyText('manager'),
    contractRenewal: buildContractRenewalRule(),
    missionWindow: buildMissionTimeframe('manager', context, 0),
    completed: false,
    completedAt: null
  };
}

function generatePlayerChallenge(allClubs, difficultyKey, filters) {
  filters = filters || {};
  const diff = DIFFICULTIES[difficultyKey] || DIFFICULTIES.normal;
  const club = pickClub(allClubs, diff.tierPool, filters);
  const ageProfile = pick(AGE_PROFILES);
  const context = getCompetitiveContext(club, 'player');
  const age = ageProfile.age;
  const ovr = Math.floor(Math.random() * (diff.ovrMax - diff.ovrMin + 1)) + diff.ovrMin;
  const nationality = pick(NATIONALITIES);
  const playerGender = (filters.gender === 'F') ? 'F' : 'M';
  const durationKey = filters.duration || "";
  return {
    type: "player",
    difficulty: diff.label,
    duration: DURATIONS[durationKey] ? DURATIONS[durationKey].label : DURATIONS[""].label,
    name: generatePlayerName(nationality, playerGender),
    gender: playerGender,
    nationality,
    age,
    ageNote: ageProfile.note,
    club,
    ovr,
    position: pick(POSITIONS),
    objective: buildContextualObjective(context, 'player', age, difficultyKey),
    specialRule: pick(PLAYER_SPECIAL_RULES),
    penalty: buildPenaltyText('player'),
    contractRenewal: buildContractRenewalRule(),
    missionWindow: buildMissionTimeframe('player', context, age),
    careerPath: generateCareerPath(age),
    completed: false,
    completedAt: null
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BUDGET_MODIFIERS, SEASON_OBJECTIVES, TRANSFER_RESTRICTIONS, MANAGER_SPECIAL_RULES,
    NATIONALITIES, POSITIONS, AGE_PROFILES, FINAL_OBJECTIVES_PLAYER, PLAYER_SPECIAL_RULES,
    DIFFICULTIES, DURATIONS, TEAM_TYPES, CAREER_PATH_STAGES,
    getCompetitiveContext, buildContextualObjective, buildMissionTimeframe, buildPenaltyText, buildContractRenewalRule,
    generateMaleNames, generateFemaleNames, generateManagerChallenge, generatePlayerChallenge, generateCareerPath, rerollCareerPathStage,
    rebuildCareerPathLabels, generatePlayerName
  };
}
