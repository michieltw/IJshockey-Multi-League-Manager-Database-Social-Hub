# Firebase / NoSQL Architectuur Visie & Analyse

Als Lead Database Architect en Data Engineer heb ik het ijshockey ecosysteem en de huidige relationele/JSON structuur diepgaand geanalyseerd, en deze naar een NoSQL (Firebase/Firestore) vriendelijk model vertaald. Hieronder volgt mijn rapportage.

## 1. Huidige Situatie Analyse (Wat was goed, onlogisch en ontbrak)

### Wat was goed?
* **Diepte en structuur:** De normalisatie (scheiding tussen persoon, organisatie en team) is relationeel gezien ijzersterk. Er is tot in de finesse nagedacht over hockeyregels, waivers en competitiestructuren (IIHF/NHL).
* **Uitgebreide categorieën:** De flexibiliteit in type stats en wedstrijd settings zat al deels in de fundamenten via `Categories V1`.

### Wat was onlogisch voor NoSQL?
* **Over-relationalisatie in snelle queries:** Voor `game_events` (Live play-by-play) is het halen van speler info (naam/rugnummer) d.m.v. 3 joins in SQL normaal, maar in Firestore wil je de kosten (document fetches) en latency minimaliseren. We moeten dit direct aflezen.
* **Geen "Line-up" (Game Roster) snapshotting:** Enkel vertrouwen op `person_encounters` voor het uitlezen van wie er op het ijs staat per wedstrijd leidt tot problemen. In de praktijk spelen 'leenspelers' of gasten mee (in houseleagues) of dragen spelers eenmalig een ander rugnummer. Dit zou de integriteit van de "SZN" (Season) databron aantasten.

### Wat ontbrak er nog?
* **Wissel (Line Change) Event:** Voor geavanceerde analytics (en Time on Ice) moet je ook de 'shift'-veranderingen kunnen loggen, niet enkel wie er ten tijde van de goal op het ijs stond.
* **Overrides op wedstrijdniveau:** Het stat tracking level was gelinkt aan de competitie, wat betekent dat specifieke wedstrijden hier niet zelf in konden over-rulen.
* **Firestore Strategieën:** Geen visie of we root collections of sub-collections moesten gebruiken.

---

## 2. Visie en Implementatie voor Firestore (NoSQL)

De JSON bestanden zijn aangepast en geoptimaliseerd voor schaalbaarheid en robuustheid.

### Schema's als Root Collections vs Subcollections
Om het model in Firebase te schalen, raad ik de volgende indeling aan (die nu ook verwerkt is in de JSON als `firestore_strategy`):
* **Root Collections:** `persons`, `organizations`, `teams`, `competitions`, `venues`, `nations`, `ruling_bodies` -> Dit zijn globale entiteiten die door de hele app te doorzoeken zijn.
* **Hiërarchische Root Collections (of Sub-Collections):** `games` en `person_encounters`. Deze kunnen vaak het beste root-level worden gehouden (bijv. `/games/{game_id}`) met referentie naar season/league, omdat je een 'global scoreboard' wilt kunnen tonen zonder over duizenden subcollections te hoeven aggregeren.
* **Game Sub-Collections:** `game_events`, `game_rosters`, `team_encounters`. Voorbeeld: `/games/{game_id}/game_events/{event_id}`. Hierdoor cluster je alle live data bij de wedstrijd en lees je nooit te veel data in!

### Agressieve Denormalisatie voor Performance
In het `game_events` schema zijn velden zoals `primary_person_name` en `primary_person_jersey` (en voor de target) toegevoegd.
**Waarom?** Als we in een app een feed van alle play-by-play acties tonen, fetchen we direct de 100 event documenten, en hoeven we niet óók 100 speler documenten apart op te vragen om de naam en rugnummers te resolven (bespaart enorm op Firestore facturatie en verbetert de snelheid drastisch). Als de persoon in de toekomst zijn naam wijzigt, blijft historisch gezien gewoon de toenmalige situatie in tact (wat exact is wat je wil in de sportwereld!).

### Roster-chaos oplossen: `game_rosters`
Ik heb een heel nieuw schema: `game_rosters` toegevoegd. Dit werkt als een sub-collection van een wedstrijd.
* Het vormt een absolute momentopname (snapshot) van het team *voor die specifieke wedstrijd*.
* **Ringers / Leenspelers:** Je kunt in deze collectie een document plaatsen met `name_display`: "Gastspeler X" en `jersey_number`: 99. De `person_id` is nu verplicht. Aan de frontend wordt een verplichte creatie afgedwongen voor onbekende spelers. Hiermee loopt het systeem nooit vast als een scorekeeper haast heeft en iemand toevoegt. Het spel gaat altijd door.

### Flexibiliteit (Overrides)
Ik heb aan `games` het veld `game_level_stat_tracking` toegevoegd. Zo kan de scorekeeper vóór of tijdens een houseleague wedstrijd aangeven dat hij alles (inclusief +/- en shots) gaat bijhouden, zelfs als de competitie in de basis eist dat we alleen doelpunten loggen.

### Uitgebreidere Categories
Categories V1 is aangepast:
1. `line_change` (Wissel) is als geldig `EVENT_TYPE` toegevoegd voor de toekomst om Time On Ice goed te tracken.
2. Extra penalty opties zoals "Abuse of officials" en "Penalty shot" zijn toegevoegd.
3. Extra shot type "Deflection" (wat essentieel is in play-by-play analytics) is toegevoegd.
4. Stat tracking override opties zijn beschikbaar gemaakt.

Het systeem is nu robuust, gericht op performance, en klaar voor ringers!