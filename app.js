// Shared data. Replace/add real product artwork later.
window.ATELIER = {
  sizes:["XS","S","M","L","XL","2XL","3XL","4XL","5XL"],
  colours:["#111111","#242424","#444444","#777777","#b9b9b2","#e9e9e4","#ffffff","#c7c7c1","#8f9698","#28343a","#233b5d","#304d3a","#6b2e2e","#5b4a34","#34364a","#8d8d8d","#1b1b1b","#d0d0cc","#555555","#fafaf7"],
  styles:Array.from({length:50},(_,i)=>`Jersey Print ${String(i+1).padStart(2,"0")}`),
  patterns:Array.from({length:100},(_,i)=>`Pattern ${String(i+1).padStart(3,"0")}`),
  palette:["#111111","#f0f0ec","#9a9a94","#60615e","#b7b7b0","#d9d9d4","#343a3c","#73746e","#252c35","#4b4b49"]
};
