// Affirmations are original messages inspired by positive self-affirmation resources.
const AFFIRMATIONS=[
'I can make progress at a pace that works for me.',
'Every time I show up, I strengthen a promise to myself.',
'I am building habits that support the life I want.',
'My effort matters, even when progress feels quiet.',
'I can begin again whenever I need to.',
'I am learning to trust the work I put in.',
'Consistency is something I practice, not something I have to perfect.',
'I deserve care on rest days as much as training days.',
'I can be ambitious and patient with myself.',
'My worth is not a number on a scale.',
'I am allowed to grow at my own pace.',
'I can choose one helpful action today.',
'I am stronger than the doubts that visit me.',
'Each small choice is a chance to support myself.',
'I can listen to my body and still pursue my goals.',
'What I practice today can become my strength tomorrow.',
'I am capable of learning from every workout.',
'I do not need a perfect day to make progress.',
'My goals are worth pursuing with kindness and patience.',
'I can celebrate effort as well as outcomes.',
'I am building a relationship with movement that lasts.',
'I have permission to rest, recover, and return.',
'One missed day does not erase my progress.',
'I can adjust my plan and keep moving forward.',
'My body deserves respect at every stage.',
'I am becoming more resilient through steady practice.',
'I can focus on what is within my control today.',
'Progress can be quiet and still be meaningful.',
'I choose to speak to myself like someone I care about.',
'I can meet a challenge without judging myself.',
'My health is a journey, not a race.',
'I am proud of the effort it takes to begin.',
'I can build strength one session at a time.',
'I trust myself to make thoughtful choices.',
'I can adapt when life changes my plans.',
'My commitment is more important than a perfect streak.',
'I am allowed to enjoy the process of getting stronger.',
'I can pursue my goals while respecting my limits.',
'Every rep is an opportunity to practice patience.',
'I bring curiosity and care to my training.',
'I am more than my performance on any one day.',
'I can acknowledge how far I have come.',
'I am capable of doing hard things and asking for support.',
'I choose progress that is sustainable for me.',
'My future is shaped by the habits I practice today.',
'I can take the next step without knowing every step.',
'I am worth the time I invest in my well-being.',
'It is okay to slow down and keep going.',
'I can make room for strength, recovery, and joy.',
'I can treat a setback as information, not failure.',
'I am allowed to choose a goal that feels right for me.',
'I can find momentum in small beginnings.',
'What matters is returning to the things I value.',
'I can give myself the same encouragement I give others.',
'My effort today is enough to build on tomorrow.',
'I am becoming someone who keeps showing up for myself.',
'I can make space for both discipline and flexibility.',
'My progress belongs to me; I do not need to compare it.',
'I am learning, adapting, and getting stronger.',
'I can be proud of myself while still working toward more.'
];
let affirmation='',affirmationAuthor='',affirmationSource='',quoteBank=[];
function parseQuotes(text){return text.split(/\r?\n/).filter(line=>line.trim()&&!line.trim().startsWith('#')).flatMap(line=>{try{let q=JSON.parse(line);return typeof q.text==='string'&&q.text.trim()&&typeof q.author==='string'?[{text:q.text.trim(),author:q.author,source:typeof q.source==='string'&&/^https:\/\//.test(q.source)?q.source:''}]:[]}catch{return []}})}
function chooseAffirmation(){let list=quoteBank.length?quoteBank:AFFIRMATIONS.map(text=>({text,author:'FORGE',source:''}));let last='';try{last=localStorage.getItem('forge-last-quote-v2')||''}catch{}let candidates=list.length>1?list.filter(q=>q.text!==last):list;if(!candidates.length)candidates=list;let q=candidates[Math.floor(Math.random()*candidates.length)];affirmation=q.text;affirmationAuthor=q.author;affirmationSource=q.source;try{localStorage.setItem('forge-last-quote-v2',affirmation)}catch{}}
chooseAffirmation();
fetch('./quotes.txt').then(r=>{if(!r.ok)throw Error('Quote bank unavailable');return r.text()}).then(text=>{let parsed=parseQuotes(text);if(parsed.length){quoteBank=parsed;chooseAffirmation();if(page==='home')render()}}).catch(()=>{});
let previewGoals=null;
const KG_PER_LB=0.45359237, CM_PER_IN=2.54;
function calculateNutrition(p){
 let age=Number(p.age),h=Number(p.height)*(p.heightUnit==='in'?CM_PER_IN:1),w=Number(p.weight)*(p.weightUnit==='lb'?KG_PER_LB:1),activity=Number(p.activity),type=p.sex,mode=p.mode;
 if(!Number.isFinite(age)||age<18||age>100)return {error:'This calculator is for adults ages 18–100. Enter a valid age.'};
 if(!['male','female'].includes(type))return {error:'Select the sex coefficient used by the equation.'};
 if(!Number.isFinite(h)||h<120||h>230||!Number.isFinite(w)||w<35||w>300)return {error:'Check your height and weight and their units.'};
 if(![1.2,1.375,1.55,1.725,1.9].includes(activity))return {error:'Choose an activity level.'};
 if(!['maintain','lose','gain'].includes(mode))return {error:'Choose a goal.'};
 if(p.situation!=='none')return {error:'This general calculator is not suitable during pregnancy or breastfeeding. Ask a clinician or registered dietitian for an individualized target.'};
 let bmr=10*w+6.25*h-5*age+(type==='male'?5:-161),maintenance=bmr*activity,delta=0,changeKg=0,weekly=0,weeks=0,targetKg=w;
 if(mode!=='maintain'){
  let raw=Number(p.targetWeight);weeks=Number(p.weeks);targetKg=raw*(p.weightUnit==='lb'?KG_PER_LB:1);
  if(!p.targetWeight||!Number.isFinite(targetKg)||targetKg<35||targetKg>300||!p.weeks||!Number.isFinite(weeks)||weeks<1||weeks>104)return {error:'Enter a valid target weight and a timeline between 1 and 104 weeks.'};
  changeKg=targetKg-w;if(mode==='lose'&&changeKg>=0)return {error:'For a fat-loss goal, the target weight must be lower than your current weight.'};
  if(mode==='gain'&&changeKg<=0)return {error:'For a muscle-gain goal, the target weight must be higher than your current weight.'};
  if(mode==='lose'&&targetKg/((h/100)**2)<18.5)return {error:'The target weight is below the standard adult healthy BMI range. Discuss an individualized goal with a clinician or registered dietitian.'};
  weekly=Math.abs(changeKg)/weeks;
  if(weekly/w>0.01)return {error:`That timeline requires changing more than 1% of your current weight per week. Choose a longer timeline for a more gradual starting plan.`};
  delta=changeKg*7700/(weeks*7);
 }
 let target=maintenance+delta;
 // Conservative automatic-calculation guardrails, not a personalized safety guarantee.
 let floor=type==='male'?1500:1200;
 if(!Number.isFinite(target)||target<floor)return {error:`That combination produces less than ${floor.toLocaleString()} kcal/day. Choose a less aggressive goal or discuss it with a registered dietitian.`};
 let proteinChoice=p.proteinSetting||'auto',fatPercent=Number(p.fatPercent||30);if(!['auto','1.6','1.8','2.0','2.2'].includes(proteinChoice)||![25,30,35].includes(fatPercent))return {error:'Choose a valid protein target and fat balance.'};
 let proteinPerKg=proteinChoice==='auto'?(mode==='lose'?2.2:mode==='gain'?2.0:1.8):Number(proteinChoice);
 let calories=Math.round(target),protein=Math.round(w*proteinPerKg),fat=Math.max(Math.round(calories*fatPercent/100/9),Math.ceil(w*.6)),carbs=Math.round((calories-protein*4-fat*9)/4);
 if(carbs<130)return {error:'These calories do not leave enough room for at least 130 g of carbohydrates after the selected protein and fat targets. Choose a less aggressive goal or a different macro setting, or discuss an individual plan with a dietitian.'};
 let warnings=[];if(mode==='gain'&&(weekly/w>.005||delta/maintenance>.15))warnings.push('This is a relatively fast bulk or large estimated surplus. A slower gain can limit unnecessary fat gain, especially if you are already experienced.');
 if(mode==='lose'&&(weekly/w>.0075||-delta/maintenance>.25))warnings.push('This is a relatively aggressive cut. A slower loss and continued resistance training may better support muscle retention, especially if you are already lean.');
 if(w/((h/100)**2)>=30)warnings.push('Protein is calculated from current body weight; this may overestimate an appropriate target for some people with a high body-fat level. A dietitian can individualize it.');
 if(protein*4/calories>.35)warnings.push('Protein makes up more than 35% of the estimated calories. Consider a lower protein setting or a less aggressive calorie target if this is impractical.');
 if(carbs/w<2)warnings.push('Carbohydrates are below 2 g/kg. You may prefer more carbs to support training; a lower fat setting or higher calorie target can increase them.');
 return {calories,protein,fat,carbs,proteinPerKg,fatPercent,warnings,bmr:Math.round(bmr),maintenance:Math.round(maintenance),adjustment:Math.round(delta),weeklyKg:weekly,weightKg:w,targetKg,weeks,mode,weightUnit:p.weightUnit,activity};
}
// Scroll-snap wheels: keyboard and +/− controls provide alternatives to touch.
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const roundStep=(n,step)=>Math.round(n/step)*step;
function sequence(min,max,step=1){let n=Math.round((max-min)/step);return Array.from({length:n+1},(_,i)=>Number((min+i*step).toFixed(2)))}
function wheelFormat(kind,n){if(kind==='change'){if(n>0)return `+${n}`;if(n<0)return `−${Math.abs(n)}`;return '0'}return String(n)}
function wheelMarkup(kind,label,values,selected,unit=''){let index=clamp(values.findIndex(v=>v===selected),0,values.length-1);return `<div class="wheel-control"><div class="wheel-label">${esc(label)}${unit?` <span>${esc(unit)}</span>`:''}</div><div class="wheel-row"><button type="button" class="wheel-step" data-wheel-adjust="${kind}" data-step="-1" aria-label="Decrease ${esc(label)}">−</button><div class="wheel-frame"><div class="wheel-band"></div><div class="wheel-scroll" data-wheel="${kind}" role="spinbutton" tabindex="0" aria-label="${esc(label)}" aria-valuemin="${values[0]}" aria-valuemax="${values[values.length-1]}" aria-valuenow="${values[index]}" aria-valuetext="${esc(wheelFormat(kind,values[index])+' '+unit)}"><div class="wheel-spacer"></div>${values.map((v,i)=>`<div class="wheel-item ${i===index?'selected':''} ${kind==='change'?(v>0?'gain':v<0?'loss':''):''}" data-index="${i}">${wheelFormat(kind,v)}</div>`).join('')}<div class="wheel-spacer"></div></div></div><button type="button" class="wheel-step" data-wheel-adjust="${kind}" data-step="1" aria-label="Increase ${esc(label)}">＋</button></div></div>`}
function nutritionProfileForm(){
 let p=state.profile||{},age=clamp(Math.round(Number(p.age)||25),18,100),heightUnit=p.heightUnit==='cm'?'cm':'in',storedHeight=Number(p.height)||(heightUnit==='cm'?173:68),weightUnit=p.weightUnit==='kg'?'kg':'lb',weightDefault=weightUnit==='kg'?82:180,weight=clamp(roundStep(Number(p.weight)||weightDefault,.5),weightUnit==='kg'?35:70,weightUnit==='kg'?300:660),target=Number(p.targetWeight),change=p.mode==='maintain'?0:Number.isFinite(target)&&target>0?roundStep(target-weight,.5):0;
 change=clamp(change,weightUnit==='kg'?-100:-200,weightUnit==='kg'?100:200);let weeks=clamp(Math.round(Number(p.weeks)||16),1,104);
 let inches=Math.round(heightUnit==='cm'?storedHeight/CM_PER_IN:storedHeight),feet=clamp(Math.floor(inches/12),3,7),inch=clamp(inches-feet*12,0,11),cm=clamp(Math.round(heightUnit==='cm'?storedHeight:storedHeight*CM_PER_IN),120,230);
 let hvalue=heightUnit==='cm'?cm:feet*12+inch;let mode=change>0?'gain':change<0?'lose':'maintain';
 return `<div class="card nutrition-card"><div class="eyebrow">YOUR PERSONAL ESTIMATE</div><h3>Calorie & macro planner</h3><p class="help">Scroll the wheels or use the +/− buttons. Starting values are placeholders; adjust them to your measurements. Review the estimate before applying it.</p><form id="nutrition-profile"><input type="hidden" name="age" value="${age}"><input type="hidden" name="height" value="${hvalue}"><input type="hidden" name="heightUnit" value="${heightUnit}"><input type="hidden" name="weight" value="${weight}"><input type="hidden" name="targetWeight" value="${weight+change}"><input type="hidden" name="goalChange" value="${change}"><input type="hidden" name="weeks" value="${weeks}"><input type="hidden" name="mode" value="${mode}"><div class="wheel-card"><div class="wheel-title">Your age</div><div id="wheel-age">${wheelMarkup('age','Age',sequence(18,100),age,'years')}</div></div><label class="field">Sex used in equation<select name="sex" required><option value="">Choose</option><option value="male" ${p.sex==='male'?'selected':''}>Male equation</option><option value="female" ${p.sex==='female'?'selected':''}>Female equation</option></select></label><p class="help">The equation uses male/female coefficients. This is not a gender identity field; if unsure which is appropriate, discuss it with a clinician.</p><div class="wheel-card"><div class="row"><div class="wheel-title">Your height</div><label class="compact-select"><span class="sr-only">Height unit</span><select name="heightDisplay"><option value="ftin" ${heightUnit==='in'?'selected':''}>ft / in</option><option value="cm" ${heightUnit==='cm'?'selected':''}>cm</option></select></label></div><div id="height-wheels" class="height-wheels">${heightUnit==='cm'?wheelMarkup('cm','Centimeters',sequence(120,230),cm,'cm'):wheelMarkup('feet','Feet',sequence(3,7),feet,'ft')+wheelMarkup('inches','Inches',sequence(0,11),inch,'in')}</div></div><div class="wheel-card"><div class="row"><div class="wheel-title">Current weight</div><label class="compact-select"><span class="sr-only">Weight unit</span><select name="weightUnit"><option value="lb" ${weightUnit==='lb'?'selected':''}>lb</option><option value="kg" ${weightUnit==='kg'?'selected':''}>kg</option></select></label></div><div id="wheel-weight">${wheelMarkup('weight','Current weight',weightUnit==='kg'?sequence(35,300,.5):sequence(70,660,.5),weight,weightUnit)}</div><p class="help">Wheel values are rounded to the nearest half unit.</p></div><label class="field">Overall activity<select name="activity" required><option value="">Choose your typical activity</option>${[['1.2','Mostly sedentary: little planned exercise'],['1.375','Light: some movement or 1–3 training days'],['1.55','Moderate: active lifestyle or 3–5 training days'],['1.725','High: physically active most days'],['1.9','Very high: demanding training and active work']].map(([v,l])=>`<option value="${v}" ${String(p.activity)===v?'selected':''}>${l}</option>`).join('')}</select></label><p class="help">Choose based on your whole day, including training. The estimate already includes that activity.</p><div class="wheel-card"><div class="wheel-title">Weight goal</div><div class="goal-readout ${change>0?'gain':change<0?'loss':''}" id="goal-readout">${wheelFormat('change',change)} ${weightUnit}</div><div id="goal-caption" class="help">${change>0?'Gain / bulk':change<0?'Lose / cut':'Maintain current weight'} · Target ${(weight+change).toFixed(1)} ${weightUnit}</div><div id="wheel-change">${wheelMarkup('change','Weight change',weightUnit==='kg'?sequence(-100,100,.5):sequence(-200,200,.5),change,weightUnit)}</div><p class="help">Move below zero to lose weight or above zero to gain. This is total body-weight change, not a prediction of muscle or fat change.</p></div><div class="wheel-card"><div class="wheel-title">Your timeframe</div><div id="wheel-weeks">${wheelMarkup('weeks','Timeframe',sequence(1,104),weeks,'weeks')}</div><p class="help">Used for gain or loss; ignored for maintenance.</p></div><div class="wheel-card"><div class="wheel-title">Macro preferences</div><label class="field">Protein target<select name="proteinSetting"><option value="auto" ${!p.proteinSetting||p.proteinSetting==='auto'?'selected':''}>Automatic: 2.0 g/kg bulk, 2.2 cut, 1.8 maintain</option>${[['1.6','1.6 g/kg · Moderate'],['1.8','1.8 g/kg · Higher'],['2.0','2.0 g/kg · High'],['2.2','2.2 g/kg · Higher-protein']].map(([v,label])=>`<option value="${v}" ${p.proteinSetting===v?'selected':''}>${label}</option>`).join('')}</select></label><label class="field">Carb and fat balance<select name="fatPercent"><option value="25" ${String(p.fatPercent)==='25'?'selected':''}>More carbs · fat 25% of calories</option><option value="30" ${!p.fatPercent||String(p.fatPercent)==='30'?'selected':''}>Balanced · fat 30% of calories</option><option value="35" ${String(p.fatPercent)==='35'?'selected':''}>More fat, fewer carbs · fat 35%</option></select></label><p class="help">Protein is set by body weight, not calorie percentage. Carbs fill remaining calories and can be useful for training. Dietary fat has a 0.6 g/kg minimum. These are starting options, not guarantees.</p></div><label class="field">Pregnancy or breastfeeding<select name="situation" required><option value="">Choose</option><option value="none" ${p.situation==='none'?'selected':''}>Neither</option><option value="pregnant" ${p.situation==='pregnant'?'selected':''}>Pregnant</option><option value="breastfeeding" ${p.situation==='breastfeeding'?'selected':''}>Breastfeeding</option><option value="unsure" ${p.situation==='unsure'?'selected':''}>Prefer individual advice</option></select></label><p class="help">This general adult estimate may not be appropriate for kidney disease, other medical conditions, eating-disorder history, or hormone treatment. A registered dietitian can help personalize it.</p><button class="primary">Calculate my estimate</button></form><div id="nutrition-result"></div></div>`
}
function initProfileWheels(form){
 const wheelData={age:sequence(18,100),feet:sequence(3,7),inches:sequence(0,11),cm:sequence(120,230),weeks:sequence(1,104)};
 let weightUnit=form.elements.weightUnit.value,heightDisplay=form.elements.heightDisplay.value,oldHeight=Number(form.elements.height.value),roundedInches=Math.round(heightDisplay==='cm'?oldHeight/CM_PER_IN:oldHeight),feet=clamp(Math.floor(roundedInches/12),3,7),inch=clamp(roundedInches-feet*12,0,11),centimeters=heightDisplay==='cm'?Math.round(oldHeight):Math.round(oldHeight*CM_PER_IN);
 let vals={age:Number(form.elements.age.value),feet,inches:inch,cm:centimeters,weight:Number(form.elements.weight.value),change:Number(form.elements.goalChange.value),weeks:Number(form.elements.weeks.value)};
 function ranges(){wheelData.weight=weightUnit==='kg'?sequence(35,300,.5):sequence(70,660,.5);wheelData.change=weightUnit==='kg'?sequence(-100,100,.5):sequence(-200,200,.5)}ranges();
 function invalidate(){previewGoals=null;let result=$('#nutrition-result');if(result)result.innerHTML=''}
 function sync(){form.elements.age.value=vals.age;form.elements.height.value=heightDisplay==='cm'?vals.cm:vals.feet*12+vals.inches;form.elements.heightUnit.value=heightDisplay==='cm'?'cm':'in';form.elements.weight.value=vals.weight;form.elements.goalChange.value=vals.change;form.elements.mode.value=vals.change>0?'gain':vals.change<0?'lose':'maintain';form.elements.targetWeight.value=Number((vals.weight+vals.change).toFixed(2));form.elements.weeks.value=vals.weeks;let show=$('#goal-readout'),caption=$('#goal-caption');show.className='goal-readout '+(vals.change>0?'gain':vals.change<0?'loss':'');show.textContent=`${wheelFormat('change',vals.change)} ${weightUnit}`;caption.textContent=`${vals.change>0?'Gain / bulk':vals.change<0?'Lose / cut':'Maintain current weight'} · Target ${(vals.weight+vals.change).toFixed(1)} ${weightUnit}`}
 function update(kind,value,clear=true){if(!wheelData[kind])return;vals[kind]=value;let wheel=form.querySelector(`[data-wheel="${kind}"]`);if(wheel){wheel.setAttribute('aria-valuenow',String(value));wheel.setAttribute('aria-valuetext',wheelFormat(kind,value));wheel.querySelectorAll('.wheel-item.selected').forEach(x=>x.classList.remove('selected'));let index=wheelData[kind].indexOf(value);wheel.querySelector(`[data-index="${index}"]`)?.classList.add('selected')}sync();if(clear)invalidate()}
 function bindWheel(kind){let wheel=form.querySelector(`[data-wheel="${kind}"]`);if(!wheel)return;let values=wheelData[kind],index=values.indexOf(vals[kind]);if(index<0){index=0;vals[kind]=values[0]}wheel.scrollTop=index*44;let raf=0;wheel.addEventListener('scroll',()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(!wheel.isConnected||form.querySelector(`[data-wheel="${kind}"]`)!==wheel)return;let i=clamp(Math.round(wheel.scrollTop/44),0,values.length-1);update(kind,values[i])})},{passive:true});wheel.addEventListener('click',e=>{let item=e.target.closest('[data-index]');if(item){let i=Number(item.dataset.index);wheel.scrollTo({top:i*44,behavior:'smooth'});update(kind,values[i])}});wheel.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();let current=values.indexOf(vals[kind]),i=e.key==='Home'?0:e.key==='End'?values.length-1:clamp(current+(e.key==='ArrowDown'?1:-1),0,values.length-1);wheel.scrollTo({top:i*44,behavior:'smooth'});update(kind,values[i])});update(kind,vals[kind],false)}
 function rebuild(kind,holder,label,unit){let target=form.querySelector(holder);target.innerHTML=wheelMarkup(kind,label,wheelData[kind],vals[kind],unit);bindWheel(kind)}
 ['age','feet','inches','cm','weight','change','weeks'].forEach(bindWheel);sync();
 form.addEventListener('click',e=>{let b=e.target.closest('[data-wheel-adjust]');if(!b)return;let kind=b.dataset.wheelAdjust,values=wheelData[kind],wheel=form.querySelector(`[data-wheel="${kind}"]`);if(!values||!wheel)return;let index=clamp(values.indexOf(vals[kind])+Number(b.dataset.step),0,values.length-1);wheel.scrollTo({top:index*44,behavior:'smooth'});update(kind,values[index])});
 form.addEventListener('change',e=>{if(e.target.name==='heightDisplay'){let cm=heightDisplay==='cm'?vals.cm:(vals.feet*12+vals.inches)*CM_PER_IN;heightDisplay=e.target.value;let holder=form.querySelector('#height-wheels');if(heightDisplay==='cm'){vals.cm=clamp(Math.round(cm),120,230);holder.innerHTML=wheelMarkup('cm','Centimeters',wheelData.cm,vals.cm,'cm');bindWheel('cm')}else{let inches=Math.round(cm/CM_PER_IN);vals.feet=clamp(Math.floor(inches/12),3,7);vals.inches=clamp(inches-vals.feet*12,0,11);holder.innerHTML=wheelMarkup('feet','Feet',wheelData.feet,vals.feet,'ft')+wheelMarkup('inches','Inches',wheelData.inches,vals.inches,'in');bindWheel('feet');bindWheel('inches')}sync();invalidate()}else if(e.target.name==='weightUnit'){let factor=weightUnit==='lb'?KG_PER_LB:1/KG_PER_LB;weightUnit=e.target.value;ranges();vals.weight=clamp(roundStep(vals.weight*factor,.5),wheelData.weight[0],wheelData.weight[wheelData.weight.length-1]);vals.change=clamp(roundStep(vals.change*factor,.5),wheelData.change[0],wheelData.change[wheelData.change.length-1]);rebuild('weight','#wheel-weight','Current weight',weightUnit);rebuild('change','#wheel-change','Weight change',weightUnit);sync();invalidate()}else invalidate()});
}

function nutritionResult(r){
 let label=r.adjustment<0?'Estimated daily deficit':r.adjustment>0?'Estimated daily surplus':'Daily adjustment',change=r.adjustment===0?'Maintenance':`${Math.abs(r.adjustment)} kcal/day`;
 let pace=r.mode==='maintain'?'':`<div class="estimate-line"><span>Requested average change</span><strong>${(r.weightUnit==='lb'?r.weeklyKg/KG_PER_LB:r.weeklyKg).toFixed(2)} ${r.weightUnit}/week · ${(r.weeklyKg/r.weightKg*100).toFixed(2)}%</strong></div>`;
 let warnings=r.warnings.length?`<div class="estimate-warning"><strong>Consider before applying</strong>${r.warnings.map(w=>`<p>${esc(w)}</p>`).join('')}</div>`:'';
 return `<div class="estimate"><div class="eyebrow">YOUR MUSCLE-FOCUSED STARTING ESTIMATE</div><div class="estimate-big">${r.calories.toLocaleString()} <small>kcal/day</small></div><div class="estimate-line"><span>Resting energy estimate</span><strong>${r.bmr.toLocaleString()} kcal/day</strong></div><div class="estimate-line"><span>Estimated maintenance</span><strong>${r.maintenance.toLocaleString()} kcal/day</strong></div><div class="estimate-line"><span>${label}</span><strong>${change}</strong></div>${pace}<div class="macrogrid"><div><div class="label">PROTEIN</div><strong>${r.protein}g</strong><div class="label">${r.proteinPerKg.toFixed(1)} g/kg</div></div><div><div class="label">CARBS</div><strong>${r.carbs}g</strong><div class="label">${(r.carbs/r.weightKg).toFixed(1)} g/kg</div></div><div><div class="label">FAT</div><strong>${r.fat}g</strong><div class="label">${Math.round(r.fat*9/r.calories*100)}% calories</div></div></div><p class="help">Protein uses ${r.proteinPerKg.toFixed(1)} g/kg of current body weight; fat starts at ${r.fatPercent}% of calories with a 0.6 g/kg minimum; carbohydrates use the remaining calories. You can choose a different protein or fat setting above and calculate again.</p><p class="help">Protein and progressive resistance training support muscle gain or retention. Spreading protein over several meals can help you reach the daily goal; no calculator can guarantee how much weight change is muscle versus fat.</p>${warnings}<p class="help">Starting estimates, not an exact prediction. The timeline uses a simple 7,700 kcal/kg approximation, including for gains; actual energy needs and changes in muscle, fat, glycogen, and water vary. Review your weight trend over several weeks and adjust as needed.</p><p class="help">Research: <a href="https://pubmed.ncbi.nlm.nih.gov/28698222/" target="_blank" rel="noopener">protein and resistance training</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/26817506/" target="_blank" rel="noopener">protein during a deficit</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/37914977/" target="_blank" rel="noopener">surplus size and training</a></p><button type="button" class="primary" data-apply-estimate="1">Apply these daily targets</button></div>`;
}
let settingsStateReference=null,settingsStorageVersion=0;
render=function(){
 const home=page==='home', fuel=page==='food', overview=page==='training'&&trainingTab==='overview', details=page==='training'&&['analysis','history'].includes(trainingTab), plan=page==='training'&&['routine','library'].includes(trainingTab), settings=page==='settings';
 $('#content').hidden=home||fuel||overview||details||plan||settings;
 $('#today-root').hidden=!home;
 $('#fuel-root').hidden=!fuel;
 $('#training-root').hidden=!overview;
 $('#training-detail-root').hidden=!details;
 $('#training-plan-root').hidden=!plan;
 $('#settings-root').hidden=!settings;
 ForgeNavigation.render(page);
 if(home||fuel||overview||details||plan||settings) $('#content').innerHTML='';
 if(home) ForgeToday.render({state, date:today(), affirmation, affirmationAuthor, affirmationSource});
 else if(fuel) ForgeFuel.render({foods:state.foods});
 else if(overview){ensureExtraState();ForgeTraining.render({state,cutoff:dateDaysAgo(6),date:today(),timer:timerText()})}
 else if(details){ensureExtraState();ForgeTrainingDetails.render({tab:trainingTab,state,muscles:MUSCLES,muscle:analysisMuscle,selected:selectedExercise,cutoff:dateDaysAgo(6),date:today(),muscleFor:setMuscle})}
 else if(plan){ensureExtraState();let results=libraryMatches();if(libraryPage*30>=results.length&&libraryPage)libraryPage=0;ForgeTrainingPlan.render({tab:trainingTab,state,expanded:expandedRoutineDay,all:libraryAll(),results,query:libraryQuery,region:libraryRegion,muscle:libraryMuscle,equipment:libraryEquipment,page:libraryPage,muscles:MUSCLES,regions:REGIONS,catalogCount:catalog.length,catalogError,photos:exercisePhotos})}
 else if(settings){
  if(settingsStateReference!==state){settingsStateReference=state;settingsStorageVersion++}
  ForgeSettings.render({state,storageVersion:settingsStorageVersion,calculate:calculateNutrition,onProfile:p=>{state.profile=p;save()},onApply:r=>{state.goals={calories:r.calories,protein:r.protein,carbs:r.carbs,fat:r.fat};save();alert('Daily calorie and macro targets updated.')},onGoals:g=>{for(let k of ['calories','protein','carbs','fat'])state.goals[k]=num(g[k]);save();alert('Targets saved.') }});
 }
};
document.addEventListener('submit',e=>{if(e.target.id!=='nutrition-profile')return;e.preventDefault();let profile=Object.fromEntries(new FormData(e.target));state.profile=profile;save();let r=calculateNutrition(profile),box=$('#nutrition-result');if(r.error){previewGoals=null;box.innerHTML=`<div class="estimate-warning"><strong>Let’s adjust the plan.</strong><p>${esc(r.error)}</p><p>Review your inputs or talk with a registered dietitian for a tailored plan.</p></div>`;return}previewGoals=r;box.innerHTML=nutritionResult(r);box.scrollIntoView({behavior:'smooth',block:'nearest'})});
document.addEventListener('click',e=>{if(e.target.closest('[data-new-affirmation]')){chooseAffirmation();render();return}if(e.target.closest('[data-apply-estimate]')&&previewGoals){state.goals={calories:previewGoals.calories,protein:previewGoals.protein,carbs:previewGoals.carbs,fat:previewGoals.fat};save();previewGoals=null;render();alert('Daily calorie and macro targets updated.')}});
let wasHidden=false;document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){wasHidden=true;return}if(wasHidden&&document.visibilityState==='visible'){wasHidden=false;chooseAffirmation();if(page==='home')render()}});


