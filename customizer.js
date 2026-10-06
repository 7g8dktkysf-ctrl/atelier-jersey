const A=window.ATELIER;
const $=id=>document.getElementById(id);
const jersey=$("jersey"), front=$("front"), graphic=$("graphic");
let rotation=0, dragging=false, startX=0, startRot=0, auto=false, qty=1, size="M";
const styleSelect=$("styleSelect"), printSelect=$("printSelect"), patternSelect=$("patternSelect");
A.styles.forEach((x,i)=>styleSelect.add(new Option(x,i)));
A.patterns.forEach((x,i)=>patternSelect.add(new Option(x,i)));
for(let i=0;i<50;i++) printSelect.add(new Option(A.styles[i],i));

A.colours.forEach(c=>{const b=document.createElement("button");b.style.background=c;b.title=c;b.onclick=()=>setPrimary(c);$("colourGrid").appendChild(b)});

function setPrimary(c){front.style.setProperty("--primary",c);document.querySelectorAll(".sleeve").forEach(x=>x.style.background=c)}
$("primary").addEventListener("input",e=>setPrimary(e.target.value));
$("secondary").addEventListener("input",e=>front.style.setProperty("--secondary",e.target.value));

function patternSVG(n){
  const shapes=[
    `<path d="M0 20L100 0M0 45L100 25M0 70L100 50M0 95L100 75" stroke="white" stroke-width="7" opacity=".12"/>`,
    `<path d="M0 0L50 100L100 0" fill="none" stroke="white" stroke-width="5" opacity=".13"/>`,
    `<circle cx="20" cy="20" r="12" fill="white" opacity=".08"/><circle cx="70" cy="65" r="24" fill="none" stroke="white" stroke-width="6" opacity=".08"/>`,
    `<path d="M-10 75 Q25 10 60 75 T130 75" fill="none" stroke="white" stroke-width="12" opacity=".08"/>`,
    `<path d="M0 0L100 100M100 0L0 100" stroke="white" stroke-width="3" opacity=".10"/>`,
    `<path d="M10 0L10 100M35 0L35 100M60 0L60 100M85 0L85 100" stroke="white" stroke-width="8" opacity=".07"/>`,
    `<rect x="8" y="8" width="84" height="84" rx="18" fill="none" stroke="white" stroke-width="8" opacity=".07"/>`,
    `<path d="M0 25H100M0 50H100M0 75H100" stroke="white" stroke-width="8" opacity=".07"/>`
  ];
  const shape=shapes[n%shapes.length], rot=(n*17)%360;
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g transform="rotate(${rot} 50 50)">${shape}</g></svg>`)}")`;
}
function refreshPattern(){const n=+patternSelect.value;front.style.setProperty("--pattern",patternSVG(n))}
patternSelect.addEventListener("change",refreshPattern); styleSelect.addEventListener("change",()=>{$("designNo").textContent=`FORM ${String(+styleSelect.value+1).padStart(2,"0")}`});
refreshPattern();

function updateView(){jersey.style.transform=`rotateY(${rotation}deg)`;$("angleLabel").textContent=(Math.abs(Math.round(rotation))%360<=90||Math.abs(Math.round(rotation))%360>=270)?"FRONT / "+Math.round(rotation%360)+"°":"BACK / "+Math.round(rotation%360)+"°"}
$("stage").addEventListener("pointerdown",e=>{dragging=true;startX=e.clientX;startRot=rotation;$("stage").setPointerCapture(e.pointerId)});
$("stage").addEventListener("pointermove",e=>{if(!dragging)return;rotation=startRot+(e.clientX-startX)*.7;updateView()});
$("stage").addEventListener("pointerup",()=>dragging=false);$("stage").addEventListener("pointercancel",()=>dragging=false);
$("resetView").onclick=()=>{rotation=0;updateView()};
$("autoSpin").onclick=()=>{auto=!auto;$("autoSpin").textContent=auto?"STOP ROTATE":"AUTO ROTATE"};
setInterval(()=>{if(auto){rotation+=.8;updateView()}},30);

$("playerName").addEventListener("input",e=>{$("namePreview").textContent=e.target.value.toUpperCase()||"PLAYER";$("backName").textContent=e.target.value.toUpperCase()||"PLAYER"});
$("playerNumber").addEventListener("input",e=>{let v=String(e.target.value).slice(0,2);$("numberPreview").textContent=v||"07";$("backNumber").textContent=v||"07"});
$("logoFile").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const img=document.createElement("img");img.src=URL.createObjectURL(f);$("logoPreview").replaceChildren(img);$("crest").replaceChildren(img.cloneNode());});

A.sizes.forEach(s=>{const b=document.createElement("button");b.textContent=s;if(s==="M")b.classList.add("selected");b.onclick=()=>{document.querySelectorAll(".size-grid button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");size=s};$("sizes").appendChild(b)});
function price(){const p=1499+(+styleSelect.value*15)+(+patternSelect.value%10)*10;return (p*qty).toLocaleString("en-IN")}
function updatePrice(){$("price").textContent="₹"+price()}
$("minus").onclick=()=>{qty=Math.max(1,qty-1);$("qty").textContent=qty;updatePrice()};
$("plus").onclick=()=>{qty++;$("qty").textContent=qty;updatePrice()};styleSelect.onchange=()=>{ $("designNo").textContent=`FORM ${String(+styleSelect.value+1).padStart(2,"0")}`;updatePrice()};patternSelect.onchange=()=>{refreshPattern();updatePrice()};
$("saveDesign").onclick=()=>{localStorage.setItem("atelierDesign",JSON.stringify({style:styleSelect.value,pattern:patternSelect.value,name:$("playerName").value,number:$("playerNumber").value,size,qty,primary:$("primary").value,secondary:$("secondary").value}));alert("Design saved on this device. Connect the final order button to your backend/payment when ready.")};
const q=new URLSearchParams(location.search);if(q.has("design"))styleSelect.value=Math.max(0,Math.min(49,+q.get("design")-1));updatePrice();
