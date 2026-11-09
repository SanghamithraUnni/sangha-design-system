import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SparkleIcon } from '@phosphor-icons/react/dist/csr/Sparkle';
import {
  Avatar, Badge, Button, Card, Icon, Input, Modal, Tag, Textarea,
} from '../../../design-system/src/components.jsx';
import { getResults, getSimulatedAnswer, loadSwitchboard, people, searchWords, storageKey } from './data.js';
import './switchboard.css';

const modeNames = {
  all: 'Search the workspace',
  channels: 'Browse channels',
  people: 'Browse people',
  unread: 'Unread conversations',
  messages: 'Search messages',
  files: 'Find a file',
  ask: 'Ask about a decision',
};
const clock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

const searchFilters = [
  ['all', 'All'], ['people', 'People'], ['channels', 'Channels'],
  ['messages', 'Messages'], ['files', 'Files'],
];

function Highlight({ text, query }) {
  const words = [...new Set(searchWords(query))];
  if (!words.length) return text;
  const expression = new RegExp(`(${words.join('|')})`, 'gi');
  return text.split(expression).map((part, index) =>
    index % 2 ? <mark key={index}>{part}</mark> : part,
  );
}

function preview(text, query) {
  if (text.length <= 175) return text;
  const words = searchWords(query);
  const matches = words.map((word) => text.toLowerCase().indexOf(word)).filter((index) => index >= 0);
  const start = matches.length ? Math.max(0, Math.min(...matches) - 36) : 0;
  return `${start ? '…' : ''}${text.slice(start, start + 175)}${text.length > start + 175 ? '…' : ''}`;
}

function Message({ item, onThread, onFile, targeted }) {
  const author = people[item.author];
  const count = item.replies?.length ?? 0;
  return (
    <article className={`sb-message ${targeted ? 'sb-target-message' : ''}`} id={`sb-message-${item.id}`} tabIndex={-1}>
      <Avatar name={author} />
      <div className="sb-message-copy">
        <div className="sb-byline"><strong>{author}</strong><time>{item.date ? `${item.date} · ` : ''}{item.time}</time></div>
        <p>{item.text}</p>
        {item.attachment && (
          <button className="sb-file" type="button" onClick={() => onFile(item.attachment)}>
            <span className="sb-file-art" aria-hidden="true">CG<span>·</span></span>
            <span><strong>{item.attachment.name}</strong><small>{item.attachment.detail}</small></span>
            <Icon name="arrow" size="sm" />
          </button>
        )}
        {onThread && (
          <Button size="compact" variant={count ? 'accent' : 'ghost'} onClick={() => onThread(item)}>
            {count ? `${count} ${count === 1 ? 'reply' : 'replies'}` : 'Reply in thread'}
          </Button>
        )}
      </div>
    </article>
  );
}

export function Switchboard() {
  const [state, setState] = useState(loadSwitchboard);
  const [landing, setLanding] = useState(true);
  const [threadId, setThreadId] = useState(null);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [returnSearch, setReturnSearch] = useState(null);
  const [targetMessage, setTargetMessage] = useState(null);
  const [modal, setModal] = useState(null);
  const [destination, setDestination] = useState('');
  const [newBody, setNewBody] = useState('');
  const [notice, setNotice] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);
  const command = useRef(null);
  const commandRegion = useRef(null);
  const pane = useRef(null);
  const title = useRef(null);
  const landingTitle = useRef(null);
  const focusLanding = useRef(false);
  const composer = useRef(null);
  const positions = useRef(new Map());
  const nextPosition = useRef(null);
  const focusConversation = useRef(false);
  const active = state.conversations.find((item) => item.id === state.activeId) ?? state.conversations[0];
  const thread = active.messages.find((item) => item.id === threadId);
  const draftKey = thread ? `${active.id}/${thread.id}` : active.id;
  const draft = state.drafts[draftKey] ?? '';
  const unread = state.conversations.reduce((count, item) => count + item.unread, 0);
  const recents = state.recents.map((id) => state.conversations.find((item) => item.id === id)).filter(Boolean);
  const answer = searchOpen && ['all', 'ask'].includes(mode)
    ? getSimulatedAnswer(state.conversations, query, mode === 'ask') : null;
  const found = getResults(state.conversations, query, mode === 'ask' ? 'all' : mode);
  const results = answer?.source ? [answer.source, ...found] : found;
  const resultIndex = Math.min(highlight, results.length - 1);
  const selectedResult = results[resultIndex];
  const groups = [...new Set(results.map((item) => item.group))];

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      setStorageAvailable(false);
    }
  }, [state]);

  useLayoutEffect(() => {
    if (landing) {
      if (focusLanding.current) landingTitle.current?.focus({ preventScroll: true });
      focusLanding.current = false;
      return;
    }
    if (!pane.current) return;
    const position = nextPosition.current;
    if (position?.messageId) {
      document.getElementById(`sb-message-${position.messageId}`)?.scrollIntoView({ block: 'nearest' });
    } else {
      pane.current.scrollTop = position?.end ? pane.current.scrollHeight : positions.current.get(draftKey) ?? 0;
    }
    nextPosition.current = null;
    if (focusConversation.current) title.current?.focus({ preventScroll: true });
    focusConversation.current = false;
  }, [landing, draftKey, active.messages, thread?.replies]);

  useEffect(() => {
    if (searchOpen && selectedResult && (query.trim() || highlight > 0)) {
      document.getElementById(`sb-result-${selectedResult.key}`)?.scrollIntoView({ block: 'nearest' });
    }
  }, [searchOpen, highlight, selectedResult?.key, query]);

  function openCommand(nextMode = 'all', nextQuery = '', nextHighlight = 0) {
    setMode(nextMode);
    setQuery(nextQuery);
    setHighlight(nextHighlight);
    setSearchOpen(true);
    command.current?.focus({ preventScroll: true });
  }

  function closeCommand() {
    setSearchOpen(false);
    setMode('all');
    setHighlight(0);
  }

  function rememberScroll() {
    if (pane.current) positions.current.set(draftKey, pane.current.scrollTop);
  }

  function openConversation(id, { messageId, openThread = false, replyId } = {}) {
    rememberScroll();
    const nextThread = openThread ? messageId : null;
    const position = replyId ?? (openThread ? undefined : messageId);
    setTargetMessage(position ?? null);
    if (!landing && active.id === id && threadId === nextThread) {
      title.current?.focus({ preventScroll: true });
      if (position) document.getElementById(`sb-message-${position}`)?.scrollIntoView({ block: 'nearest' });
    } else {
      nextPosition.current = { messageId: position };
      focusConversation.current = true;
    }
    setThreadId(nextThread);
    setLanding(false);
    setState((current) => ({
      ...current,
      activeId: id,
      recents: [id, ...current.recents.filter((entry) => entry !== id)].slice(0, 5),
      conversations: current.conversations.map((item) =>
        item.id === id && item.unread ? { ...item, unread: 0 } : item,
      ),
    }));
    closeCommand();
  }

  function startMessage() {
    closeCommand();
    setDestination('');
    setNewBody('');
    setModal({ type: 'compose' });
  }

  function chooseResult(row) {
    if (!row) return;
    if (row.key === 'compose') {
      startMessage();
      return;
    }
    setReturnSearch({ mode, query, highlight: results.indexOf(row) });
    const term = query.trim();
    if (term) setState((current) => ({
      ...current, searches: [term, ...current.searches.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 5),
    }));
    setQuery('');
    openConversation(row.id, { messageId: row.messageId, openThread: row.thread, replyId: row.replyId });
  }

  function openThread(item) {
    rememberScroll();
    setTargetMessage(null);
    focusConversation.current = true;
    setThreadId(item.id);
  }

  function backToConversation() {
    rememberScroll();
    focusConversation.current = true;
    setThreadId(null);
  }

  function returnToLanding() {
    rememberScroll();
    closeCommand();
    setQuery('');
    setReturnSearch(null);
    focusLanding.current = true;
    setLanding(true);
  }

  function selectRecent(id) {
    setReturnSearch(null);
    openConversation(id);
  }

  useEffect(() => {
    function shortcuts(event) {
      if (modal || event.defaultPrevented || event.isComposing) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openCommand('all', query);
        command.current?.select();
      } else if (event.altKey && event.code === 'KeyU') {
        event.preventDefault();
        openCommand('unread');
      } else if (event.altKey && /^Digit[1-5]$/.test(event.code)) {
        const recent = recents[Number(event.code.at(-1)) - 1];
        if (recent) {
          event.preventDefault();
          selectRecent(recent.id);
        }
      }
    }
    window.addEventListener('keydown', shortcuts);
    return () => window.removeEventListener('keydown', shortcuts);
  });

  useEffect(() => {
    if (!searchOpen) return;
    function dismiss(event) {
      if (!commandRegion.current?.contains(event.target)) closeCommand();
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [searchOpen]);

  function sendMessage(id, body, parentId = null, clearDraft = null) {
    const text = body.trim();
    if (!text) return;
    const now = new Date();
    const message = { id: crypto.randomUUID(), author: 'you', text, time: clock.format(now),
      date: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(now) };
    nextPosition.current = { end: true };
    setState((current) => ({
      ...current,
      activeId: id,
      recents: [id, ...current.recents.filter((entry) => entry !== id)].slice(0, 5),
      drafts: clearDraft ? { ...current.drafts, [clearDraft]: '' } : current.drafts,
      conversations: current.conversations.map((item) => {
        if (item.id !== id) return item;
        const messages = parentId
          ? item.messages.map((entry) => entry.id === parentId
            ? { ...entry, replies: [...(entry.replies ?? []), message] }
            : entry)
          : [...item.messages, message];
        return { ...item, messages, unread: 0 };
      }),
    }));
    setNotice(parentId ? 'Reply sent.' : 'Message sent.');
  }

  function submitReply(event) {
    event.preventDefault();
    sendMessage(active.id, draft, thread?.id, draftKey);
    composer.current?.focus({ preventScroll: true });
  }

  function submitNew(event) {
    event.preventDefault();
    if (!destination || !newBody.trim()) return;
    rememberScroll();
    setThreadId(null);
    setTargetMessage(null);
    setReturnSearch(null);
    setModal(null);
    focusConversation.current = true;
    setLanding(false);
    sendMessage(destination, newBody);
  }

  const openFile = (attachment) => setModal({ type: 'file', attachment });
  const visibleMessages = thread ? thread.replies ?? [] : active.messages;

  const commandDock = (
    <section className={`sb-command-area ${searchOpen ? 'sb-search-open' : ''}`} aria-label="Workspace navigation">
        {searchOpen && <div className="sb-search-scrim" aria-hidden="true" />}
        <div className="sb-command-wrap" ref={commandRegion}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) closeCommand();
          }}>
          {searchOpen && (
            <div className="sb-results">
              <div className="sb-results-heading">
                <div><p className="sb-kicker">Command dock</p><strong>{modeNames[mode]}</strong></div>
                <Button variant="ghost" size="compact" icon="close" onClick={() => {
                  command.current?.focus({ preventScroll: true });
                  closeCommand();
                }}>Close search</Button>
              </div>
              <div className="sb-search-filters" role="group" aria-label="Search filters">
                {searchFilters.map(([id, label]) => (
                  <Tag key={id} selected={mode === id} onToggle={() => openCommand(id, query)}>{label}</Tag>
                ))}
              </div>
              <div className="sb-result-body">
                {!query.trim() && (mode === 'all' || mode === 'ask') && (
                  <div className="sb-search-history">
                    <p className="sb-kicker">{state.searches.length ? 'Recent searches' : 'Try a search'}</p>
                    {(state.searches.length ? state.searches : ['launch date', 'Maya', 'homepage feedback']).map((term) => (
                      <Button key={term} size="compact" variant="secondary" onClick={() => openCommand(mode, term)}>{term}</Button>
                    ))}
                  </div>
                )}
                {mode === 'ask' && !query.trim() && <p className="sb-result-empty">Try “Where did we decide the launch date?”</p>}
                {answer && (
                  <Card className="sb-answer">
                    <Badge tone="accent">Simulated AI</Badge>
                    <p>{answer.text}</p>
                    {answer.source && <small>Open the source below to read the original message.</small>}
                  </Card>
                )}
                <div id="sb-results" role="listbox" aria-label={modeNames[mode]}>
                  {groups.map((group) => (
                    <div className="sb-result-group" role="group" aria-label={group} key={group}>
                      <p className="sb-kicker" aria-hidden="true">{group}</p>
                      {results.filter((row) => row.group === group).map((row) => (
                        <div role="option" tabIndex={-1} aria-selected={row.key === selectedResult?.key}
                          key={row.key} id={`sb-result-${row.key}`} className="sb-result"
                          onPointerDown={(event) => { if (event.pointerType === 'mouse') event.preventDefault(); }}
                          onClick={() => chooseResult(row)}>
                          <span>
                            <strong><Highlight text={row.title} query={query} /></strong>
                            {row.sender && <small className="sb-result-meta"><Highlight text={`${row.sender} · ${row.channel} · ${row.date}, ${row.time}`} query={query} /></small>}
                            <small className="sb-result-preview"><Highlight text={preview(row.detail, query)} query={query} /></small>
                          </span>
                          {row.unread > 0 && <Badge tone="accent">{row.unread} unread</Badge>}
                          <Icon name="arrow" size="sm" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {!results.length && !answer && mode !== 'ask' && (
                  <p className="sb-result-empty" role="status">{mode === 'unread' && !query ? 'You’re caught up.' : 'No matches. Try another search.'}</p>
                )}
              </div>
              <footer className="sb-search-footer">↑ ↓ to browse · Enter to open · Esc to close</footer>
            </div>
          )}
          <div className="sb-command-line">
            <Input ref={command} className="sb-command" label="Search workspace" type="text"
              role="combobox" aria-autocomplete="list" aria-expanded={searchOpen}
              aria-controls={searchOpen ? 'sb-results' : undefined}
              aria-activedescendant={searchOpen && selectedResult ? `sb-result-${selectedResult.key}` : undefined}
              autoComplete="off" value={query} placeholder={mode === 'ask' ? 'Ask about a decision…' : 'Find a person, channel or message…'}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlight(0);
                setSearchOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return;
                if (event.key === 'Escape') {
                  closeCommand();
                } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  if (!searchOpen) {
                    setSearchOpen(true);
                    return;
                  }
                  if (!results.length) return;
                  const step = event.key === 'ArrowDown' ? 1 : -1;
                  setHighlight((resultIndex + step + results.length) % results.length);
                } else if (event.key === 'Enter' && searchOpen) {
                  event.preventDefault();
                  chooseResult(selectedResult);
                }
              }} />
            <kbd className="sb-command-hint">⌘ / Ctrl K</kbd>
          </div>
        </div>
        <div className="sb-tools">
          <Button variant="secondary" size="compact" onClick={() => openCommand('ask')}>
            <span className="sb-ai-label">
              <SparkleIcon size="var(--icon-md)" aria-hidden="true" focusable="false" />
              Ask about a decision
            </span>
          </Button>
          <Button variant="secondary" size="compact" onClick={() => openCommand('files')}>Find a file</Button>
          <Button icon="plus" size="compact" onClick={startMessage}>New message</Button>
        </div>
      </section>
  );

  return (
    <div className={`sb-app ${landing ? 'sb-landing' : 'sb-in-conversation'}`}>
      <header className="sb-bar">
        <div className="sb-brand"><span aria-hidden="true">sw<span>·</span></span><strong>Switchboard</strong></div>
        <span className="sb-workspace">Common ground <span aria-hidden="true">/</span> Studio workspace</span>
        <div className="sb-header-tools">
          <Button variant="ghost" size="compact" onClick={() => openCommand('people')}>Browse people</Button>
          <Button variant="ghost" size="compact" onClick={() => openCommand('channels')}>Browse channels</Button>
          <Button variant="secondary" size="compact" onClick={() => openCommand('unread')}>
            Activity {unread > 0 && <Badge tone="accent">{unread} unread</Badge>}
          </Button>
        </div>
        <div className="sb-account"><Avatar name={people.you} size="sm" /><span>{people.you}</span></div>
      </header>
      <div className="sb-stage">
      {landing ? (
        <main className="sb-landing-hero" aria-labelledby="sb-landing-title">
          <p className="sb-kicker">Studio workspace</p>
          <h1 id="sb-landing-title" ref={landingTitle} tabIndex={-1}>Where do you want to go?</h1>
          <p className="sb-landing-description">Jump to a person, find a conversation, or look up a decision.</p>
          {commandDock}
        </main>
      ) : (
      <main className="sb-conversation" aria-labelledby="sb-title">
        <div className="sb-thread-head">
          <div>
            {thread && <Button variant="ghost" size="compact" onClick={backToConversation}>Back to {active.name}</Button>}
            <p className="sb-kicker">{thread ? `${active.name} / Thread` : active.type}</p>
            <h1 id="sb-title" ref={title} tabIndex={-1}>{thread?.topic ?? (thread ? 'Thread' : active.name)}</h1>
            {!thread && <p>{active.description}</p>}
          </div>
          <div className="sb-conversation-actions">
            <Button variant="ghost" size="compact" onClick={returnToLanding}>Search home</Button>
            {returnSearch && (
              <Button variant="secondary" size="compact"
                onClick={() => openCommand(returnSearch.mode, returnSearch.query, returnSearch.highlight)}>Back to results</Button>
            )}
          </div>
        </div>
        <div className="sb-message-scroll" ref={pane}>
          {thread && <Card className="sb-parent"><Message item={thread} onFile={openFile} /></Card>}
          <div className="sb-message-divider"><span>{thread ? 'Thread replies' : 'Conversation history'}</span></div>
          <div role="log" aria-label="Messages">
            {visibleMessages.map((item) => (
              <Message key={item.id} item={item} targeted={targetMessage === item.id} onThread={thread ? undefined : openThread} onFile={openFile} />
            ))}
          </div>
          {!visibleMessages.length && <p className="sb-empty">{thread ? 'Start the thread with a reply.' : 'Send the first message to start the conversation.'}</p>}
        </div>
        <form className="sb-composer" onSubmit={submitReply}>
          <Textarea ref={composer} label={thread ? `Reply in ${active.name} · ${thread.topic ?? 'Thread'}` : `Message ${active.name}`}
            placeholder={thread ? 'Write a reply…' : 'Write a message…'} rows={2} value={draft}
            onChange={(event) => {
              const value = event.target.value;
              setState((current) => ({ ...current, drafts: { ...current.drafts, [draftKey]: value } }));
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && !event.nativeEvent.isComposing) submitReply(event);
            }} />
          <div className="sb-compose-footer">
            <span>{storageAvailable ? 'Drafts saved on this device' : 'Browser storage unavailable'}</span>
            <Button type="submit" icon="send" size="compact" disabled={!draft.trim()}>{thread ? 'Send reply' : 'Send message'}</Button>
          </div>
        </form>
      </main>
      )}
        <aside className="sb-recents" aria-labelledby="sb-recents-title">
          <div className="sb-recent-heading">
            <p className="sb-kicker">Pick up where you left off</p>
            <h2 id="sb-recents-title">Recent conversations</h2>
          </div>
          <div className="sb-recent-list">
            {recents.map((item, index) => {
              const last = item.messages.at(-1);
              const hasDraft = Object.entries(state.drafts).some(([key, value]) =>
                (key === item.id || key.startsWith(`${item.id}/`)) && value.trim(),
              );
              return (
                <button key={item.id} type="button" onClick={() => selectRecent(item.id)}
                  aria-current={!landing && item.id === active.id ? 'page' : undefined}
                  title={`Switch to ${item.name} · Alt+${index + 1}`}>
                  <span className="sb-recent-name">{item.name}</span>
                  {item.unread > 0 && <Badge tone="accent">{item.unread}<span className="sr-only"> unread</span></Badge>}
                  {hasDraft && <Badge>Draft</Badge>}
                  <small>{last?.text ?? item.description}</small>
                </button>
              );
            })}
          </div>
          <p className="sb-recent-hint">Alt 1–5 to switch</p>
        </aside>
      </div>

      {!landing && commandDock}
      <span role="status" className="sr-only">{notice}</span>
      <Modal open={modal?.type === 'compose'} title="New message" onClose={() => setModal(null)}>
        <form className="sb-new-form" onSubmit={submitNew}>
          <div className="ds-field">
            <label htmlFor="sb-destination">Send to</label>
            <select id="sb-destination" value={destination} onChange={(event) => setDestination(event.target.value)} required>
              <option value="">Choose a destination</option>
              {state.conversations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>
          <Textarea label="Message" value={newBody} onChange={(event) => setNewBody(event.target.value)} required />
          <Button type="submit" icon="send" disabled={!destination || !newBody.trim()}>Send message</Button>
        </form>
      </Modal>
      <Modal open={modal?.type === 'file'} title={modal?.attachment?.name ?? 'File preview'}
        description={modal?.attachment?.detail} onClose={() => setModal(null)}>
        <Card className="sb-file-preview" treatment="feature">
          <p className="sb-kicker">Common ground · Design preview</p>
          <h3>{modal?.attachment?.preview}</h3>
        </Card>
      </Modal>
    </div>
  );
}
