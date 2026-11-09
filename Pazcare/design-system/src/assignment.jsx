import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import { Badge, Card, Icon } from './components.jsx';
import './assignment.css';

const previews = import.meta.glob('./demo-previews/*.png', { eager: true, query: '?url', import: 'default' });

const groups = [
  {
    id: 'messaging', number: '01', title: 'Team Messaging',
    demos: [
      ['Topic Rooms', 'topic-rooms', 'Organise ongoing discussions around named topics within each channel.'],
      ['Attention Desk · Catch-up Board', 'attention-desk', 'See mentions, thread replies and channel updates together, then open a conversation from the board.', 'I chose Attention Desk for the moment someone comes back to a busy workspace and needs to catch up. Mentions, thread replies and channel updates sit side by side, so they can decide what needs a reply and respond from the board. Switchboard is better when they already know which channel they want.'],
      ['Switchboard', 'switchboard', 'Find and jump to the right channel, person or conversation from a search-led workspace.'],
    ],
  },
  {
    id: 'reader-profile', number: '02', title: 'Goodreads Reader Profile',
    demos: [
      ['Reading Journal · Year Ribbon', 'reading-journal', 'Explore SK’s reading through a month-by-month timeline of books, milestones and reviews.'],
      ['Pick a Feeling · Shelf Postcards', 'pick-a-feeling', 'Choose a mood to discover a book SK picked and the shelf it came from.', 'I chose Pick a Feeling because SK describes herself as a mood reader. Choosing a mood reveals a book she picked and the shelf it came from, so visitors have a place to start even if she hasn’t written a review or there’s only one pick. It works best when SK keeps her mood tags up to date.'],
      ['Our Books in Common · Reading Duet', 'books-in-common', 'Compare how you and SK rated and responded to books you’ve both read.'],
    ],
  },
];

function Assignment() {
  return (
    <div className="assignment">
      <a className="assignment-skip" href="#main">Skip to content</a>
      <header className="assignment-header">
        <span>Sanghamithra Unni</span>
        <Badge>Product design</Badge>
      </header>
      <main id="main">
        <section className="assignment-hero" aria-labelledby="assignment-title">
          <p className="assignment-eyebrow">Portfolio to product</p>
          <h1 id="assignment-title">Pazcare Product<br className="assignment-break" /> Design Assignment</h1>
          <p>I turned the visual language of my portfolio into a reusable design system, then used it to explore three directions each for team messaging and a Goodreads reader profile.</p>
        </section>
        {groups.map(group => (
          <section key={group.id} className="assignment-section" aria-labelledby={group.id}>
            <div className="assignment-heading"><span aria-hidden="true">{group.number}</span><h2 id={group.id}>{group.title}</h2></div>
            <div className="assignment-grid">
              {group.demos.map(([name, slug, idea, rationale]) => (
                <Card key={slug} className={rationale ? 'assignment-demo assignment-recommended' : 'assignment-demo'}>
                  <img className="assignment-demo-preview" src={previews[`./demo-previews/${slug}.png`]} alt={`Screenshot of ${name}`} loading="lazy" decoding="async" />
                  {rationale && <div><Badge tone="accent">Recommended</Badge></div>}
                  <h3>{name}</h3>
                  <p>{idea}</p>
                  {rationale && <div className="assignment-rationale"><strong>Why this direction</strong><p>{rationale}</p></div>}
                  <a href={`/${slug}.html`} className={`ds-button ${rationale ? 'primary' : 'secondary'}`} aria-label={`Open demo: ${name}`}>Open demo <Icon name="arrow" size="sm" /></a>
                </Card>
              ))}
            </div>
          </section>
        ))}
        <section className="assignment-section" aria-labelledby="system">
          <div className="assignment-heading"><span aria-hidden="true">03</span><h2 id="system">Design System</h2></div>
          <Card treatment="feature" className="assignment-system">
            <p>Sangha UI brings together portfolio-derived tokens, reusable React components and product patterns shared across all six demos.</p>
            <div className="assignment-actions">
              <a className="ds-button primary" href="/design-system/">Explore the design system <Icon name="arrow" size="sm" /></a>
              <a className="ds-button secondary" href="/skill-setup/">Skill setup</a>
            </div>
          </Card>
        </section>
      </main>
      <footer className="assignment-footer">Sanghamithra Unni · Pazcare Product Design Assignment</footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Assignment />);
