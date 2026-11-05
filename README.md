# Ursula Jüngst – Refactoring

Horizonte ist der erste Galeriepilot im eigenständigen Refactoring-Repository. Er zeigt vier Werke mit sieben Abbildungen in zwei Sprachen. Die Startseite und alle 17 Malerei-Seiten werden beim Build als statische HTML-Seiten ausgegeben. Die Startseite zeigt einen Ausschnitt aus Golem und verlinkt ausgewählte Werke direkt in der Galerie. Menüpunkte außerhalb der Rubrik Malerei führen weiterhin zur Bestandswebsite.

## Lokal starten

Mit Node.js 24 im Repository-Stamm ausführen:

```powershell
npm ci
npm run dev -- --hostname 127.0.0.1
```

Öffne die Adresse, die Next.js ausgibt. Horizonte und Primavera sind auf Deutsch und Englisch erreichbar, etwa unter `/de/horizonte/` und `/de/primavera/`.

Für die statische Vorschau den Entwicklungsserver zuerst beenden und dann ausführen:

```powershell
npm run build
npm run typecheck
python -m http.server 0 --bind 127.0.0.1 --directory out
```

Öffne die von Python ausgegebene URL. Port `0` lässt Windows einen freien Port wählen. Beide Startwege benötigen die Originalbilder in den Serienordnern unter `media/`. Die Dateinamen stehen in den Seriendaten unter `src/gallery/`. Die Originale liegen separat von Git. Nach einem frischen Checkout müssen sie dort bereitgestellt werden.

## Wo ändere ich was?

| Pfad | Verantwortung |
| --- | --- |
| `src/app/` | Einstieg, Sprachrouten, Metadaten und statische Ausgabe |
| `src/site/` | Seitenrahmen, Navigation, Sprachpfade und MUI-Theme |
| `src/home/` | Startseite, redaktionelle Texte und Auswahl der gezeigten Werke |
| `src/gallery/` | Werkdaten, Validierung, Bildbeschriftungen und Galerie |
| `scripts/prepare-media.mjs` | Originale prüfen und WebP-Dateien sowie Pixelmaße erzeugen |

Komponentenspezifische MUI-Styles liegen in `*.styles.ts` neben den zugehörigen Komponenten. Der Seitenrahmen enthält die Seitenstruktur. `SiteNavigation.tsx` enthält die Tastaturinteraktion und liest die Menüpunkte aus `navigation.json`.

## Gemeinsame Galerievorlage

Die Malerei-Seiten verwenden dieselbe Vorlage. In `src/gallery/horizonte.json` enthält `series` den Titel, optional die Einführung in beiden Sprachen und die ID eines vorhandenen Bildes als Titelmotiv. Der Werkindex entsteht aus den Werkzuordnungen der Abbildungen. Die erste Nennung eines Werks bestimmt seine Position. Weitere Bilder desselben Werks erscheinen im selben Abschnitt. Gestaltung und kontrastreiche Header-Variante werden zentral gepflegt. Für einen späteren Editor bleiben die Inhaltsfelder und die Bildreihenfolge getrennt von der Darstellung.

## Altgalerien importieren

Der Node-Importer prüft einspaltige Galerien aus dem Altbestand. Der erste Befehl gibt den Datenvorschlag aus. Mit `--write` legt der Import die JSON-Datei und die benötigten Originalbilder an. Geänderte Zieldateien werden beim erneuten Import gemeldet.

```sh
npm run import:gallery -- ../Ursula_Juengst Primavera.html
npm run import:gallery -- ../Ursula_Juengst Primavera.html --write
```

Der erste Pfad ist der Ordner der Bestandswebsite. Dieselben Befehle funktionieren mit Node.js 24 unter Windows und macOS. Die bereits migrierten Serien stehen in `src/gallery/series.json`. Bei einer weiteren geprüften Migration dort den neuen Slug aufnehmen, den Menüeintrag auf die lokale Seite umstellen und den generierten Medienordner in `.gitignore` ergänzen.

Der Import hält bei mehrspaltigen Zeilen, zusätzlichem Text und unklarer Werkzuordnung an. Für Primavera normalisiert ein Profil die abweichenden Schreibweisen der römischen Ziffern bei Krokusbraut und wählt einen vorhandenen Ausschnitt als Titelmotiv.

### Galerien mit Bildgruppen und Texten übernehmen

```sh
node scripts/import-gallery-blocks.mjs ../Ursula_Juengst
node scripts/import-gallery-blocks.mjs ../Ursula_Juengst --write
```

Der erste Aufruf prüft die 15 weiteren Malerei-Seiten und gibt die Anzahl der Bilder, Bildgruppen und Texte aus. Der zweite Aufruf erzeugt die Seriendaten und kopiert die Originale nach `media/<slug>/`. Vorhandene Seriendaten bleiben erhalten. Abweichende Bilddateien im Ziel werden gemeldet.

In den erzeugten Dateien unter `src/gallery/` steht `blocks` für die Reihenfolge der Seite. Ein Block enthält ein bis drei Bilder mit ihren eigenen Beschriftungen, einen Text oder eine Zwischenüberschrift. Die Bildgruppen folgen dem HTML-Bestand und werden auf schmalen Bildschirmen gestapelt. Zweisprachige Textfelder können eine englische Fassung enthalten. Ohne diese zeigt die englische Seite den gekennzeichneten deutschen Originaltext. Horizonte und Primavera nutzen weiter ihre Werk- und Detaildaten. Beide Darstellungen verwenden denselben Vollbilddialog.

## Titelmotive und Textplatzierung

`series.coverImageId` wählt ein vorhandenes Bild für den Einstieg der Galerie. Die Sprunglinks entstehen aus den Bildreihen oder Kapitelüberschriften. Ein Textblock mit `placement: "intro"` erscheint als hervorgehobener Einstieg vor den Bildreihen. Corona nutzt diese Option, während der Text bei Begegnungsspuren zwischen den Bildern bleibt.

## Beispiel: Einen Ausschnitt ergänzen

In [horizonte.json](src/gallery/horizonte.json) enthält `works` die Werkdaten und `entries` die Abbildungen in Anzeigereihenfolge. Die Gesamtansicht von **Slide** und ihr Ausschnitt verweisen beide auf die Werk-ID `slide`. Für einen weiteren Ausschnitt die Originaldatei ablegen und unter `entries` einen Eintrag mit eigener ID, `work: "slide"`, dem exakten Dateinamen und `view: "detail"` ergänzen.

Beim Start prüft die Bildaufbereitung die Werkzuordnungen und Dateinamen und erzeugt WebP-Dateien je Serie unter `public/`. Die Pixelmaße bleiben in einem internen Manifest. Beim Rendern erzeugt `loadGallery.ts` die Bilddaten und Texte für die gewählte Sprache. `Gallery.tsx` stellt diese dar. Der Ablauf ist für zusätzliche Ausschnitte derselbe.

[Roadmap und Status](ROADMAP.md)
