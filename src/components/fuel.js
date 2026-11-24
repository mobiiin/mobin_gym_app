(function () {
  const h = React.createElement;
  const num = value => Number(value) || 0;
  const formatDate = date => { const [y,m,d] = date.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); };
  function FoodEntry({food}) {
    return h('div',{className:'entry row'},
      h('div',null,h('strong',null,food.name),h('small',null,`${food.meal} · ${num(food.calories)} kcal · ${num(food.protein)}g protein`)),
      h('button',{className:'iconbtn','data-delete':'food','data-id':food.id,'aria-label':`Delete ${food.name}`},'×'));
  }
  function Fuel({foods}) {
    const dates = [...new Set(foods.map(food => food.date))].sort().reverse();
    return h(React.Fragment,null,
      h('h2',{className:'page'},'Fuel your work',h('span',{style:{color:'var(--lime)'}},'.')),
      h('p',{className:'sub'},'Every meal is part of the plan.'),
      h('button',{className:'primary','data-add':'food'},'＋ Log food'),
      h('div',{className:'sectionhead'},h('h2',null,'Food history'),h('small',null,'ALL ENTRIES')),
      dates.length ? dates.map(date => h(React.Fragment,{key:date},
        h('div',{className:'historydate'},formatDate(date)),
        h('div',{className:'card'},foods.filter(food=>food.date===date).slice().reverse().map(food=>h(FoodEntry,{key:food.id,food})))))
        : h('div',{className:'card'},h('p',{className:'empty'},'Nothing logged yet. Your next small step starts here.')));
  }
  const root=ReactDOM.createRoot(document.getElementById('fuel-root'));
  window.ForgeFuel={render: props => root.render(h(Fuel,props))};
})();
