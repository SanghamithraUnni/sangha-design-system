export const people = {
 maya: 'Maya Chen', arjun: 'Arjun Mehta', leah: 'Leah Brooks',
 noah: 'Noah Williams', you: 'Sangha Unni',
};
export const channels = [
 {id:'design', name:'design', description:'Thoughtful details. Better experiences.', members:8},
 {id:'launch', name:'product-launch', description:'Everything we need for a confident launch.', members:12},
 {id:'engineering', name:'engineering', description:'Building the next version, together.', members:9},
 {id:'general', name:'general', description:'A little of everything, for everyone.', members:18},
];
export const chats = [
 {id:'maya',name:'Maya Chen',type:'Direct message',members:['maya','you']},
 {id:'arjun',name:'Arjun Mehta',type:'Direct message',members:['arjun','you']},
 {id:'trio',name:'Website working group',type:'Group chat',members:['maya','leah','you']},
];
const message = (id, author, text, time, extra={}) => ({id,author,text,time,...extra});
export const initialTopics = [
 {id:'homepage',channel:'design',subject:'A warmer welcome on the homepage',category:'Feedback',followed:true,unread:3,resolved:false,activity:'11:42',messages:[
  message('h1','maya','I’ve explored a quieter direction for the homepage. Less explaining what we do, more showing what it feels like to work together.\n\nThe main change: one clear story above the fold, with the customer examples doing the heavy lifting below. Would love a second pair of eyes before I share this with the wider team.','10:24',{attachment:{name:'Homepage exploration · v03',detail:'Design notes · 3 frames',body:'Good work starts\nwith common ground.',caption:'A little less noise. A lot more together.'}}),
  message('h2','arjun','This feels much more like us. The customer examples give the headline something concrete to land on.','10:38'),
  message('h3','leah','Love the breathing room. Could we make the first CTA more specific? “See how teams work” feels clearer than “Explore”.','11:06',{reaction:{label:'Agree',count:2,active:false}}),
  message('h4','maya','Good call, Leah. I’ll try that copy. @Sangha, what do you think about the balance between the headline and the product preview?','11:42'),
 ]},
 {id:'onboarding',channel:'design',subject:'Onboarding: the first five minutes',category:'Discussion',followed:true,unread:2,resolved:false,activity:'10:18',messages:[
  message('o1','leah','Five of the six people in yesterday’s usability sessions tried to invite a teammate before creating a project. Could we bring the invite step forward?','09:15'),
  message('o2','arjun','We can make invitations optional on the welcome screen. That avoids blocking people who want to look around first.','10:18'),
 ]},
 {id:'icons',channel:'design',subject:'A small update to our icon sizing',category:'Update',followed:false,unread:0,resolved:true,activity:'Yesterday',messages:[
  message('i1','you','The toolbar now uses the shared 18px icons. We’re keeping 24px for navigation and 14px next to metadata. Checked at 200% zoom too.','Yesterday, 14:10'),
  message('i2','noah','Verified in the staging build. No clipping in the compact controls. Good to close this one.','Yesterday, 15:20'),
 ]},
 {id:'empty-states',channel:'design',subject:'Empty states that help people get started',category:'Feedback',followed:false,unread:1,resolved:false,activity:'Yesterday',messages:[
  message('e1','noah','The first project screen currently says “No projects yet.” I’d like to pair that with an example and one clear next action. Any favourite references?','Yesterday, 16:45'),
 ]},
 {id:'handoff',channel:'design',subject:'Design handoff · November',category:'Discussion',followed:false,unread:0,resolved:false,activity:'Fri',messages:[
  message('d1','arjun','The handoff checklist is ready: responsive states, keyboard behaviour, loading and error copy. Please add open questions here before Wednesday.','Fri, 16:00'),
 ]},
 {id:'checklist',channel:'launch',subject:'Launch checklist & final owners',category:'Discussion',followed:true,unread:2,resolved:false,activity:'11:20',messages:[
  message('l1','maya','We’re targeting Thursday for the customer preview. Leah owns the announcement, Arjun owns the release, and I’ll coordinate support. Can everyone confirm their final checks by Wednesday at 4?','10:00'),
  message('l2','arjun','Release candidate is on staging. Rollback is tested; I’m waiting on the final accessibility review.','11:20'),
 ]},
 {id:'release',channel:'engineering',subject:'Release candidate: keyboard review',category:'Feedback',followed:false,unread:1,resolved:false,activity:'09:30',messages:[
  message('r1','arjun','The new project dialog now returns focus to its trigger. Could someone check the channel picker with a keyboard before we tag the release?','09:30'),
 ]},
 {id:'coffee',channel:'general',subject:'A coffee and a good read',category:'Discussion',followed:false,unread:0,resolved:false,activity:'09:10',messages:[
  message('c1','noah','Friday’s reading circle is on for 3 pm. Bring one thing that changed how you think about your work. Articles, books and half-finished ideas all welcome.','09:10'),
 ]},
];
export const initialChats = {
 maya:[message('dm1','maya','Hey Sangha! I’ve put the homepage direction in #design. No rush, but I’d love your take on the hierarchy before our review tomorrow.','10:30')],
 arjun:[message('dm2','arjun','The compact controls are on staging now. Thanks for the notes on focus states — the difference is really noticeable.','09:40')],
 trio:[message('g1','leah','Keeping website copy questions in here so we can move quickly. I’ve updated the first CTA to “See how teams work”.','10:50'),message('g2','maya','Perfect. I’ll bring the revised frames to our afternoon review.','11:05')],
};
export const STORAGE_KEY = 'sangha-topic-rooms-v1';
export const createInitialState = () => ({topics:structuredClone(initialTopics),chatMessages:structuredClone(initialChats),drafts:{},selectedChannel:'design',selectedTopic:'homepage',selectedChat:null});
export function readState() {
 try {
  const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
  if(saved && Array.isArray(saved.topics) && saved.topics.length && saved.topics.every(t=>t.id&&t.subject&&channels.some(c=>c.id===t.channel)&&Array.isArray(t.messages)) && chats.every(c=>Array.isArray(saved.chatMessages?.[c.id])) && typeof saved.drafts==='object' && saved.drafts && channels.some(c=>c.id===saved.selectedChannel)) return saved;
 } catch { /* A blocked store or invalid snapshot starts a fresh local demo. */ }
 return createInitialState();
}
