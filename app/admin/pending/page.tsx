// 👇 APNA AFFILIATE ID YAHAN LIKHO
  const MY_AFFILIATE_TAG = "alsafatraders"; // <-- ye change karna hai

  function getAffiliateLink(originalLink: string) {
    if (!originalLink) return "";
    // Agar link me pehle se ? hai to & lagao warna ?
    const separator = originalLink.includes("?") ? "&" : "?";
    // Daraz Affiliate format
    return `${originalLink}${separator}aff_id=${MY_AFFILIATE_TAG}&utm_source=affiliate`;
    // Agar Involve Asia hai to ye format use karo:
    // return `https://invol.co/cl...?url=${encodeURIComponent(originalLink)}`;
  }

  async function approveSelected() {
    // 1. Pehle selected products ka data nikalo
    const selectedProducts = products.filter(p => selected.includes(p.id));
    
    // 2. Har product pe auto affiliate lagao
    const productsWithAffiliate = selectedProducts.map(p => ({
      name: p.product_name,
      price: p.daraz_price,
      category: p.category,
      // 🔥 YAHAN AUTO AFFILIATE LAG RAHA HAI
      original_link: p.daraz_link,
      affiliate_link: getAffiliateLink(p.daraz_link),
      image: p.image_url,
      status: 'live'
    }));

    // 3. Live products table me daalo
    const { error } = await supabase.from('products').insert(productsWithAffiliate);
    
    if (!error) {
      // Pending se approved karo
      await supabase.from('pending_products').update({status:'approved'}).in('id',selected);
      alert(`${selected.length} Products LIVE with YOUR Affiliate! 💰`);
      setSelected([]); 
      fetchPending();
    }
  }
