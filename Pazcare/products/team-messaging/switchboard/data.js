export const people = {
  you: 'Sangha Unni', maya: 'Maya Chen', arjun: 'Arjun Mehta',
  leah: 'Leah Brooks', noah: 'Noah Williams',
};

const message = (id, author, text, time, extras = {}) => ({ id, author, text, time, date: 'Nov 9', ...extras });

const conversations = [
  { id: 'design', name: '#design', type: 'Channel', description: 'Product design and feedback', unread: 0, messages: [
    message('welcome', 'maya', 'Morning! The homepage exploration is ready for another pair of eyes. I’ve moved customer stories below the product preview so the opening can focus on one idea.', '10:24', {
      topic: 'Homepage direction',
      attachment: { name: 'Homepage exploration · v03', detail: 'Design notes · 3 frames', preview: 'Good work starts with common ground.' },
      replies: [
        message('welcome-1', 'leah', 'I updated the CTA to “See how teams work.” The action now feels specific without promising too much.', '10:38'),
        message('welcome-2', 'maya', 'Thanks, Leah. Sangha, could you confirm the headline and preview order before the 2 pm review?', '11:06'),
      ],
    }),
    message('handoff', 'arjun', 'The invitation flow is on staging. I’ve added the narrow layout and keyboard notes to the handoff checklist.', '11:21', {
      topic: 'Invitation flow handoff',
      replies: [message('handoff-1', 'you', 'I’ll do the keyboard pass before QA takes a look.', '11:34')],
    }),
    message('review', 'leah', 'I’ve moved today’s copy questions into the Website working group. The design review is still at 2 pm.', '11:42'),
  ] },
  { id: 'launch', name: '#product-launch', type: 'Channel', description: 'Release planning and handoffs', unread: 2, messages: [
    message('launch-window', 'maya', 'The customer preview is set for Thursday at 11 am. Can we confirm the final owners before we send invites?', '10:24', {
      topic: 'Customer preview schedule',
      replies: [message('launch-window-1', 'noah', 'I’ll own first-run checks and share results before Thursday.', '10:54')],
    }),
    message('launch-copy', 'leah', 'Customer announcement copy is ready. I’ll hold it until the preview invites go out.', '11:02'),
  ] },
  { id: 'engineering', name: '#engineering', type: 'Channel', description: 'Builds, fixes and releases', unread: 1, messages: [
    message('rollout', 'arjun', 'The release candidate is on staging. We’ll start at 10% and check the dashboards before widening access.', '09:32', {
      topic: 'Staged rollout',
      replies: [message('rollout-1', 'noah', 'Rollback is tested. I’ll watch the dashboards during the first hour.', '09:40')],
    }),
  ] },
  { id: 'maya', name: 'Maya Chen', type: 'Direct message', description: 'Product design', unread: 1, messages: [
    message('maya-1', 'maya', 'Could you join the homepage review at 2? I’d like your take on the preview before we show it to the wider team.', '11:45'),
  ] },
  { id: 'web', name: 'Website working group', type: 'Group chat', description: 'Maya, Leah and you', unread: 0, messages: [
    message('web-1', 'leah', 'I left two options for the customer quote. I’d pick the shorter one so the preview stays the focal point.', '10:48'),
    message('web-2', 'maya', 'Agreed. I’ll bring the shorter quote to the review.', '11:15'),
  ] },
  { id: 'arjun', name: 'Arjun Mehta', type: 'Direct message', description: 'Engineering', unread: 0, messages: [] },
  { id: 'leah', name: 'Leah Brooks', type: 'Direct message', description: 'Content design', unread: 0, messages: [] },
  { id: 'noah', name: 'Noah Williams', type: 'Direct message', description: 'Engineering', unread: 0, messages: [] },
];

const additions = {
  design: [
    message('homepage-feedback', 'leah', 'Homepage feedback is in. Keep “See how teams work” as the CTA, move the customer quote below the preview, and shorten the subheading before handoff.', '13:18', {
      topic: 'Homepage feedback',
      replies: [message('homepage-feedback-1', 'maya', 'Agreed. I’ll fold those three changes into v03 before handoff.', '13:27')],
    }),
  ],
  launch: [
    message('launch-decision', 'maya', 'We decided the launch date in today’s release review: Thursday, November 12 at 11 am IST for the customer preview. Noah owns first-run checks and Leah will send the announcement after invites go out.', '14:16', {
      topic: 'Launch date confirmed',
      attachment: { name: 'Launch checklist', detail: 'Release plan · Owners and dates', preview: 'Customer preview · Thursday, November 12 · 11 am IST' },
      replies: [message('launch-decision-1', 'noah', 'Confirmed. The first-run checks are on my list for Thursday morning.', '14:24')],
    }),
  ],
  web: [
    message('web-feedback', 'maya', 'For homepage feedback, please use the #design thread. This group is for copy questions and final customer quote approvals.', '13:02'),
  ],
};

function addSampleMessages(items) {
  return items.map((item) => {
    const existing = new Set(item.messages.map(({ id }) => id));
    const missing = (additions[item.id] ?? []).filter(({ id }) => !existing.has(id));
    if (!missing.length) return item;
    const lastSample = new Set(conversations.find(({ id }) => id === item.id)?.messages.map(({ id }) => id) ?? []);
    const index = item.messages.findIndex(({ id }) => !lastSample.has(id));
    const insertAt = index < 0 ? item.messages.length : index;
    return { ...item, messages: [...item.messages.slice(0, insertAt), ...missing, ...item.messages.slice(insertAt)] };
  });
}

export const storageKey = 'sangha-switchboard-v1';
export function loadSwitchboard() {
  try {
    const state = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(state?.conversations) && state.conversations.length &&
        Array.isArray(state.recents) && state.drafts) {
      return { ...state, conversations: addSampleMessages(state.conversations), searches: state.searches ?? [] };
    }
  } catch {
    // Sample conversations remain available without storage.
  }
  return { conversations: addSampleMessages(conversations), recents: ['design', 'maya', 'launch', 'web'],
    drafts: {}, searches: [], activeId: 'design' };
}

export const searchWords = (query) => query.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

export function getResults(conversations, query, mode) {
  const words = searchWords(query);
  const matches = (...parts) => {
    const text = parts.filter(Boolean).join(' ').toLowerCase();
    return words.every((word) => text.includes(word));
  };
  const rows = [];
  if (mode === 'all' && words.length && matches('new message compose send start')) {
    rows.push({ key: 'compose', group: 'Actions', title: 'New message', detail: 'Choose a destination and compose' });
  }
  for (const conversation of conversations) {
    const { id, name, type, description, messages, unread } = conversation;
    if (mode === 'unread' && !unread) continue;
    const group = type === 'Channel' ? 'Channels' : type === 'Direct message' ? 'People' : 'Group chats';
    if ((mode === 'all' || mode === 'unread' || mode === group.toLowerCase()) && matches(name, description, type)) {
      rows.push({ key: id, id, group: mode === 'unread' ? 'Unread conversations' : group,
        title: name, detail: description, unread });
    }
    if (!['all', 'messages', 'files'].includes(mode) || (mode === 'all' && !words.length)) continue;
    for (const item of messages) {
      for (const entry of [item, ...(item.replies ?? [])]) {
        if (mode !== 'files' && matches(item.topic, entry.text, people[entry.author], name)) {
          rows.push({ key: entry.id, id, group: 'Messages', title: item.topic || `Message from ${people[entry.author]}`,
            detail: entry.text, sender: people[entry.author], channel: name, date: entry.date ?? 'Nov 9', time: entry.time,
            messageId: item.id, thread: entry !== item, replyId: entry !== item ? entry.id : undefined });
        }
      }
      if (mode !== 'messages' && item.attachment && matches(item.attachment.name, item.attachment.detail, people[item.author], name)) {
        rows.push({ key: `${item.id}-file`, id, group: 'Files', title: item.attachment.name,
          detail: item.attachment.detail, sender: people[item.author], channel: name, date: item.date ?? 'Nov 9',
          time: item.time, messageId: item.id });
      }
    }
  }
  return [...new Set(rows.map((row) => row.group))].flatMap((group) =>
    rows.filter((row) => row.group === group),
  );
}

const decisionSamples = [
  { matches: /launch date|launch timing|when.*launch|customer preview|go.live/i, id: 'launch', messageId: 'launch-decision',
    text: 'The team agreed to launch the customer preview on Thursday, November 12 at 11 am IST. Maya recorded the decision in #product-launch after the release review.' },
  { matches: /homepage|hero|cta/i, id: 'design', messageId: 'homepage-feedback',
    text: 'The team kept “See how teams work” as the CTA, moved the customer quote below the preview, and agreed to shorten the subheading before handoff.' },
  { matches: /rollout|release percentage|staging/i, id: 'engineering', messageId: 'rollout',
    text: 'Engineering agreed to start the rollout at 10% and check the dashboards before widening access.' },
];

export function getSimulatedAnswer(conversations, query, asking) {
  const text = query.trim();
  if (!text || (!asking && !/^(where|when|what|who|why|how|did|can|which)\b/i.test(text) && !text.endsWith('?'))) return null;
  const sample = decisionSamples.find((item) => item.matches.test(text));
  const channel = conversations.find(({ id }) => id === sample?.id);
  const message = channel?.messages.find(({ id }) => id === sample.messageId);
  if (!message) return { text: 'I couldn’t find a matching decision in the sample workspace. Try asking about the launch date, homepage feedback, or rollout.' };
  return {
    text: sample.text,
    source: { key: `source-${message.id}`, id: channel.id, group: 'Sources', title: message.topic,
      detail: message.text, sender: people[message.author], channel: channel.name,
      date: message.date ?? 'Nov 9', time: message.time, messageId: message.id },
  };
}
