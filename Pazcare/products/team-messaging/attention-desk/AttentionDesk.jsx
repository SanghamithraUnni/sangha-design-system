import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar, Badge, Button, DropdownMenu, Icon, IconButton, Input, Modal, Textarea,
} from '../../../design-system/src/components.jsx';
import { destinations, isInInbox, loadDesk, mentionDetails, people, storageKey } from './data.js';
import { InboxBoard, getUnreadChannelThreads } from './InboxBoard.jsx';
import './attention-desk.css';

const views = [
  ['inbox', 'Inbox'], ['later', 'Later'], ['saved', 'Saved'], ['reviewed', 'Reviewed'],
  ['people', 'People'], ['channels', 'Channels'],
];
const descriptions = {
  inbox: 'Mentions, replies and conversations you follow.',
  later: 'Conversations you’ve set aside for another time.',
  saved: 'Conversations you want to keep close.',
  reviewed: 'Conversations you’ve already handled.',
  people: 'Find a teammate or group conversation.',
  channels: 'Browse the workspace and catch up on channel activity.',
};
const timeLabel = (value) => new Intl.DateTimeFormat(undefined, {
  hour: 'numeric', minute: '2-digit',
}).format(value);
const reminderLabel = (value) => new Intl.DateTimeFormat(undefined, {
  weekday: 'short', hour: 'numeric', minute: '2-digit',
}).format(value);
const newMessage = (body) => ({
  id: crypto.randomUUID(), author: 'you', body: body.trim(), time: timeLabel(new Date()),
});

export function AttentionDesk() {
  const [desk, setDesk] = useState(loadDesk);
  const [view, setView] = useState('inbox');
  const [query, setQuery] = useState('');
  const [destinationId, setDestinationId] = useState(null);
  const [selectedId, setSelectedId] = useState(() => desk.threads.find(
    (item) => isInInbox(item, Date.now()),
  )?.id);
  const [reading, setReading] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [composeTo, setComposeTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [now, setNow] = useState(Date.now);
  const [notice, setNotice] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);
  const queueHeading = useRef(null);
  const threadHeading = useRef(null);
  const messagePane = useRef(null);
  const boardScroll = useRef(null);
  const boardReturn = useRef(null);
  const focusTarget = useRef(null);
  const scrollToReply = useRef(false);

  const { threads, drafts } = desk;
  const inbox = threads.filter((item) => isInInbox(item, now));
  const boardItems = getUnreadChannelThreads(inbox);
  const boardOpen = view === 'inbox' && reading;
  const boardUnread = boardItems.reduce((count, item) => count + item.unread, 0);
  const later = threads.filter((item) => item.remindAt > now)
    .sort((a, b) => a.remindAt - b.remindAt);
  const selected = threads.find((item) => item.id === selectedId);
  const selectedDestination = destinations.find((item) => item.id === selected?.destination);
  const directory = view === 'people' || view === 'channels';
  const directoryDestination = destinations.find((item) => item.id === destinationId);
  const draft = drafts[selectedId] || '';
  const search = query.trim().toLowerCase();
  const heading = directoryDestination?.name || views.find(([key]) => key === view)[1];
  const candidates = {
    inbox, later, saved: threads.filter((item) => item.saved),
    reviewed: threads.filter((item) => item.reviewed && !item.remindAt),
  };
  const queue = (directory ? threads.filter((item) => item.destination === destinationId) : candidates[view])
    .filter((item) => {
      const destination = destinations.find((entry) => entry.id === item.destination);
      return !search || [item.title, destination?.name, ...item.messages.map((message) => message.body)]
        .some((text) => text?.toLowerCase().includes(search));
    });
  const directoryEntries = destinations.filter((item) =>
    (view === 'channels' ? item.type === 'channel' : item.type !== 'channel') &&
    `${item.name} ${item.detail}`.toLowerCase().includes(search),
  );

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(desk));
    } catch {
      setStorageAvailable(false);
    }
  }, [desk]);

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = setInterval(refresh, 15_000);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  useEffect(() => {
    if (!focusTarget.current || dialog) return;
    if (focusTarget.current === 'board') {
      const previous = boardReturn.current;
      if (boardScroll.current && previous) boardScroll.current.scrollTop = previous.scrollTop;
      const opener = previous?.openerKey && boardScroll.current?.querySelector(
        `[data-board-opener="${CSS.escape(previous.openerKey)}"]`,
      );
      (opener || queueHeading.current)?.focus({ preventScroll: true });
      boardReturn.current = null;
    } else {
      const target = focusTarget.current === 'thread' ? threadHeading : queueHeading;
      target.current?.focus({ preventScroll: true });
    }
    focusTarget.current = null;
  }, [reading, selectedId, view, destinationId, dialog]);

  useEffect(() => {
    const pane = messagePane.current;
    if (pane) pane.scrollTop = scrollToReply.current ? pane.scrollHeight : 0;
    scrollToReply.current = false;
  }, [reading, selectedId, selected?.messages.length]);

  function updateThread(id, change) {
    setDesk((current) => ({
      ...current,
      threads: current.threads.map((item) => item.id === id ? { ...item, ...change } : item),
    }));
  }

  function changeView(next) {
    if (next !== view || reading || destinationId) focusTarget.current = 'queue';
    setView(next);
    setQuery('');
    setDestinationId(null);
    setReading(false);
    setSelectedId(candidates[next]?.[0]?.id);
  }

  function openThread(item, opener) {
    if (view === 'inbox') {
      boardReturn.current = {
        openerKey: opener?.dataset.boardOpener,
        scrollTop: boardScroll.current?.scrollTop ?? 0,
        unread: item.unread,
      };
    }
    if (item.id !== selectedId || !reading) focusTarget.current = 'thread';
    setSelectedId(item.id);
    setReading(true);
    if (item.unread) updateThread(item.id, { unread: 0 });
  }

  function returnToQueue() {
    focusTarget.current = view === 'inbox' ? 'board' : 'queue';
    setReading(false);
  }

  function advance(change, feedback) {
    if (view === 'inbox') {
      updateThread(selectedId, change);
      setNotice(feedback);
      returnToQueue();
      return;
    }
    const next = queue[queue.indexOf(selected) + 1] || queue.find((item) => item.id !== selectedId);
    updateThread(selectedId, change);
    setNotice(feedback);
    focusTarget.current = reading && next ? 'thread' : 'queue';
    setSelectedId(next?.id);
    if (!next) setReading(false);
  }

  function review() {
    if (selected.reviewed) {
      updateThread(selectedId, {
        reviewed: false, reason: selected.reason || 'For review', remindAt: null, muted: false,
      });
      setNotice('Returned to Inbox.');
    } else {
      advance({ reviewed: true, unread: 0, remindAt: null }, 'Conversation reviewed.');
    }
  }

  function snooze(remindAt) {
    setDialog(null);
    advance({ remindAt, reviewed: false }, `Reminder set for ${reminderLabel(remindAt)}.`);
  }

  function startCompose(destination = '') {
    setComposeTo(destination);
    setSubject('');
    setBody('');
    setDialog('compose');
  }

  function sendReply(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    const reply = newMessage(draft);
    scrollToReply.current = true;
    setDesk((current) => {
      const thread = current.threads.find((item) => item.id === selectedId);
      return {
        drafts: { ...current.drafts, [selectedId]: '' },
        threads: [
          { ...thread, messages: [...thread.messages, reply], time: reply.time, unread: 0 },
          ...current.threads.filter((item) => item.id !== selectedId),
        ],
      };
    });
    setNotice('Reply sent.');
  }

  function sendNew(event) {
    event.preventDefault();
    const destination = destinations.find((item) => item.id === composeTo);
    if (!destination || !body.trim() || (destination.type === 'channel' && !subject.trim())) return;
    const existing = destination.type !== 'channel' && threads.find((item) => item.destination === destination.id);
    const reply = newMessage(body);
    const item = existing
      ? { ...existing, messages: [...existing.messages, reply], time: reply.time, unread: 0 }
      : {
        id: crypto.randomUUID(), destination: destination.id, title: subject.trim() || destination.name,
        reason: null, time: reply.time, messages: [reply], unread: 0, reviewed: false,
        saved: false, followed: false, muted: false, remindAt: null,
      };
    scrollToReply.current = true;
    setDesk((current) => ({
      ...current, threads: [item, ...current.threads.filter((entry) => entry.id !== item.id)],
    }));
    setView(destination.type === 'channel' ? 'channels' : 'people');
    setDestinationId(destination.id);
    setQuery('');
    setDialog(null);
    focusTarget.current = 'thread';
    setSelectedId(item.id);
    setReading(true);
    setNotice('Message sent.');
  }

  const needsSubject = destinations.find((item) => item.id === composeTo)?.type === 'channel';
  const actionItems = selected ? [
    { id: 'follow', label: selected.followed ? 'Unfollow conversation' : 'Follow conversation',
      onSelect: () => updateThread(selectedId, { followed: !selected.followed }) },
    { id: 'mute', label: selected.muted ? 'Unmute conversation' : 'Mute conversation',
      onSelect: () => {
        if (!selected.muted && view === 'inbox') advance({ muted: true }, 'Conversation muted.');
        else updateThread(selectedId, { muted: !selected.muted });
      } },
    ...(selected.context ? [{ id: 'context', label: 'View channel context', onSelect: () => setDialog('context') }] : []),
  ] : [];

  return (
    <div className={`ad-app ${reading ? 'ad-reading' : ''}`}>
      <header className="ad-bar" inert={boardOpen}>
        <div className="ad-brand"><span className="ad-mark" aria-hidden="true">ad<span>·</span></span><strong>Attention Desk</strong></div>
        <span className="ad-workspace">Common ground <span aria-hidden="true">/</span> Studio workspace</span>
        <div className="ad-account"><Avatar name={people.you} size="sm" /><span>{people.you}</span></div>
      </header>

      <aside className="ad-rail" inert={boardOpen}>
        <Button icon="plus" onClick={() => startCompose()}>New message</Button>
        <nav aria-label="Attention Desk">
          <p className="ad-kicker">Personal desk</p>
          {views.slice(0, 4).map(([key, label]) => (
            <button key={key} type="button" className="ad-nav-item" aria-current={view === key ? 'page' : undefined}
              onClick={() => changeView(key)}>
              <span>{label}</span>
              {key === 'inbox' && <Badge tone={view === key ? 'accent' : 'neutral'}>{boardUnread}</Badge>}
              {key === 'later' && later.length > 0 && <Badge>{later.length}</Badge>}
            </button>
          ))}
          <p className="ad-kicker ad-workspace-label">Workspace</p>
          {views.slice(4).map(([key, label]) => (
            <button key={key} type="button" className="ad-nav-item" aria-current={view === key ? 'page' : undefined}
              onClick={() => changeView(key)}>{label}</button>
          ))}
        </nav>
        <div className="ad-rail-foot"><span className="ad-kicker">Common ground</span><span>Messaging exploration 02</span></div>
      </aside>

      <main className={`ad-main ${view === 'inbox' ? 'ad-main-board' : ''}`}>
        {view === 'inbox' ? (
          <InboxBoard items={boardItems} headingRef={queueHeading} scrollRef={boardScroll}
            inert={boardOpen} onOpen={openThread} />
        ) : (
        <section className="ad-queue" aria-labelledby="ad-queue-title">
          <header className="ad-queue-header">
            <p className="ad-kicker">{directory ? 'Workspace directory' : 'Your attention'}</p>
            {directoryDestination && <Button variant="ghost" size="compact" onClick={() => changeView(view)}>Back to {view}</Button>}
            <h1 id="ad-queue-title" ref={queueHeading} tabIndex={-1}>{heading}</h1>
            <p>{directoryDestination?.detail || descriptions[view]}</p>
            {directoryDestination && <Button variant="secondary" icon="plus" onClick={() => startCompose(destinationId)}>New message</Button>}
            <Input label={directory && !destinationId ? 'Search directory' : 'Search conversations'}
              type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder={directory && !destinationId ? 'Find a destination…' : 'Search conversations…'} className="ad-search" />
          </header>
          <div className="ad-queue-scroll">
            {directory && !destinationId ? (
              directoryEntries.length ? directoryEntries.map((item) => (
                <button key={item.id} type="button" className="ad-directory-row" onClick={() => {
                  focusTarget.current = 'queue';
                  setDestinationId(item.id);
                  setQuery('');
                  setSelectedId(threads.find((thread) => thread.destination === item.id)?.id);
                }}>
                  {item.type === 'direct' ? <Avatar name={item.name} size="sm" /> : <span className="ad-destination-mark" aria-hidden="true">{item.type === 'channel' ? '#' : 'CG'}</span>}
                  <span><strong>{item.name}</strong><small>{item.detail}</small></span>
                  <Icon name="arrow" size="sm" />
                </button>
              )) : <div className="ad-empty"><h2>No matching destinations</h2><p>Try a different name.</p></div>
            ) : (
              <>
                <div className="ad-queue-summary"><span>{queue.length} {queue.length === 1 ? 'conversation' : 'conversations'}</span><span>{view === 'later' ? 'Next reminder' : 'Recent activity'}</span></div>
                {queue.map((item) => {
                  const last = item.messages.at(-1);
                  const destination = destinations.find((entry) => entry.id === item.destination);
                  return (
                    <button key={item.id} type="button" className="ad-row"
                      aria-current={item.id === selectedId ? 'true' : undefined} onClick={() => openThread(item)}>
                      <Avatar name={people[last.author]} size="sm" />
                      <span className="ad-row-copy">
                        <span className="ad-row-meta"><span>{destination.type === 'channel' ? destination.name : destination.type === 'group' ? 'Group chat' : 'Direct message'}</span><span>{view === 'later' ? reminderLabel(item.remindAt) : item.time}</span></span>
                        <strong>{item.title}</strong>
                        <span className="ad-preview">{last.body}</span>
                        <span className="ad-row-status">
                          {item.reason && destination.type === 'channel' && <span>{item.reason}</span>}
                          {item.followed && item.reason !== 'Following' && <span>Following</span>}
                          {item.unread > 0 && <Badge tone="accent" dot>{item.unread} unread</Badge>}
                          {item.reviewed && <Badge>Reviewed</Badge>}
                        </span>
                      </span>
                    </button>
                  );
                })}
                {!queue.length && (
                  <div className="ad-empty">
                    <h2>{query ? 'No matches' : 'No conversations here'}</h2>
                    <p>{query ? 'Try another search.' : descriptions[view]}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        )}

        {boardOpen && <div className="ad-board-scrim" onClick={returnToQueue} aria-hidden="true" />}
        {(view !== 'inbox' || boardOpen) && (
        <section className={`ad-thread ${boardOpen ? 'ad-thread-drawer' : ''}`}
          aria-labelledby="ad-thread-title" role={boardOpen ? 'dialog' : undefined}
          aria-modal={boardOpen ? true : undefined}
          onKeyDown={(event) => {
            if (boardOpen && !dialog && event.key === 'Escape' && !event.defaultPrevented) returnToQueue();
            if (boardOpen && !dialog && event.key === 'Tab') {
              const controls = [...event.currentTarget.querySelectorAll('button:not(:disabled), textarea, a[href]')]
                .filter((control) => control.tabIndex >= 0 && control.getClientRects().length);
              const first = controls[0];
              const last = controls.at(-1);
              if (event.shiftKey && (document.activeElement === first || document.activeElement === threadHeading.current)) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }
          }}>
          {selected ? (
            <>
              <header className="ad-thread-header">
                {boardOpen ? (
                  <div className="ad-drawer-top">
                    <span className="ad-kicker">Inbox / Conversation</span>
                    <IconButton label="Close conversation" icon="close" variant="ghost" onClick={returnToQueue} />
                  </div>
                ) : <Button className="ad-back" variant="ghost" size="compact" onClick={returnToQueue}>Back to {heading}</Button>}
                <div className="ad-thread-title-row">
                  <div>
                    <p className="ad-kicker">{selectedDestination.type === 'channel' ? selectedDestination.name : selectedDestination.type === 'group' ? 'Group conversation' : 'Direct message'}</p>
                    <h2 id="ad-thread-title" ref={threadHeading} tabIndex={-1}>{selected.title}</h2>
                  </div>
                  <DropdownMenu key={selected.id} label="More" icon="more" items={actionItems} />
                </div>
                <div className="ad-actions">
                  {boardOpen && (
                    <Button variant="secondary" size="compact" onClick={() => {
                      const unread = selected.unread ? 0 : Math.max(1, boardReturn.current?.unread ?? 1);
                      updateThread(selectedId, { unread });
                      setNotice(unread ? 'Conversation marked unread.' : 'Conversation marked read.');
                    }}>{selected.unread ? 'Mark read' : 'Mark unread'}</Button>
                  )}
                  <Button variant="secondary" size="compact" icon="check" onClick={review}>
                    {selected.reviewed ? 'Return to inbox' : 'Mark reviewed'}
                  </Button>
                  {selected.remindAt > now ? (
                    <Button variant="ghost" size="compact" onClick={() => advance({
                      remindAt: null, reason: selected.reason || 'For review', muted: false,
                    }, 'Returned to Inbox.')}>Move to inbox</Button>
                  ) : (
                    <Button variant="ghost" size="compact" onClick={() => setDialog('later')}>Remind later</Button>
                  )}
                  <Button variant="ghost" size="compact" icon={selected.saved ? 'check' : 'save'} aria-pressed={selected.saved}
                    onClick={() => updateThread(selectedId, { saved: !selected.saved })}>{selected.saved ? 'Saved' : 'Save'}</Button>
                </div>
              </header>
              <div className="ad-messages" ref={messagePane}>
                <div className="ad-thread-context">
                  <span className="ad-kicker">Conversation</span>
                  <div>
                    {selected.remindAt > now && <Badge>Reminds {reminderLabel(selected.remindAt)}</Badge>}
                    {selected.followed && <Badge>Following</Badge>}
                    {selected.muted && <Badge>Muted</Badge>}
                    {selected.reviewed && <Badge tone="success">Reviewed</Badge>}
                    {selected.context && <Button variant="ghost" size="compact" onClick={() => setDialog('context')}>Channel context</Button>}
                  </div>
                </div>
                <div role="log" aria-label="Conversation messages">
                  {selected.messages.map((message) => (
                    <article key={message.id} className="ad-message">
                      <Avatar name={people[message.author]} />
                      <div>
                        <div className="ad-message-byline"><strong>{people[message.author]}</strong><span>{message.time}</span></div>
                        <p>{message.body}</p>
                        {mentionDetails[message.id]?.attachment && (
                          <div className="ad-thread-attachment">
                            <strong>{mentionDetails[message.id].attachment.title}</strong>
                            <p>{mentionDetails[message.id].attachment.detail} · {mentionDetails[message.id].attachment.version}</p>
                            <p>{mentionDetails[message.id].attachment.preview}</p>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <form className="ad-composer" onSubmit={sendReply}>
                <Textarea label={selectedDestination.type === 'channel'
                  ? `Reply in ${selectedDestination.name} · ${selected.title}`
                  : `Reply to ${selectedDestination.name}`}
                  rows={2} placeholder="Write a reply…" value={draft}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDesk((current) => ({ ...current, drafts: { ...current.drafts, [selectedId]: value } }));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && !event.nativeEvent.isComposing) sendReply(event);
                  }} />
                <div className="ad-composer-footer">
                  <span>{storageAvailable ? 'Drafts are saved on this device' : 'Browser storage is unavailable'}</span>
                  <Button type="submit" icon="send" disabled={!draft.trim()}>Send reply</Button>
                </div>
              </form>
            </>
          ) : (
            <div className="ad-thread-empty">
              <h2 id="ad-thread-title">Choose a conversation</h2>
              <p>Open a conversation to read it and reply here.</p>
            </div>
          )}
        </section>
        )}
      </main>

      <span role="status" className="sr-only">{notice}</span>
      <Modal open={dialog === 'later'} onClose={() => setDialog(null)} title="Remind me later"
        description="This conversation will return to Inbox when the reminder is due.">
        <div className="ad-dialog-actions">
          <Button variant="secondary" onClick={() => snooze(Date.now() + 60 * 60 * 1000)}>In one hour</Button>
          <Button variant="secondary" onClick={() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            snooze(tomorrow.getTime());
          }}>Tomorrow at 9 am</Button>
        </div>
      </Modal>
      <Modal open={dialog === 'context'} onClose={() => setDialog(null)}
        title="Around this conversation" description={selectedDestination?.name}>
        <p className="ad-context-copy">{selected?.context}</p>
      </Modal>
      <Modal open={dialog === 'compose'} onClose={() => setDialog(null)} title="New message">
        <form onSubmit={sendNew}>
          <div className="ds-field">
            <label htmlFor="ad-destination">Send to</label>
            <select id="ad-destination" required value={composeTo} onChange={(event) => setComposeTo(event.target.value)}>
              <option value="">Choose a destination</option>
              {destinations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>
          {needsSubject && <Input label="Subject" value={subject} required maxLength={120} onChange={(event) => setSubject(event.target.value)} />}
          <Textarea label="Message" rows={4} required value={body} onChange={(event) => setBody(event.target.value)} />
          <Button type="submit" icon="send" disabled={!composeTo || !body.trim() || (needsSubject && !subject.trim())}>Send message</Button>
        </form>
      </Modal>
    </div>
  );
}
