'use client';

import Sidebar from '@/components/Sidebar';
import { PlacementPageClient } from '@/components/placement';

export default function PlacementsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <PlacementPageClient />
    </div>
  );
}
