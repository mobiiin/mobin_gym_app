// React views for training analysis and history. The existing app state and
// delegated actions remain in place until the other training tabs migrate.
(function () {
  const h = React.createElement;
  const number = value => Number(value) || 0;
  const titleCase = value => String(value || '').replace(/\b\w/g, c => c.toUpperCase());
  const dateFormat = value => { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); };
  const unitFor = item => item.unit === 'kg' ? 'kg' : 'lb';
  const toLb = item => number(item.weight) * (unitFor(item) === 'kg' ? 2.20462262185 : 1);
  const inUnit = (lb,unit) => Math.round((unit === 'kg' ? lb / 2.20462262185 : lb) * 10) / 10;
  const tabs = [['overview','Overview'],['routine','Routine'],['library','Exercises'],['analysis','Analysis'],['history','History'],['records','Records'],['schedule','Schedule'],['measurements','Measurements'],['tools','Tools']];

  function TrainingShell({tab,children}) {
    return h(React.Fragment,null,
      h('h2',{className:'page'},'Training',h('span',{style:{color:'var(--lime)'}},'.')),
      h('p',{className:'sub'},'Your plan. Your progress.'),
      h('div',{className:'training-tabs',role:'tablist'},tabs.map(([id,label])=>h('button',{key:id,role:'tab','aria-selected':id===tab,className:id===tab?'active':'','data-training-tab':id},label))),children);
  }
  function Heading({title,label,action}) {
    return h('div',{className:'sectionhead'},h('h2',null,title),action || (label && h('small',null,label)));
  }
  function ExerciseTrend({entries,selected}) {
    const names=[...new Set(entries.map(x=>x.exercise))];
    if(!names.length)return h('p',{className:'empty'},'Your exercise trend will appear after you log weighted sets.');
    const chosen=names.includes(selected)?selected:names[0];
    const matching=entries.filter(x=>x.exercise===chosen);
    const unit=unitFor(matching[matching.length-1]);
    const byDay={};
    for(const item of matching){const weight=toLb(item);if(weight>0)byDay[item.date]=Math.max(byDay[item.date]||0,weight)}
    const dates=Object.keys(byDay).sort().slice(-8);
    const max=Math.max(0,...dates.map(day=>byDay[day]));
    return h(React.Fragment,null,
      h('label',{className:'field'},'Exercise',h('select',{id:'progress-exercise',key:chosen,defaultValue:chosen},names.map(name=>h('option',{key:name,value:name},name)))),
      dates.length ? h(React.Fragment,null,
        h('div',{className:'trend'},dates.map(day=>h('div',{className:'trendcol',key:day},h('span',null,inUnit(byDay[day],unit)),h('div',{className:'trendbar',style:{height:Math.max(8,Math.round(byDay[day]/max*82))+'px'}}),h('small',null,day.slice(5))))),
        h('p',{className:'help'},`Heaviest logged set each day (${unit}); not an estimated 1RM.`)) : h('p',{className:'empty'},'Log external weight to see a trend.'));
  }
  function Analysis({state,muscles,muscle,selected,cutoff,date,muscleFor}) {
    const matching=state.sets.filter(item=>item.tag!=='warmup'&&(!item.mode||item.mode==='strength')&&muscleFor(item)===muscle);
    const recent=matching.filter(item=>item.date>=cutoff&&item.date<=date);
    const unassigned=state.sets.filter(item=>!muscleFor(item));
    const names=[...new Set(matching.map(item=>item.exercise))];
    const missing=[...new Set(unassigned.map(item=>item.exercise))];
    const count=recent.reduce((sum,item)=>sum+Math.max(1,number(item.sets)),0);
    return h(TrainingShell,{tab:'analysis'},
      h('div',{className:'card'},
        h('label',{className:'field'},'Choose a muscle',h('select',{id:'analysis-muscle',key:muscle,defaultValue:muscle},muscles.map(name=>h('option',{key:name,value:name},titleCase(name))))),
        h('div',{className:'metricgrid'},h('div',{className:'card metric'},h('span',{className:'label'},'SETS · LAST 7 DAYS'),h('strong',null,count)),h('div',{className:'card metric'},h('span',{className:'label'},'EXERCISES · ALL TIME'),h('strong',null,names.length))),
        h('p',{className:'help'},'Counts use the primary muscle assigned to each logged set. A set may work other muscles too. Warm-ups and timed holds are excluded. These numbers describe training, not muscle growth.'),
        unassigned.length>0 && h('p',{className:'help'},`${unassigned.length} logged entries have no assigned or recognized primary muscle and are excluded. New logs let you choose one.`)),
      h(Heading,{title:`${titleCase(muscle)} progress`,label:'BY EXERCISE'}),
      h('div',{className:'card'},names.length?names.map(name=>{
        const entries=matching.filter(item=>item.exercise===name);
        const best=entries.filter(item=>number(item.weight)>0).sort((a,b)=>toLb(b)-toLb(a))[0];
        const last=[...entries].sort((a,b)=>b.date.localeCompare(a.date))[0];
        const desc=(best?`Heaviest: ${number(best.weight)} ${unitFor(best)} × ${number(best.reps)} reps`:'No external weight logged')+` · Last: ${dateFormat(last.date)}`;
        return h('div',{className:'entry row',key:name},h('div',null,h('strong',null,name),h('small',null,desc)),h('button',{className:'smallbtn','data-assign-muscle':name},'Change target'));
      }):h('p',{className:'empty'},'No matching sets yet. Log an exercise and choose its primary muscle.')),
      missing.length>0&&h(React.Fragment,null,h(Heading,{title:'Unassigned exercises'}),h('div',{className:'card'},missing.map(name=>h('div',{className:'entry row',key:name},h('strong',null,name),h('button',{className:'smallbtn','data-assign-muscle':name},'Assign target'))))),
      h(Heading,{title:'Exercise trend',label:'HEAVIEST SET PER DAY'}),h('div',{className:'card'},h(ExerciseTrend,{entries:matching,selected})));
  }
  function StrengthEntry({item}) {
    return h('div',{className:'entry row'},h('div',null,h('strong',null,item.exercise),h('small',null,(item.mode==='timed'?`${number(item.seconds)} sec`:`${number(item.sets)} sets × ${number(item.reps)} reps · ${number(item.weight)} ${item.unit}`)+(item.tag?' · '+item.tag:'')+(item.rpe?' · RPE '+item.rpe:''))),h('button',{className:'iconbtn','data-delete':'set','data-id':item.id,'aria-label':`Delete ${item.exercise}`},'×'));
  }
  function History({state}) {
    const dates=[...new Set(state.sets.map(item=>item.date))].sort().reverse();
    const cardio=[...state.cardio].sort((a,b)=>b.date.localeCompare(a.date));
    return h(TrainingShell,{tab:'history'},
      h(Heading,{title:'Workout sessions',label:'COMPLETED'}),
      [...(state.workoutSessions||[])].reverse().map(session=>h('details',{className:'card',key:session.id},h('summary',null,session.dayName+' · '+dateFormat(session.date)),h('p',{className:'help'},session.routineName+' · '+Math.round(session.durationSeconds/60)+' min'),session.notes&&h('p',null,session.notes),(session.exercises||[]).filter(x=>x.note).map((x,i)=>h('p',{key:i},x.name+': '+x.note)),state.sets.filter(x=>x.sessionId===session.id).map(item=>h(StrengthEntry,{key:item.id,item})))),
      h(Heading,{title:'Strength history',label:'ALL ENTRIES'}),
      dates.length?dates.map(date=>h(React.Fragment,{key:date},h('div',{className:'historydate'},dateFormat(date)),h('div',{className:'card'},state.sets.filter(item=>item.date===date).slice().reverse().map(item=>h(StrengthEntry,{key:item.id,item}))))):h('div',{className:'card'},h('p',{className:'empty'},'No exercises logged yet. Time to put in work.')),
      h(Heading,{title:'Cardio history',action:h('button',{className:'smallbtn','data-cardio-add':'1'},'＋ Log')}),
      h('div',{className:'card'},cardio.length?cardio.map(item=>h('div',{className:'entry row',key:item.id},h('div',null,h('strong',null,item.name),h('small',null,`${dateFormat(item.date)} · ${number(item.minutes)} min${item.distance?` · ${number(item.distance)} ${item.unit}`:''}`)),h('button',{className:'iconbtn','data-cardio-delete':item.id,'aria-label':'Delete cardio entry'},'×'))):h('p',{className:'empty'},'No cardio logged yet.')));
  }
  const root=ReactDOM.createRoot(document.getElementById('training-detail-root'));
  window.ForgeTrainingDetails={render:props=>root.render(h(props.tab==='analysis'?Analysis:History,props))};
})();
