import {it,expect} from 'vitest';import {readFileSync} from 'node:fs';const tokens=readFileSync('src/tokens.css','utf8');const components=readFileSync('src/components.css','utf8');
it('parses reduced-motion overrides for duration, animation, scroll and press movement',()=>{
 const reduced=[];
 for(const css of [tokens,components]){
  const style=document.createElement('style');style.textContent=css;document.head.append(style);
  for(const rule of style.sheet.cssRules){if((rule.conditionText||rule.media?.mediaText||'').replaceAll(' ','')==='(prefers-reduced-motion:reduce)')for(const child of rule.cssRules)if(child.style)for(let i=0;i<child.style.length;i++){const p=child.style[i];reduced.push([p,child.style.getPropertyValue(p).trim(),child.style.getPropertyPriority(p)]);}}
  style.remove();
 }
 for(const token of ['--duration-fast','--duration-normal','--duration-slow'])expect(reduced).toContainEqual([token,'0ms','']);
 expect(reduced).toContainEqual(['animation','none','important']);
 expect(reduced).toContainEqual(['scroll-behavior','auto','important']);
 expect(reduced).toContainEqual(['transform','none','']);
});
