(function(g){
 const h=React.createElement;
 function Field({label,children}){return h('label',{className:'field'},label,children)}
 const input=(label,value,onChange,props={})=>h(Field,{label},h('input',{value:value??'',onChange:e=>onChange(e.target.value),...props}));
 const select=(label,value,onChange,options)=>h(Field,{label},h('select',{value,onChange:e=>onChange(e.target.value)},options.map(x=>h('option',{key:Array.isArray(x)?x[0]:x,value:Array.isArray(x)?x[0]:x},Array.isArray(x)?x[1]:x))));
 const btn=(text,onClick,props={})=>h('button',{type:'button',className:'smallbtn',onClick,...props},text);
 const fmt=x=>Number(x||0).toLocaleString(undefined,{maximumFractionDigits:1});
 const clock=seconds=>{const n=Math.max(0,Math.floor(seconds));return (n>=3600?Math.floor(n/3600)+':':'')+String(Math.floor(n/60)%60).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
 const rowText=r=>r.mode==='cardio'?`${fmt(r.minutes)} min${r.distance?' · '+r.distance+' '+(r.distanceUnit||'km'):''}`:r.mode==='timed'?`${fmt(r.seconds)} sec`:`${fmt(r.weight)} ${r.unit||'lb'} × ${r.reps} reps`;
 const tags=[['working','Working'],['warmup','Warm-up'],['drop','Drop'],['failure','Failure']];
 const tabs=[['overview','Overview'],['routine','Routine'],['library','Exercises'],['analysis','Analysis'],['history','History'],['records','Records'],['schedule','Schedule'],['measurements','Measurements'],['tools','Tools']];
 function Chart({points,label}){if(!points.length)return h('p',{className:'help'},'Log entries to see your trend.');const max=Math.max(...points.map(p=>p.value),1);return h('figure',{className:'forge-chart'},h('figcaption',null,label),h('svg',{viewBox:'0 0 320 110',role:'img','aria-label':label},h('polyline',{points:points.map((p,i)=>`${10+i*300/Math.max(1,points.length-1)},${100-p.value/max*85}`).join(' '),fill:'none',stroke:'var(--lime)',strokeWidth:3}),points.map((p,i)=>h('circle',{key:i,cx:10+i*300/Math.max(1,points.length-1),cy:100-p.value/max*85,r:4,fill:'var(--lime)'}))),h('div',{className:'forge-chart-values'},points.map((p,i)=>h('span',{key:i},p.date.slice(5),h('strong',null,fmt(p.value))))))}
 function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 g.ForgeTrainingUI={h,Field,input,select,btn,fmt,clock,rowText,tags,tabs,Chart,download};
})(window);
