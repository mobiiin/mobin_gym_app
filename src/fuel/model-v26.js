(function(g){
 const keys=['calories','protein','carbs','fat','fiber','sugar','sodium','saturatedFat'];
 const labels={calories:'Calories',protein:'Protein',carbs:'Carbs',fat:'Fat',fiber:'Fiber',sugar:'Sugar',sodium:'Sodium',saturatedFat:'Saturated fat'};
 const meals=['Breakfast','Lunch','Dinner','Snack'];
 const known=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v))&&Number(v)>=0;
 const n=v=>known(v)?Number(v):0;
 const round=v=>Math.round(v*1000000)/1000000;
 const norm=v=>String(v||'').trim().toLowerCase();
 function base(entry){if(entry.basis)return structuredClone(entry.basis);return {name:entry.name,baseAmount:1,baseUnit:'serving',description:'logged portion',...Object.fromEntries(keys.map(k=>[k,known(entry[k])?Number(entry[k]):null]))}}
 function validate(food){if(!String(food.name||'').trim())throw Error('Add a food name.');if(!(Number(food.baseAmount)>0)||!Number.isFinite(Number(food.baseAmount)))throw Error('Base serving must be greater than zero.');if(!['serving','g','ml'].includes(food.baseUnit))throw Error('Choose a serving unit.');if(!known(food.calories))throw Error('Enter the calories for the base serving.');for(const k of keys)if(food[k]!==null&&food[k]!==''&&food[k]!==undefined&&!known(food[k]))throw Error('Check '+labels[k]+'.');return food}
 function portion(food,amount){validate(food);if(!(Number(amount)>0)||!Number.isFinite(Number(amount)))throw Error('Portion must be greater than zero.');return Object.fromEntries(keys.map(k=>[k,known(food[k])?round(Number(food[k])*Number(amount)/Number(food.baseAmount)):null]))}
 function entry(food,amount,date,meal,id){return {id,name:food.name,date,meal,amount:Number(amount),basis:structuredClone(food),...portion(food,amount)}}
 function totals(entries){return Object.fromEntries(keys.map(k=>[k,entries.reduce((sum,r)=>sum+n(r[k]),0)]))}
 function strictTotals(entries){const total=totals(entries);return Object.fromEntries(keys.map(k=>[k,entries.every(r=>known(r[k]))?total[k]:null]))}
 function coverage(entries,k){return entries.filter(r=>known(r[k])).length}
 function days(end,count){const d=new Date(end+'T12:00:00'),out=[];for(let i=0;i<count;i++){out.unshift(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'));d.setDate(d.getDate()-1)}return out}
 function shift(date,delta){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+delta);return days(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),1)[0]}
 function recipe(name,ingredients,yieldCount){if(!ingredients.length)throw Error('Add at least one ingredient.');if(!(Number(yieldCount)>0)||!Number.isFinite(Number(yieldCount)))throw Error('Recipe yield must be greater than zero.');const rows=ingredients.map(x=>portion(x.food,x.amount));return validate({name,baseAmount:1,baseUnit:'serving',description:'recipe serving',...Object.fromEntries(keys.map(k=>[k,rows.every(r=>known(r[k]))?round(rows.reduce((sum,r)=>sum+n(r[k]),0)/Number(yieldCount)):null]))})}
 function recent(entries,sort='recent'){const by=new Map();entries.forEach((r,i)=>{const food=base(r);const k=JSON.stringify([norm(food.name),food.baseAmount,food.baseUnit,...keys.map(n=>food[n])]);const old=by.get(k)||{food,count:0,index:0};by.set(k,{food,count:old.count+1,index:i})});return [...by.values()].sort((a,b)=>sort==='frequent'?b.count-a.count||b.index-a.index:b.index-a.index).slice(0,30)}
 const waterML=(amount,unit)=>round(Number(amount)*(unit==='fl oz'?29.5735295625:1));
 g.ForgeFuelModel={keys,labels,meals,known,n,round,norm,base,validate,portion,entry,totals,strictTotals,coverage,days,shift,recipe,recent,waterML};
})(window);
