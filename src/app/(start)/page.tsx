import { HomePage, homeMetadata } from '../../home/HomePage';

export const metadata = homeMetadata('de');

export default function StartPage() {
  return <HomePage locale="de" />;
}
