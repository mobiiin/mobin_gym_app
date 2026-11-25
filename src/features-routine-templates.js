// Template selection creates a separate routine; the currently saved plan is never overwritten.
(function(){
  function nextName(name){let used=new Set(state.routines.map(r=>r.name));if(!used.has(name))return name;let i=2;while(used.has(`${name} (${i})`))i++;return `${name} (${i})`}
  function createCopy(id){
    ensureExtraState();
    const template=ForgeRoutineTemplates.templates.find(t=>t.id===id);if(!template)return;
    const previousId=state.activeRoutine,previousDays=state.dayPlans;
    const days=ForgeRoutineTemplates.instantiate(template),routine={id:crypto.randomUUID(),name:nextName(template.name),days};
    state.routines.push(routine);state.activeRoutine=routine.id;state.dayPlans=days;expandedRoutineDay=-1;
    try{save()}catch(e){state.routines.pop();state.activeRoutine=previousId;state.dayPlans=previousDays;alert('Could not save the routine on this device. Check storage and try again.');return}
    $('#modal').close();trainingTab='routine';render();
  }
  function showTemplates(){ForgeRoutineTemplateBrowser.show({templates:ForgeRoutineTemplates.templates,onCreate:createCopy})}
  document.addEventListener('click',e=>{if(e.target.closest('[data-routine-templates]'))showTemplates()});
  window.ForgeTemplateActions={createCopy,showTemplates};
})();
