// React owns the Today screen. Existing storage and event handlers remain the source
// of truth during the gradual migration of the other screens.
(function () {
  const h = React.createElement;
  const number = value => Number(value) || 0;
  const sum = (items, key) => items.reduce((total, item) => total + number(item[key]), 0);

  function Affirmation({ text, author, source }) {
    return h('div', {className: 'affirmation-card'},
      h('div', {className: 'affirmation-top'},
        h('span', {className: 'eyebrow'}, 'A MOMENT FOR YOU'),
        h('button', {type: 'button', className: 'affirmation-refresh', 'data-new-affirmation': '1', 'aria-label': 'Show another affirmation'}, '↻')),
      h('p', null, '“', text, '”'),
      h('div', {className: 'quote-credit'}, '— ', author, source && h(React.Fragment, null, ' · ', h('a', {href: source, target: '_blank', rel: 'noopener noreferrer'}, 'Source ↗'))));
  }

  function Macro({name, value, goal}) {
    const progress = goal ? Math.min(100, value / goal * 100) : 0;
    return h('div', null,
      h('div', {className: 'label'}, name),
      h('div', {className: 'bar'}, h('span', {style: {width: progress + '%'}})),
      h('strong', null, value, ' ', h('span', {className: 'label'}, '/ ', goal, 'g')));
  }

  function FuelCard({foods, goals}) {
    const calories = sum(foods, 'calories');
    const goal = number(goals.calories);
    const percentage = goal ? calories / goal * 100 : 0;
    return h('div', {className: 'card'},
      h('div', {className: 'cardtop'},
        h('div', null, h('div', {className: 'label'}, "TODAY'S FUEL"),
          h('div', {className: 'big'}, calories.toLocaleString(), ' ', h('small', null, 'kcal')),
          h('div', {className: 'label'}, Math.max(0, goal - calories).toLocaleString(), ' kcal remaining · Goal ', goal.toLocaleString())),
        h('div', {className: 'ring', style: {'--progress': Math.min(100, percentage) + '%'}, 'data-text': Math.round(percentage) + '%'})),
      h('div', {className: 'macrogrid'},
        ['protein', 'carbs', 'fat'].map(key => h(Macro, {key, name: key.toUpperCase(), value: sum(foods, key), goal: number(goals[key])}))));
  }

  function SectionHeading({title, label}) {
    return h('div', {className: 'sectionhead'}, h('h2', null, title), h('small', null, label));
  }

  function Entries({items, type}) {
    if (!items.length) return h('p', {className: 'empty'}, type === 'food' ? 'Nothing logged yet. Your next small step starts here.' : 'No exercises logged yet. Time to put in work.');
    return [...items].reverse().map(item => {
      const name = type === 'food' ? item.name : item.exercise;
      const detail = type === 'food' ? `${item.meal} · ${number(item.calories)} kcal · ${number(item.protein)}g protein` : (item.mode==='timed'?`${number(item.seconds)} sec`:`${number(item.sets)} sets × ${number(item.reps)} reps · ${number(item.weight)} ${item.unit}`)+(item.tag?' · '+item.tag:'');
      return h('div', {className: 'entry row', key: item.id}, h('div', null, h('strong', null, name), h('small', null, detail)), h('button', {className: 'iconbtn', 'data-delete': type, 'data-id': item.id, 'aria-label': `Delete ${name}`}, '×'));
    });
  }

  function Today({state, date, affirmation, affirmationAuthor, affirmationSource}) {
    const foods = state.foods.filter(item => item.date === date);
    const sets = state.sets.filter(item => item.date === date);
    return h(React.Fragment, null,
      h('section', {className: 'hero'}, h('div', {className: 'eyebrow'}, new Date().toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'})), h('h1', null, 'SHOW UP.', h('br'), 'LEVEL UP', h('span', {style:{color:'var(--lime)'}}, '.')), h('p', null, 'Build the body. Track the process.')),
      h(Affirmation, {text:affirmation, author:affirmationAuthor, source:affirmationSource}),
      h(FuelCard, {foods, goals:state.goals}),
      h(SectionHeading, {title:'Make it count', label:'QUICK ACTIONS'}),
      h('div', {className:'quick'}, h('button', {className:'action', 'data-add':'food'}, h('span', null, '＋'), 'Log food'), h('button', {className:'action alt', 'data-add':'set'}, h('span', null, '↗'), 'Log exercise')),
      h(SectionHeading, {title:"Today's training", label:`${sets.length} EXERCISES`}), h('div', {className:'card'}, h(Entries, {items:sets, type:'set'})),
      h(SectionHeading, {title:"Today's fuel", label:`${foods.length} ENTRIES`}), h('div', {className:'card'}, h(Entries, {items:foods, type:'food'})),
      h('button', {type:'button', className:'secondary share-today', 'data-share-open':'1'}, '↗ Share today’s progress'));
  }

  const root = ReactDOM.createRoot(document.getElementById('today-root'));
  window.ForgeToday = {render: props => root.render(h(Today, props))};
})();
