// Versioned, portable backup format. The original unwrapped FORGE JSON remains supported.
(function(global){
  const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  const validDay=d=>isObject(d)&&typeof d.name==='string'&&Array.isArray(d.priority)&&Array.isArray(d.optional)&&[...d.priority,...d.optional].every(x=>typeof x==='string')&&(!('details'in d)||(Array.isArray(d.details)&&d.details.every(x=>isObject(x)&&typeof x.name==='string')));
  function validate(data){
    if(!isObject(data)||!isObject(data.goals)||!Array.isArray(data.foods)||!Array.isArray(data.sets))throw Error('This file is missing FORGE goals, food entries, or workout entries.');
    for(const key of ['calories','protein','carbs','fat'])if(data.goals[key]==null||!Number.isFinite(Number(data.goals[key]))||Number(data.goals[key])<0)throw Error(`The ${key} target is invalid.`);
    const arrayKeys=['foods','sets','body','cardio','customExercises','dayPlans','exercisePool','routines'];
    for(const key of arrayKeys)if(key in data&&!Array.isArray(data[key]))throw Error(`The ${key} section is invalid.`);
    for(const [key,name] of [['foods','name'],['sets','exercise'],['body','weight'],['cardio','name']])for(const item of data[key]||[]){if(!isObject(item)||typeof item.id!=='string'||typeof item.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(item.date)||item[name]===undefined||item[name]===null||((key==='foods'||key==='sets'||key==='cardio')&&typeof item[name]!=='string')||(key==='body'&&(!Number.isFinite(Number(item.weight))||Number(item.weight)<=0)))throw Error(`An entry in ${key} is invalid.`)}
    if(data.dayPlans&&!data.dayPlans.every(validDay))throw Error('A training day is invalid.');
    if(data.routines&&(!data.routines.length||!data.routines.every(r=>isObject(r)&&typeof r.id==='string'&&typeof r.name==='string'&&Array.isArray(r.days)&&r.days.every(validDay))))throw Error('A saved routine is invalid.');
    if(data.activeRoutine!==undefined&&typeof data.activeRoutine!=='string')throw Error('The active routine is invalid.');
    if(data.exercisePool&&!data.exercisePool.every(x=>typeof x==='string'))throw Error('The exercise pool is invalid.');
    if(data.customExercises&&!data.customExercises.every(x=>isObject(x)&&typeof x.name==='string'&&(!('primary'in x)||Array.isArray(x.primary))&&(!('secondary'in x)||Array.isArray(x.secondary))))throw Error('A custom exercise is invalid.');
    if(data.profile!==undefined&&!isObject(data.profile))throw Error('The nutrition profile is invalid.');
    if(data.plans!==undefined&&!isObject(data.plans))throw Error('The plans section is invalid.');
    return data;
  }
  function parse(text){let parsed;try{parsed=JSON.parse(text)}catch{throw Error('This file is not valid JSON.')};let data=parsed;if(isObject(parsed)&&parsed.format==='forge-backup'){if(parsed.version!==1)throw Error('This backup uses an unsupported version.');data=parsed.data}return validate(data)}
  function serialize(state){validate(state);return JSON.stringify({format:'forge-backup',version:1,exportedAt:new Date().toISOString(),data:state},null,2)}
  function summary(state){return {foods:state.foods.length,sets:state.sets.length,cardio:(state.cardio||[]).length,weights:(state.body||[]).length,routines:(state.routines||[]).length}}
  global.ForgeBackup={parse,serialize,summary,validate};
})(typeof window==='object'?window:globalThis);
