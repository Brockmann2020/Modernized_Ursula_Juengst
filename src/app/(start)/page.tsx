import { HomePage, homeMetadata } from '../../components/HomePage/HomePage';

export const metadata = homeMetadata('de');

export default function StartPage() {
  return <HomePage locale="de" />;
}
