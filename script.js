function setSector(s){
  document.querySelectorAll('.sector-btn').forEach((b,i)=>{
    const ss=['agri','retail','logistics','supply','payments','chat'];
    b.classList.toggle('active',ss[i]===s);
  });
  document.querySelectorAll('.sector-panel').forEach(p=>{
    p.classList.toggle('active',p.id==='sector-'+s);
  });
}
function showSub(sector,sub){
  const panel=document.getElementById('sector-'+sector);
  panel.querySelectorAll('.stab').forEach(t=>{
    const id=sector+'-'+sub;
    t.classList.toggle('active',t.getAttribute('onclick')&&t.getAttribute('onclick').includes("'"+sub+"'"));
  });
  panel.querySelectorAll('.page').forEach(p=>{
    p.classList.toggle('active',p.id===sector+'-'+sub);
  });
}
let chatLang='english';
const botReplies={
  english:["Thanks for your query! Let me check that.","I can help with that right away.","Based on current market data...","Great question — here's what I found."]
};
function addMsg(id,text,who,lang){
  const c=document.getElementById(id);
  const d=document.createElement('div');
  d.className='msg '+(who==='bot'?'mbot':'muser');
  if(who==='user')d.style.background='#B42318';
  d.innerHTML=text+(who==='bot'?'<div class="mlang">'+(lang||chatLang)+'</div>':'');
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function reply(msgId,lang){
  const r=botReplies[lang||chatLang];
  setTimeout(()=>addMsg(msgId,r[Math.floor(Math.random()*r.length)],'bot',lang||chatLang),600);
}
function sendMain(){const i=document.getElementById('main-in');const t=i.value.trim();if(!t)return;addMsg('main-msgs',t,'user');i.value='';reply('main-msgs');}
function quickMain(t){addMsg('main-msgs',t,'user');reply('main-msgs');setSector('chat');showSub('chat','main');}
function pushUnifiedPrice(){
  const item=document.getElementById('up-item').value.trim()||'Item';
  const price=parseFloat(document.getElementById('up-price').value)||0;
  const region=document.getElementById('up-region').value;
  const agri=document.getElementById('up-agri').checked;
  const logi=document.getElementById('up-logi').checked;
  const retail=document.getElementById('up-retail').checked;
  const sectors=[];
  if(agri)sectors.push('Agriculture');
  if(logi)sectors.push('Logistics');
  if(retail)sectors.push('Retail');
  if(sectors.length===0){alert('Select at least one sector to push this price to.');return;}
  const fmt=n=>'MK '+Math.round(n).toLocaleString();
  const logiPrice=price*1.10;
  const retailPrice=logiPrice*1.09;
  document.getElementById('up-preview-agri').style.opacity=agri?'1':'0.35';
  document.getElementById('up-preview-logi').style.opacity=logi?'1':'0.35';
  document.getElementById('up-preview-retail').style.opacity=retail?'1':'0.35';
  if(agri)document.getElementById('up-agri-price').textContent=fmt(price)+'/unit';
  if(logi)document.getElementById('up-logi-price').textContent=fmt(logiPrice)+'/unit';
  if(retail)document.getElementById('up-retail-price').textContent=fmt(retailPrice)+'/unit';
  const log=document.getElementById('up-log');
  const row=document.createElement('div');
  row.className='row';
  row.innerHTML='<div class="av" style="background:var(--teal-l);color:var(--teal-d)"><i class="ti ti-tag" style="font-size:14px" aria-hidden="true"></i></div><div class="ri"><h4>'+item+' · '+fmt(price)+'</h4><p>Pushed to '+sectors.join(', ')+' · '+region+'</p></div><span class="badge bg">Just now</span>';
  log.insertBefore(row,log.firstChild);
  sendPrompt('Push a unified price of '+fmt(price)+' for '+item+' in '+region+' to '+sectors.join(', ')+' simultaneously on ZaMsika');
}


// ZaMsika marketplace prototype: listings and cart persist in this browser.
const defaultAgriProducts = [
  {name:"Maize",price:18500,qty:"50 kg bag",seller:"Chimwemwe Farm",location:"Kasungu",category:"Grains"},
  {name:"Groundnuts",price:450000,qty:"1 tonne",seller:"Chisomo Zimba",location:"Mzuzu",category:"Legumes"},
  {name:"Soybean",price:380000,qty:"1 tonne",seller:"Fatima Enterprises",location:"Zomba",category:"Legumes"},
  {name:"Tomatoes",price:12000,qty:"20 kg crate",seller:"Green Valley Farm",location:"Lilongwe",category:"Vegetables"}
];
const defaultRetailProducts = [
  {name:"Chitenge fabric",price:8500,qty:"6 yards",seller:"Lusungu Textiles",location:"Blantyre",category:"Clothing"},
  {name:"Cooking oil",price:42000,qty:"20L drum",seller:"Sunflower Wholesale",location:"Lilongwe",category:"Groceries"},
  {name:"Android 4G smartphone",price:185000,qty:"1 unit",seller:"Techmart",location:"Mzuzu",category:"Electronics"},
  {name:"Farm tools",price:25000,qty:"1 set",seller:"Agro Hardware",location:"Lilongwe",category:"Hardware"}
];

function getProducts(key, defaults){
  const saved=localStorage.getItem(key);
  if(saved) return JSON.parse(saved);
  localStorage.setItem(key,JSON.stringify(defaults));
  return defaults;
}
function saveProducts(key,items){localStorage.setItem(key,JSON.stringify(items));}
function money(n){return "MK "+Number(n||0).toLocaleString();}

function renderAgricultureProducts(){
  const grid=document.getElementById('agri-product-grid'); if(!grid)return;
  const q=(document.getElementById('agri-product-search')?.value||'').toLowerCase();
  const cat=document.getElementById('agri-product-category')?.value||'All categories';
  const items=getProducts('zamsika_agri_products',defaultAgriProducts).filter(p=>
    (cat==='All categories'||p.category===cat) &&
    [p.name,p.seller,p.location,p.category].join(' ').toLowerCase().includes(q)
  );
  grid.innerHTML=items.length?items.map((p,i)=>`
    <div class="pcard">
      <div class="picon" style="background:var(--teal-l)"><i class="ti ti-wheat" style="font-size:28px;color:var(--teal)"></i></div>
      <h4 style="font-size:13px;font-weight:500">${escapeHtml(p.name)}</h4>
      <p style="font-size:11px;color:var(--m);margin:3px 0 7px">${escapeHtml(p.qty)} · ${escapeHtml(p.seller)} · ${escapeHtml(p.location)}</p>
      <div style="font-size:14px;font-weight:500;color:var(--teal);margin-bottom:6px">${money(p.price)}</div>
      <span class="tag tg">${escapeHtml(p.category)}</span>
      <div class="product-actions"><button class="btnp" onclick="addToCart('agri',${i})">Order</button><button class="btn" onclick="alert('Seller: ${escapeJs(p.seller)}\\nLocation: ${escapeJs(p.location)}\\nPrice: ${escapeJs(money(p.price))}')">Details</button></div>
    </div>`).join(''):'<div class="empty-products">No products match your search.</div>';
}
function renderRetailProducts(){
  const grid=document.getElementById('retail-product-grid'); if(!grid)return;
  const q=(document.getElementById('retail-product-search')?.value||'').toLowerCase();
  const cat=document.getElementById('retail-product-category')?.value||'All categories';
  const items=getProducts('zamsika_retail_products',defaultRetailProducts).filter(p=>
    (cat==='All categories'||p.category===cat) &&
    [p.name,p.seller,p.location,p.category].join(' ').toLowerCase().includes(q)
  );
  grid.innerHTML=items.length?items.map((p,i)=>`
    <div class="pcard">
      <div class="picon" style="background:var(--purple-l)"><i class="ti ti-shopping-cart" style="font-size:28px;color:var(--purple)"></i></div>
      <h4 style="font-size:13px;font-weight:500">${escapeHtml(p.name)}</h4>
      <p style="font-size:11px;color:var(--m);margin:3px 0 7px">${escapeHtml(p.qty)} · ${escapeHtml(p.seller)} · ${escapeHtml(p.location)}</p>
      <div style="font-size:14px;font-weight:500;color:var(--purple);margin-bottom:6px">${money(p.price)}</div>
      <span class="tag tp">${escapeHtml(p.category)}</span>
      <div class="product-actions"><button class="btnp" onclick="addToCart('retail',${i})">Buy</button><button class="btn" onclick="alert('Seller: ${escapeJs(p.seller)}\\nLocation: ${escapeJs(p.location)}\\nPrice: ${escapeJs(money(p.price))}')">Details</button></div>
    </div>`).join(''):'<div class="empty-products">No products match your search.</div>';
}
function addAgricultureProduct(){
  const p={name:val('agri-name'),price:Number(val('agri-price')),qty:val('agri-qty'),seller:val('agri-seller'),location:val('agri-location'),category:val('agri-category')};
  if(!p.name||!p.price||!p.qty||!p.seller||!p.location){alert('Please fill in all product fields.');return;}
  const items=getProducts('zamsika_agri_products',defaultAgriProducts); items.unshift(p); saveProducts('zamsika_agri_products',items);
  clearFields(['agri-name','agri-price','agri-qty','agri-seller','agri-location']); renderAgricultureProducts(); alert('Agricultural product added.');
}
function addRetailProduct(){
  const p={name:val('retail-name'),price:Number(val('retail-price')),qty:val('retail-qty'),seller:val('retail-seller'),location:val('retail-location'),category:val('retail-category')};
  if(!p.name||!p.price||!p.qty||!p.seller||!p.location){alert('Please fill in all product fields.');return;}
  const items=getProducts('zamsika_retail_products',defaultRetailProducts); items.unshift(p); saveProducts('zamsika_retail_products',items);
  clearFields(['retail-name','retail-price','retail-qty','retail-seller','retail-location']); renderRetailProducts(); alert('Retail product added.');
}
function val(id){return document.getElementById(id)?.value.trim()||'';}
function clearFields(ids){ids.forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});}
function addToCart(type,index){
  const key=type==='agri'?'zamsika_agri_products':'zamsika_retail_products';
  const items=getProducts(key,type==='agri'?defaultAgriProducts:defaultRetailProducts);
  const p=items[index]; if(!p)return;
  const cart=JSON.parse(localStorage.getItem('zamsika_cart')||'[]');
  cart.push({...p,type});
  localStorage.setItem('zamsika_cart',JSON.stringify(cart));
  updateCartCount();
  alert(p.name+' added to your cart.');
}
function getCart(){return JSON.parse(localStorage.getItem('zamsika_cart')||'[]');}
function saveCart(cart){localStorage.setItem('zamsika_cart',JSON.stringify(cart));}
function openCartView(){
  renderCartView();
  document.getElementById('cartViewModal').style.display='flex';
}
function closeCartView(){document.getElementById('cartViewModal').style.display='none';}
function renderCartView(){
  const cart=getCart();
  const list=document.getElementById('cartViewList');
  const totalEl=document.getElementById('cartViewTotal');
  const checkoutBtn=document.getElementById('cartViewCheckoutBtn');
  if(!cart.length){
    list.innerHTML='<div class="empty-products">Your cart is empty.</div>';
    totalEl.textContent=money(0);
    checkoutBtn.disabled=true;
    return;
  }
  checkoutBtn.disabled=false;
  list.innerHTML=cart.map((p,i)=>`
    <div class="zm-modal-item">
      <span>${escapeHtml(p.name)}<br><small style="color:var(--m);font-weight:400">${escapeHtml(p.qty||'')}</small></span>
      <span style="display:flex;align-items:center;gap:8px"><strong>${money(p.price)}</strong><button class="btn" style="padding:4px 9px;font-size:11px" onclick="removeCartItem(${i})">Remove</button></span>
    </div>`).join('');
  const total=cart.reduce((s,p)=>s+Number(p.price||0),0);
  totalEl.textContent=money(total);
}
function removeCartItem(i){
  const cart=getCart(); cart.splice(i,1); saveCart(cart); updateCartCount(); renderCartView();
}
function proceedToCheckout(){
  const cart=getCart();
  if(!cart.length){alert('Your cart is empty.');return;}
  closeCartView();
  openCheckoutModal();
}
function openCheckoutModal(){
  const cart=getCart();
  const total=cart.reduce((s,p)=>s+Number(p.price||0),0);
  document.getElementById('checkoutItemName').textContent=cart.length+(cart.length===1?' item':' items');
  document.getElementById('checkoutItemPrice').textContent=money(total);
  document.querySelectorAll('#checkoutModal input[name="paymethod"]').forEach((el,i)=>el.checked=i===0);
  document.getElementById('checkoutModal').style.display='flex';
}
function closeCheckoutModal(){document.getElementById('checkoutModal').style.display='none';}
function confirmCheckout(){
  const cart=getCart();
  if(!cart.length){closeCheckoutModal();return;}
  const sel=document.querySelector('#checkoutModal input[name="paymethod"]:checked');
  const method=sel?sel.value:'Airtel Money';
  const total=cart.reduce((s,p)=>s+Number(p.price||0),0);
  saveCart([]);
  updateCartCount();
  closeCheckoutModal();
  alert('Order placed for '+money(total)+' — paying via '+method+'.');
}
function updateCartCount(){
  const n=JSON.parse(localStorage.getItem('zamsika_cart')||'[]').length;
  const top=document.getElementById('cartCountTop'); if(top)top.textContent=n;
  ['agri-cart-count','retail-cart-count'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='Cart: '+n;});
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function escapeJs(s){return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,' ');}
document.addEventListener('DOMContentLoaded',()=>{updateCartCount();renderAgricultureProducts();renderRetailProducts();});


function hideLanding(){document.getElementById('zm-home').style.display='none';document.getElementById('zm-platform').style.display='block';document.getElementById('zm-contact-footer').style.display='none';}
function showHome(){document.getElementById('zm-home').style.display='block';document.getElementById('zm-platform').style.display='none';document.getElementById('zm-contact-footer').style.display='flex';document.querySelectorAll('.zm-nav a').forEach(a=>a.classList.remove('active'));document.getElementById('navHome').classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function openSector(s){hideLanding();if(typeof setSector==='function')setSector(s);window.scrollTo({top:0,behavior:'smooth'});}
function showAbout(){showHome();setTimeout(()=>document.getElementById('about').scrollIntoView({behavior:'smooth'}),50);}
function showContact(){showHome();setTimeout(()=>document.getElementById('zm-contact-footer').scrollIntoView({behavior:'smooth'}),50);}
function openFeatured(){document.getElementById('products').scrollIntoView({behavior:'smooth'});}
function runZmSearch(e){e.preventDefault();const q=document.getElementById('zmSearchInput').value.trim().toLowerCase();if(!q){openFeatured();return;}hideLanding();if(q.includes('transport')||q.includes('truck')||q.includes('logistics'))setSector('logistics');else if(q.includes('oil')||q.includes('retail')||q.includes('phone')||q.includes('clothes')){setSector('retail');if(typeof showSub==='function'){showSub('retail','products');if(typeof renderRetailProducts==='function')renderRetailProducts();}}else{setSector('agri');if(typeof showSub==='function'){showSub('agri','products');if(typeof renderAgricultureProducts==='function')renderAgricultureProducts();}}}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('zm-platform').style.display='none';document.getElementById('zm-contact-footer').style.display='flex';});


/* ---- Standalone support ----
   Many buttons call sendPrompt(...), which only exists inside Claude's
   widget environment. On a normal web page it is undefined, so route those
   prompts to the built-in ZaMsika chat assistant instead. */
if (typeof window.sendPrompt !== 'function') {
  window.sendPrompt = function (text) { quickMain(text); };
}
