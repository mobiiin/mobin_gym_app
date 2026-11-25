(function(global){
  const h=React.createElement;
  function prescription(x){return [x.sets?`${x.sets} sets`:'',x.reps?`${x.reps} reps`:'',x.rest?`${x.rest}s rest`:'',x.notes||''].filter(Boolean).join(' · ')}
  function Exercises({items}){return items.length?h('ul',{className:'planlist'},items.map((x,i)=>h('li',{key:i},h('strong',null,x.name),prescription(x)&&h('div',{className:'help'},prescription(x))))):h('p',{className:'help'},'No exercises in this section.');}
  function Browser({templates,onCreate}){
    return h('div',{className:'template-browser'},
      h('p',{className:'help'},'Preview a starting plan and create your own editable copy. Your existing routines and workout history stay in place.'),
      h('p',{className:'help'},'Starting targets are suggestions. Choose manageable loads, allow recovery, and adjust exercises or volume to your experience. If a movement causes pain, stop and choose a comfortable alternative.'),
      templates.map(t=>h('details',{className:'plan-day template-item',key:t.id},
        h('summary',null,h('span',null,t.name),h('span',{className:'muted'},`${t.days.length} days`)),
        h('p',{className:'help'},`${t.level} · ${t.equipment}`),h('p',{className:'help'},t.description),
        t.days.map(d=>h('div',{className:'setrow',key:d.name},h('strong',null,d.name),h('div',{className:'eyebrow',style:{margin:'14px 0 8px'}},'PRIORITY'),h(Exercises,{items:d.priority}),d.optional.length>0&&h(React.Fragment,null,h('div',{className:'eyebrow',style:{margin:'14px 0 8px'}},'OPTIONAL'),h(Exercises,{items:d.optional})))),
        h('button',{type:'button',className:'primary','data-template-create':t.id,onClick:()=>onCreate(t.id)},'Create editable copy'))),
      h('p',{className:'help'},'The original template is a general starting point, not a personalized prescription. Set and rep targets are editable in your copy.'),
      h('p',{className:'help'},'Research: ',h('a',{href:'https://pubmed.ncbi.nlm.nih.gov/41843416/',target:'_blank',rel:'noopener noreferrer'},'ACSM resistance training review'),' · ',h('a',{href:'https://pubmed.ncbi.nlm.nih.gov/38595233/',target:'_blank',rel:'noopener noreferrer'},'full body vs. split review')));
  }
  global.ForgeRoutineTemplateBrowser={show:props=>ForgeEntryDialogs.showCustom('Explore routine templates',Browser,props)};
})(window);
