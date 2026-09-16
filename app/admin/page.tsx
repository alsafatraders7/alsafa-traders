'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [ok, setOk] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [up, setUp] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', cat: '',
    img1: '', img2: '', img3: '', img4: '',
    detail: '', link: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) { setOk(true); setEmail(data.session.user.email || ''); load(); }
    });
  }, []);

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setProducts(data);
  };

  const login = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (!error) { setOk(true); load(); } else alert(error.message);
  };

  const toCC = (u: string) => {
    if (!u) return '';
    return u.split('?')[0].split('&')[0] + '?cc';
  };

  const upload = async (e: any, key: string) => {
    const file = e.target.files[0];
    if (!file) return;
    setUp(true);
    const name = Date.now() + '-' + file.name.replace(/\s/g, '-');
    const { error } = await supabase.storage.from('product-images').upload(name, file);
    if (error) { alert(error.message); setUp(false); return; }
    const { data } = supabase.storage.from('product-images').getPublicUrl(name);
    setForm((f: any) => ({...f, [key]: data.publicUrl }));
    setUp(false);
  };

  const save = async (e: any) => {
    e.preventDefault();
    const link = toCC(form.link);
    const desc = form.detail + ' || IMG2:' + form.img2 + ' || IMG3:' + form.img3 + ' || IMG4:' + form.img4;
    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.cat,
      image_url: form.img1,
      affiliate_link: link,
      description: desc,
      is_active: true
    };
    if (edit) {
      await supabase.from('products').update(payload).eq('id', edit.id);
    } else {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      await supabase.from('products').insert([{...payload, slug }]);
    }
    setShow(false);
    setEdit(null);
    setForm({ name: '', price: '', cat: '', img1: '', img2: '', img3: '', img4: '', detail: '', link: '' });
    load();
  };

  const startEdit = (p: any) => {
    const parts = (p.description || '').split('||');
    setEdit(p);
    setForm({
      name: p.name,
      price: String(p.price),
      cat: p.category,
      img1: p.image_url,
      img2: parts[1]? parts[1].replace('IMG2:', '').trim() : '',
      img3: parts[2]? parts[2].replace('IMG3:', '').trim() : '',
      img4: parts[3]? parts[3].replace('IMG4:', '').trim() : '',
      detail: parts[0]? parts[0].trim() : '',
      link: p.affiliate_link || ''
    });
    setShow(true);
  };

  const del = async (id: string) => {
    if (!confirm('Delete?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  if (!ok) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f2e26', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={login} style={{ background: 'white', padding: 24, borderRadius: 16, width: 350 }}>
          <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>Al Safa Traders - Admin</h1>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', border: '1px solid #ccc', padding: 10, marginTop: 12, borderRadius: 8 }} />
          <input placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', border: '1px solid #ccc', padding: 10, marginTop: 12, borderRadius: 8 }} />
          <button type="submit" style={{ width: '100%', background: 'black', color: 'white', padding: 12, marginTop: 12, borderRadius: 8 }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: 12, borderRadius: 8 }}>
        <h2 style={{ fontWeight: 'bold' }}>Al Safa Traders - {products.length} Products - 4 Pic LIVE</h2>
        <button onClick={() => { setEdit(null); setForm({ name: '', price: '', cat: '', img1: '', img2: '', img3: '', img4: '', detail: '', link: '' }); setShow(true); }} style={{ background: '#c49a4b', padding: '8px 16px', borderRadius: 8, fontWeight: 'bold' }}>+ Add 4 Pic Product</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 16 }}>
        {products.map((p: any) => (
          <div key={p.id} style={{ background: 'white', padding: 8, borderRadius: 8, border: '1px solid #eee' }}>
            <img src={p.image_url} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6 }} />
            <div style={{ fontSize: 12, marginTop: 6, fontWeight: 'bold' }}>{p.name}</div>
            <div style={{ fontSize: 11, color: '#666' }}>{p.category} - Rs.{p.price}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              <button onClick={() => startEdit(p)} style={{ flex: 1, border: '1px solid #ccc', borderRadius: 20, fontSize: 10, padding: 4 }}>Edit</button>
              <button onClick={() => del(p.id)} style={{ flex: 1, border: '1px solid #ccc', borderRadius: 20, fontSize: 10, padding: 4 }}>Del</button>
            </div>
          </div>
        ))}
      </div>
      {show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 16, width: 500, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ fontWeight: 'bold' }}>{edit? 'Edit' : 'Add'} Product - 4 Pic</h3><button onClick={() => setShow(false)}>X</button></div>
            <form onSubmit={save} style={{ display: 'grid', gap: 8, marginTop: 12 }}>
              <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value })} style={{ border: '1px solid #ccc', padding: 8, borderRadius: 6 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input required placeholder="Price LIVE Rs" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value })} style={{ border: '1px solid #ccc', padding: 8, borderRadius: 6, background: '#e8ffe8' }} />
                <input required placeholder="Category - Bartan, Kitchen etc" value={form.cat} onChange={e => setForm({...form, cat: e.target.value })} style={{ border: '1px solid #ccc', padding: 8, borderRadius: 6, background: '#fff9d6' }} />
              </div>
              <div style={{ border: '2px dashed #ccc', padding: 8, borderRadius: 8, background: '#fafafa' }}>
                <div style={{ fontSize: 11, fontWeight: 'bold' }}>4 Picture - Gallery Se</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  <div><div style={{ fontSize: 9 }}>Pic1 Main</div><input type="file" accept="image/*" onChange={e => upload(e, 'img1')} /><input required placeholder="Pic1 URL" value={form.img1} onChange={e => setForm({...form, img1: e.target.value })} style={{ width: '100%', border: '1px solid #ccc', padding: 4, fontSize: 11 }} /></div>
                  <div><div style={{ fontSize: 9 }}>Pic2</div><input type="file" accept="image/*" onChange={e => upload(e, 'img2')} /><input placeholder="Pic2 URL" value={form.img2} onChange={e => setForm({...form, img2: e.target.value })} style={{ width: '100%', border: '1px solid #ccc', padding: 4, fontSize: 11 }} /></div>
                  <div><div style={{ fontSize: 9 }}>Pic3</div><input type="file" accept="image/*" onChange={e => upload(e, 'img3')} /><input placeholder="Pic3 URL" value={form.img3} onChange={e => setForm({...form, img3: e.target.value })} style={{ width: '100%', border: '1px solid #ccc', padding: 4, fontSize: 11 }} /></div>
                  <div><div style={{ fontSize: 9 }}>Pic4</div><input type="file" accept="image/*" onChange={e => upload(e, 'img4')} /><input placeholder="Pic4 URL" value={form.img4} onChange={e => setForm({...form, img4: e.target.value })} style={{ width: '100%', border: '1px solid #ccc', padding: 4, fontSize: 11 }} /></div>
                </div>
                {up && <div style={{ fontSize: 10, color: 'blue' }}>Uploading...</div>}
              </div>
              <input placeholder="Detail Type" value={form.detail} onChange={e => setForm({...form, detail: e.target.value })} style={{ border: '1px solid #ccc', padding: 8, borderRadius: 6 }} />
              <input required placeholder="Daraz Link auto?cc" value={form.link} onChange={e => setForm({...form, link: e.target.value })} style={{ border: '1px solid orange', padding: 8, borderRadius: 6 }} />
              <button type="submit" style={{ background: '#0f2e26', color: 'white', padding: 12, borderRadius: 8, fontWeight: 'bold' }}>Save - 4 Pic LIVE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
