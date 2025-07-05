// ==== 1.  Grab the DOM elements once, so we can reuse them efficiently ====
const form   = document.getElementById('taskForm');         
const input  = document.getElementById('taskInput');             
const list   = document.getElementById('taskList');              
const clear  = document.getElementById('clearTasksButton');      
const total  = document.getElementById('taskCount');              
const done   = document.getElementById('completedTasksCount');
const todo   = document.getElementById('pendingTasksCount');


// ==== 2.  Load tasks from localStorage (or start empty) ====
let tasks = JSON.parse(localStorage.getItem('todo-data')) || [];  
render();                                                        

// ==== 3.  Add a new task ====
form.addEventListener('submit', e => {
  e.preventDefault();                                            
  const text = input.value.trim();
  if (!text) return;                                           

  tasks.push({ text, completed: false });
  input.value = '';
  saveAndRender();
});

// ==== 4.  Event delegation for toggle / delete (one listener for all <li>) ====
list.addEventListener('click', e => {
  const idx = e.target.dataset.index;                          
  if (idx === undefined) return;

  if (e.target.matches('input[type="checkbox"]')) {
    tasks[idx].completed = !tasks[idx].completed;                 
  } else if (e.target.matches('.delete')) {
    tasks.splice(idx, 1);                                         
  }
  saveAndRender();
});

// ==== 5.  Clear everything ====
clear.addEventListener('click', () => {
    tasks = [];                                                  
    localStorage.removeItem('todo-data');                          
    saveAndRender();                                                
});

// ==== 6.  Helper: render the list & counters ====
function render() {
  list.innerHTML = '';                                          
  tasks.forEach((t, i) => {
    // build <li> via DOM methods (safer than innerHTML)          
    const li      = document.createElement('li');
    const check   = document.createElement('input');
    const text    = document.createElement('span');
    const remove  = document.createElement('button');

    check.type = 'checkbox';
    check.dataset.index = i;
    check.checked = t.completed;

    text.textContent = t.text;
    if (t.completed) text.classList.add('done');               

    remove.textContent = '✖';
    remove.className   = 'delete';
    remove.dataset.index = i;

    li.append(check, text, remove);
    list.append(li);
  });

  // update stats
  const completed = tasks.filter(t => t.completed).length;       
  total.textContent = `Total Tasks: ${tasks.length}`;
  done.textContent  = `Completed Tasks: ${completed}`;
  todo.textContent  = `Pending Tasks: ${tasks.length - completed}`;
}

// ==== 7.  Helper: save to localStorage then re‑render ====
function saveAndRender() {
  localStorage.setItem('todo-data', JSON.stringify(tasks));      
  render();
}
