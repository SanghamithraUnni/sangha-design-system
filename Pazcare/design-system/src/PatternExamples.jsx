import React, {useState} from 'react';
import {Badge, Button, Card, Icon, Input, Modal} from './components.jsx';
import './patterns-preview.css';

const notes = [
  {id: 'coast', title: 'A field guide to the coast', author: 'Anya Reed', rating: 5, date: '2026-10-21', excerpt: 'Small observations made the shoreline feel alive.', text: 'I kept returning to the sketches of ordinary things: a shell, a pool, the edge of a dune. The attention paid to each one changed what I looked for on my next walk.'},
  {id: 'garden', title: 'The evening garden', author: 'Sam Bell', rating: 4, date: '2026-10-09', excerpt: 'A gentle reminder to make time for things that grow slowly.', text: 'The stories about neighbours sharing cuttings were my favourite. A few chapters felt repetitive, but the final section made me want to try keeping a garden of my own.'},
];

export function PatternExamples() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [review, setReview] = useState(null);
  const [liked, setLiked] = useState({});
  const results = notes.filter(note => [note.title, note.author].some(value => value.toLowerCase().includes(filter)));
  const lead = notes[0];

  return <div className="pattern-canvas">
    <div className="pattern-page">
      <header className="pattern-header">
        <strong>Reading notes</strong>
        <form role="search" aria-label="Reading notes" onSubmit={event => {
          event.preventDefault();
          setFilter(query.trim().toLowerCase());
        }}>
          <div className="pattern-search">
            <Icon name="search"/>
            <Input label="Find reading notes" type="search" enterKeyHint="search" placeholder="Search titles or authors" value={query}
              onChange={event => {
                setQuery(event.target.value);
                if (!event.target.value) setFilter('');
              }}/>
          </div>
          <Button type="submit" variant="accent">Search</Button>
        </form>
      </header>
      <div className="pattern-focus">
        <Card className="pattern-spotlight">
          <div>
            <p className="pattern-meta"><Icon name="sparkle" size="sm"/> Featured read</p>
            <h3>{lead.title}</h3>
            <p>{lead.excerpt}</p>
            <Button onClick={() => setReview(lead)} icon="arrow" iconPosition="end">Read full review</Button>
          </div>
          <div className="pattern-art" aria-hidden="true"><Icon name="book" size="lg"/></div>
        </Card>
        <aside aria-label="Reading milestone">
          <Card className="pattern-milestone">
            <h3><Icon name="trophy"/> Reading milestone</h3>
            <p>Finished the autumn reading list.</p>
            <Badge tone="success">Goal complete</Badge>
          </Card>
        </aside>
      </div>
      <section aria-labelledby="example-reviews" className="pattern-collection">
        <h3 id="example-reviews"><Icon name="review"/> Recent reviews <Badge>{results.length}</Badge></h3>
        <p role="status" className="sr-only">{results.length} matching reviews</p>
        {results.length ? <div className="pattern-grid">
          {results.map(note => <article key={note.id}>
            <Card className="pattern-review">
              <header><h4>{note.title}</h4><p className="pattern-meta">{note.author}</p></header>
              <div className="pattern-review-meta">
                <span role="img" aria-label={`${note.rating} out of 5 stars`} className="pattern-stars">
                  {Array.from({length: 5}, (_, index) => <Icon key={index} name="star" size="sm" weight={index < note.rating ? 'fill' : 'regular'}/>)}
                </span>
                <time className="pattern-meta" dateTime={note.date}>{note.date}</time>
              </div>
              <blockquote>{note.excerpt}</blockquote>
              <footer>
                <Button variant="ghost" className="pattern-text-action" icon="arrow" iconPosition="end" onClick={() => setReview(note)}>Read full review</Button>
                <Button variant="ghost" icon={liked[note.id] ? undefined : 'heart'} aria-pressed={Boolean(liked[note.id])}
                  onClick={() => setLiked(previous => ({...previous, [note.id]: !previous[note.id]}))}>
                  {liked[note.id] && <Icon name="heart" weight="fill"/>} {liked[note.id] ? 'Liked' : 'Like'}
                </Button>
              </footer>
            </Card>
          </article>)}
        </div> : <p>No matching reviews. Try another title or author.</p>}
      </section>
    </div>
    <Modal open={Boolean(review)} onClose={() => setReview(null)} title={review?.title || 'Full review'}>
      {review && <p>{review.text}</p>}
    </Modal>
  </div>;
}
