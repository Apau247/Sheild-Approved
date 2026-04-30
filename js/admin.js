(function(){
var cur=localStorage.getItem('ivsCurrentUser');
if(!cur){window.location.href='login.html';return;}
var u;try{u=JSON.parse(cur);}catch(e){localStorage.removeItem('ivsCurrentUser');window.location.href='login.html';return;}
if(u.role!=='admin'){window.location.href='client-portal.html';return;}
var msg=document.getElementById('adminMessage');
document.getElementById('adminWelcome').textContent='Signed in as '+(u.fullName||u.email);
document.getElementById('adminLogout').addEventListener('click',function(e){e.preventDefault();localStorage.removeItem('ivsCurrentUser');window.location.href='login.html';});
function show(t,ty){msg.textContent=t;msg.className='dashboard-message active '+ty;}
async function sj(r){var t=await r.text();if(!t)return{};try{return JSON.parse(t);}catch(e){throw new Error('Invalid server response.');}}
function fd(i){if(!i)return'-';try{var d=new Date(i);return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});}catch(e){return i;}}
function sbc(s){var x=String(s||'').toLowerCase();if(x==='deceased')return'badge-deceased';if(x==='active')return'badge-active';return'badge-pending';}
function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'<').replace(/>/g,'>');}
function rcr(user){
var ih='',bh='',nh='',ah='',lh='';
if(user.clientImage)ih+='<div class="record-image-box"><img src="'+esc(user.clientImage)+'" alt="Client" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid var(--color-accent-gold);"><span>Client</span></div>';
if(user.nextOfKinImage)ih+='<div class="record-image-box"><img src="'+esc(user.nextOfKinImage)+'" alt="Next of Kin" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--color-accent-gold);"><span>Next of Kin</span></div>';
['id','fullName','email','phone','company','country','city','address','preferredService','assetType','occupation','province','clientStatus','status','role','createdAt','updatedAt'].forEach(function(k){
var v=user[k],lab=k.replace(/[A-Z]/g,function(m){return' '+m.toLowerCase();}).replace(/^./,function(m){return m.toUpperCase();});
if(k==='clientStatus'||k==='status')bh+='<div class="record-item"><div class="record-label">'+lab+'</div><div class="record-value"><span class="record-badge '+sbc(v)+'">'+(v||'Unknown')+'</span></div>';
else if(k==='createdAt'||k==='updatedAt')bh+='<div class="record-item"><div class="record-label">'+lab+'</div><div class="record-value">'+fd(v)+'</div>';
else bh+='<div class="record-item"><div class="record-label">'+lab+'</div><div class="record-value '+(v?'':'record-null')+'">'+(v?esc(v):'Not set')+'</div>';
});
nh+='<div class="record-item"><div class="record-label">Next of Kin Name</div><div class="record-value">'+(user.nextOfKinName||'-')+'</div>';
nh+='<div class="record-item"><div class="record-label">NOK Phone</div><div class="record-value '+(user.nextOfKinPhone?'':'record-null')+'">'+(user.nextOfKinPhone||'Not set')+'</div>';
nh+='<div class="record-item"><div class="record-label">NOK Email</div><div class="record-value '+(user.nextOfKinEmail?'':'record-null')+'">'+(user.nextOfKinEmail||'Not set')+'</div>';
nh+='<div class="record-item"><div class="record-label">NOK Relationship</div><div class="record-value">'+(user.nextOfKinRelationship||'-')+'</div>';
if(user.assetDetails){var ad=user.assetDetails;ah+='<div class="record-item"><div class="record-label">Asset Type</div><div class="record-value">'+(ad.assetType||'-')+'</div>';ah+='<div class="record-item"><div class="record-label">Quantity</div><div class="record-value">'+(ad.quantity||'-')+'</div>';ah+='<div class="record-item"><div class="record-label">Consignment Value</div><div class="record-value">'+(ad.consignmentValue?ad.currency+' '+ad.consignmentValue.toLocaleString():'-')+'</div>';ah+='<div class="record-item"><div class="record-label">Monthly Charges</div><div class="record-value">'+(ad.monthlyCharges?ad.currency+' '+ad.monthlyCharges.toLocaleString():'-')+'</div>';ah+='<div class="record-item"><div class="record-label">Date Issued</div><div class="record-value">'+(ad.dateIssued||'-')+'</div>';ah+='<div class="record-item"><div class="record-label">Security Code</div><div class="record-value">'+(ad.securityCode||'-')+'</div>';ah+='<div class="record-item"><div class="record-label">Storage Location</div><div class="record-value">'+(ad.storageLocation||'-')+'</div>';}
if(user.logistics){var lg=user.logistics;lh+='<div class="record-item"><div class="record-label">Transport Method</div><div class="record-value">'+(lg.transportMethod||'-')+'</div>';lh+='<div class="record-item"><div class="record-label">Vehicle Type</div><div class="record-value">'+(lg.vehicleType||'-')+'</div>';lh+='<div class="record-item"><div class="record-label">Number of Vehicles</div><div class="record-value">'+(lg.numberOfVehicles||'-')+'</div>';lh+='<div class="record-item"><div class="record-label">Security Level</div><div class="record-value">'+(lg.securityLevel||'-')+'</div>';lh+='<div class="record-item"><div class="record-label">Logistics Status</div><div class="record-value">'+(lg.status||'-')+'</div>';}
return'<div class="client-record-card"><div class="client-record-header"><div class="record-images">'+ih+'</div><div class="client-record-title"><h4>'+(user.fullName||'Unnamed Client')+'</h4><span>'+(user.id||'')+' &middot; '+(user.company||'')+'</span></div><span class="record-badge '+sbc(user.clientStatus)+'">'+(user.clientStatus||'Unknown')+'</span></div><div class="record-section-title">Contact Information</div><div class="record-grid">'+bh+'</div><div class="record-section-title">Next of Kin</div><div class="record-grid">'+nh+'</div>'+(user.assetDetails?'<div class="record-section-title">Asset Details</div><div class="record-grid">'+ah+'</div>':'')+(user.logistics?'<div class="record-section-title">Logistics &amp; Transport</div><div class="record-grid">'+lh+'</div>':'')+'</div>';
}
function rc(users){
var rows=[],tv=0,sc=0,pc=0;
users.forEach(function(user){if(user.assetDetails){var ad=user.assetDetails,v=Number(ad.consignmentValue)||0;tv+=v;if(String(ad.status||'').toLowerCase()==='stored')sc++;else if(String(ad.status||'').toLowerCase()==='pending')pc++;rows.push({userId:user.id,clientName:user.fullName,assetType:ad.assetType||'-',quantity:ad.quantity||'-',consignmentValue:v,currency:ad.currency||'USD',securityCode:ad.securityCode||'-',storageLocation:ad.storageLocation||'-',status:ad.status||'Stored'});}});
document.getElementById('consignmentCount').textContent=rows.length;
document.getElementById('consignmentValueTotal').textContent='$'+tv.toLocaleString();
document.getElementById('consignmentStoredCount').textContent=sc;
document.getElementById('consignmentPendingCount').textContent=pc;
document.getElementById('consignmentRows').innerHTML=rows.map(function(r){return'<tr><td>'+r.userId+'</td><td>'+r.clientName+'</td><td>'+r.assetType+'</td><td>'+r.quantity+'</td><td>'+r.currency+' '+r.consignmentValue.toLocaleString()+'</td><td>'+r.currency+'</td><td>'+r.securityCode+'</td><td>'+r.storageLocation+'</td><td><span class="record-badge '+sbc(r.status)+'">'+r.status+'</span></td><td><button type="button" class="btn btn-simple" style="padding:6px 12px;font-size:0.75rem;" onclick="openConsignmentEdit(\''+r.userId+'\')">Edit</button></td></tr>';}).join('')||'<tr><td colspan="10" class="empty-copy">No consignment records available.</td></tr>';
}
window.openConsignmentEdit=function(userId){
fetch('/api/users').then(function(r){return r.json();}).then(function(p){
var d=p.data||p,user=(d.users||[]).find(function(x){return x.id===userId;});
if(!user||!user.assetDetails)return;
var ad=user.assetDetails;
document.getElementById('editUserId').value=userId;
document.getElementById('editAssetType').value=ad.assetType||'';
document.getElementById('editQuantity').value=ad.quantity||'';
document.getElementById('editConsignmentValue').value=ad.consignmentValue||'';
document.getElementById('editCurrency').value=ad.currency||'USD';
document.getElementById('editSecurityCode').value=ad.securityCode||'';
document.getElementById('editStorageLocation').value=ad.storageLocation||'';
document.getElementById('editStatus').value=ad.status||'Stored';
document.getElementById('editDateIssued').value=ad.dateIssued||'';
document.getElementById('editMonthlyCharges').value=ad.monthlyCharges||'';
document.getElementById('consignmentModal').style.display='flex';
});
};
document.getElementById('modalClose').addEventListener('click',function(){document.getElementById('consignmentModal').style.display='none';});
document.getElementById('consignmentModal').addEventListener('click',function(e){if(e.target===this)this.style.display='none';});
var cForm=document.getElementById('consignmentForm'),ceForm=document.getElementById('consignmentEditForm'),aForm=document.getElementById('adminAssetForm'),uForm=document.getElementById('adminUserForm');
cForm.addEventListener('submit',async function(e){e.preventDefault();var fd=new FormData(cForm),p=Object.fromEntries(fd.entries());p.consignmentValue=Number(p.consignmentValue)||0;p.monthlyCharges=Number(p.monthlyCharges)||0;p.actor=u.fullName||u.email;try{var r=await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'updateUser',payload:{id:p.userId,assetDetails:{assetType:p.assetType,quantity:p.quantity,consignmentValue:p.consignmentValue,currency:p.currency,securityCode:p.securityCode,storageLocation:p.storageLocation,status:p.status,dateIssued:p.dateIssued,monthlyCharges:p.monthlyCharges},actor:p.actor}})});var res=await sj(r);if(!r.ok)throw new Error(res.error||'Could not save consignment.');show('Consignment record saved successfully.','success');cForm.reset();load();}catch(err){show(err.message||'Could not save consignment.','error');}});
ceForm.addEventListener('submit',async function(e){e.preventDefault();var fd=new FormData(ceForm),p=Object.fromEntries(fd.entries());p.consignmentValue=Number(p.consignmentValue)||0;p.monthlyCharges=Number(p.monthlyCharges)||0;p.actor=u.fullName||u.email;try{var r=await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'updateUser',payload:{id:p.userId,assetDetails:{assetType:p.assetType,quantity:p.quantity,consignmentValue:p.consignmentValue,currency:p.currency,securityCode:p.securityCode,storageLocation:p.storageLocation,status:p.status,dateIssued:p.dateIssued,monthlyCharges:p.monthlyCharges},actor:p.actor}})});var res=await sj(r);if(!r.ok)throw new Error(res.error||'Could not update consignment.');show('Consignment updated successfully.','success');document.getElementById('consignmentModal').style.display='none';load();}catch(err){show(err.message||'Could not update consignment.','error');}});
aForm.addEventListener('submit',async function(e){e.preventDefault();var fd=new FormData(aForm),p=Object.fromEntries(fd.entries()),act=p.assetId?'updateAsset':'addAsset';try{var r=await fetch('/api/dashboard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:act,payload:p})});var res=await sj(r);if(!r.ok)throw new Error(res.error||'Could not save asset.');show('Asset record saved successfully.','success');aForm.reset();load();}catch(err){show(err.message||'Could not save asset.','error');}});
uForm.addEventListener('submit',async function(e){e.preventDefault();var fd=new FormData(uForm),p=Object.fromEntries(fd.entries());try{var r=await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'updateUser',payload:p})});var res=await sj(r);if(!r.ok)throw new Error(res.error||'Could not save user.');show('User record saved successfully.','success');load();}catch(err){show(err.message||'Could not save user.','error');}});
async function load(){
try{
var[dR,aR]=await Promise.all([fetch('/api/dashboard'),fetch('/api/users')]);
var dP=await sj(dR),aP=await sj(aR);
var dD=dP.data||dP,aD=aP.data||aP;
displayPrices(dD.prices);
document.getElementById('adminAssetRows').innerHTML=(dD.assets||[]).map(function(a){return'<tr><td>'+esc(a.owner)+'</td><td>'+esc(a.assetName)+'<br><small>'+esc(a.assetId)+'</small></td><td>'+esc(a.assetType)+'</td><td>'+esc(a.quantity)+'</td><td>'+esc(a.vault)+'</td><td class="price-rise">'+(a.spotPrice?'$'+a.spotPrice+'/oz':'-')+'</td><td>$'+esc(a.consignmentValue)+'</td><td>$'+esc(a.storagePrice)+'/mo</td><td>'+esc(a.status)+'</td></tr>';}).join('')||'<tr><td colspan="9" class="empty-copy">No asset data available.</td></tr>';
var q=[].concat((aD.users||[]).filter(function(x){return x.role==='client';}).map(function(i){var det=[i.id,i.phone,i.company,i.country,i.city,i.preferredService,i.assetType].filter(Boolean).join(' | ');return{name:i.fullName,email:i.email,meta:det,createdAt:i.createdAt||'New'};})).concat((dD.contacts||[]).map(function(i){return{name:i.name,email:i.email,meta:i.message||'',createdAt:i.createdAt||'New'};}));
document.getElementById('adminQueueRows').innerHTML=q.map(function(e){return'<tr><td>'+esc(e.name)+'</td><td>'+esc(e.email)+'</td><td>'+esc(e.meta)+'</td><td>'+esc(e.createdAt)+'</td></tr>';}).join('')||'<tr><td colspan="4" class="empty-copy">No signup or contact requests available.</td></tr>';
var cU=(aD.users||[]).filter(function(x){return x.role==='client';});
document.getElementById('adminClientRecords').innerHTML=cU.map(rcr).join('')||'<p class="empty-copy">No client records available.</p>';
rc(cU);
}catch(err){
document.getElementById('adminAssetRows').innerHTML='<tr><td colspan="7" class="empty-copy">API unavailable.</td></tr>';
document.getElementById('adminQueueRows').innerHTML='<tr><td colspan="4" class="empty-copy">API unavailable.</td></tr>';
document.getElementById('adminClientRecords').innerHTML='<p class="empty-copy">API unavailable.</p>';
document.getElementById('consignmentRows').innerHTML='<tr><td colspan="10" class="empty-copy">API unavailable.</td></tr>';
show(err.message||'Could not load admin data.','error');
}}
load();
// Price update handler
document.getElementById('updatePricesBtn')?.addEventListener('click', async function(){
  const btn = this;
  btn.disabled = true;
  btn.textContent = 'Updating...';
  try{
    const res = await fetch('/api/update-prices', {method:'POST'});
    const data = await sj(res);
    if(data.ok){
      show('Prices updated from live sources! Reloading data...','success');
      load();
    } else {
      show('Update failed: '+data.error,'error');
    }
  }catch(err){
    show('Update error: '+err.message,'error');
  }
  btn.disabled = false;
  btn.textContent = '🔄 Update Prices Now';
});
function displayPrices(prices){
  const minerals = ['gold','platinum','silver'];
  minerals.forEach(m => {
    const el = document.getElementById(m+'-price-display');
    if(el && prices && prices[m]){
      const p = prices[m];
      const cls = p.percent > 0 ? 'price-rise' : p.percent < 0 ? 'price-fall' : 'price-neutral';
      el.innerHTML = `$${p.oz}/oz <span class="${cls}"> ${p.percent}%</span>`;
    }
  });
}
})();
