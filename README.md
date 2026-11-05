# Ursula Jüngst – Refactoring

Horizonte ist der erste Galeriepilot im eigenständigen Refactoring-Repository. Er zeigt vier Werke mit sieben Abbildungen in zwei Sprachen. Die deutsch- und englischsprachige Startseite und beide Galerien werden beim Build als statische HTML-Seiten ausgegeben. Die Startseite zeigt einen Ausschnitt aus Golem und verlinkt ausgewählte Werke direkt in der Galerie. Menüpunkte für spätere Migrationen führen zur Bestandswebsite.

## Lokal starten

Mit Node.js 24 im Repository-Stamm ausführen:

```powershell
npm ci
npm run dev -- --hostname 127.0.0.1
```

Öffne die Adresse, die Next.js ausgibt. Die Galerie liegt unter `/de/horizonte/` und `/en/horizonte/`.

Für die statische Vorschau den Entwicklungsserver zuerst beenden und dann ausführen:

```powershell
npm run build
npm run typecheck
python -m http.server 0 --bind 127.0.0.1 --directory out
```

Öffne die von Python ausgegebene URL. Port `0` lässt Windows einen freien Port wählen. Beide Startwege benötigen die sieben Originale in `media/horizonte/`. Die Dateinamen stehen in [horizonte.json](src/gallery/horizonte.json). Die Originale liegen separat von Git. Nach einem frischen Checkout müssen sie dort bereitgestellt werden.

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

## Beispiel: Einen Ausschnitt ergänzen

In [horizonte.json](src/gallery/horizonte.json) enthält `works` die Werkdaten und `entries` die Abbildungen in Anzeigereihenfolge. Die Gesamtansicht von **Slide** und ihr Ausschnitt verweisen beide auf die Werk-ID `slide`. Für einen weiteren Ausschnitt die Originaldatei ablegen und unter `entries` einen Eintrag mit eigener ID, `work: "slide"`, dem exakten Dateinamen und `view: "detail"` ergänzen.

Beim Start prüft die Bildaufbereitung die Werkzuordnungen und Dateinamen und erzeugt WebP-Dateien unter `public/horizonte/`. Die Pixelmaße bleiben in einem internen Manifest. Beim Rendern erzeugt `loadHorizonte.ts` die Bilddaten und Texte für die gewählte Sprache. `Gallery.tsx` stellt diese dar. Der Ablauf ist für zusätzliche Ausschnitte derselbe.

[Roadmap und Status](ROADMAP.md)
