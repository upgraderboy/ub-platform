import { redirect } from 'next/navigation';

export default function AdminHomePage() {
  // Direct default entry route to Dashboard
  redirect('/dashboard');
}
