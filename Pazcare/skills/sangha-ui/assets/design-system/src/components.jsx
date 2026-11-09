import React, {useEffect, useId, useRef, useState} from 'react';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/dist/csr/ArrowSquareOut';
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check';
import { XIcon } from '@phosphor-icons/react/dist/csr/X';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { CaretDownIcon } from '@phosphor-icons/react/dist/csr/CaretDown';
import { DotsThreeIcon } from '@phosphor-icons/react/dist/csr/DotsThree';
import { PaperPlaneTiltIcon } from '@phosphor-icons/react/dist/csr/PaperPlaneTilt';
import { FloppyDiskIcon } from '@phosphor-icons/react/dist/csr/FloppyDisk';
import { BookOpenIcon } from '@phosphor-icons/react/dist/csr/BookOpen';
import { BooksIcon } from '@phosphor-icons/react/dist/csr/Books';
import { CalendarBlankIcon } from '@phosphor-icons/react/dist/csr/CalendarBlank';
import { ChatCircleTextIcon } from '@phosphor-icons/react/dist/csr/ChatCircleText';
import { HeartIcon } from '@phosphor-icons/react/dist/csr/Heart';
import { SparkleIcon } from '@phosphor-icons/react/dist/csr/Sparkle';
import { TagSimpleIcon } from '@phosphor-icons/react/dist/csr/TagSimple';
import { TargetIcon } from '@phosphor-icons/react/dist/csr/Target';
import { TrophyIcon } from '@phosphor-icons/react/dist/csr/Trophy';
import { UserCircleIcon } from '@phosphor-icons/react/dist/csr/UserCircle';
import { UsersIcon } from '@phosphor-icons/react/dist/csr/Users';
import { ListBulletsIcon } from '@phosphor-icons/react/dist/csr/ListBullets';
import { QuotesIcon } from '@phosphor-icons/react/dist/csr/Quotes';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star';
import './tokens.css';
import './components.css';
export function Button({variant='primary',size='default',loading=false,disabled=false,icon,iconPosition='start',children,className='',type='button',...props}) {
 return <button {...props} type={type} disabled={disabled||loading} aria-busy={loading||undefined} className={`ds-button ${variant} ${size} ${className}`}>{loading&&<span className="spinner" aria-hidden="true"/>}{!loading&&icon&&iconPosition==='start'&&<Icon name={icon}/>}<span>{children}</span>{!loading&&icon&&iconPosition==='end'&&<Icon name={icon}/ >}{loading&&<span className="sr-only"> — loading</span>}</button>;
}
export function Input({label,hint,error,id, className='',...props}) {
 const generated=useId(); const fieldId=id||generated;
 return <div className={`ds-field ${className}`}><label htmlFor={fieldId}>{label}{props.required&&<span aria-hidden="true"> *</span>}</label><input {...props} id={fieldId} aria-invalid={error?true:undefined} aria-describedby={error||hint?`${fieldId}-message`:undefined}/>{(error||hint)&&<span id={`${fieldId}-message`} className={error?'field-error':'field-hint'}>{error||hint}</span>}</div>;
}
export function Card({children,treatment='plain',className='',...props}) {return <div {...props} className={`ds-card ${treatment} ${className}`}>{children}</div>}
export function Tag({children,tone='neutral',selected,onToggle,disabled=false}) {const cls=`ds-tag ${tone}`;return onToggle?<button type="button" className={cls} aria-pressed={!!selected} onClick={onToggle} disabled={disabled}>{selected&&<span aria-hidden="true" className="tag-check"><Icon name="check" size="sm"/></span>}{children}</button>:<span className={cls}>{children}</span>}
export function Nav({items,label='Section navigation'}) {return <nav className="ds-nav" aria-label={label}>{items.map(item=><a key={item.href} href={item.href} aria-current={item.current?'page':undefined}>{item.label}</a>)}</nav>}
export function List({items,emptyMessage='Nothing here yet.',compact=false}) {return items.length?<ul className={`ds-list ${compact?'compact':''}`}>{items.map(item=><li key={item.id}>{item.leading}<div className="list-copy"><strong>{item.title}</strong>{item.description&&<p>{item.description}</p>}</div>{item.trailing}</li>)}</ul>:<p className="empty-state">{emptyMessage}</p>}
export function Avatar({name,src,size='md'}) {const [failedSrc,setFailedSrc]=useState(null);return <span className={`ds-avatar ${size}`} role="img" aria-label={name}>{src&&failedSrc!==src?<img src={src} alt="" onError={()=>setFailedSrc(src)}/>:<span aria-hidden="true">{name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?'}</span>}</span>}
export function Modal({open,onClose,title,description,children}) {
 const ref=useRef(null); const titleId=useId(); const descriptionId=useId();const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{const dialog=ref.current;if(!open)return;const previous=document.activeElement;const overflow=document.body.style.overflow;dialog.showModal();(dialog.querySelector('input:not([disabled]),textarea:not([disabled])')||dialog.querySelector('button:not([disabled])'))?.focus();document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=overflow;previous?.focus();};},[open]);
 return <dialog ref={ref} className="ds-modal" aria-labelledby={titleId} aria-describedby={description?descriptionId:undefined} onKeyDown={e=>{if(e.key!=='Tab')return;const nodes=[...e.currentTarget.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if(!first){e.preventDefault();e.currentTarget.focus();}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}} onCancel={e=>{e.preventDefault();closeRef.current();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}><div className="modal-heading"><h2 id={titleId}>{title}</h2><IconButton label="Close dialog" icon="close" variant="ghost" onClick={onClose}/></div>{description&&<p id={descriptionId}>{description}</p>}{children}</dialog>;
}

/** Phosphor icons; aliases preserve the public Button/Icon API. */
const iconComponents = {arrow:ArrowRightIcon, external:ArrowSquareOutIcon, check:CheckIcon,
 close:XIcon, plus:PlusIcon, chevron:CaretDownIcon, more:DotsThreeIcon,
 send:PaperPlaneTiltIcon, save:FloppyDiskIcon,
 book:BookOpenIcon, books:BooksIcon, calendar:CalendarBlankIcon, review:ChatCircleTextIcon,
 heart:HeartIcon, sparkle:SparkleIcon, tag:TagSimpleIcon, target:TargetIcon,
 trophy:TrophyIcon, profile:UserCircleIcon, people:UsersIcon, list:ListBulletsIcon,
 quote:QuotesIcon, search:MagnifyingGlassIcon, star:StarIcon};
export function Icon({name,size='md',weight='regular'}){
 const Glyph=iconComponents[name];
 if(!Glyph)return null;
 return <Glyph className={`ds-icon ${size}`} size={`var(--icon-${size})`} weight={weight}
   color="currentColor" aria-hidden="true" focusable="false"/>;
}
export function IconButton({label,icon='more',size='default',variant='secondary',...props}){return <Button {...props} variant={variant} size={size} className="ds-icon-button" aria-label={label} icon={icon}><span className="sr-only">{label}</span></Button>}
export function Textarea({label,hint,error,id,rows=4,...props}){const generated=useId();const fieldId=id||generated;return <div className="ds-field"><label htmlFor={fieldId}>{label}{props.required&&<span aria-hidden="true"> *</span>}</label><textarea {...props} id={fieldId} rows={rows} aria-invalid={error?true:undefined} aria-describedby={hint||error?`${fieldId}-message`:undefined}/>{(hint||error)&&<span id={`${fieldId}-message`} className={error?'field-error':'field-hint'}>{error||hint}</span>}</div>}
export function Badge({children,tone='neutral',dot=false}){return <span className={`ds-badge ${tone}`}>{dot&&<span className="badge-dot" aria-hidden="true"/>}{children}</span>}
export function ProgressBar({value=0,max=100,label,showValue=true}){const id=useId();const validMax=Number.isFinite(max)&&max>0?max:100;const bounded=Number.isFinite(value)?Math.max(0,Math.min(value,validMax)):0;return <div className="ds-progress"><div className="progress-label"><span id={id}>{label}</span>{showValue&&<span aria-hidden="true">{Math.round(bounded/validMax*100)}%</span>}</div><div role="progressbar" aria-labelledby={id} aria-valuenow={bounded} aria-valuemin={0} aria-valuemax={validMax} className="progress-track"><span style={{width:`${bounded/validMax*100}%`}}/></div></div>}
export function Tabs({items,value,onChange,label='Sections'}){
 const id=useId();const refs=useRef({});const available=items.filter(x=>!x.disabled);const selected=available.find(x=>x.id===value)?.id||available[0]?.id;
 function move(e,item){const index=available.findIndex(x=>x.id===item.id);let next;if(e.key==='ArrowRight')next=available[(index+1)%available.length];if(e.key==='ArrowLeft')next=available[(index-1+available.length)%available.length];if(e.key==='Home')next=available[0];if(e.key==='End')next=available.at(-1);if(next){e.preventDefault();onChange(next.id);refs.current[next.id]?.focus();}}
 return <div className="ds-tabs"><div role="tablist" aria-label={label}>{items.map(item=><button key={item.id} ref={el=>refs.current[item.id]=el} role="tab" type="button" id={`${id}-tab-${item.id}`} aria-controls={`${id}-panel-${item.id}`} aria-selected={selected===item.id} tabIndex={selected===item.id?0:-1} disabled={item.disabled} onClick={()=>onChange(item.id)} onKeyDown={e=>move(e,item)}>{item.label}</button>)}</div>{items.map(item=><div key={item.id} role="tabpanel" id={`${id}-panel-${item.id}`} aria-labelledby={`${id}-tab-${item.id}`} hidden={selected!==item.id} tabIndex={0}>{item.content}</div>)}</div>;
}
export function DropdownMenu({label='Actions',items,icon='chevron'}){
 const[open,setOpen]=useState(false);const id=useId();const root=useRef(null);const trigger=useRef(null);const menu=useRef(null);const nextFocus=useRef('first');
 function focusItems(){return [...(menu.current?.querySelectorAll('[role="menuitem"]:not(:disabled)')||[])];}
 function close(restore=true){setOpen(false);if(restore)trigger.current?.focus();}
 useEffect(()=>{if(!open)return;const nodes=focusItems();(nextFocus.current==='last'?nodes.at(-1):nodes[0])?.focus();function outside(e){if(!root.current?.contains(e.target))setOpen(false);}function escape(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}}document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};},[open]);
 function keys(e){const nodes=focusItems();const index=nodes.indexOf(document.activeElement);let target;if(e.key==='ArrowDown')target=nodes[(index+1)%nodes.length];if(e.key==='ArrowUp')target=nodes[(index-1+nodes.length)%nodes.length];if(e.key==='Home')target=nodes[0];if(e.key==='End')target=nodes.at(-1);if(target){e.preventDefault();target.focus();}if(e.key==='Tab'){setOpen(false);trigger.current?.focus();}if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&e.key!==' '){const ordered=[...nodes.slice(index+1),...nodes.slice(0,index+1)];ordered.find(n=>n.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()))?.focus();}}
 return <div ref={root} className="ds-dropdown" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}><button ref={trigger} type="button" className="ds-button secondary" aria-haspopup="menu" aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>{nextFocus.current='first';setOpen(!open);}} onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();nextFocus.current=e.key==='ArrowUp'?'last':'first';setOpen(true);}}}>{label}<Icon name={icon}/></button>{open&&<div ref={menu} role="menu" aria-label={label} id={id} className="dropdown-panel" onKeyDown={keys}>{items.map(item=><button key={item.id} type="button" role="menuitem" tabIndex={-1} disabled={item.disabled} className={item.danger?'danger':''} onClick={()=>{close();item.onSelect?.();}}>{item.icon&&<Icon name={item.icon}/ >}{item.label}</button>)}</div>}</div>;
}
