# Ursula Jüngst – Roadmap

Stand: 5. November 2026. Grundlage ist der Obsidian-Implementierungsplan, Abschnitt „8. Umsetzung in Phasen“. Die [Prototyp-Dokumentation](README.md) beschreibt die lokale Vorschau und Datenpflege.

**Implementiert** = im aktuellen Umfang umgesetzt und geprüft. **In Arbeit** = teilweise umgesetzt oder Abnahme offen. **Geplant** = Umsetzung steht aus. **Entscheidung offen** = Projektentscheidung steht an.

## Fundament und Horizonte-Pilot

| Feature | Status | Abnahme / Bemerkung |
| --- | --- | --- |
| Bestands- und Medieninventar | Implementiert | 31 Inhaltsseiten, separater Exportbaum, Medienstatus und kollidierende Übersetzungs-IDs im Bestandsrepository erfasst. |
| Statischer Export und gemeinsames Theme | Implementiert | Next.js, TypeScript und MUI. HTML und Styles werden über einen statischen Server ausgeliefert. |
| Navigation, Fußzeile und Sprachwechsel | Implementiert | Tastaturbedienung und Wechsel auf dieselbe Galerie geprüft. Externe Übergangslinks bleiben ungeprüft. |
| Horizonte-Galerie | Implementiert | Vier Werke, sieben Abbildungen, zwei Sprachen. Ein zusätzlicher Dateneintrag ließ sich ohne Komponentenänderung anzeigen. |
| Medienaufbereitung | In Arbeit | WebP und Pixelmaße für Horizonte vorhanden. Medienquelle für frische Checkouts, responsive Bildgrößen und siteweite Prüfungen fehlen. |
| Öffentliche Sprachpfade und Altlinks | Entscheidung offen | Öffentliche Zielpfade, Alias `Horizont.html`, Weiterleitungen und Anker klären. |

## Inhaltsmigration

| Feature | Status | Abnahme / Bemerkung |
| --- | --- | --- |
| Begegnungsspuren und Elementare Akkorde | Geplant | Textblöcke, Werkteile und Detailansichten erproben. Danach das gemeinsame Galeriemodell festigen. |
| Weitere Werkreihen und Arbeitssituationen | Geplant | Bildreihen, Werkzuordnungen und Beschriftungen übernehmen. |
| Aktuell | Geplant | Nachrichten, Ausstellungen, Karussells und Downloads übernehmen. Englische Texte fachlich zuordnen und doppelte Snippet-IDs auflösen. |
| Literatur und Flyer | Geplant | Publikationen, aufklappbare Auszüge und PDF-Downloads übernehmen. |
| Presse und Filme | Geplant | Gemeinsamer Presse-Bilddialog. Lokale Videos und YouTube-Einbettungen erhalten. |
| Kunst am Bau und Statement | Geplant | Projektbeschreibungen, Texte, Abbildungen und Links übernehmen. |
| Biografie, Ausstellungen, Kontakt und Impressum | Geplant | Zeitachsen, Ausstellungsliste, Kontaktinformationen und rechtliche Inhalte übernehmen. |
| Startseite | In Arbeit | Zweisprachiger Einstieg mit Golem-Ausschnitt und direkter Werkauswahl umgesetzt und geprüft. Ob ein Karussell ergänzt wird, ist offen. |
| ArtKa 2017 und separater Exportbaum | Entscheidung offen | Historische Inhalte, abweichende Seiten und eingehende Links prüfen. Archiv und Weiterleitungen festlegen. |

## Pflege und Umstieg

| Feature | Status | Abnahme / Bemerkung |
| --- | --- | --- |
| Pflege- und Importwerkzeuge | Geplant | Nach den weiteren Galerien einen Ablauf für Werke, Medien, Texte und Übersetzungen entwickeln. |
| Statisches Release-Paket | Geplant | Geprüfte Exportdateien, Medien und nötige Weiterleitungen für FTP zusammenstellen. |
| Gesamtabnahme und Umstieg | Geplant | Seiten, Sprachen, Medien und Altlinks prüfen, auch auf echten Mobilgeräten. Öffentlichen Wechsel separat freigeben. |
