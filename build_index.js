﻿// build_index.js —— 知识卡站点索引生成器
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
const cards=[];
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
cards.sort(function(a,b){return a.title.localeCompare(b.title,'zh');});

// 1) cards.json
fs.writeFileSync(path.join(__dirname,'cards.json'),JSON.stringify(cards,null,2),'utf8');

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
inject('list.html');
inject('search.html');

console.log('完成！共',cards.length,'张卡片。把整个文件夹上传到 GitHub 即可。');
