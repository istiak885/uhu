// Replace this with your own VAPID public key (generate at https://tools.reactpwa.com/vapid)
const VAPID_PUBLIC_KEY = "YOUR_VAPID_PUBLIC_KEY_BASE64URL";

function urlBase64ToUint8Array(base64) {
  const pad = '='.repeat((4 - base64.length % 4) % 4);
  const b64 = (base64 + pad).replace(/-/g,'+').replace(/_/g,'/');
  const raw = atob(b64);
  return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)));
}

(async function init(){
  if(!('serviceWorker' in navigator)) return;
  await navigator.serviceWorker.register('./service-worker.js');
  const pill=document.getElementById('notifyPill');
  if(!pill) return;
  if(Notification.permission==='granted'){pill.style.display='none';return;}
  pill.addEventListener('click',async()=>{
    const perm=await Notification.requestPermission();
    if(perm!=='granted'){alert('Notifications blocked. Enable in Settings.');return;}
    const reg=await navigator.serviceWorker.ready;
    const sub=await reg.pushManager.subscribe({
      userVisibleOnly:true,
      applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    console.log('SUBSCRIPTION JSON (save for sender):',JSON.stringify(sub));
    pill.textContent='Reminder enabled ✅';
    setTimeout(()=>pill.style.display='none',2000);
  });
})();
