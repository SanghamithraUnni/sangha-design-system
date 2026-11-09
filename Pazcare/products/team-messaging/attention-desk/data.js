export const people = {
  you: 'Sangha Unni',
  maya: 'Maya Chen',
  arjun: 'Arjun Mehta',
  leah: 'Leah Brooks',
  noah: 'Noah Williams',
};

export const destinations = [
  { id: 'design', name: '#design', type: 'channel', detail: 'Product design and feedback' },
  { id: 'launch', name: '#product-launch', type: 'channel', detail: 'Release planning and handoffs' },
  { id: 'engineering', name: '#engineering', type: 'channel', detail: 'Builds, fixes and releases' },
  { id: 'maya', name: people.maya, type: 'direct', detail: 'Product design' },
  { id: 'arjun', name: people.arjun, type: 'direct', detail: 'Engineering' },
  { id: 'leah', name: people.leah, type: 'direct', detail: 'Content design' },
  { id: 'web', name: 'Website working group', type: 'group', detail: 'Maya, Leah and you' },
];

const message = (id, author, body, time) => ({ id, author, body, time });
const thread = (id, destination, title, reason, time, messages, extra = {}) => ({
  id, destination, title, reason, time, messages, unread: 0, reviewed: false,
  saved: false, followed: false, muted: false, remindAt: null, ...extra,
});

export const initialThreads = [
  thread('home', 'design', 'Homepage direction', 'Mention', '11:42', [
    message('home-1', 'maya', 'The new homepage is ready for a final look. We’ve moved the customer stories below the product preview so the opening can stay focused on one idea.', '10:24'),
    message('home-2', 'leah', 'I’ve updated the CTA to “See how teams work.” It feels more concrete and still leaves room for the customer stories below.', '11:06'),
    message('home-3', 'maya', '@Sangha, could you confirm the headline and preview order before our review at 2? I can make the final adjustment this morning.', '11:42'),
  ], { unread: 2, context: 'The design team is reviewing the homepage before a customer preview. The discussion started after Tuesday’s usability sessions.' }),
  thread('invite', 'arjun', 'Arjun Mehta', 'Direct message', '11:28', [
    message('invite-1', 'arjun', 'The invite step is on staging. Can you check the empty state on a narrow screen before I hand it over to QA?', '11:28'),
  ], { unread: 1 }),
  thread('release', 'launch', 'Release checklist', 'Reply to you', '10:54', [
    message('release-1', 'you', 'Could we confirm who is checking the first-run experience before we send the preview invites?', '09:42'),
    message('release-2', 'noah', 'I can take the first-run checks. I’ll post the results before the release review.', '10:54'),
  ], { unread: 1, saved: true, context: 'The team is coordinating owners for Thursday’s customer preview.' }),
  thread('copy', 'web', 'Website working group', 'Group chat', '10:18', [
    message('copy-1', 'leah', 'I’ve left two copy options in the review notes. Could we pick one before lunch so Maya can update the frames?', '10:18'),
  ], { unread: 1 }),
  thread('patterns', 'design', 'Empty state patterns', 'Following', '09:36', [
    message('patterns-1', 'noah', 'I added an example project to the empty state. It gives first-time users something to explore while they decide what to create.', '09:36'),
  ], { followed: true }),
  thread('focus', 'engineering', 'Focus restoration on staging', null, 'Yesterday', [
    message('focus-1', 'arjun', 'The new dialog now returns focus to the control that opened it. I’ll keep the keyboard checklist in this thread.', 'Yesterday'),
  ], { context: 'An engineering update for the next staging build.' }),
  thread('notes', 'maya', 'Maya Chen', 'Direct message', 'Yesterday', [
    message('notes-1', 'maya', 'I’ll send the review notes after the customer call. No action needed until then.', 'Yesterday'),
  ], { reviewed: true, saved: true }),
];

const boardSamples = [
  thread('board-design-review', 'design', 'Onboarding checklist', 'Mention', '09:47', [
    message('board-design-review-1', 'arjun', '@Sangha, could you review the invite step before we send the staging build to QA?', '09:47'),
  ], { unread: 1 }),
  thread('board-launch-copy', 'launch', 'Announcement timing', 'Mention', '08:56', [
    message('board-launch-copy-1', 'leah', '@Sangha, can we confirm when the customer announcement goes out? The copy is ready.', '08:56'),
  ], { unread: 1 }),
  thread('board-rollout', 'engineering', 'Staged rollout', 'Reply to you', '10:05', [
    message('board-rollout-1', 'you', 'Can we start with a small rollout on Thursday?', '09:08'),
    message('board-rollout-2', 'arjun', 'We can start at 10% and check the dashboards before widening access.', '10:05'),
  ], { unread: 1 }),
  thread('board-assets', 'design', 'Customer preview assets', 'Reply to you', '09:18', [
    message('board-assets-1', 'you', 'Are the updated images in the review folder?', '08:51'),
    message('board-assets-2', 'maya', 'The new hero image and social preview are ready for review.', '09:18'),
  ], { unread: 1 }),
  thread('board-launch-window', 'launch', 'Go-live window', 'Channel update', '10:24', [
    message('board-launch-window-1', 'maya', 'The customer preview is set for Thursday at 11 am.', '10:24'),
  ], { unread: 1 }),
  thread('board-launch-owners', 'launch', 'Rollout owners', 'Channel update', '09:02', [
    message('board-launch-owners-1', 'noah', 'The rollout checklist now includes an owner for each step.', '09:02'),
  ], { unread: 1 }),
  thread('board-staging', 'engineering', 'Staging build', 'Channel update', '09:32', [
    message('board-staging-1', 'arjun', 'The latest build is on staging and the smoke checks passed.', '09:32'),
  ], { unread: 1 }),
  thread('board-design-notes', 'design', 'Design review notes', 'Channel update', '08:45', [
    message('board-design-notes-1', 'leah', 'The design review notes are ready in the shared workspace.', '08:45'),
  ], { unread: 1 }),
];

export const mentionDetails = {
  'home-3': {
    request: 'Confirm the headline and preview order before the 2 pm review.',
    attachment: {
      title: 'Homepage exploration',
      detail: 'Design notes · 3 frames',
      version: 'v03',
      preview: 'Good work starts with common ground.',
    },
  },
  'board-design-review-1': { request: 'Review the invite step before QA.' },
  'board-launch-copy-1': { request: 'Confirm when the customer announcement goes out.' },
};

export const storageKey = 'sangha-attention-desk-v1';

export function loadDesk() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(saved?.threads) && saved.drafts) {
      const existingIds = new Set(saved.threads.map((item) => item.id));
      return {
        ...saved,
        threads: [...saved.threads, ...boardSamples.filter((item) => !existingIds.has(item.id))],
      };
    }
  } catch {
    // The demo can still run when local storage is unavailable.
  }
  return { threads: [...initialThreads, ...boardSamples], drafts: {} };
}

export function isInInbox(thread, now) {
  if (thread.muted) return false;
  if (thread.remindAt) return thread.remindAt <= now;
  return !thread.reviewed && Boolean(thread.reason || thread.followed);
}
