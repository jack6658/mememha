﻿﻿﻿﻿﻿﻿﻿// build_index.js —— 知识卡站点索引生成器
// 用法：把知识卡 HTML 放进 ./cards/ 文件夹，然后在命令行运行：
//   node build_index.js
// 它会：
//   1. 扫描 cards/ 里所有 .html 文件
//   2. 提取标题(h1)、页面标题(title)、章节徽章(badges)、标签(tags)、卡片数、文件大小
//   3. 生成 cards.json（索引存档）
//   4. 自动更新 index.html 和 search.html 里内嵌的卡片数据（无需手改）
// 之后每添加一张新卡，把文件放进 cards/ 再跑一次本脚本即可。

const fs=require('fs');
const path=require('path');

const dir=path.join(__dirname,'cards');
const files=fs.readdirSync(dir).filter(function(f){return f.toLowerCase().endsWith('.html');});
var cards=[];
for(const f of files){
  const p=path.join(dir,f);
  const s=fs.readFileSync(p,'utf8');
  const title=((s.match(/<title>([^<]*)<\/title>/)||[])[1]||f).trim();
  const h1raw=((s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||'');
  const h1=h1raw.replace(/<[^>]+>/g,'').trim();
  const badges=[];
  const bm=[...s.matchAll(/class="sec-badge">([^<]*)<\/span>/g)];
  bm.forEach(function(m){badges.push(m[1].trim());});
  const tags=[];
  const tm=[...s.matchAll(/class="tag">([^<]*)<\/span>/g)];
  tm.forEach(function(m){tags.push(m[1].trim());});
  const cardCount=(s.match(/<article class="card/g)||[]).length;
  const size=fs.statSync(p).size;
  cards.push({file:f,title:title,h1:h1,badges:[...new Set(badges)].slice(0,8),tags:[...new Set(tags)].slice(0,8),cards:cardCount,size:size});
}

// 新卡（不在旧 cards.json 中的）放数组最前面，旧卡保持原序
var oldOrder=[];var oldCardMap={};
try{var oldCards=JSON.parse(fs.readFileSync(path.join(__dirname,'cards.json'),'utf8'));
oldOrder=oldCards.map(function(c){return c.file;});
oldCards.forEach(function(c){oldCardMap[c.file]=c;});}catch(e){}
var newCards=[],oldCardsList=[];
cards.forEach(function(c){
  if(oldOrder.indexOf(c.file)>=0){oldCardsList.push(c);}
  else{newCards.push(c);}
});
oldCardsList.sort(function(a,b){return oldOrder.indexOf(a.file)-oldOrder.indexOf(b.file);});
cards=newCards.concat(oldCardsList);

// 读取旧 cards.json 保留已有 ID（新卡片分配 6 位随机不重复 ID）
var oldIdMap={};
try{var oldCards=JSON.parse(fs.readFileSync(path.join(__dirname,'cards.json'),'utf8'));
oldCards.forEach(function(c){if(c.id)oldIdMap[c.file]=c.id;});}catch(e){}
var usedSet=new Set(Object.values(oldIdMap));
cards.forEach(function(c){
  if(oldIdMap[c.file]){c.id=oldIdMap[c.file];}
  else{
    var id;
    do{id=100000+Math.floor(Math.random()*900000);}while(usedSet.has(id));
    usedSet.add(id);c.id=id;
  }
});

// 1) cards.json
fs.writeFileSync(path.join(__dirname,'cards.json'),JSON.stringify(cards,null,2),'utf8');
// 3) 生成 ID 对照表 TXT 到工作区
var idDir='C:\\Users\\Administrator\\nhnh nhnh\\ID密钥';
try{fs.mkdirSync(idDir,{recursive:true});}catch(e){}
var lines=['ID            卡片名称（文件名）','─'.repeat(50)];
cards.forEach(function(c){
  var name=String(c.file).replace(/\.html$/i,'').replace(/_/g,'').replace(/(知识卡片|知识卡)$/,'');
  if(!name)name=c.h1||c.title||c.file;
  var idStr=String(c.id).padEnd(6)+'  ';
  lines.push(idStr+name);
});
fs.writeFileSync(path.join(idDir,'卡片ID对照表.txt'),'\ufeff'+lines.join('\r\n'),'utf8');
console.log('ID 对照表已写入:',path.join(idDir,'卡片ID对照表.txt'));

// 2) update index.html & search.html embedded data
function inject(htmlFile){
  let h=fs.readFileSync(path.join(__dirname,htmlFile),'utf8');
  const marker='window.CARDS=';
  const start=h.indexOf(marker);
  if(start<0){console.log('跳过（未找到数据标记）:',htmlFile);return;}
  const end=h.indexOf(';',start);
  const data=JSON.stringify(cards);
  h=h.slice(0,start+marker.length)+data+h.slice(end);
  fs.writeFileSync(path.join(__dirname,htmlFile),'\ufeff'+h,'utf8');
  console.log('已更新:',htmlFile,'卡片数:',cards.length);
}
inject('search.html');

console.log('完成！共',cards.length,'张卡片。把整个文件夹上传到 GitHub 即可。');
