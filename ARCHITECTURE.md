# Architectuur & Analyse: Groningen House League (GHL) Frontend

Dit document biedt een overzicht van het doel, de sterke punten, de valkuilen en de voorgestelde oplossingen voor de Groningen House League applicatie. Het combineert zowel technische als functionele (UX) inzichten, met een speciale focus op de samenhang tussen de verschillende onderdelen.

## 1. Doel van de Applicatie

De applicatie is gebouwd als een **centraal hub voor een ijshockeycompetitie (Groningen House League)**.
Het doel is om:
- **Voor fans en spelers:** Real-time inzicht te geven in standen, statistieken, speelschema's, evenementen en nieuws (o.a. via de social feed). Spelers kunnen tevens de 3D stick configurator gebruiken.
- **Voor scorekeepers:** Een tool te bieden om live wedstrijden te loggen (goals, penalties, line-ups) tijdens de wedstrijd.
- **Voor teambeheerders en competitieleiding:** Een uitgebreid, op rollen gebaseerd administratief systeem ("Epic Healthcare" RBAC) te bieden voor data-invoer, goedkeuring van wedstrijden, speler-trades en team-management.

## 2. Sterke Punten

- **Gedetailleerd en Flexibel Datamodel:** Spelers- en goaliestatistieken gebruiken een gecombineerd schema (waarbij irrelevante velden op `null` of `0` worden gezet) wat NoSQL querying vereenvoudigt.
- **Optimale Leesprestaties op Gratis Firebase (Spark):** Er wordt sterk geleund op denormalisatie (bijv. namen en jerseys opslaan binnen het event) en het voorberekenen van waarden (`current_rank` / `sort_order` voor standen). Hierdoor worden dure joins en on-the-fly berekeningen op de frontend vermeden.
- **Geavanceerd RBAC Systeem:** Het op "Epic Healthcare" geïnspireerde permissiesysteem is diepgaand en schaalbaar, waarbij contextuele permissies (zoals `admin_teams` en `admin_leagues`) exact sturen wie wat mag aanpassen.
- **Slimme Caching voor Social Feeds:** De 'Global Recent Cache' (Postbode) zorgt ervoor dat recente posts centraal worden opgeslagen en client-side gefilterd, wat enorm veel Firestore reads bespaart.
- **Moderne en Rijke UI:** Het gebruik van TailwindCSS voor styling, AG Grid voor uitgebreide data-weergave/-manipulatie voor admins en Three.js/React Three Fiber voor de configurator zorgen voor een volwassen uitstraling.

## 3. Valkuilen (Technisch & UX) en de Samenhang

Omdat alle business logic, RBAC checks en atomic increments client-side plaatsvinden (vanwege de restricties van het Firebase Spark plan, waar geen Cloud Functions beschikbaar zijn), ontstaan er meerdere inherente risico's, vooral rondom de **samenhang en betrouwbaarheid van data**.

### Valkuil 3.1: Client-Side Business Logic & Veiligheid
- **Probleem:** Omdat er geen server-side authorisatie (via Cloud Functions) is, is de beveiliging 100% afhankelijk van complexe Firestore Security Rules (`firestore.rules`). Als deze rules ook maar één edge-case missen, kunnen kwaadwillende gebruikers of gehackte clients frauduleuze data schrijven, inclusief hun eigen permissies verhogen.
- **Samenhang:** Dit beïnvloedt alle systemen. Als een scorekeeper offline gaat of halverwege stopt, en admin goedkeuring vereist is, rust de hele statetransitie op de client. Als de client crasht tijdens een "Trade" operatie, raakt de data asynchroon (bijv. oud team wel geüpdatet, nieuw team niet).

### Valkuil 3.2: Atomic Updates & Teller Systeem
- **Probleem:** Het updaten van tellers (likes, comments) gebeurt met `FieldValue.increment` vanuit de frontend. Als een gebruiker dubbelklikt of een verzoek deels faalt, of als de 'Global Recent Cache' asynchroon loopt met de originele post, ontstaan er inconsistente tellingen.
- **UX Impact:** Gebruikers kunnen gefrustreerd raken als hun acties niet direct of juist meermaals gereflecteerd worden.

### Valkuil 3.3: Denormalisatie en Data Integriteit
- **Probleem:** Gegevens zoals spelersnamen, jerseys of teamlogo's worden gededupliceerd in bijvoorbeeld game boxscores. Als een speler halverwege het seizoen zijn naam of rugnummer verandert, wijzigt dit niet automatisch in oude wedstrijddocumenten.
- **UX Impact:** De geschiedenis blijft accuraat ("toen heette hij zo en droeg hij dat nummer"), maar het zoeken, updaten of corrigeren van een spelfout over de gehele database wordt een enorme client-side script-klus.

### Valkuil 3.4: Schaalbaarheid van het Spark Plan
- **Probleem:** De hardcoded restricties (bijv. alle toegankelijke collecties staan hardcoded in de admin interface wegens client SDK beperkingen) maken uitbreiding omslachtig. Ook is er het risico dat bij een plotse toename van data of gebruikers de dagelijkse read/write limieten van Firebase Spark worden overschreden.

### Valkuil 3.5: Grote Monolithische Structuur in de Client
- **Probleem:** Doordat 3D-rendering, complexe AG Grids, ingewikkelde RBAC checks en scorekeeping functionaliteit allemaal via de browser van de gebruiker worden gedraaid, kan de bundle size en het benodigde werkgeheugen fors oplopen.
- **Samenhang:** Voor een scorekeeper die op een oudere tablet in een koude ijsbaan de wedstrijd logt, kan een zware client-applicatie zorgen voor lag, batterijverlies of zelfs crashes.

## 4. Oplossingsrichtingen

Hieronder staan per valkuil pragmatische oplossingsrichtingen:

1. **Beheer van Client-side Risico's en Security Rules (Valkuil 3.1 & 3.2):**
   - **Oplossing:** Bouw "Transaction" of "Batched Write" utiliteit-functies in de frontend voor meerstaps operaties (zoals trades of game-approvals). Zorg dat een update óf volledig slaagt, óf volledig faalt (all-or-nothing).
   - **Oplossing:** Schrijf geautomatiseerde, onafhankelijke integratietests puur gericht op de `firestore.rules` met de Firebase Local Emulator om te garanderen dat rechten waterdicht zijn.

2. **Omgaan met Denormalisatie en Data Updates (Valkuil 3.3):**
   - **Oplossing:** Implementeer een 'Data Integrity / Cleanup' tool binnen het Admin-dashboard. Deze tool (die batched writes gebruikt) kan via de client over de collecties heen gaan om gecentraliseerde fouten, zoals verkeerd gespelde teamnamen overal recht te trekken.
   - **Oplossing:** Maak visueel in de UX duidelijk wat "historische, bevroren data" is ten opzichte van "actuele, updatable data".

3. **Performance en Offline Capabilities voor Scorekeepers (Valkuil 3.5):**
   - **Oplossing:** Implementeer **Firebase Offline Persistence**. Aangezien de scorekeeper wellicht een slechte verbinding heeft op de ijsbaan, zorgt offline persistence ervoor dat acties in de cache belanden en automatisch synchroniseren wanneer de verbinding herstelt.
   - **Oplossing:** Gebruik 'Code Splitting' en 'Lazy Loading' (bijv. via `React.lazy`) voor de zware modules zoals de 3D Configurator en de Admin AG Grid. Hierdoor hoeft een bezoeker of scorekeeper deze code niet in te laden en blijft de app razendsnel.

4. **Klaarmaken voor Groei (Valkuil 3.4):**
   - **Oplossing:** Zodra het Spark plan limieten bereikt, is de overstap naar het (Pay-As-You-Go) Blaze plan onvermijdelijk. Bouw de applicatie nu al dusdanig dat specifieke client-side taken makkelijk geëxporteerd kunnen worden naar kleine Cloud Functions zodra dat budgettair mogelijk is, zoals het tellen van stats of het veilig updaten van permissies.
