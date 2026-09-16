import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MY_MEMBER_ID = "190932174";

export default async function GoPage({ params }: { params: { id: string } }) {
  const { id } = (await params) as any;

  let { data } = await supabase.from('pending_products').select('daraz_link').eq('id', id).single();
  
  if (!data) {
    const r = await supabase.from('products').select('daraz_link').eq('id', id).single();
    data = r.data as any;
  }

  if (!data?.daraz_link) redirect('/');

  const sep = data.daraz_link.includes('?') ? '&' : '?';
  const finalLink = `${data.daraz_link}${sep}aff_id=${MY_MEMBER_ID}`;

  redirect(finalLink);
}
