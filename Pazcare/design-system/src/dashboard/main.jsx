import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import {Avatar, Badge, Button, Card, Input, Modal, ProgressBar, Tag, Textarea} from '../components.jsx';
import './style.css';

const statuses = ['To do', 'In progress', 'Done'];
const initialTasks = [
 {id:'1',title:'Map out the onboarding journey',description:'Bring the first-time experience into focus.',project:'Product',status:'In progress'},
 {id:'2',title:'Review the homepage explorations',description:'Gather feedback and choose a direction.',project:'Design',status:'To do'},
 {id:'3',title:'Write the weekly team update',description:'Share progress, decisions, and what’s next.',project:'Team',status:'To do'},
 {id:'4',title:'Polish the component documentation',description:'Add usage notes for the new input states.',project:'Design system',status:'In progress'},
 {id:'5',title:'Collect customer interview notes',description:'Bring the latest insights into one place.',project:'Research',status:'Done'},
 {id:'6',title:'Set priorities for the week',description:'Make room for the work that matters most.',project:'Planning',status:'Done'},
];
function loadTasks(){try{const saved=JSON.parse(localStorage.getItem('sangha-daybook-tasks'));return Array.isArray(saved)&&saved.every(t=>typeof t.id==='string'&&typeof t.title==='string'&&statuses.includes(t.status))?saved:initialTasks;}catch{return initialTasks;}}
export function Dashboard(){
 const [tasks,setTasks]=useState(loadTasks),[filter,setFilter]=useState('All tasks'),[open,setOpen]=useState(false);
 const [title,setTitle]=useState(''),[description,setDescription]=useState(''),[status,setStatus]=useState('To do'),[error,setError]=useState(''),[notice,setNotice]=useState('');
 useEffect(()=>{try{localStorage.setItem('sangha-daybook-tasks',JSON.stringify(tasks));}catch{setNotice('Browser storage is unavailable. Changes will last for this session.');}},[tasks]);
 const done=tasks.filter(t=>t.status==='Done').length;
 const visible=tasks.filter(t=>filter==='All tasks'||t.status===filter);
 function addTask(e){e.preventDefault();if(!title.trim()){setError('Give your task a name.');return;}setTasks(prev=>[{id:crypto.randomUUID(),title:title.trim(),description:description.trim(),project:'Personal',status},...prev]);setFilter('All tasks');setOpen(false);setNotice('Task added.');}
 function launch(){setTitle('');setDescription('');setStatus('To do');setError('');setOpen(true);}
 return <div className="app"><header className="topbar"><a className="brand" href="/dashboard.html"><span className="brandmark" aria-hidden="true">d.</span>daybook<span className="brand-divider"/> <span className="workspace">Your workspace</span></a><Avatar name="Alex Morgan" size="sm"/></header>
 <main className="dashboard"><div className="eyebrow">A LITTLE CLARITY FOR YOUR DAY</div><div className="page-heading"><div><h1>Make space for good work.</h1><p>Your tasks, a clear plan, and one next step.</p></div><Button icon="plus" onClick={launch}>Add task</Button></div>
 <section className="summary" aria-label="Task overview"><Card><span className="metric-label">Total tasks</span><strong>{tasks.length.toString().padStart(2,'0')}</strong><p>Everything on your radar</p></Card><Card><span className="metric-label"><span className="status-dot active"/>In progress</span><strong>{tasks.filter(t=>t.status==='In progress').length.toString().padStart(2,'0')}</strong><p>A little closer, every day</p></Card><Card className="completion"><span className="metric-label">Completed</span><div className="completed-number"><strong>{done.toString().padStart(2,'0')}</strong><Badge tone="success">{tasks.length?Math.round(done/tasks.length*100):0}% done</Badge></div><ProgressBar label="Tasks completed" value={done} max={tasks.length||1} showValue={false}/></Card></section>
 <section className="task-panel" aria-labelledby="task-heading"><div className="list-heading"><div><h2 id="task-heading">Your tasks <span>{tasks.length}</span></h2><p>Small steps. Meaningful progress.</p></div><span className="sample-label">Your personal list</span></div>
 <div className="filters" role="group" aria-label="Filter tasks by status">{['All tasks',...statuses].map(s=><Tag key={s} selected={filter===s} onToggle={()=>setFilter(s)}>{s}<span className="filter-count">{s==='All tasks'?tasks.length:tasks.filter(t=>t.status===s).length}</span></Tag>)}</div>
 <div className="column-head" aria-hidden="true"><span>Task</span><span>Status</span></div><ul className="tasks">{visible.map(task=><li key={task.id} className={task.status==='Done'?'is-done':''}><div className="task-main"><button className="complete-button" aria-label={`${task.status==='Done'?'Reopen':'Complete'} ${task.title}`} aria-pressed={task.status==='Done'} onClick={()=>{setTasks(prev=>prev.map(t=>t.id===task.id?{...t,status:t.status==='Done'?'To do':'Done'}:t));setNotice(`${task.title}: ${task.status==='Done'?'To do':'Done'}.`);}}>{task.status==='Done'&&<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>}</button><div className="task-copy"><h3>{task.title}</h3>{task.description&&<p>{task.description}</p>}<span className="project">{task.project}</span></div></div><select className={`status-select status-${task.status.replaceAll(' ','-')}`} aria-label={`Status for ${task.title}`} value={task.status} onChange={e=>{const next=e.target.value;setTasks(prev=>prev.map(t=>t.id===task.id?{...t,status:next}:t));setNotice(`${task.title}: ${next}.`);}}>{statuses.map(s=><option key={s}>{s}</option>)}</select></li>)}</ul>
 {visible.length===0&&<div className="empty"><h3>A clear slate.</h3><p>No tasks with this status yet.</p><Button variant="secondary" onClick={launch} icon="plus">Add a task</Button></div>}
 <footer className="list-footer"><span>{visible.length} {visible.length===1?'task':'tasks'}{filter!=='All tasks'?` · ${filter.toLowerCase()}`:''}</span><span>One thing at a time.</span></footer></section><p className="storage-note">A personal space to keep things moving. Saved in this browser.</p><div className="sr-only" role="status">{notice}</div></main>
 <Modal open={open} onClose={()=>setOpen(false)} title="A new next step" description="Get it out of your head and onto your list."><form onSubmit={addTask} noValidate><Input label="Task name" placeholder="What needs to get done?" value={title} maxLength={180} onChange={e=>{setTitle(e.target.value);setError('');}} error={error} required/><Textarea label="Description (optional)" placeholder="A little context goes a long way." value={description} maxLength={500} onChange={e=>setDescription(e.target.value)} rows={3}/><label className="select-field">Status<select value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><div className="form-actions"><Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button><Button type="submit" icon="plus">Add task</Button></div></form></Modal></div>;
}
const root = document.getElementById('root');
if (root) createRoot(root).render(<Dashboard/>);
