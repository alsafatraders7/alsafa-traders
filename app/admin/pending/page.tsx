async function approveSelected() {
    if (selected.length === 0) {
      alert("Pehle checkbox pe tick karo bhai!");
      return;
    }
    console.log("Approving:", selected);
    const selectedProducts = products.filter((p) => selected.includes(p.id));
    
    const productsWithAffiliate = selectedProducts.map((p) => ({
      product_name: p.product_name,
      daraz_price: p.daraz_price,
      category: p.category,
      daraz_link: p.daraz_link,
      affiliate_link: getAffiliateLink(p.daraz_link),
      image_url: p.image_url,
      seller_name: p.seller_name,
      status: 'live'
    }));

    console.log("Inserting:", productsWithAffiliate);

    const { data, error: insertError } = await supabase.from("products").insert(productsWithAffiliate).select();
    if (insertError) { 
      alert("INSERT ERROR: " + insertError.message + "\n\nSupabase me products table me affiliate_link column banao!");
      console.error(insertError);
      return; 
    }

    const { error: updateError } = await supabase.from("pending_products").update({ status: "approved" }).in("id", selected);
    if(updateError){
      alert("Update Error: " + updateError.message);
      return;
    }

    alert(`${selected.length} LIVE HO GAYA! 💰`);
    setSelected([]);
    fetchPending();
  }
