# Ett litet julkort 🎄

Ett interaktivt julkort med **React, Vite och Motion**. Designen är vinröd och guld med ett animerat kuvert, ett brev som vecklas fram, julrim som tonas in rad för rad och en liten avslutande överraskning.

Allt fungerar på mobilen och är gjort för att kunna öppnas via QR-kod på en julklapp.

## Kom igång

Du behöver en aktuell version av Node.js.

```bash
npm install
npm run dev
```

Öppna sedan adressen som Vite visar i terminalen. För att testa produktionsbygget:

```bash
npm run build
npm run preview
```

## Publicera på Vercel med GitHub

1. Packa upp ZIP-filen.
2. Skapa ett nytt GitHub-repository och lägg **innehållet** i den uppackade mappen i repositoryts rot. Lägg inte upp `node_modules`.
3. På Vercel: **Add New → Project** och importera ditt repository.
4. Vercel bör känna igen **Vite**. Om inställningarna behöver anges manuellt:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Publicera. När sidan är live kan du göra en QR-kod av den publika Vercel-adressen.

**Tips:** Testa länken på mobilen innan du skriver ut QR-koden. QR-koden kan fortsätta användas om du senare uppdaterar sidan på samma adress.

## Ändra julrimmet

Redigera `src/content.js`. Där finns alla fyra verserna och slutmeddelandet.

Du kan även anpassa:

- `src/styles.css` – färger, typsnitt, layout och kuvertanimation.
- `src/App.jsx` – interaktioner, textanimationer och överraskningen.

## Så fungerar upplevelsen

1. Besökaren ser ett förseglat kuvert och trycker för att öppna.
2. Kuvertet öppnas och brevet visas.
3. Julrimmet tonas in i lugn takt med pauser mellan verserna.
4. Besökaren kan välja **Visa hela rimmet** eller **Börja om**.
5. Efter rimmet finns ett litet paket att trycka på för en sista hälsning.

Animationerna anpassas om användaren har valt reducerad rörelse i sin enhet. Ingen musik spelas automatiskt.

## Teknik

- React
- Vite
- Motion för React
- CSS och typsnitt från Google Fonts

Det finns ingen backend, ingen databas och inga API-nycklar. Sidan är helt statisk efter att Vite byggt den.
