import { horizontePath, legacySite } from '../../site/routes';

export const metadata = {
  title: 'Ursula Jüngst | Horizonte',
  robots: { index: false, follow: false },
};

export default function StartPage() {
  return (
    <main>
      <h1>Ursula Jüngst</h1>

      <p>Horizonte · Vorschau / <span lang="en">Preview</span></p>

      <ul>
        <li><a href={horizontePath('de')}>Deutsch</a></li>
        <li><a href={horizontePath('en')} lang="en">English</a></li>
      </ul>

      <a href={legacySite}>Bestehende Website</a>
    </main>
  );
}
