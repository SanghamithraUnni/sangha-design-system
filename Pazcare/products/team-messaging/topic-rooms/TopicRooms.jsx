import React, {useEffect,useRef,useState} from 'react';
import {Avatar,Badge,Button,Icon,Input,Modal,Tag,Textarea} from '../../../design-system/src/components.jsx';
import {channels,chats,people,readState,STORAGE_KEY} from './data.js';
import './topic-rooms.css';

const clock = () => new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit'}).format(new Date());
const uid = () => globalThis.crypto?.randomUUID?.() || `local-${Date.now()}-${Math.random()}`;
export function TopicRooms() {
 const [state,setState]=useState(readState);
 const [filter,setFilter]=useState('All');
 const [query,setQuery]=useState('');
 const [modal,setModal]=useState(null);
 const [subject,setSubject]=useState('');
 const [opening,setOpening]=useState('');
 const [notice,setNotice]=useState('');
 const [storageError,setStorageError]=useState(false);
 const [view,setView]=useState('conversation');
 const [attachment,setAttachment]=useState(null);
 const messageEnd=useRef(null);
 const messageScroll=useRef(null);
 const previousMessageCount=useRef(0);
 const conversationHeading=useRef(null);
 const listHeading=useRef(null);
 const sidebarHeading=useRef(null);
 const needsFocus=useRef(false);
 const channel=channels.find(c=>c.id===state.selectedChannel)||channels[0];
 const chat=chats.find(c=>c.id===state.selectedChat);
 const topic=state.topics.find(t=>t.id===state.selectedTopic&&t.channel===channel.id);
 const destination=chat?chat.name:topic?.subject;
 const draftKey=chat?`chat:${chat.id}`:topic?.id;
 const messages=chat?state.chatMessages[chat.id]:(topic?.messages||[]);
 const draft=state.drafts[draftKey]||'';
 const channelTopics=state.topics.filter(t=>t.channel===channel.id);
 const normalized=query.trim().toLowerCase();
 const visibleTopics=channelTopics.filter(t=>(filter!=='Unread'||t.unread>0)&&(filter!=='Following'||t.followed)&&(!normalized||`${t.subject} ${t.messages.map(m=>m.text).join(' ')}`.toLowerCase().includes(normalized)));
 const visibleChannels=channels.filter(c=>!normalized||c.name.includes(normalized)||state.topics.some(t=>t.channel===c.id&&`${t.subject} ${t.messages.map(m=>m.text).join(' ')}`.toLowerCase().includes(normalized)));

 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));setStorageError(false);}catch{setStorageError(true);}},[state]);
 useEffect(()=>{if(messageScroll.current)messageScroll.current.scrollTop=0;previousMessageCount.current=messages.length;},[draftKey]);
 useEffect(()=>{if(messages.length>previousMessageCount.current&&messages.at(-1)?.author==='you')messageEnd.current?.scrollIntoView?.({block:'nearest'});previousMessageCount.current=messages.length;},[messages.length]);
 useEffect(()=>{if(needsFocus.current){({conversation:conversationHeading,topics:listHeading,sidebar:sidebarHeading})[view]?.current?.focus();needsFocus.current=false;}},[view,state.selectedTopic,state.selectedChat,state.selectedChannel]);
 function go(next){needsFocus.current=true;setView(next);}
 function selectChannel(id){
  setState(s=>({...s,selectedChannel:id,selectedChat:null,selectedTopic:s.topics.find(t=>t.channel===id)?.id}));
  setFilter('All');go('topics');
 }
 function selectTopic(id){setState(s=>({...s,selectedChat:null,selectedTopic:id,topics:s.topics.map(t=>t.id===id?{...t,unread:0}:t)}));go('conversation');}
 function selectChat(id){setState(s=>({...s,selectedChat:id}));go('conversation');}
 function changeTopic(patch){setState(s=>({...s,topics:s.topics.map(t=>t.id===topic.id?{...t,...patch}:t)}));}
 function send(e){
  e.preventDefault();if(!draft.trim()||!draftKey)return;
  const msg={id:uid(),author:'you',text:draft.trim(),time:clock()};
  setState(s=>({...s,drafts:{...s.drafts,[draftKey]:''},...(chat?{chatMessages:{...s.chatMessages,[chat.id]:[...s.chatMessages[chat.id],msg]}}:{topics:[...s.topics.filter(t=>t.id===topic.id).map(t=>({...t,messages:[...t.messages,msg],activity:msg.time,unread:0})),...s.topics.filter(t=>t.id!==topic.id)]})}));
  setNotice('Message sent.');
 }
 function createTopic(e){
  e.preventDefault();if(!subject.trim()||!opening.trim())return;
  const id=uid(),time=clock();
  const next={id,channel:channel.id,subject:subject.trim(),category:'Discussion',followed:true,resolved:false,unread:0,activity:time,messages:[{id:uid(),author:'you',text:opening.trim(),time}]};
  setState(s=>({...s,topics:[next,...s.topics],selectedTopic:id,selectedChat:null}));setModal(null);setSubject('');setOpening('');setQuery('');setFilter('All');go('conversation');setNotice('Topic created. You’re following this discussion.');
 }
 function reactTo(id){setState(s=>({...s,topics:s.topics.map(t=>t.id!==topic.id?t:{...t,messages:t.messages.map(m=>m.id!==id?m:{...m,reaction:{...m.reaction,active:!m.reaction.active,count:m.reaction.count+(m.reaction.active?-1:1)}})})}));}
 const unreadCount=id=>state.topics.filter(t=>t.channel===id).reduce((n,t)=>n+t.unread,0);

 return <div className={`tr-app tr-view-${view}`}>
  <a className="tr-skip" href="#conversation">Skip to conversation</a>
  <aside className="tr-sidebar" aria-label="Workspace navigation">
   <a className="tr-brand" href="/topic-rooms.html"><span className="tr-monogram" aria-hidden="true">cg<span>·</span></span><span>common ground<span className="tr-brand-caption">A place to work together</span></span></a>
   <div className="tr-workspace"><span className="tr-workspace-mark">S</span><div><strong>Studio workspace</strong><span>18 people · one shared space</span></div></div>
   <div className="tr-nav-body">
    <div className="tr-section-label"><h2 ref={sidebarHeading} tabIndex={-1}>Channels</h2><Button size="compact" variant="ghost" onClick={()=>setModal('channels')}>Browse</Button></div>
    <nav aria-label="Channels">{channels.map(c=><button key={c.id} className={`tr-nav-row ${!chat&&channel.id===c.id?'is-selected':''}`} aria-current={!chat&&channel.id===c.id?'page':undefined} onClick={()=>selectChannel(c.id)}><span className="tr-hash" aria-hidden="true">#</span><span>{c.name}</span>{unreadCount(c.id)>0&&<Badge tone={!chat&&channel.id===c.id?'accent':'neutral'}>{unreadCount(c.id)}<span className="sr-only"> unread replies</span></Badge>}</button>)}</nav>
    <div className="tr-section-label tr-spaced"><h2>Direct messages</h2></div>
    <nav aria-label="Direct messages">{chats.filter(c=>c.type==='Direct message').map(c=><button key={c.id} aria-label={c.name} className={`tr-nav-row ${chat?.id===c.id?'is-selected':''}`} aria-current={chat?.id===c.id?'page':undefined} onClick={()=>selectChat(c.id)}><Avatar name={c.name} size="sm"/><span>{c.name}</span></button>)}</nav>
    <div className="tr-section-label tr-spaced"><h2>Group chats</h2></div>
    <button className={`tr-nav-row ${chat?.id==='trio'?'is-selected':''}`} aria-current={chat?.id==='trio'?'page':undefined} onClick={()=>selectChat('trio')}><span className="tr-group-mark" aria-hidden="true">3</span><span>Website working group</span></button>
    <div className="tr-sidebar-note"><span className="tr-eyebrow">A little more clarity</span><p>One topic. One conversation.<br/>Room for every good idea.</p></div>
   </div>
   <footer className="tr-profile"><Avatar name={people.you} size="sm"/><div><strong>{people.you}</strong><span>Product designer</span></div><a href="/design-system/" aria-label="Open design-system showcase" title="Design-system showcase"><Icon name="external"/></a></footer>
  </aside>

  <header className="tr-topbar"><div className="tr-topbar-path"><span>Workspace</span><span aria-hidden="true">/</span><strong>{chat&&view==='conversation'?'Messages':`# ${channel.name}`} </strong></div><span className="tr-topbar-note">Good conversations move work forward.</span><Avatar name={people.you} size="sm"/></header>

  <main className="tr-workspace-main">
   <section className="tr-topics" aria-labelledby="topic-list-heading">
    <div className="tr-topics-heading"><Button variant="ghost" size="compact" className="tr-mobile-nav" onClick={()=>go('sidebar')}>Channels</Button><div className="tr-eyebrow">Your shared space</div><h1 id="topic-list-heading" ref={listHeading} tabIndex={-1}># {channel.name}</h1><p>{channel.description}</p><div className="tr-channel-meta"><span className="tr-mini-avatars"><Avatar name={people.maya} size="sm"/><Avatar name={people.arjun} size="sm"/><Avatar name={people.leah} size="sm"/></span><span>{channel.members} members</span></div><Button icon="plus" onClick={()=>setModal('new')}>Start a topic</Button></div>
    <div className="tr-topic-tools"><Input label="Search channels and topics" type="search" placeholder="Find a conversation…" value={query} onChange={e=>setQuery(e.target.value)}/><div className="tr-filters" aria-label="Filter topics">{['All','Unread','Following'].map(f=><Tag key={f} selected={filter===f} onToggle={()=>setFilter(f)}>{f}{f==='Unread'&&` (${channelTopics.filter(t=>t.unread>0).length})`}</Tag>)}</div><div className="tr-list-meta"><span>{visibleTopics.length} {visibleTopics.length===1?'topic':'topics'}</span><span>Recent activity</span></div></div>
    <div className="tr-topic-list">{visibleTopics.length?visibleTopics.map(t=><button className={`tr-topic-row ${!chat&&topic?.id===t.id?'is-selected':''}`} key={t.id} onClick={()=>selectTopic(t.id)} aria-current={!chat&&topic?.id===t.id?'true':undefined}><div className="tr-topic-top"><span>{t.category}</span><span>{t.activity}</span></div><h2>{t.subject}</h2><p>{t.messages.at(-1)?.text}</p><div className="tr-topic-bottom"><span><Avatar name={people[t.messages[0]?.author]||people.you} size="sm"/>{t.messages.length-1} {t.messages.length===2?'reply':'replies'}</span>{t.resolved?<Badge tone="success">Resolved</Badge>:t.unread>0?<Badge tone="accent">{t.unread} unread</Badge>:t.followed?<span className="tr-following"><Icon name="check" size="sm"/>Following</span>:null}</div></button>):<div className="tr-empty"><h2>No topics here</h2><p>{query?'Try another search.':filter==='Following'?'Follow a topic to find it here.':filter==='Unread'?'You’re all caught up.':'Start the first conversation.'}</p><Button variant="secondary" onClick={()=>{setQuery('');setFilter('All');}}>Show all topics</Button></div>}</div>
    <footer className="tr-topic-footer"><span className="tr-quiet-dot" aria-hidden="true"/>A home for the whole conversation.</footer>
   </section>

   <section className="tr-conversation" id="conversation" aria-labelledby="conversation-heading">
    <header className="tr-conversation-header"><div><Button className="tr-back" size="compact" variant="ghost" onClick={()=>go('topics')}>Back to topics</Button><div className="tr-eyebrow">{chat?chat.type:`# ${channel.name} / Topic`}</div><h2 id="conversation-heading" ref={conversationHeading} tabIndex={-1}>{destination||'Choose a conversation'}</h2></div>{topic&&!chat&&<Button variant={topic.followed?'accent':'secondary'} size="compact" icon={topic.followed?'check':undefined} aria-label={topic.followed?'Unfollow topic':'Follow topic'} aria-pressed={topic.followed} onClick={()=>changeTopic({followed:!topic.followed})}>{topic.followed?'Following':'Follow topic'}</Button>}</header>
    {destination?<><div className="tr-conversation-meta"><span>{chat?`${chat.members.length} people in this conversation`:`Started by ${people[topic.messages[0]?.author]||people.you}`}</span>{!chat&&<button className={`tr-status ${topic.resolved?'is-resolved':''}`} onClick={()=>{changeTopic({resolved:!topic.resolved});setNotice(topic.resolved?'Topic reopened.':'Topic marked resolved. You can still reply.');}} aria-label={topic.resolved?'Reopen topic':'Mark topic resolved'}>{topic.resolved&&<Icon name="check" size="sm"/>}{topic.resolved?'Resolved · Reopen':'Open · Mark resolved'}</button>}</div>
    <div className="tr-message-scroll" ref={messageScroll}><div className="tr-date-divider"><span>Conversation history</span></div><div className="tr-messages" role="log" aria-label="Messages" aria-live="polite" aria-relevant="additions">{messages.map((m,index)=><article key={m.id} className={`tr-message ${!chat&&index===0?'tr-opening':''}`}><Avatar name={people[m.author]||people.you}/><div className="tr-message-body"><div className="tr-message-byline"><strong>{people[m.author]||people.you}</strong>{m.author==='you'&&<span className="tr-you">You</span>}<span>{m.time}</span>{!chat&&index===0&&<span className="tr-original">Started this topic</span>}</div><p>{m.text}</p>{m.attachment&&<button className="tr-attachment" onClick={()=>{setAttachment(m.attachment);setModal('attachment');}} aria-label={`Open ${m.attachment.name}`}><span className="tr-attachment-preview"><span className="tr-preview-brand">common ground</span><strong>{m.attachment.body}</strong><span>{m.attachment.caption}</span><span className="tr-preview-pill">Make room for better work <Icon name="arrow" size="sm"/></span><span className="tr-preview-orbits" aria-hidden="true"><i/><i/><i/></span></span><span className="tr-attachment-caption"><span><strong>{m.attachment.name}</strong><span>{m.attachment.detail}</span></span><Icon name="external"/></span></button>}{m.reaction&&<button className="tr-reaction" aria-pressed={m.reaction.active} aria-label={`${m.reaction.active?'Remove':'Add'} agreement reaction, ${m.reaction.count} agreements`} onClick={()=>reactTo(m.id)}><Icon name="check" size="sm"/>{m.reaction.label} <strong>{m.reaction.count}</strong></button>}</div></article>)}</div><div ref={messageEnd}/></div>
    <div className="tr-compose-wrap"><form className="tr-composer" onSubmit={send}><Textarea label={`Reply ${chat?`to ${chat.name}`:`in ${topic.subject}`}`} placeholder="Add to the conversation…" rows={2} value={draft} onChange={e=>setState(s=>({...s,drafts:{...s.drafts,[draftKey]:e.target.value}}))} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();send(e);}}}/><div className="tr-compose-actions"><span>Enter for a new line · Ctrl / ⌘ Enter to send</span><Button type="submit" icon="send" size="compact" disabled={!draft.trim()}>Send</Button></div></form><div className="tr-compose-note"><span>{storageError?'Changes are kept for this visit; browser storage is unavailable.':'Drafts and messages saved on this device.'}</span><span>Topic Rooms · Exploration 01</span></div></div></>:<div className="tr-empty"><h2>A fresh start</h2><p>Choose a topic or start a new conversation.</p><Button onClick={()=>setModal('new')}>Start a topic</Button></div>}
   </section>
  </main>
  <span className="sr-only" role="status">{notice}</span>
  <Modal open={modal==='new'} onClose={()=>setModal(null)} title="Start a topic" description={`A little context goes a long way. Start a conversation in #${channel.name}.`}><form onSubmit={createTopic}><Input label="Subject" placeholder="What would you like to discuss?" required maxLength={160} value={subject} onChange={e=>setSubject(e.target.value)}/><Textarea label="Opening message" placeholder="Give the team some context…" required value={opening} onChange={e=>setOpening(e.target.value)}/><div className="tr-modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Cancel</Button><Button type="submit" disabled={!subject.trim()||!opening.trim()}>Create topic</Button></div></form></Modal>
  <Modal open={modal==='channels'} onClose={()=>setModal(null)} title="Find a channel" description="Browse your shared spaces, or search their conversations."><div className="tr-directory"><Input label="Search channel directory" type="search" value={query} onChange={e=>setQuery(e.target.value)}/>{visibleChannels.map(c=><button key={c.id} className="tr-directory-row" onClick={()=>{selectChannel(c.id);setModal(null);}}><strong># {c.name}</strong><span>{c.description}</span></button>)}{!visibleChannels.length&&<p>No matching channels. Try another search.</p>}</div></Modal>
  <Modal open={modal==='attachment'} onClose={()=>setModal(null)} title={attachment?.name||'Design preview'} description="Shared by Maya Chen · Homepage direction"><div className="tr-preview-detail"><span className="tr-eyebrow">The idea behind the frames</span><h3>One story. A little more space.</h3><p>Lead with a clear promise, show the product in context, then let customer stories build confidence.</p><ol><li>A calmer opening with one primary action.</li><li>A product preview that shows a real team at work.</li><li>Customer examples grouped by the work they do.</li></ol><p>Review question: does the headline give the product preview enough room?</p></div></Modal>
 </div>;
}
