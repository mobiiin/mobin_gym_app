// Original FORGE starting routines, informed by the sources in docs/routine-research.md.
// Each selection is copied into the user's own fully editable routine.
(function(global){
  const lift=(name,sets='2',reps='8–12',rest='90',notes='')=>({name,sets,reps,rest,notes});
  const core=(name)=>lift(name,'2','','60','Hold for 20–40 seconds at a comfortable difficulty.');
  const walk=()=>lift('Walking','','','','Optional cardio: 10–20 minutes at a comfortable pace.');
  const day=(name,priority,optional=[])=>({name,priority,optional});
  const templates=[
    {id:'full-body-2',name:'2-day Full Body',level:'Beginner-friendly',equipment:'Gym',description:'Two nonconsecutive sessions covering the major movement patterns. A practical starting point when your schedule is tight.',days:[
      day('Day 1 — Full Body A',[lift('Goblet Squat'),lift('Dumbbell Bench Press'),lift('Seated Cable Rows'),lift('Romanian Deadlift'),lift('Dumbbell Shoulder Press')],[lift('Standing Calf Raises','2','12–15','60'),core('Plank'),walk()]),
      day('Day 2 — Full Body B',[lift('Leg Press'),lift('Wide-Grip Lat Pulldown'),lift('Dumbbell Bench Press'),lift('Seated Leg Curl'),lift('One-Arm Dumbbell Row')],[lift('Side Lateral Raise','2','12–15','60'),lift('Hammer Curls','2','10–15','60'),lift('Cable Crunch','2','10–15','60')])]},
    {id:'full-body-3',name:'3-day Full Body',level:'Beginner / intermediate',equipment:'Gym',description:'Three nonconsecutive sessions balance squat, hinge, push and pull work. Start with two sets and add work gradually if recovery is good.',days:[
      day('Day 1 — Full Body A',[lift('Goblet Squat'),lift('Dumbbell Bench Press'),lift('Seated Cable Rows'),lift('Romanian Deadlift'),lift('Side Lateral Raise','2','12–15','60')],[lift('Hammer Curls','2','10–15','60'),core('Plank')]),
      day('Day 2 — Full Body B',[lift('Leg Press'),lift('Wide-Grip Lat Pulldown'),lift('Dumbbell Shoulder Press'),lift('Seated Leg Curl'),lift('Dumbbell Bench Press')],[lift('Standing Calf Raises','2','12–15','60'),lift('Triceps Pushdown','2','10–15','60')]),
      day('Day 3 — Full Body C',[lift('Dumbbell Lunges'),lift('One-Arm Dumbbell Row'),lift('Dumbbell Bench Press'),lift('Barbell Glute Bridge'),lift('Wide-Grip Lat Pulldown')],[lift('Leg Extensions','2','10–15','60'),lift('Cable Crunch','2','10–15','60'),walk()])]},
    {id:'ppl-3',name:'3-day Push / Pull / Legs',level:'Intermediate',equipment:'Gym',description:'One push, pull and leg session each week, with priority work first. Each muscle is trained mainly once weekly in this three-day version.',days:[
      day('Day 1 — Push',[lift('Dumbbell Bench Press','3'),lift('Dumbbell Shoulder Press','3'),lift('Side Lateral Raise','2','12–15','60'),lift('Triceps Pushdown','2','10–15','60')],[lift('Dumbbell Flyes','2','10–15','60'),core('Plank')]),
      day('Day 2 — Pull',[lift('Wide-Grip Lat Pulldown','3'),lift('Seated Cable Rows','3'),lift('Reverse Machine Flyes','2','12–15','60'),lift('Hammer Curls','2','10–15','60')],[lift('Barbell Curl','2','8–12','60'),walk()]),
      day('Day 3 — Legs',[lift('Leg Press','3'),lift('Romanian Deadlift','3'),lift('Seated Leg Curl','2'),lift('Leg Extensions','2','10–15','60'),lift('Standing Calf Raises','2','12–15','60')],[lift('Cable Crunch','2','10–15','60')])]},
    {id:'upper-lower-4',name:'4-day Upper / Lower',level:'Beginner / intermediate',equipment:'Gym',description:'Two upper-body and two lower-body sessions. Spread the four sessions across the week with rest between demanding days.',days:[
      day('Day 1 — Upper A',[lift('Dumbbell Bench Press','3'),lift('Seated Cable Rows','3'),lift('Wide-Grip Lat Pulldown','2'),lift('Dumbbell Shoulder Press','2')],[lift('Hammer Curls','2','10–15','60'),lift('Triceps Pushdown','2','10–15','60')]),
      day('Day 2 — Lower A',[lift('Goblet Squat','3'),lift('Romanian Deadlift','3'),lift('Seated Leg Curl','2'),lift('Standing Calf Raises','2','12–15','60')],[lift('Cable Crunch','2','10–15','60')]),
      day('Day 3 — Upper B',[lift('Wide-Grip Lat Pulldown','3'),lift('Dumbbell Bench Press','3'),lift('One-Arm Dumbbell Row','2'),lift('Side Lateral Raise','2','12–15','60')],[lift('Barbell Curl','2','8–12','60'),lift('Triceps Pushdown','2','10–15','60')]),
      day('Day 4 — Lower B',[lift('Leg Press','3'),lift('Barbell Glute Bridge','3'),lift('Leg Extensions','2','10–15','60'),lift('Seated Leg Curl','2'),lift('Seated Calf Raise','2','12–15','60')],[core('Plank')])]},
    {id:'upper-lower-arms-5',name:'5-day Upper / Lower + Arms',level:'Intermediate',equipment:'Gym',description:'Four upper/lower sessions plus a shorter arm and shoulder day. Start conservatively and adjust weekly volume to recovery.',days:[
      day('Day 1 — Upper A',[lift('Dumbbell Bench Press','3'),lift('Seated Cable Rows','3'),lift('Wide-Grip Lat Pulldown','2'),lift('Dumbbell Shoulder Press','2')],[lift('Side Lateral Raise','2','12–15','60')]),
      day('Day 2 — Lower A',[lift('Goblet Squat','3'),lift('Romanian Deadlift','3'),lift('Seated Leg Curl','2'),lift('Standing Calf Raises','2','12–15','60')],[core('Plank')]),
      day('Day 3 — Arms + Shoulders',[lift('Side Lateral Raise','3','12–15','60'),lift('Hammer Curls','3','10–15','60'),lift('Triceps Pushdown','3','10–15','60'),lift('Reverse Machine Flyes','2','12–15','60')],[lift('Barbell Curl','2','8–12','60')]),
      day('Day 4 — Upper B',[lift('Wide-Grip Lat Pulldown','3'),lift('Dumbbell Bench Press','3'),lift('One-Arm Dumbbell Row','3'),lift('Dumbbell Shoulder Press','2')],[lift('Cable Crunch','2','10–15','60')]),
      day('Day 5 — Lower B',[lift('Leg Press','3'),lift('Barbell Glute Bridge','3'),lift('Seated Leg Curl','2'),lift('Leg Extensions','2','10–15','60'),lift('Seated Calf Raise','2','12–15','60')],[walk()])]},
    {id:'home-3',name:'3-day Home Full Body',level:'Beginner-friendly',equipment:'Dumbbells + bodyweight',description:'Three nonconsecutive sessions with dumbbells and bodyweight. Use a stable bench or surface for incline push-ups, or substitute a comfortable press.',days:[
      day('Day 1 — Home A',[lift('Goblet Squat'),lift('Incline Push-Up','2','6–12','90'),lift('One-Arm Dumbbell Row'),lift('Dumbbell Lunges'),core('Plank')],[lift('Hammer Curls','2','10–15','60'),walk()]),
      day('Day 2 — Home B',[lift('Dumbbell Squat'),lift('Dumbbell Shoulder Press'),lift('One-Arm Dumbbell Row'),lift('Single Leg Glute Bridge','2','8–12','90','Perform on each side.'),lift('Side Lateral Raise','2','12–15','60')],[lift('Standing Dumbbell Calf Raise','2','12–15','60'),core('Plank')]),
      day('Day 3 — Home C',[lift('Goblet Squat'),lift('Incline Push-Up','2','6–12','90'),lift('One-Arm Dumbbell Row'),lift('Bodyweight Walking Lunge','2','8–12','90','Perform on each side.'),lift('Dumbbell Shoulder Press')],[lift('Hammer Curls','2','10–15','60'),walk()])]}
  ];
  function instantiate(template){return template.days.map(d=>({name:d.name,priority:d.priority.map(x=>x.name),optional:d.optional.map(x=>x.name),details:[...d.priority,...d.optional].map(x=>({...x}))}));}
  global.ForgeRoutineTemplates={templates,instantiate};
})(typeof window==='object'?window:globalThis);
