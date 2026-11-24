(function () {
  const h=React.createElement;
  const pages=[['home','◉','Today'],['food','◒','Fuel'],['training','▥','Training'],['settings','⚙','Settings']];
  function Navigation({page}) {
    return pages.map(([id,icon,label])=>h('button',{key:id,className:id===page?'active':'','data-page':id},h('b',null,icon),label));
  }
  const root=ReactDOM.createRoot(document.getElementById('navigation'));
  window.ForgeNavigation={render: page => root.render(h(Navigation,{page}))};
})();
