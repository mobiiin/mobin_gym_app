(function () {
  const h=React.createElement;
  const num=value=>Number(value)||0;
  const formatDate=date=>{const [y,m,d]=date.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})};
  const tabs=[['overview','Overview'],['routine','Routine'],['library','Exercises'],['analysis','Analysis'],['history','History'],['records','Records'],['schedule','Schedule'],['measurements','Measurements'],['tools','Tools']];
  function Heading({title,label}) {return h('div',{className:'sectionhead'},h('h2',null,title),label&&h('small',null,label))}
  function TrainingOverview({state,cutoff,date,timer}) {
    const sets=state.sets.filter(s=>s.tag!=='warmup'&&(!s.mode||s.mode==='strength')&&s.date>=cutoff&&s.date<=date);
    const cardio=state.cardio.filter(s=>s.date>=cutoff&&s.date<=date);
    const days=new Set([...sets,...cardio].map(s=>s.date)).size;
    const count=sets.reduce((n,x)=>n+Math.max(1,num(x.sets)),0);
    const weights=[...state.body].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
    return h(React.Fragment,null,
      h('h2',{className:'page'},'Training',h('span',{style:{color:'var(--lime)'}},'.')),
      h('p',{className:'sub'},'Your plan. Your progress.'),
      h('div',{className:'training-tabs',role:'tablist'},tabs.map(([id,label])=>h('button',{key:id,role:'tab','aria-selected':id==='overview',className:id==='overview'?'active':'','data-training-tab':id},label))),
      h('div',{className:'metricgrid'},h('div',{className:'card metric'},h('span',{className:'label'},'ACTIVE DAYS · 7D'),h('strong',null,days)),h('div',{className:'card metric'},h('span',{className:'label'},'SETS · 7D'),h('strong',null,count))),
      h(Heading,{title:'Ready to train?'}),
      state.workoutDraft&&h('button',{className:'primary','data-add':'set'},'Resume active workout'),
      (state.trainingSchedule||[]).filter(x=>!x.done&&x.date>=date).slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,3).map(x=>h('div',{className:'card',key:x.id},h('strong',null,x.dayName),h('p',{className:'help'},x.date+' · '+x.time),h('button',{className:'smallbtn','data-training-tab':'schedule'},'View schedule'))),
      h('div',{className:'quick'},h('button',{className:'action','data-add':'set'},h('span',null,'＋'),'Log sets'),h('button',{className:'action alt','data-cardio-add':'1'},h('span',null,'↗'),'Log cardio')),
      h(Heading,{title:'Rest timer',label:'BETWEEN SETS'}),
      h('div',{className:'card'},h('div',{className:'row'},h('div',null,h('div',{className:'label'},'TIME REMAINING'),h('div',{id:'timer-value',className:'timer'},timer)),h('div',null,[60,90,120,0].map(value=>h('button',{key:value,className:'smallbtn','data-timer':String(value)},value?`${value}s`:'Reset')))),h('p',{className:'help'},'Timer runs while the app is open; no background alert.')),
      h(Heading,{title:'Body weight',label:'LAST 5'}),
      h('div',{className:'card'},weights.length?weights.map(weight=>h('div',{className:'entry row',key:weight.id},h('div',null,h('strong',null,`${num(weight.weight)} ${weight.unit}`),h('small',null,formatDate(weight.date))),h('button',{className:'iconbtn','data-body-delete':weight.id,'aria-label':'Delete body weight'},'×'))):h('p',{className:'empty'},'No weigh-ins yet. Add one to see your history.'),h('button',{className:'secondary','data-extra':'body'},'＋ Add weigh-in')));
  }
  const root=ReactDOM.createRoot(document.getElementById('training-root'));
  window.ForgeTraining={render:props=>root.render(h(TrainingOverview,props))};
})();
