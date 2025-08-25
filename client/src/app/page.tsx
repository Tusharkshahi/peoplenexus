import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard for now
  // In a real app, you'd check authentication status here
  redirect('/dashboard');
}
