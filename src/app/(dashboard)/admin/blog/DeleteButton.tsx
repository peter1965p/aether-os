'use client';

import { deletePost } from '@/modules/blog/actions';

export default function DeleteButton({ id }: { id: number }) {
  return (
    <button
      onClick={async () => {
        if (confirm('Soll dieser Post wirklich aus der Aether-Datenbank getilgt werden?')) {
          await deletePost(id);
        }
      }}
      className="text-red-900 font-black text-xs hover:text-red-500 transition-colors uppercase"
    >
      DELETE
    </button>
  );
}
