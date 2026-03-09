# PV-Netzanschlussvergleich

Ein Engineering-Tool zum Vergleich von Niederspannungs- (NS) und Mittelspannungs- (MS) Netzanschlüssen für Photovoltaik-Projekte.

## Bereinigung der Historie (Sauberer Neustart)

Falls Sie Ihre Git-Historie löschen möchten, um persönliche Daten zu entfernen:

1. **Git Identität lokal setzen:**
   ```bash
   git config user.name "Ihr Name oder Pseudonym"
   git config user.email "ihre-email@beispiel.de"
   ```

2. **Historie zurücksetzen:**
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit: PV-Netzanschlussvergleich Tool"
   git remote add origin https://github.com/blindleistung-cloud/grid-connection-calculator
   git push -u origin main --force
   ```

## Funktionen

- **Technische Auslegung:** Berechnung der erforderlichen Querschnitte (16 - 400 mm²).
- **Parallele Verlegung:** Optionale Aufteilung der Last auf zwei Leiter im NS-Netz.
- **Wirtschaftlichkeitsvergleich:** Gegenüberstellung der CAPEX-Kosten.
- **Visualisierung:** Kosten-Balkendiagramm für schnelle Entscheidungen.

## Deployment auf GitHub Pages

Dieses Projekt ist für GitHub Pages konfiguriert. Sobald Sie den Code in Ihren `main`-Branch pushen, startet automatisch eine GitHub Action:

1. Gehen Sie in Ihrem Repository auf **Settings** -> **Pages**.
2. Wählen Sie unter **Build and deployment** -> **Source**: "GitHub Actions".
3. Die Seite wird automatisch unter `https://<ihr-nutzername>.github.io/grid-connection-calculator/` veröffentlicht.

---
© 2024 PV-Netzanschlussvergleich. Nur für vorläufige technische Schätzungen.
