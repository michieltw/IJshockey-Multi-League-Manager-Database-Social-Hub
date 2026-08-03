# Naming Convention Visie & Architectuur (Firestore / NoSQL)

Dit document beschrijft de gestandaardiseerde databasestructuur voor Groningen House League. Het primaire doel is het creëren van een robuust, schaalbaar en toekomstbestendig fundament, geoptimaliseerd voor Firebase (Firestore) implementaties.

## 1. De 4-Letter Prefix Conventie
Elke data-entiteit is voorzien van een vaste 4-lettercode (prefix). Deze code identificeert het type record direct, wat cruciaal is in NoSQL waar data soms globaal verspreid of gedenormaliseerd is.

**Overzicht 4-Letter Codes:**
* `PERS` = persons (Personen)
* `PENC` = person_encounters (Persoon x Seizoen)
* `ORGA` = organizations (Organisaties)
* `OENC` = org_encounters (Organisatie x Seizoen)
* `TEAM` = teams (Teams)
* `COMP` = competitions (Competities)
* `CENC` = comp_encounters (Competitie-instellingen)
* `STAG` = stages (Fases & Rondes)
* `VENU` = venues (Sportaccommodaties)
* `NATI` = nations (Naties)
* `RULE` = ruling_bodies (Bestuursorganen)
* `MEDC` = medical_injuries (Blessures)
* `DRAF` = drafts (Drafts)
* `FINA` = financials (Financiën root)
* `LEDG` = ledgers (Financiën Maandelijks)
* `GAME` = games (Wedstrijden)
* `GEVT` = game_events (Live Gebeurtenissen)
* `TENC` = team_encounters (Tactieken)
* `DEVL` = developments (Ontwikkelingsdossiers)
* `WPLN` = weekly_plans (Trainingsschema's)
* `ROST` = game_rosters (Game Rosters / Wedstrijd Selecties)

*Voorbeeld document-ID's in Firestore:* `PERS_00123`, `GAME_9931`, `TEAM_21`

## 2. Tabelnamen en Foreign Keys (Referenties)
Hoewel we de 4-letter codes gebruiken voor daadwerkelijke data-identificatie (`ID` waardes), behouden we voor de leesbaarheid van de code en het schrijven van queries volledige Engelse benamingen in properties:

* **Tabel / Schema Identificatie:** Tabellen behouden hun logische Engelse meervoudsnamen (bijv. `"id": "persons"` of `"id": "games"`). Het schema-object is verrijkt met een property `"code": "PERS"`, zodat backend- en frontendsystemen dit programmatisch aan elkaar kunnen koppelen.
* **Foreign Keys:** Properties die verwijzen naar andere documenten gebruiken logische sleutels zoals `team_id`, `person_id` of `home_team_id`. De target schema waarnaar verwezen wordt staat gedefinieerd onder `targetSchemaId` (verwijzend naar de volledige tabelnaam zoals `"teams"`).

Hiermee borgen we dat programmeurs makkelijk met de datastructuur kunnen werken zonder te moeten ontcijferen wat `ref_t_id` betekent.

## 3. Categorieën Standaard (CAT_)
Alle dropdowns, selects en statische lijsten in het systeem staan opgeslagen in `Categories V1`.
Er is één uniforme standaard ingevoerd waarbij ieder Categorie-ID start met de `CAT_` prefix.
* *Voorbeeld:* UUID's voor stick-eigenschappen (zoals "Stickmerk" of "Stickflex") zijn vertaald naar leesbare codes: `CAT_STBR` (Stick Brand) en `CAT_STFL` (Stick Flex).
* Alle velden in `Master Files` met een `categoryListId` zijn hierop geüpdatet, zodat de relatie tussen metadata-tabellen behouden blijft.

## 4. NoSQL Denormalisatie & Flexibiliteit (Houseleague & Ringers)
Een strikt genormaliseerde SQL-database werkt niet efficiënt in Firebase als het gaat om veelgebruikte, complexe weergaves zoals een live wedstrijdfeed. Hiervoor zijn de volgende richtlijnen toegepast:

**A. Aggressieve Denormalisatie in Game Events**
In plaats van elke keer spelergegevens (naam, rugnummer) via een extra 'fetch' op te halen voor een `game_event`, bevat de `game_events` tabel gedenormaliseerde velden zoals:
* `primary_person_name`, `primary_person_jersey`
* `target_person_name`, `target_person_jersey`
* `secondary_person_name`, `secondary_person_jersey`
* `tertiary_person_name`, `tertiary_person_jersey`
*Hierdoor laadt een wedstrijdfeed razendsnel, met slechts de documenten uit de `game_events` subcollectie.*

**B. Flexibiliteit in Validatie (Geen harde crashes bij lege data)**
Om Houseleagues, "Ringers" (leenspelers) en varierende registratieniveaus (bijv. alleen goals in league A vs. volledige stats inclusief faceoffs en assists in league B) te accommoderen:
* Het concept `game_rosters` is een snapshot-collectie onder `games`. Het biedt ruimte voor het last-minute toevoegen van een "Gastspeler X" op rugnummer 99.
* Bijna alle velden in `game_events` en `game_rosters` zijn optioneel (niet `required`) gemaakt op schemaniveau, behalve de essentiële identifiers (`id`, `game_id`, `event_type`). Het systeem crasht niet als een veld (zoals `secondary_person_id` of `shot_type`) simpelweg afwezig is.

**C. Dynamische Image URLs**
Afbeeldingen en logo's worden direct bij de statische profielen in de Root Collections (`persons`, `teams`, `competitions`) opgeslagen in URL-velden (`player_headshot_url`, `team_logo_url`, `league_logo_url`), voor dynamische rendering en eenvoudige media koppeling met CDN's.

*Met deze conventies sluiten we ambiguïteit uit en is het systeem direct klaar om duizenden extra wedstrijden of zelfs nieuwe datatypes te faciliteren.*