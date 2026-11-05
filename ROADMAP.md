# Ursula Jüngst – Roadmap

Stand: 5. November 2026. Grundlage ist der Obsidian-Implementierungsplan, Abschnitt „8. Umsetzung in Phasen“. Die [Prototyp-Dokumentation](README.md) beschreibt die lokale Vorschau und Datenpflege.

**Implementiert** = im aktuellen Umfang umgesetzt und geprüft. **In Arbeit** = teilweise umgesetzt oder Abnahme offen. **Geplant** = Umsetzung steht aus. **Entscheidung offen** = Projektentscheidung steht an.

## Fundament und Horizonte-Pilot

| Feature | Status | Abnahme / Bemerkung |
| --- | --- | --- |
| Bestands- und Medieninventar | Implementiert | 31 Inhaltsseiten, separater Exportbaum, Medienstatus und kollidierende Übersetzungs-IDs im Bestandsrepository erfasst. |
| Statischer Export und gemeinsames Theme | Implementiert | Next.js, TypeScript und MUI. HTML und Styles werden über einen statischen Server ausgeliefert. |
| Navigation, Fußzeile und Sprachwechsel | Implementiert | Tastaturbedienung und Wechsel auf dieselbe Galerie geprüft. Alle Menüpunkte und Footer-Ziele liegen im neuen Export. |
| Horizonte-Galerie | Implementiert | Vier Werke, sieben Abbildungen, zwei Sprachen. Ein zusätzlicher Dateneintrag ließ sich ohne Komponentenänderung anzeigen. |
| Medienaufbereitung | In Arbeit | WebP und Pixelmaße für Horizonte vorhanden. Medienquelle für frische Checkouts, responsive Bildgrößen und siteweite Prüfungen fehlen. |
| Öffentliche Sprachpfade und Altlinks | Entscheidung offen | Öffentliche Zielpfade, Alias `Horizont.html`, Weiterleitungen und Anker klären. |

## Inhaltsmigration

| Feature | Status | Abnahme / Bemerkung |
| --- | --- | --- |
| Begegnungsspuren und Elementare Akkorde | Implementiert | Textblock, Werkteile und Detailbeschriftungen in der Reihenfolge des Altbestands übernommen. |
| Primavera | Implementiert | Vier Werke und acht Abbildungen mit dem Node-Importer übernommen. Beide Sprachen nutzen die gemeinsame Galerievorlage. |
| Hochzeit des Lichts | Implementiert | Zweier- und Dreierreihen, Atelierfoto und Dezimalmaß übernommen. |
| Weitere Malerei-Seiten | Implementiert | Alle 17 Galerien lokal erreichbar. Bildreihen, Kontextfotos, Werkteile und Originalbeschriftungen bleiben erhalten. |
| Arbeitssituationen | Implementiert | Bildreihen und Beschriftungen in einer Fotostrecke übernommen. |
| Aktuell | Implementiert | 14 Meldungen, 35 Bilder, zwei manuelle Karussells und fünf lokale PDFs. Vorhandene englische Texte nach Meldung zugeordnet. |
| Literatur und Flyer | Implementiert | Publikationen, 15 aufklappbare Auszüge und lokale PDFs. |
| Presse und Filme | Implementiert | Pressebilder im Vollbilddialog. Zehn lokale Videos und sechs YouTube-Filme. |
| Kunst am Bau und Statement | Implementiert | Texte, Bildreihen und Links mit Sprungnavigation übernommen. |
| Biografie und Kontakt | Implementiert | Zweisprachige Zeitleiste und Kontaktseite mit lokalen Links von der Startseite. |
| Ausstellungen und Impressum | Implementiert | Ausstellungsliste nach Jahren und rechtliche Inhalte aus dem Altbestand. |
| Startseite | In Arbeit | Zweisprachiger Einstieg mit Golem-Ausschnitt und direkter Werkauswahl umgesetzt und geprüft. Ob ein Karussell ergänzt wird, ist offen. |
| Art Karlsruhe 2017 | Implementiert | Film, Werke, Literatur und historische Preise im Archiv. |
| Separater Exportbaum und Altlinks | Entscheidung offen | Abweichende historische Inhalte und öffentliche Weiterleitungen prüfen. |

## Pflege und Umstieg

| Feature | Status | Abnahme / Bemerkung |
| --- | --- | --- |
| Pflege- und Importwerkzeuge | In Arbeit | Node-Import für Werkdaten und für geordnete Bild-, Text- und Überschriftenblöcke vorhanden. Pflegeoberfläche steht aus. |
| Statisches Release-Paket | Geplant | Geprüfte Exportdateien, Medien und nötige Weiterleitungen für FTP zusammenstellen. |
| Gesamtabnahme und Umstieg | Geplant | Seiten, Sprachen, Medien und Altlinks prüfen, auch auf echten Mobilgeräten. Öffentlichen Wechsel separat freigeben. |
