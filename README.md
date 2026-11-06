# Ursula Jüngst – Refactoring

Horizonte ist der erste Galeriepilot im eigenständigen Refactoring-Repository. Er zeigt vier Werke mit sieben Abbildungen in zwei Sprachen. Die Startseite und alle 17 Malerei-Seiten werden beim Build als statische HTML-Seiten ausgegeben. Die Startseite zeigt einen Ausschnitt aus Golem und verlinkt ausgewählte Werke direkt in der Galerie. Die Navigation und der Footer führen zu den migrierten Seiten.

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

Öffne die von Python ausgegebene URL. Port `0` lässt Windows einen freien Port wählen. Beide Startwege benötigen die Originalbilder in den Serienordnern unter `media/`. Die Dateinamen stehen in den Seriendaten unter `src/data/gallery/`. Die Originale liegen separat von Git. Nach einem frischen Checkout müssen sie dort bereitgestellt werden.

## Biografie und Kontakt

Beide Seiten sind über die Startseite erreichbar und werden auf Deutsch und Englisch statisch ausgegeben. Stationen und Kontaktangaben stehen in `src/data/profile/biography.json` und `src/data/profile/contact.json`. Die Medienaufbereitung erwartet die Atelierfotos unter `media/profile/biografie.JPG` und `media/profile/kontakt.JPG`. Sie stammen aus `Biografie/image2.JPG` und `Kontakt/image0.JPG` im Altbestand.

## Aktuell

Die Startseite verlinkt die zweisprachige Aktuell-Seite. Die Meldungen sind in `src/data/news/news.json` nach Meldung, Bildern, Texten und Links gegliedert. Würzburg und Miltenberg stehen im Fokus. Ältere Meldungen folgen im Rückblick. Die beiden Bildstrecken sind manuell bedienbar. Vorhandene englische Texte sind den jeweiligen Meldungen zugeordnet.

Aus dem alten Website-Ordner lassen sich die Aktuell-Daten und lokalen Originaldateien mit `node scripts/import-news.mjs ../Ursula_Juengst --write` übernehmen. Der Build erwartet Bilder und PDFs in `media/news/`.

## Weitere Inhaltsseiten

Ausstellungen, Arbeitssituationen, Bücher/Kataloge, Flyer, Kunst am Bau, Presse, Filme, Statement, Impressum und Art Karlsruhe 2017 verwenden geordnete Inhaltsblöcke in `src/data/editorial/pages.json`. Die Präsentation richtet sich nach dem Inhalt: Ausstellungsjahre als Zeitachse, Publikationen mit Auszügen, Bilder im Vollbilddialog und Videos mit Bedienelementen. YouTube-Einbettungen werden erst nach Klick geladen. Art Karlsruhe 2017 ist als Archiv mit historischen Preisen gekennzeichnet. Der Wortlaut des Impressums und der Datenschutzerklärung stammt aus dem Altbestand.

`node scripts/import-editorial.mjs ../Ursula_Juengst --write` übernimmt aus dem Altbestand die Daten und 137 Originaldateien nach `media/editorial/`. Die Medienaufbereitung erzeugt die Dateien unter `public/editorial/`. Pressebilder behalten ihre Originalauflösung. Die Medien liegen separat von Git.

## Wo ändere ich was?

| Pfad | Verantwortung |
| --- | --- |
| `src/app/` | Einstieg, Sprachrouten, Metadaten und statische Ausgabe |
| `src/components/` | Ein Ordner pro Komponente, mit zugehörigen MUI-Styles |
| `src/data/` | JSON-Inhalte nach Bereich, z. B. Werkserien in `src/data/gallery/` |
| `src/lib/` | Sprachpfade, Datenzugriff, Validierung und Medienhelfer |
| `scripts/prepare-media.mjs` | Originale prüfen und WebP-Dateien sowie Pixelmaße erzeugen |

Komponentenspezifische MUI-Styles liegen in `*.styles.ts` neben den zugehörigen Komponenten. Der Seitenrahmen enthält die Seitenstruktur. `SiteNavigation.tsx` enthält die Tastaturinteraktion und liest die Menüpunkte aus `navigation.json`.

## Gemeinsame Galerievorlage

Horizonte und Primavera nutzen die Werkgalerie. Die übrigen Malerei-Seiten nutzen die Blockgalerie. Beide teilen sich Gestaltungselemente und den Vollbilddialog. In `src/data/gallery/horizonte.json` enthält `series` den Titel, optional die Einführung in beiden Sprachen und die ID eines vorhandenen Bildes als Titelmotiv. Der Werkindex entsteht aus den Werkzuordnungen der Abbildungen. Die erste Nennung eines Werks bestimmt seine Position. Weitere Bilder desselben Werks erscheinen im selben Abschnitt. Gestaltung und kontrastreiche Header-Variante werden zentral gepflegt. Für einen späteren Editor bleiben die Inhaltsfelder und die Bildreihenfolge getrennt von der Darstellung.

## Altgalerien importieren

Der Node-Importer prüft einspaltige Galerien aus dem Altbestand. Der erste Befehl gibt den Datenvorschlag aus. Mit `--write` legt der Import die JSON-Datei und die benötigten Originalbilder an. Geänderte Zieldateien werden beim erneuten Import gemeldet.

```sh
npm run import:gallery -- ../Ursula_Juengst Primavera.html
npm run import:gallery -- ../Ursula_Juengst Primavera.html --write
```

Der erste Pfad ist der Ordner der Bestandswebsite. Dieselben Befehle funktionieren mit Node.js 24 unter Windows und macOS. Die bereits migrierten Serien stehen in `src/data/gallery/series.json`. Bei einer weiteren geprüften Migration dort den neuen Slug aufnehmen, den Menüeintrag auf die lokale Seite umstellen und den generierten Medienordner in `.gitignore` ergänzen.

Der Import hält bei mehrspaltigen Zeilen, zusätzlichem Text und unklarer Werkzuordnung an. Für Primavera normalisiert ein Profil die abweichenden Schreibweisen der römischen Ziffern bei Krokusbraut und wählt einen vorhandenen Ausschnitt als Titelmotiv.

### Galerien mit Bildgruppen und Texten übernehmen

```sh
node scripts/import-gallery-blocks.mjs ../Ursula_Juengst
node scripts/import-gallery-blocks.mjs ../Ursula_Juengst --write
```

Der erste Aufruf prüft die 15 weiteren Malerei-Seiten und gibt die Anzahl der Bilder, Bildgruppen und Texte aus. Der zweite Aufruf erzeugt die Seriendaten und kopiert die Originale nach `media/<slug>/`. Vorhandene Seriendaten bleiben erhalten. Abweichende Bilddateien im Ziel werden gemeldet.

In den erzeugten Dateien unter `src/data/gallery/` steht `blocks` für die Reihenfolge der Seite. Ein Block enthält ein bis drei Werke mit ihren eigenen Beschriftungen, einen Text oder eine Zwischenüberschrift. Im optionalen Feld `details` eines Werks stehen weitere Aufnahmen mit jeweils eigener `id`, `source` und `caption`. Die Galerie zeigt diese Aufnahmen unter dem Hauptbild im selben Abschnitt. Gruppen eigenständiger Werke werden auf schmalen Bildschirmen gestapelt. Zweisprachige Textfelder können eine englische Fassung enthalten. Ohne diese zeigt die englische Seite den gekennzeichneten deutschen Originaltext. Horizonte und Primavera nutzen weiter ihre Werk- und Detaildaten. Beide Darstellungen verwenden denselben Vollbilddialog.

## Titelmotive und Textplatzierung

`series.coverImageId` wählt ein vorhandenes Bild für den Einstieg der Galerie. Die Sprunglinks entstehen aus den Bildreihen oder Kapitelüberschriften. Ein Textblock mit `placement: "intro"` erscheint als hervorgehobener Einstieg vor den Bildreihen. Corona nutzt diese Option, während der Text bei Begegnungsspuren zwischen den Bildern bleibt.

## Beispiel: Einen Ausschnitt ergänzen

In [horizonte.json](src/data/gallery/horizonte.json) enthält `works` die Werkdaten und `entries` die Abbildungen in Anzeigereihenfolge. Die Gesamtansicht von **Slide** und ihr Ausschnitt verweisen beide auf die Werk-ID `slide`. Für einen weiteren Ausschnitt die Originaldatei ablegen und unter `entries` einen Eintrag mit eigener ID, `work: "slide"`, dem exakten Dateinamen und `view: "detail"` ergänzen.

Beim Start prüft die Bildaufbereitung die Werkzuordnungen und Dateinamen und erzeugt WebP-Dateien je Serie unter `public/`. Die Pixelmaße bleiben in einem internen Manifest. Beim Rendern erzeugt `loadGallery.ts` die Bilddaten und Texte für die gewählte Sprache. `Gallery.tsx` stellt diese dar. Der Ablauf ist für zusätzliche Ausschnitte derselbe.

[Roadmap und Status](ROADMAP.md)
