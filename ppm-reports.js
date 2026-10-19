(function () {
 'use strict';
 const templates=window.PPMReportTemplates||{}, labels={Electrical:'Elektrikal',Mechanical:'Mekanikal','Fire Fighting':'Kebakaran',Civil:'Sivil',Plumbing:'Paip'};
 const templateNames={bilikSuis:'Switch Room',waterPump:'Water Pump',swimmingPump:'Swimming Water Pump',standbyGenset:'Standby Genset',capacitorBank:'Capacitor Bank',mechExhaustFan:'Exhaust Fan',ffWaterTank:'Water Tank',ffAlarmPanel:'Alarm Panel',ffFireControlRoom:'Fire Control Room',ffWaterRiser:'Water Riser',ffWetRiser:'Wet Riser',civilRiserLeaking:'Riser Leaking Check',civilWallLeaking:'Wall Leaking Checking',plToilet:'Toilet'};
 const $=id=>document.getElementById(id), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const suffixLabels={r:'R',y:'Y',b:'B',rn:'R-N',yn:'Y-N',bn:'B-N',ry:'R-Y',yb:'Y-B',br:'B-R',volt:'V',freq:'Hz',amf_v:'AMF V',amf_a:'AMF A',chargeMode:'Mod caj',normalCutIn:'Normal Cut-In',testCutIn:'Test Cut-In',normalCutOut:'Normal Cut-Out',testCutOut:'Test Cut-Out',BMA:'Bilik Meter Air',BPB:'Bilik Pancur Basah',MATV:'Bilik MATV',BST:'Bilik Saluran Telefon',BPM:'Bilik Panel Meter',BSE:'Bilik Saluran Elektrik',BGH:'Bilik Gegelung Hos',TK:'Tangga Kecemasan',HRC:'Hose Reel (Canvas)',NAC:'Nozzle & Coupling',HRB:'Hose Reel Bracket',FE:'Fire Extinguisher',CV:'Control Valve',LAMP:'Lamp'};
 const codes={P:'Pintu rosak',T:'Tombol atau stopper rosak',B:'Bilik tidak bersih',LS:'Lantai atau siling bocor'};
 let reports=[], selected=null, fetching=false;
 function fields(row){try{const data=typeof row.checklistFieldValues==='string'?JSON.parse(row.checklistFieldValues||'{}'):row.checklistFieldValues;return data&&typeof data==='object'?data:{};}catch(_){return {};}}
 function month(row){const raw=String(row.monthKey||row.inspectionDate||'');return raw.match(/^\d{4}-\d{2}/)?.[0]||'';}
 function accepted(row){return row.confirmChecklist===true||String(row.confirmChecklist).toLowerCase()==='true';}
 function evidence(row){const f=fields(row);const entries=Array.isArray(f.__evidence)?f.__evidence:Array.isArray(f.__imageUrls)?f.__imageUrls.map(url=>({url})):[];return entries.filter(item=>/^https?:\/\//i.test(item?.url||''));}
 function imageUrl(url){const m=String(url).match(/\/file\/d\/([^/?#]+)/)||String(url).match(/[?&]id=([^&#]+)/);return m?`https://lh3.googleusercontent.com/d/${encodeURIComponent(m[1])}`:url;}
 function parseRows(row){
  const f=fields(row),template=templates[row.templateKey];let number=0;const result=[],used=new Set();
  if(!template)return [{group:'Medan rekod asal',number:'',item:'Templat tidak dikenali',status:'—',note:JSON.stringify(f)}];
  template.groups.forEach(group=>group.items.forEach(item=>{
   const n=++number,statusKey=`checkStatus_${n}`,remarkKey=`checkRemark_${n}`;used.add(statusKey);used.add(remarkKey);
   const extras=[];
   Object.entries(f).filter(([key])=>key.startsWith(statusKey+'_')||key.startsWith(remarkKey+'_')).forEach(([key,value])=>{
    used.add(key);if(!String(value??'').trim())return;
    let suffix=key.replace(/^check(?:Status|Remark)_\d+_/,'');
    if(suffix.startsWith('ng_')){suffix=suffix.slice(3);value=String(value).split(':').pop().split(/[\s,;|/]+/).map(code=>codes[code]||code).join(', ');}
    extras.push(`${suffixLabels[suffix]||suffix}: ${value}`);
   });
   result.push({group:group.title,number:n,item,status:String(f[statusKey]||'—'),note:[String(f[remarkKey]||''),...extras].filter(Boolean).join('\n')||'—'});
  }));
  const extra=Object.entries(f).filter(([key,value])=>!key.startsWith('__')&&!used.has(key)&&String(value??'').trim());
  if(extra.length)result.push({group:'Medan tambahan dalam rekod',number:'',item:'Maklumat tambahan',status:'—',note:extra.map(([key,value])=>`${key}: ${value}`).join('\n')});
  return result;
 }
 function totals(row){const items=parseRows(row);return {items,ng:items.filter(item=>item.status==='NG').length,ok:items.filter(item=>item.status==='OK').length};}
 function conclusion(row){const {items,ng}=totals(row);return [
  `KESIMPULAN: ${items.length} item direkodkan; ${ng} item NG. ${ng?'Item NG memerlukan tindakan susulan.':'Status mengikut rekod pemeriksaan yang dihantar.'}`,
  'PENEMUAN: '+(items.filter(item=>item.status==='NG').map(item=>`Item ${item.number}: ${item.note}`).join(' | ')||'Tiada item NG direkodkan.'),
  'CATATAN TEKNIKAL: '+(String(row.technicianNotes||'').split('\n').filter(line=>line.replace(/[-\s]/g,'')).join('\n')||'Tiada catatan tambahan.'),
  'PENGESAHAN TEKNIKAL: '+(row.techDeclaration||'Tidak direkodkan')+' | PENYEMAK: '+(row.verifiedBy||'Tidak direkodkan'),
  'Rekod diterima server. Laporan ini tidak menandakan kerosakan telah dibaiki dan tidak mengandungi tandatangan digital.'
 ].join('\n');}
 function templateName(row){return `${templateNames[row.templateKey]||row.templateKey||'Templat tidak dikenali'} (${templates[row.templateKey]?.referenceNo||row.referenceNo||'-'})`;}
 function render(){
  const data=reports.filter(row=>(!$('monthFilter').value||month(row)===$('monthFilter').value)&&(!$('categoryFilter').value||(templates[row.templateKey]?.category||row.category)===$('categoryFilter').value)&&(!$('templateFilter').value||row.templateKey===$('templateFilter').value)&&(! $('searchFilter').value||[row.location,row.id,templateName(row)].join(' ').toLowerCase().includes($('searchFilter').value.toLowerCase())));
  $('reportCount').textContent=`${data.length} laporan diterima server`;
  $('reportList').innerHTML=data.length?'':'<p class="empty-state">Tiada laporan untuk penapis ini. Cuba kosongkan penapis atau pilih bulan lain.</p>';
  data.forEach(row=>{const {ng,items}=totals(row),card=document.createElement('section');card.className='report-card';card.innerHTML=`<div><h2>${esc(row.location||'Lokasi tidak direkodkan')}</h2><p>${esc(labels[templates[row.templateKey]?.category||row.category]||row.category)} · ${esc(templateName(row))}</p><p>${esc(String(row.inspectionDate||'').slice(0,10))} · ${esc(row.id)}</p><span class="report-badge ${ng?'ng':''}">${items.length} item · ${ng} NG</span></div><div class="report-actions"><button type="button">Lihat Laporan</button><button type="button">PDF</button></div>`;const buttons=card.querySelectorAll('button');buttons[0].onclick=()=>preview(row);buttons[1].onclick=()=>{preview(row);download();};$('reportList').append(card);});
 }
 function templateFilters(){const select=$('templateFilter'),value=select.value;select.replaceChildren(new Option('Semua templat',''));Object.entries(templates).filter(([,t])=>!$('categoryFilter').value||t.category===$('categoryFilter').value).forEach(([key,t])=>select.add(new Option(`${templateNames[key]||key} · ${t.referenceNo}`,key)));select.value=value;}
 function preview(row){selected=row;const {items}=totals(row);let previous='';$('previewTitle').textContent=`Laporan · ${row.location}`;$('pdfStatus').textContent='';
  $('reportPreview').innerHTML=`<div class="report-heading"><img src="assets/bc-logo.png" alt="Logo Banjaria Court"><div><h3>BANJARIA COURT | LAPORAN PPM</h3><p>${esc(row.id)}</p></div></div><div class="report-metadata">${esc(labels[row.category]||row.category)} · ${esc(templateName(row))} · ${esc(row.location)}<br>Tarikh: ${esc(String(row.inspectionDate||'').slice(0,10))} · Kekerapan: ${esc(row.frequency)}<br>Pengesahan teknikal: ${esc(row.techDeclaration||'Tidak direkodkan')}</div><div class="preview-table-wrap"><table><thead><tr><th>No.</th><th>Item Pemeriksaan</th><th>Status</th><th>Catatan / Bacaan</th></tr></thead><tbody>${items.map(item=>{const group=item.group!==previous?`<tr class="group-row"><td colspan="4">${esc(item.group)}</td></tr>`:'';previous=item.group;return group+`<tr><td>${esc(item.number)}</td><td>${esc(item.item)}</td><td class="status-cell">${esc(item.status)}</td><td style="white-space:pre-wrap">${esc(item.note)}</td></tr>`;}).join('')}</tbody></table></div><div class="conclusion">${esc(conclusion(row))}</div><h3>Lampiran bukti</h3><div class="evidence-grid">${evidence(row).map((entry,i)=>`<figure><img src="${esc(imageUrl(entry.url))}" alt="Bukti ${i+1}" loading="lazy"><figcaption>${esc(entry.note||entry.name||`Bukti ${i+1}`)} · <a href="${esc(entry.url)}" target="_blank" rel="noopener">Buka asal</a></figcaption></figure>`).join('')||'<p>Tiada gambar dalam rekod ini.</p>'}</div>`;
  if(!$('reportDialog').open)$('reportDialog').showModal();
 }
 async function load(){if(fetching)return;fetching=true;$('refreshReports').disabled=true;$('reportStatus').textContent='Memuatkan rekod server...';try{
  if(!window.REMOTE_BACKEND_URL)throw Error('URL backend belum ditetapkan.');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);let response;try{response=await fetch(`${window.REMOTE_BACKEND_URL}?action=read&type=PPM`,{signal:controller.signal});}finally{clearTimeout(timer);}const result=await response.json();if(!response.ok||!result.success||!Array.isArray(result.rows))throw Error(result.error||'Jawapan server tidak sah.');
  const unique=new Map();result.rows.filter(accepted).sort((a,b)=>String(a.updatedAt||a.submittedAt||'').localeCompare(String(b.updatedAt||b.submittedAt||''))).forEach(row=>unique.set(JSON.stringify([row.templateKey,month(row),String(row.location||'').trim()]),row));
  reports=[...unique.values()].sort((a,b)=>String(b.inspectionDate||b.submittedAt||'').localeCompare(String(a.inspectionDate||a.submittedAt||'')));$('reportStatus').textContent=`Dikemas kini ${new Date().toLocaleString('ms-MY')}. Rekod berdasarkan server; draf tidak disenaraikan. Jika rekod berulang, versi terkini dipaparkan.`;render();const target=new URLSearchParams(location.search).get('id');if(target&&!selected){const row=reports.find(item=>item.id===target);if(row)preview(row);else $('reportStatus').textContent+=' Rekod yang diminta belum ditemui.';}
 }catch(error){$('reportStatus').textContent=`Tidak dapat membaca server: ${error.name==='AbortError'?'Sambungan tamat masa.':error.message} Tekan Muat semula untuk mencuba lagi.`;if(!reports.length)$('reportList').innerHTML='<p class="empty-state">Rekod server belum tersedia. Tiada data contoh dimasukkan.</p>';}finally{fetching=false;$('refreshReports').disabled=false;}}
 async function loadImage(url){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(imageUrl(url),{signal:controller.signal});if(!response.ok)throw Error('Imej tidak tersedia');
   const bytes=new Uint8Array(await response.arrayBuffer());
   const type=bytes[0]===137&&bytes[1]===80?'image/png':bytes[0]===255&&bytes[1]===216?'image/jpeg':bytes[0]===71&&bytes[1]===73?'image/gif':String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':'';
   if(!type)throw Error('Format bukan imej');
   const blob=new Blob([bytes],{type});
   return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>resolve({data:reader.result,width:img.naturalWidth,height:img.naturalHeight});img.onerror=()=>reject(Error('Imej tidak boleh dibaca'));img.src=reader.result;};reader.onerror=reject;reader.readAsDataURL(blob);});
  }finally{clearTimeout(timer);}
 }
 async function buildPdf(row){
  if(!window.jspdf?.jsPDF)throw Error('Pustaka PDF belum dimuatkan. Sila muat semula halaman.');
  const doc=new window.jspdf.jsPDF({orientation:'landscape',unit:'pt',format:'a4'}),W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),M=24,gap=12,col=(W-M*2-gap)/2;
  const {items,ng,ok}=totals(row),logo=await loadImage('assets/bc-logo.png');
  const clean=value=>String(value??'').replace(/[\u2013\u2014]/g,'-').replace(/\u2022/g,'-');
  function header(){doc.addImage(logo.data,'PNG',M,16,65,55);doc.setTextColor('#246b5b');doc.setFont('helvetica','bold');doc.setFontSize(13);doc.text('BANJARIA COURT | LAPORAN PPM',M+78,33);doc.setTextColor('#334155');doc.setFont('helvetica','normal');doc.setFontSize(7);doc.text(doc.splitTextToSize(clean(row.id),W-125),M+78,48);doc.setFillColor('#edf4f1');doc.roundedRect(M,80,W-2*M,35,4,4,'F');doc.setFontSize(8);doc.text(doc.splitTextToSize(clean(`${templateName(row)} | ${row.location} | ${String(row.inspectionDate||'').slice(0,10)} | ${row.frequency||''}`),W-2*M-16),M+8,93);doc.text(`${items.length} item | ${ok} OK | ${ng} NG`,M+8,107);}
  doc.setFont('helvetica','normal');doc.setFontSize(7);
  const conclusionText=clean(conclusion(row)),allLines=doc.splitTextToSize(conclusionText,W-M*2-16),longConclusion=allLines.length>12;
  const lines=longConclusion?doc.splitTextToSize(clean(`KESIMPULAN: ${items.length} item direkodkan; ${ng} item NG. Catatan dan penemuan penuh disertakan dalam lampiran.\nPENGESAHAN: ${row.techDeclaration||'Tidak direkodkan'} | Rekod diterima server; bukan tandatangan digital.`),W-M*2-16):allLines;
  const footHeight=lines.length*8+14,footTop=H-30-footHeight;
  const chunks=[[],[]];let accumulated=0;const target=items.reduce((sum,item)=>sum+item.item.length+item.note.length,0)/2;
  items.forEach(item=>{const index=accumulated<target?0:1;chunks[index].push(item);accumulated+=item.item.length+item.note.length;});
  for(let column=0;column<2;column++){
   doc.setPage(1);let group='';const body=[];chunks[column].forEach(item=>{if(item.group!==group){body.push([{content:clean(item.group),colSpan:4,styles:{fillColor:'#f1eaf7',textColor:'#5b2878',fontStyle:'bold'}}]);group=item.group;}body.push([item.number,clean(item.item),clean(item.status),clean(item.note)]);});
   doc.autoTable({startY:126,margin:{left:M+column*(col+gap),right:W-(M+column*(col+gap)+col),top:126,bottom:H-footTop+8},tableWidth:col,head:[['NO','ITEM PEMERIKSAAN','STATUS','CATATAN / BACAAN']],body,styles:{fontSize:6.7,cellPadding:3,overflow:'linebreak',valign:'top',lineColor:'#d7e1dc',lineWidth:.2},headStyles:{fillColor:'#246b5b',fontSize:6.5},columnStyles:{0:{cellWidth:20},1:{cellWidth:122},2:{cellWidth:36,halign:'center'},3:{cellWidth:col-178}},didParseCell(data){if(data.column.index===2)data.cell.styles.halign='center';if(data.section==='body'&&data.column.index===2&&data.cell.raw==='NG')data.cell.styles.fillColor='#ffe2df';}});
  }
  const mainPages=doc.getNumberOfPages();for(let page=1;page<=mainPages;page++){doc.setPage(page);header();doc.setFillColor('#edf4f1');doc.roundedRect(M,footTop,W-2*M,footHeight,4,4,'F');doc.setTextColor('#20352e');doc.setFont('helvetica','normal');doc.setFontSize(7);doc.text(lines,M+8,footTop+11,{lineHeightFactor:8/7});}
  if(longConclusion){for(let start=0;start<allLines.length;start+=48){doc.addPage();doc.setTextColor('#246b5b');doc.setFontSize(13);doc.text('CATATAN & PENEMUAN PENUH',M,32);doc.setTextColor('#20352e');doc.setFontSize(9);doc.text(allLines.slice(start,start+48),M,55,{lineHeightFactor:1.1});}}
  const failures=[];for(const [i,entry]of evidence(row).entries()){
   doc.addPage();doc.setFontSize(13);doc.setTextColor('#246b5b');doc.text(`LAMPIRAN BUKTI ${i+1}`,M,32);doc.setFontSize(8);doc.setTextColor('#20352e');doc.text(doc.splitTextToSize(clean(entry.note||entry.name||''),W-2*M),M,48);
   try{const image=await loadImage(entry.url),ratio=Math.min((W-2*M)/image.width,(H-120)/image.height),width=image.width*ratio,height=image.height*ratio;doc.addImage(image.data,undefined,(W-width)/2,75,width,height);}catch(_){failures.push(i+1);doc.text('Gambar tidak dapat dimuatkan. Rujuk pautan bukti asal di bawah.',M,85);doc.textWithLink('Buka gambar asal',M,105,{url:entry.url});}
  }
  const pages=doc.getNumberOfPages();for(let page=1;page<=pages;page++){doc.setPage(page);doc.setFontSize(6.5);doc.setTextColor('#64748b');doc.text(clean(templateName(row)),M,H-14);doc.text(`Halaman ${page} / ${pages}`,W-85,H-14);}
  return {doc,failures};
 }
 async function download(){if(!selected)return;const row=selected;$('downloadPdf').disabled=true;$('pdfStatus').textContent='Menjana laporan dan memuatkan bukti...';try{const {doc,failures}=await buildPdf(row);doc.save(`PPM-${String(row.id||'laporan').replace(/[^a-zA-Z0-9_-]/g,'_')}.pdf`);$('pdfStatus').textContent=failures.length?`PDF dijana. Gambar ${failures.join(', ')} tidak dapat dimuatkan; pautan asal disertakan dalam lampiran.`:'PDF berjaya dijana.';}catch(error){$('pdfStatus').textContent=`PDF tidak dapat dijana: ${error.message}`;}finally{$('downloadPdf').disabled=false;}}
 Object.keys(labels).forEach(category=>$('categoryFilter').add(new Option(labels[category],category)));templateFilters();
 ['monthFilter','categoryFilter','templateFilter','searchFilter'].forEach(id=>$(id).addEventListener(id==='searchFilter'?'input':'change',()=>{if(id==='categoryFilter')templateFilters();render();}));
 $('clearFilters').onclick=()=>{['monthFilter','categoryFilter','templateFilter','searchFilter'].forEach(id=>$(id).value='');templateFilters();render();};
 $('refreshReports').onclick=load;$('closePreview').onclick=()=>$('reportDialog').close();$('downloadPdf').onclick=download;
 window.PPMReportBuilder={parseRows,buildPdf};
 load();
})();
