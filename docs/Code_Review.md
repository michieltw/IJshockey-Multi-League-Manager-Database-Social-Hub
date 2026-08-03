# Code Review & Architectuur Advies: Groningen House League

Dit document bevat constructieve feedback en aanbevelingen voor de verdere ontwikkeling van de ijshockey multi-competitie manager webapp. De nadruk ligt op schaalbaarheid, onderhoudbaarheid en de beperkingen van de Firebase Spark Plan.

## 1. Routing & Dynamische Context (React Router)
**Huidige situatie:**
De routes in `App.tsx` (zoals `/competitie/standen`) zijn globaal en statisch.
**Advies:**
Om de applicatie schaalbaar te maken voor meerdere competities, divisies en seizoenen, moeten de routes dynamisch worden opgezet.
- Gebruik URL parameters zoals `/competitie/:leagueId/standen` of `/competitie/:leagueId/seizoen/:seasonId/standen`.
- Hierdoor weet de component (via `useParams()`) altijd welke data er uit Firestore gehaald moet worden, en kunnen gebruikers directe links (URL's) delen naar een specifieke competitie of uitslag.

## 2. Firebase & State Management (Spark Plan Beperkingen)
**Huidige situatie:**
In `Scorekeeper/Overview.tsx` worden teams via `getDocs` opgehaald wanneer het component laadt. In `LiveScorekeeper.tsx` wordt de spelstatus (tijd, score, gebeurtenissen) puur in de lokale React state (`useState`) bijgehouden, voordat acties (zoals goals) als losse documenten naar Firestore worden gestuurd.
**Advies:**
- **Datacaching / Custom Hooks:** Haal stamdata zoals de teams-lijst op via een custom hook (`useTeams`) die wellicht intern gebruik maakt van caching of React Context, zodat de database minder vaak onnodig bevraagd wordt. (Spark plan heeft leeslimieten).
- **Live Scorekeeper State:** Omdat je afhankelijk bent van de client-side voor de verwerking van logica, ben je erg kwetsbaar voor het herladen van de pagina of netwerkuitval.
  - Overweeg om de actieve status van een game op te slaan in een hoofd-gamedocument in Firestore, en lokaal te synchroniseren met `onSnapshot`.
  - Je kunt ook gebruikmaken van `localStorage` om de actuele tijd en score lokaal te bufferen. Dit voorkomt dat een scorekeeper per ongeluk data kwijtraakt als de iPad-browser ververst of crasht.

## 3. UI en Dataweergave
**Huidige situatie:**
Componenten zoals `Statistieken.tsx` maken nu gebruik van statische mock-data (`[1, 2, 3, 4, 5, 6]`).
**Advies:**
- Zorg dat UI-componenten (zoals kaarten voor topscorers) gescheiden zijn van de data-fetching logica (Container/Presenter patroon). De UI component moet een array van `PlayerStat` objecten als _props_ ontvangen, net zoals in de eerder gerefactorde widgets, en een default dash (`-`) of placeholder gebruiken als data mist of als de netwerkaanroep laadt.

## Conclusie
De modulaire mappenstructuur staat nu sterk. De volgende grote stappen zijn het integreren van dynamische URL-routing, en het verstevigen van de live scorekeeper module zodat deze bestand is tegen browser-refreshes (client-side persistency).
