# PV-Netzanschlussvergleich

Ein Engineering-Tool zum Vergleich von Niederspannungs- (NS) und Mittelspannungs- (MS) Netzanschlüssen für Photovoltaik-Projekte.

## Projekt-Neustart (Historie löschen)

Wenn Sie die bestehende Git-Historie (inkl. alter Namen/E-Mails) komplett löschen und sauber neu anfangen möchten, führen Sie diese Befehle in Ihrem lokalen Terminal aus:

1. **Git Identität korrekt setzen:**
   ```bash
   git config user.name "Ihr Name oder Pseudonym"
   git config user.email "ihre-email@beispiel.de"
   ```

2. **Historie zurücksetzen:**
   ```bash
   # Den alten .git Ordner löschen (Vorsicht: Alle alten Commits gehen verloren)
   rm -rf .git
   
   # Neu initialisieren
   git init
   git add .
   git commit -m "Initial commit: PV-Netzanschlussvergleich Tool"
   
   # Mit dem (neu erstellten) GitHub Repository verbinden
   git remote add origin https://github.com/blindleistung-cloud/grid-connection-calculator
   
   # Force-Push, um die Historie auf GitHub zu überschreiben
   git push -u origin main --force
   ```

## Funktionen

- **Technische Auslegung:** Berechnung der erforderlichen Querschnitte basierend auf Wirkleistung, Distanz und Spannungsfall.
- **Kabel-Bibliothek:** Nutzt Standardquerschnitte von 16 mm² bis 400 mm².
- **Parallele Verlegung:** Optionale Aufteilung der Last auf mehrere Leiter im Niederspannungsnetz.
- **Wirtschaftlichkeitsvergleich:** Gegenüberstellung der CAPEX-Kosten für NS- vs. MS-Szenarien.
- **Visualisierung:** Integrierte Diagramme zum schnellen Kostenvergleich.

## Entwicklung

Dieses Projekt basiert auf Next.js, Tailwind CSS, ShadCN UI und Genkit.

### Lokal starten:
```bash
npm install
npm run dev
```

### Build & Hosting (Firebase):
Das Projekt ist für statisches Hosting optimiert:
```bash
npm run build
# Der Inhalt von 'out/' kann auf Firebase Hosting geladen werden.
```

---
© 2024 PV-Netzanschlussvergleich. Nur für vorläufige technische Schätzungen.
