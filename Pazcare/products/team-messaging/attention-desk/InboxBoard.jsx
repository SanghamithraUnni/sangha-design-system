import React, { useState } from 'react';
import { Avatar, Badge, Button, Card, Icon, Input, Tag } from '../../../design-system/src/components.jsx';
import { destinations, mentionDetails, people } from './data.js';

const categories = [
  { id: 'mentions', title: 'Mentions', caption: 'Messages that mention you', symbol: '@' },
  { id: 'replies', title: 'Thread replies', caption: 'New replies to your conversations', symbol: 'replies' },
  { id: 'updates', title: 'Channel updates', caption: 'Unread messages grouped by channel', symbol: '#' },
];

const channels = destinations.filter((destination) => destination.type === 'channel');
const channelNames = new Map(channels.map(({ id, name }) => [id, name]));
const unreadCount = (items) => items.reduce((count, item) => count + item.unread, 0);

function categoryFor(item) {
  if (item.reason === 'Mention') return 'mentions';
  if (item.reason === 'Reply to you') return 'replies';
  return 'updates';
}

export function getUnreadChannelThreads(inbox) {
  return inbox.filter((item) => item.unread > 0 && channelNames.has(item.destination));
}

function mentionMessage(item) {
  return item.messages.findLast((message) => /@Sangha\b/i.test(message.body)) ?? item.messages.at(-1);
}

function HighlightedMention({ body }) {
  return body.split(/(@Sangha\b)/gi).map((part, index) =>
    /^@Sangha$/i.test(part) ? <mark key={index}>{part}</mark> : part,
  );
}

function MentionCard({ item, onOpen }) {
  const message = mentionMessage(item);
  const details = mentionDetails[message.id];
  const attachment = details?.attachment;
  return (
    <Card className="ad-mention-card">
      <div className="ad-mention-message">
        <Avatar name={people[message.author]} />
        <div>
          <div className="ad-board-byline">
            <strong>{people[message.author]}</strong>
            <span>{channelNames.get(item.destination)}</span>
            <time>{message.time}</time>
          </div>
          <p><HighlightedMention body={message.body} /></p>
          {attachment && (
            <button className="ad-board-attachment" data-board-opener={`${item.id}-attachment`}
              onClick={(event) => onOpen(item, event.currentTarget)}
              aria-label={`Open ${item.title} and its attachment`}>
              <span className="ad-attachment-thumbnail" aria-hidden="true">
                <span>COMMON GROUND</span><strong>{attachment.preview}</strong>
              </span>
              <span><strong>{attachment.title}</strong><small>{attachment.detail}</small></span>
              <Badge>{attachment.version}</Badge>
            </button>
          )}
        </div>
      </div>
      <div className={`ad-mention-action ${details?.request ? 'has-request' : ''}`}>
        {details?.request && <p><Icon name="check" size="sm" /><span><strong>Requested action</strong>{details.request}</span></p>}
        <Button variant={details?.request ? 'primary' : 'secondary'} size="compact" data-board-opener={item.id}
          onClick={(event) => onOpen(item, event.currentTarget)} aria-label={`Open ${item.title}`}>Open thread</Button>
      </div>
    </Card>
  );
}

function ReplyRow({ item, onOpen }) {
  const message = item.messages.at(-1);
  const replies = item.messages.length - 1;
  return (
    <li>
      <button className="ad-timeline-row" data-board-opener={item.id} onClick={(event) => onOpen(item, event.currentTarget)}>
        <Avatar name={people[message.author]} size="sm" />
        <span className="ad-timeline-copy">
          <span className="ad-board-byline"><strong>{people[message.author]}</strong><time>{message.time}</time></span>
          <strong>{item.title}</strong>
          <span className="ad-timeline-preview">{message.body}</span>
          <span className="ad-timeline-meta">{channelNames.get(item.destination)} <Badge>{replies} {replies === 1 ? 'reply' : 'replies'}</Badge></span>
        </span>
      </button>
    </li>
  );
}

function ChannelGroups({ items, expanded, onToggle, onOpen }) {
  return channels.map((channel) => {
    const group = items.filter((item) => item.destination === channel.id);
    if (!group.length) return null;
    const open = expanded[channel.id];
    return (
      <div className="ad-channel-group" key={channel.id}>
        <button className="ad-channel-toggle" onClick={() => onToggle(channel.id)}
          aria-expanded={open} aria-controls={`ad-group-${channel.id}`}>
          <strong>{channel.name}</strong>
          <Badge tone="accent">{unreadCount(group)} unread</Badge>
          <Icon name="chevron" size="sm" />
        </button>
        <ul id={`ad-group-${channel.id}`} hidden={!open}>
          {group.map((item) => {
            const message = item.messages.at(-1);
            return (
              <li key={item.id}>
                <button className="ad-update-row" data-board-opener={item.id} onClick={(event) => onOpen(item, event.currentTarget)}>
                  <span className="ad-unread-dot" aria-hidden="true" />
                  <span><strong>{people[message.author]}</strong><span className="ad-update-preview">{message.body}</span></span>
                  <time>{message.time}</time>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  });
}

export function InboxBoard({ items, headingRef, scrollRef, inert, onOpen }) {
  const [query, setQuery] = useState('');
  const [channelId, setChannelId] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [expanded, setExpanded] = useState({ design: false, launch: true, engineering: false });
  const search = query.trim().toLowerCase();
  const matches = items.filter((item) => {
    if (channelId && channelId !== item.destination) return false;
    const searchable = [
      item.title, channelNames.get(item.destination),
      ...item.messages.flatMap((message) => [people[message.author], message.body, mentionDetails[message.id]?.attachment?.title]),
    ];
    return !search || searchable.some((text) => text?.toLowerCase().includes(search));
  });
  const total = unreadCount(items);
  const channelCount = new Set(items.map((item) => item.destination)).size;
  const grouped = Object.fromEntries(categories.map(({ id }) => [
    id, matches.filter((item) => categoryFor(item) === id),
  ]));

  function chooseCategory(id) {
    setCategoryId(id);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }

  return (
    <section className="ad-inbox-board" aria-labelledby="ad-queue-title" ref={scrollRef} inert={inert}>
      <header className="ad-board-header">
        <div className="ad-board-heading">
          <h1 id="ad-queue-title" ref={headingRef} tabIndex={-1}>Inbox</h1>
          <div className="ad-board-total" role="status">
            <strong>{total} unread</strong><span>across {channelCount} {channelCount === 1 ? 'channel' : 'channels'}</span>
          </div>
        </div>
        <div className="ad-board-toolbar">
          <Input label="Search unread" type="search" placeholder="Search unread…" className="ad-search"
            value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="ad-channel-filter">
            <label htmlFor="ad-channel-filter">Channel</label>
            <select id="ad-channel-filter" value={channelId} onChange={(event) => setChannelId(event.target.value)}>
              <option value="">All channels</option>
              {channels.map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)}
            </select>
          </div>
          <div className="ad-board-filters" role="group" aria-label="Unread categories">
            <Tag selected={categoryId === 'all'} onToggle={() => chooseCategory('all')}>All unread <span>{unreadCount(matches)}</span></Tag>
            {categories.map(({ id, title }) => (
              <Tag key={id} selected={categoryId === id} onToggle={() => chooseCategory(id)}>{title} <span>{unreadCount(grouped[id])}</span></Tag>
            ))}
          </div>
        </div>
      </header>
      <div className={`ad-board-columns ${categoryId === 'all' ? '' : 'ad-board-single'}`}>
        {categories.filter(({ id }) => categoryId === 'all' || categoryId === id).map(({ id, title, caption, symbol }) => (
          <section key={id} className={`ad-board-section ad-board-${id}`} aria-labelledby={`ad-board-${id}`}>
            <header>
              <span className="ad-category-symbol" aria-hidden="true">{symbol === 'replies' ? <Icon name="more" size="lg" /> : symbol}</span>
              <div><h2 id={`ad-board-${id}`}>{title} <span>· {unreadCount(grouped[id])}</span></h2><p>{caption}</p></div>
              <Button variant="ghost" size="compact" icon={categoryId === 'all' ? 'arrow' : undefined} iconPosition="end"
                aria-label={categoryId === 'all' ? `View all ${title.toLowerCase()}` : 'Show all categories'}
                onClick={() => chooseCategory(categoryId === 'all' ? id : 'all')}>
                {categoryId === 'all' ? 'View all' : 'Show board'}
              </Button>
            </header>
            <div className="ad-section-content">
              {!grouped[id].length && <p className="ad-board-empty">No unread {title.toLowerCase()} match these filters.</p>}
              {id === 'mentions' && grouped[id].map((item) => <MentionCard key={item.id} item={item} onOpen={onOpen} />)}
              {id === 'replies' && <ol className="ad-timeline">{grouped[id].map((item) => <ReplyRow key={item.id} item={item} onOpen={onOpen} />)}</ol>}
              {id === 'updates' && <ChannelGroups items={grouped[id]} expanded={expanded} onOpen={onOpen}
                onToggle={(id) => setExpanded((current) => ({ ...current, [id]: !current[id] }))} />}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
