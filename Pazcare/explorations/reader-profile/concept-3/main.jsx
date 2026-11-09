import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Avatar, Badge, Button, Card, DropdownMenu, Icon, Input, List, Modal, ProgressBar, Tabs, Tag, Textarea,
} from '../../../design-system/src/components.jsx';
import {
  books, challenge, community, currentRead, favouriteGenres, finishes, profile, quotes, reviews, shelves,
} from '../data.js';
import {visitor, visitorShelves} from './visitor-data.js';
import './common.css';

const dateFormat = new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
const dateLabel = date => dateFormat.format(new Date(date));
const recentReviews = Object.keys(reviews).filter(id => books[id]).sort((a, b) => reviews[b].date.localeCompare(reviews[a].date));
const current = books[currentRead.book];
function Cover({id}) {
  const book = books[id];
  const [failedUrl, setFailedUrl] = useState(null);
  const url = book.edition.coverUrl;
  if (failedUrl !== url) {
    return <img className="bc-cover bc-cover-image" src={url} alt="" onError={() => setFailedUrl(url)}/>;
  }
  return <div aria-hidden="true" className={'bc-cover bc-cover-fallback ' + book.cover}>
    <span>{book.title}</span><small>{book.author}</small>
  </div>;
}

function SectionLabel({icon, children}) {
  return <span className="bc-heading-label"><span className="bc-heading-icon">
    <Icon name={icon}/>
  </span>{children}</span>;
}

function DateText({date}) {
  return <time dateTime={date}>{dateLabel(date)}</time>;
}

const skRead = new Set(shelves.find(shelf => shelf.id === 'read').books);
const skSaved = new Set(shelves.find(shelf => shelf.id === 'want').books);
const skGenres = new Set([...skRead, ...skSaved].map(id => books[id].genre));

function Rating({rating}) {
  return <span className="bc-score" role="img" aria-label={`${rating} out of 5 stars`}>
    <span aria-hidden="true">{Array.from({length: 5}, (_, i) => <Icon key={i} name="star" weight={i < rating ? 'fill' : 'regular'}/>)}</span>
    <strong aria-hidden="true">{rating}/5</strong>
  </span>;
}

function BooksInCommon() {
  const [demo, setDemo] = useState('shared');
  const [activeTab, setActiveTab] = useState('read');
  const [activeBook, setActiveBook] = useState(null);
  const [genre, setGenre] = useState('');
  const shelfSample = visitorShelves.find(sample => sample.id === demo);
  const visitorRead = new Map(shelfSample.read.map(entry => [entry.book, entry]));
  const sharedReads = [...visitorRead.keys()].filter(id => skRead.has(id));
  const savedMatches = shelfSample.saved.filter(id => skRead.has(id) || skSaved.has(id));
  const visitorGenres = new Set([
    ...shelfSample.read.map(entry => entry.genre ?? books[entry.book]?.genre),
    ...shelfSample.saved.map(id => books[id]?.genre),
  ].filter(Boolean));
  const sharedGenres = [...visitorGenres].filter(name => skGenres.has(name));
  const overlap = visitorGenres.size ? Math.round(sharedGenres.length / visitorGenres.size * 100) : null;
  const groups = {read: sharedReads, saved: savedMatches};
  const tab = activeTab === 'genres' || groups[activeTab]?.length
    ? activeTab : sharedReads.length ? 'read' : savedMatches.length ? 'saved' : 'genres';
  const options = groups[tab] ?? [];
  const selected = options.includes(activeBook) ? activeBook : options[0];
  const emptyShelf = visitorRead.size === 0 && shelfSample.saved.length === 0;
  const skLoved = [...skRead].filter(id => reviews[id]?.rating === 5 && !visitorRead.has(id));
  const visitorLoved = shelfSample.read.filter(entry => entry.rating === 5 && books[entry.book] && !skRead.has(entry.book));

  function switchDemo(id) {
    setDemo(id);
    setActiveTab('read');
    setActiveBook(null);
    setGenre('');
  }

  const [panel, setPanel] = useState(null);
  const dialogBody = useRef(null);
  useEffect(() => {
    const dialog = dialogBody.current?.closest('dialog');
    if (!panel || !dialog?.open) return;
    dialog.scrollTop = 0;
    if (!dialog.contains(document.activeElement)) {
      (dialog.querySelector('input, textarea') || dialog.querySelector('.modal-heading button'))?.focus();
    }
  }, [panel]);
  const [query, setQuery] = useState('');
  const [following, setFollowing] = useState(false);
  const [likes, setLikes] = useState({});
  const [saved, setSaved] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('reading-journal-saved'));
      return Array.isArray(stored) ? stored.filter(id => Object.hasOwn(books, id)) : [];
    } catch {
      return [];
    }
  });
  const [comments, setComments] = useState(currentRead.comments);
  const [comment, setComment] = useState('');
  const [vote, setVote] = useState('');
  const [notice, setNotice] = useState('');
  const open = (kind, id, from = null) => setPanel({kind, id, from});
  const shelf = panel?.kind === 'shelf' ? shelves.find(item => item.id === panel.id) : null;
  const showShelf = id => open('shelf', id, {kind: 'shelves'});

  function save(id) {
    const isSaved = saved.includes(id);
    const next = isSaved ? saved.filter(item => item !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem('reading-journal-saved', JSON.stringify(next)); } catch { /* Keep session state. */ }
    setNotice(isSaved ? `Removed ${books[id].title} from Want to Read.` : `Saved ${books[id].title} to Want to Read.`);
  }

  function saveButton(id) {
    if (shelfSample.saved.includes(id)) return <Badge tone="accent">On your Want to Read</Badge>;
    return <Button variant="secondary" aria-pressed={saved.includes(id)}
      icon={saved.includes(id) ? 'check' : 'plus'} onClick={() => save(id)}>
      {saved.includes(id) ? 'Saved to Want to Read' : 'Want to Read'}
    </Button>;
  }

  function likeButton(id, total) {
    return <Button variant="ghost" aria-pressed={Boolean(likes[id])}
      onClick={() => setLikes(previous => ({...previous, [id]: !previous[id]}))}>
      <span className="bc-like-label"><Icon name="heart"
        weight={likes[id] ? 'fill' : 'regular'}/>{likes[id] ? 'Liked' : 'Like'} · {total + Number(Boolean(likes[id]))}</span>
    </Button>;
  }

  function bookList(ids, dates = {}) {
    return <List emptyMessage="No books here yet." items={ids.filter(id => books[id]).map(id => ({
      id, title: books[id].title, description: dates[id] ? <>{books[id].author} · Finished <DateText date={dates[id]}/></> : books[id].author, leading: <Cover id={id}/>,
      trailing: <Button variant="ghost" onClick={() => open('book', id, panel)}>Open book</Button>,
    }))}/>;
  }

  function shelfLinks(items) {
    return <ul className="bc-shelf-list">{items.map(item => <li key={item.id}>
      <button type="button" onClick={() => showShelf(item.id)}><span>{item.name}</span><Badge>{item.count}</Badge></button>
    </li>)}</ul>;
  }

  function postComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    setComments(previous => [...previous, {name: 'You', date: new Date().toISOString().slice(0, 10), text: comment.trim()}]);
    setComment('');
  }

  function reviewCard(id) {
    const review = reviews[id];
    const book = books[id];
    return <article key={id} className="bc-review bc-book-review">
      <header className="bc-review-book">
        <Cover id={id}/>
        <div>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
        </div>
      </header>
      <div className="bc-row bc-review-meta">
        <span className="bc-rating" role="img" aria-label={`${review.rating} out of 5 stars`}>
          <span aria-hidden="true">{Array.from({length: 5}, (_, index) =>
            <Icon name="star" key={index} size="sm" weight={index < review.rating ? 'fill' : 'regular'}/>)}</span>
          <span aria-hidden="true">{review.rating}/5</span>
        </span>
        <DateText date={review.date}/>
      </div>
      <blockquote className="bc-review-excerpt"><p>“{review.excerpt}”</p></blockquote>
      <footer className="bc-row bc-review-actions">
        <Button variant="ghost" className="bc-accent-text" icon="arrow" iconPosition="end" onClick={() => open('review', id, panel)}>Read full review</Button>
        {likeButton(id, review.likes)}
      </footer>
    </article>;
  }

  const panelTitles = {
    about: 'About SK', shelves: 'SK’s bookshelves', shelf: shelf?.name, genre: panel?.id,
    review: 'SK’s review', book: books[panel?.id]?.title, activity: 'Recent activity',
    discussion: 'Reading update discussion', challenge: `${challenge.year} Reading Challenge`, recap: `${challenge.year} Year in Books`,
    stats: 'SK’s reading stats', favouriteGenres: 'SK’s favourite genres', social: 'SK’s reading network', quotes: 'Saved quotes', community: 'Groups, polls, lists & profile comments',
    search: 'Book search', account: 'Your reading account', saved: 'Your Want to Read shelf',
  };

  function panelContent() {
    const id = panel?.id;
    switch (panel?.kind) {
      case 'about':
        return <>
          <div className="bc-row"><Avatar name={profile.name} src={profile.photo} size="lg"/>
            <div><h3>{profile.name}</h3><p>{profile.bio}</p></div></div>
          <div className="bc-row">
            <Button variant={following ? 'secondary' : 'primary'} aria-pressed={following}
              onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow SK'}</Button>
            <DropdownMenu label="More" items={[
              {id: 'shelves', label: 'Browse bookshelves', onSelect: () => open('shelves', null, panel)},
              {id: 'activity', label: 'Reading activity', onSelect: () => open('activity', null, panel)},
              {id: 'community', label: 'Community', onSelect: () => open('community', null, panel)},
            ]}/>
          </div>
          <dl className="bc-facts"><div><dt>Location</dt><dd>{profile.location}</dd></div>
            <div><dt>Joined</dt><dd>{profile.joined}</dd></div><div><dt>Last active</dt><dd>{profile.active}</dd></div>
            <div><dt>Ratings</dt><dd>{profile.ratings}</dd></div><div><dt>Average rating</dt><dd>{profile.average} / 5</dd></div>
            <div><dt>Reviews</dt><dd>{profile.reviews}</dd></div><div><dt>Reviewer ranking</dt><dd>{profile.rank}</dd></div></dl>
        </>;
      case 'stats':
        return <><dl className="bc-facts">
          <div><dt>Books read</dt><dd>{shelves.find(item => item.id === 'read').count}</dd></div>
          <div><dt>Reviews</dt><dd>{profile.reviews}</dd></div>
          <div><dt>Average rating</dt><dd>{profile.average}/5</dd></div>
          <div><dt>Reviewer ranking</dt><dd>{profile.rank}</dd></div>
        </dl><div className="bc-row">
          <Button variant="secondary" onClick={() => open('challenge', null, panel)}>Yearly challenge</Button>
          <Button variant="ghost" onClick={() => open('recap', null, panel)}>Year in Books</Button>
        </div></>;
      case 'favouriteGenres':
        return favouriteGenres.map(name => <section key={name} className="bc-genre-row">
          <h3>{name}</h3>{genreShelves(name)}
        </section>);
      case 'shelves':
        return <><p>Browse SK’s reading status and custom shelves.</p>{shelfLinks(shelves)}</>;
      case 'shelf':
        return <><p>{shelf.count} {shelf.count === 1 ? 'book' : 'books'} · Showing {shelf.books.length} sample {shelf.books.length === 1 ? 'title' : 'titles'}</p>
          {shelf.id === 'read' && <p>Average rating: {profile.average} / 5</p>}{bookList(shelf.books)}</>;
      case 'genre':
        return bookList(Object.keys(books).filter(key => books[key].genre === id));
      case 'book':
        return <><div className="bc-book"><Cover id={id}/><p>{books[id].author} · {books[id].genre}</p></div>
          <div className="bc-row">{saveButton(id)}{reviews[id] && <Button variant="ghost" onClick={() => open('review', id, panel)}>Read SK’s review</Button>}</div></>;
      case 'review':
        return <><div className="bc-book"><Cover id={id}/><div><h3>{books[id].title}</h3><p>{books[id].author}</p></div></div>
          <div className="bc-row"><Badge tone="accent">{reviews[id].rating} / 5 stars</Badge><DateText date={reviews[id].date}/></div>
          <p>{reviews[id].excerpt}</p><p>{reviews[id].text}</p>
          <div className="bc-row">{likeButton(id, reviews[id].likes)}{saveButton(id)}</div></>;
      case 'activity':
        return <>{current && <article className="bc-review"><h3>Reading update · {current.title}</h3><DateText date={currentRead.date}/>
          <p>{currentRead.note}</p><div className="bc-row">{likeButton('update', currentRead.likes)}
            <Button variant="secondary" onClick={() => open('discussion', null, panel)}>View all comments ({comments.length})</Button></div>
        </article>}{recentReviews.map(reviewCard)}{!current && !recentReviews.length && <p>No reading activity yet.</p>}</>;
      case 'discussion':
        return <><p>{currentRead.note}</p><DateText date={currentRead.date}/><div className="bc-row">{likeButton('update', currentRead.likes)}{saveButton(currentRead.book)}</div><h3>{comments.length} comments</h3>
          <List items={comments.map((item, index) => ({id: index, title: item.name, description: item.text, trailing: <DateText date={item.date}/>}))}/>
          <form onSubmit={postComment}><Textarea label="Write a comment" value={comment} onChange={event => setComment(event.target.value)} rows={3}/>
            <Button type="submit" disabled={!comment.trim()}>Post comment</Button></form></>;
      case 'challenge':
        return <><Badge tone="success">Goal complete</Badge><h3>{challenge.count} of {challenge.goal} books</h3>
          <p>A selection from SK’s {challenge.year} challenge.</p>{bookList(finishes.filter(item => item.date.startsWith(String(challenge.year))).map(item => item.book))}</>;
      case 'recap':
        return <><p>SK’s {challenge.year} recap so far.</p>
          <dl className="bc-facts"><div><dt>Books read</dt><dd>{challenge.count}</dd></div><div><dt>Goal</dt><dd>{challenge.goal}</dd></div>
            <div><dt>Most revisited genre</dt><dd>{favouriteGenres[0]}</dd></div></dl><h3>A standout read</h3>{bookList(['piranesi'])}</>;
      case 'social':
        return <>{['friends', 'following', 'followers'].map(key => <section key={key}><h3 className="bc-capitalize">{key} · {profile[key].length}</h3>
          <List compact items={profile[key].map(name => ({id: name, title: name, leading: <Avatar size="sm" name={name}/>}))}/></section>)}</>;
      case 'quotes':
        return quotes.filter(quote => books[quote.book]).map(quote => <article key={quote.id} className="bc-review"><p>“{quote.text}”</p>
          <Button variant="ghost" onClick={() => open('book', quote.book, panel)}>{books[quote.book].author} · {books[quote.book].title}</Button>
          <div className="bc-row">{quote.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}{likeButton(quote.id, quote.likes)}</div></article>);
      case 'community':
        return <>
          <h3><SectionLabel icon="people">Groups</SectionLabel></h3><List items={community.groups.map(item => ({id: item.title, title: item.title, description: item.text}))}/>
          <h3><SectionLabel icon="review">Polls</SectionLabel></h3>{community.polls.map(poll => <div key={poll.title}><p>{poll.title}</p><div className="bc-row">
            {poll.options.map(option => <Tag key={option} selected={vote === option} onToggle={() => setVote(vote === option ? '' : option)}>{option}</Tag>)}</div></div>)}
          <h3><SectionLabel icon="list">Liked lists</SectionLabel></h3>{community.lists.map(list => <details key={list.title}><summary>{list.title}</summary>{bookList(list.books)}</details>)}
          <h3><SectionLabel icon="quote">Profile comments</SectionLabel></h3><List items={community.comments.map(item => ({id: item.name, title: item.name, description: item.text, trailing: <DateText date={item.date}/>}))}/>
        </>;
      case 'search':
        return <><Input type="search" label="Search books or authors" value={query} onChange={event => setQuery(event.target.value)}/>
          {bookList(Object.keys(books).filter(key => `${books[key].title} ${books[key].author}`.toLowerCase().includes(query.trim().toLowerCase())))}</>;
      case 'account':
        return <><p>Local preview · Reading as a guest</p><Button variant="secondary" onClick={() => open('saved', null, panel)}>Your Want to Read ({saved.length})</Button></>;
      case 'saved':
        return bookList([...new Set([...shelfSample.saved, ...saved])]);
      default:
        return null;
    }
  }

  function genreShelves(name) {
    const matchingShelves = shelves.filter(item => ['read', 'want', 'favourites', 'strange'].includes(item.id)
      && item.books.some(id => books[id].genre === name));
    return <div className="bc-row">{matchingShelves.map(item =>
      <Button key={item.id} variant="secondary" icon="books" onClick={() => showShelf(item.id)}>{item.name} shelf</Button>
    )}</div>;
  }

  function genreRibbon() {
    if (overlap === null) return <div className="bc-ribbon-empty">
      <Button variant="ghost" icon="tag" onClick={() => open('favouriteGenres')}>Explore SK’s favourite genres</Button>
    </div>;
    return <div className="bc-ribbon">
      <svg className="bc-ribbon-art" viewBox="0 0 240 70" aria-hidden="true">
        <defs>
          <linearGradient id="bc-blue-ribbon"><stop stopColor="#dceaff"/><stop offset=".5" stopColor="#5c8de8"/><stop offset="1" stopColor="#dceaff"/></linearGradient>
          <linearGradient id="bc-purple-ribbon"><stop stopColor="#ede4fa"/><stop offset=".55" stopColor="#9872ce"/><stop offset="1" stopColor="#ede4fa"/></linearGradient>
        </defs>
        <path d="M6 35 C52 -18 82 5 116 36 S183 89 234 35" fill="none" stroke="url(#bc-blue-ribbon)" strokeWidth="13"/>
        <path d="M6 35 C53 86 85 67 116 35 S185 -16 234 35" fill="none" stroke="url(#bc-purple-ribbon)" strokeWidth="13"/>
        <circle cx="120" cy="35" r="27" fill="white"/>
        <text x="120" y="41" textAnchor="middle" className="bc-ribbon-number">{overlap}%</text>
      </svg>
      <div><strong>{overlap}% of your genres in common · {sharedGenres.length} of {visitorGenres.size}</strong>
        <p>{sharedGenres.length ? sharedGenres.join(' · ') : 'No shared genres yet'}</p>
        <details><summary>How it’s calculated</summary>
          <p>Shared genres ÷ your distinct genres across read and saved books. Each genre counts once. Book ratings don’t affect this number.</p>
        </details>
      </div>
    </div>;
  }

  function comparison(id) {
    const book = books[id];
    const entry = visitorRead.get(id);
    const review = reviews[id];
    const hasSkRead = skRead.has(id);
    return <article className="bc-comparison" aria-label="Book comparison">
      <div className="bc-book-focus">
        <Cover key={id} id={id}/>
        <div><h3>{book.title}</h3><p>{book.author}</p></div>
      </div>
      <section className="bc-side bc-you">
        <h3><Avatar name={visitor.name} src={visitor.photo} size="sm"/> Your take</h3>
        {entry ? <>
          {entry.rating == null ? <Badge>Read · Not rated</Badge> : <Rating rating={entry.rating}/>}
          {entry.note && <blockquote><Icon name="quote" size="sm"/><p>“{entry.note}”</p></blockquote>}
        </> : <div className="bc-bookmark-status"><Icon name="book" size="lg"/><strong>Want to Read</strong><p>Saved on your shelf</p></div>}
      </section>
      <section className="bc-side bc-sk">
        <h3><Avatar name={profile.name} src={profile.photo} size="sm"/> SK’s take</h3>
        {hasSkRead ? <>
          {review?.rating == null ? <Badge>Read · Not rated</Badge> : <Rating rating={review.rating}/>}
          {review?.excerpt && <blockquote><Icon name="quote" size="sm"/><p>“{review.excerpt}”</p></blockquote>}
          {review && <Button variant="ghost" icon="arrow" iconPosition="end" className="bc-accent-text" onClick={() => open('review', id)}>Read SK’s full review</Button>}
        </> : <div className="bc-bookmark-status"><Icon name="book" size="lg"/><strong>Want to Read</strong><p>Saved on SK’s shelf</p></div>}
      </section>
    </article>;
  }

  function genrePanel() {
    if (sharedGenres.length) return <div className="bc-genre-grid">
      {sharedGenres.map(name => <section key={name} className="bc-genre-row">
        <h3><Icon name="tag"/> {name}</h3>{genreShelves(name)}
      </section>)}
    </div>;
    return <div className="bc-fallback">
      <div className="bc-fallback-icon" aria-hidden="true"><Icon name="books" size="lg"/></div>
      <div className="bc-stack">
        <h3>{emptyShelf ? 'Your shelf is empty' : 'No overlap yet'}</h3>
        <p>Start with SK’s shelves and see what catches your eye.</p>
        <div><Button icon="books" onClick={() => open('shelves')}>Browse SK’s shelves</Button></div>
        {emptyShelf && <label className="bc-select">Browse by genre
          <select value={genre} onChange={event => setGenre(event.target.value)}>
            <option value="">Choose a genre</option>
            {[...skGenres].map(name => <option key={name}>{name}</option>)}
          </select>
        </label>}
        {emptyShelf && genre && <div className="bc-genre-row"><h4>SK’s picks in {genre}</h4>
          {bookList([...new Set([...skRead, ...skSaved])].filter(id => books[id].genre === genre))}
          {genreShelves(genre)}
        </div>}
      </div>
    </div>;
  }

  function pickList(ids, showVisitorRating = false) {
    return <div className="bc-pick-grid">{ids.map(id => <article className="bc-pick" key={id}>
      <Cover id={id}/>
      <div><h3>{books[id].title}</h3><p>{books[id].author}</p>
        <Rating rating={showVisitorRating ? visitorRead.get(id).rating : reviews[id].rating}/>
        <div className="bc-row">
          {reviews[id] && <Button variant="ghost" className="bc-accent-text" onClick={() => open('review', id)}>Read review</Button>}
          {skRead.has(id) && saveButton(id)}
        </div>
      </div>
    </article>)}</div>;
  }

  return <div className="bc">
    <header className="bc-header">
      <div className="bc-wrap bc-header-inner">
        <a className="bc-wordmark" href="#books-in-common">good<strong>reads</strong></a>
        <nav className="bc-row" aria-label="Goodreads">
          <Button variant="ghost" onClick={() => open('saved')}>My Books</Button>
          <Button variant="ghost" onClick={() => open('social')}>Friends</Button>
          <Button variant="ghost" onClick={() => open('account')}>Account</Button>
        </nav>
        <form className="bc-search" role="search" aria-label="Books" onSubmit={event => {event.preventDefault(); open('search');}}>
          <div className="bc-search-field"><Icon name="search"/>
            <Input label="Search books" type="search" placeholder="Search books" enterKeyHint="search" value={query}
              onChange={event => setQuery(event.target.value)}/>
          </div>
          <Button variant="accent" type="submit">Search</Button>
        </form>
      </div>
    </header>

    <main className="bc-wrap bc-page" id="books-in-common">
      <div className="bc-layout">
        <aside className="bc-profile-rail" aria-label="SK’s profile">
          <div className="bc-rail-intro">
            <Avatar name={profile.name} src={profile.photo} size="lg"/>
            <div><h2>{profile.name}</h2><Button size="compact" variant={following ? 'secondary' : 'primary'}
              aria-pressed={following} onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow'}</Button></div>
          </div>
          <p>{profile.bio}</p>
          <dl className="bc-profile-counts">
            {[
              ['Books', shelves.find(shelf => shelf.id === 'read').count], ['Reviews', profile.reviews],
              ['Followers', profile.followers.length], ['Following', profile.following.length],
            ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <div className="bc-rail-section"><h3>Favourite genres</h3>
            <div className="bc-row">{favouriteGenres.map(name => <Tag key={name} tone="accent">{name}</Tag>)}</div>
          </div>
          <nav className="bc-rail-section" aria-label="SK profile links"><h3>Quick links</h3>
            <ul className="bc-shelf-list">
              {[
                ['shelves', 'books', 'Shelves'], ['activity', 'review', 'Reviews'],
                ['stats', 'target', 'Reading Stats'], ['community', 'people', 'Community'],
              ].map(([id, icon, label]) => <li key={id}><button type="button" onClick={() => open(id)}>
                <Icon name={icon}/><span>{label}</span><Icon name="arrow" size="sm"/>
              </button></li>)}
            </ul>
          </nav>
          <div className="bc-rail-section bc-now">
            <h3>Currently Reading</h3>
            <div className="bc-book"><Cover id={currentRead.book}/><div><strong>{current.title}</strong><p>{current.author}</p>
              <ProgressBar label={`Page ${currentRead.page} of ${currentRead.pages}`} value={Math.round(currentRead.page / currentRead.pages * 100)}/></div></div>
            <Button variant="ghost" onClick={() => open('discussion')}>Latest note</Button>
          </div>
          <div className="bc-rail-section bc-year">
            <h3><Icon name="target"/> Yearly Challenge</h3>
            <p><strong>{challenge.count}</strong> of {challenge.goal} books</p>
            <ProgressBar label={`${challenge.year} reading goal`} value={challenge.count} max={challenge.goal} showValue={false}/>
            <div className="bc-row">
              <Button variant="ghost" onClick={() => open('challenge')}>View books</Button>
              <Button variant="ghost" onClick={() => open('recap')}>Year in Books</Button>
            </div>
          </div>
        </aside>

        <div className="bc-main">
        <section className="bc-hero" aria-labelledby="bc-page-title">
          <div className="bc-hero-top">
            <div className="bc-reader-pair">
              <div className="bc-avatars">
                <Avatar name={visitor.name} src={visitor.photo} size="lg"/>
                <Avatar name={profile.name} src={profile.photo} size="lg"/>
              </div>
              <div><p className="bc-kicker">You &amp; SK</p><h1 id="bc-page-title">Our Books in Common</h1></div>
            </div>
            <Button icon="profile" onClick={() => open('about')}>Browse SK’s profile</Button>
          </div>
          <div className="bc-hero-overlap">
            <dl className="bc-hero-counts" aria-label="Title overlap">
              <div><dt>Books you’ve both read</dt><dd><Icon name="books"/>{sharedReads.length}</dd></div>
              <div><dt>Books you’ve saved that SK has read</dt><dd><Icon name="book"/>{savedMatches.filter(id => skRead.has(id)).length}</dd></div>
            </dl>
            {genreRibbon()}
          </div>
        </section>
        <section className="bc-workspace" aria-labelledby="bc-workspace-title">
          <header className="bc-section-head">
            <h2 id="bc-workspace-title"><SectionLabel icon="books">Compare shelves</SectionLabel></h2>
            <label className="bc-select">Demo shelf
              <select value={demo} onChange={event => switchDemo(event.target.value)}>
                {visitorShelves.map(sample => <option key={sample.id} value={sample.id}>{sample.label}</option>)}
              </select>
            </label>
          </header>
          <Tabs label="Compare shelves" value={tab} onChange={id => {setActiveTab(id); setActiveBook(null);}}
            items={[
              {id: 'read', label: `Both read (${sharedReads.length})`, disabled: !sharedReads.length},
              {id: 'saved', label: `On your Want to Read (${savedMatches.length})`, disabled: !savedMatches.length},
              {id: 'genres', label: `Shared genres (${sharedGenres.length})`},
            ].map(item => ({...item, content: tab === item.id && <>
              {selected ? <>
                <p className="sr-only" role="status">Comparing {books[selected].title}</p>
                {comparison(selected)}
                <div className="bc-book-picker" role="group" aria-label="Choose a book to compare">
                  <strong>{tab === 'read' ? 'Our shared reads' : 'Your saved matches'}</strong>
                  {options.map(id => <button key={id} type="button" aria-pressed={id === selected} onClick={() => setActiveBook(id)}>
                    <Cover id={id}/><span>{books[id].title}</span>{id === selected && <Icon name="check" size="sm"/>}
                  </button>)}
                </div>
              </> : genrePanel()}
            </>}))}/>
        </section>

        <div className="bc-discover">
          <section className="bc-recommend bc-recommend-sk" aria-labelledby="bc-sk-loved">
            <h2 id="bc-sk-loved"><SectionLabel icon="heart">SK loved, you haven’t logged as read</SectionLabel></h2>
            {skLoved.length ? pickList(skLoved) : <p>You’ve logged all of SK’s five-star picks in this sample.</p>}
          </section>
          <section className="bc-recommend bc-recommend-you" aria-labelledby="bc-you-loved">
            <h2 id="bc-you-loved"><SectionLabel icon="star">You loved, SK hasn’t logged as read</SectionLabel></h2>
            {visitorLoved.length ? pickList(visitorLoved.map(entry => entry.book), true) : <p>Your five-star reads that SK hasn’t logged will appear here.</p>}
          </section>
        </div>

        <section className="bc-reviews" aria-labelledby="bc-recent">
          <header className="bc-section-head"><h2 id="bc-recent"><SectionLabel icon="review">Recent reviews</SectionLabel></h2>
            <Button variant="ghost" icon="arrow" iconPosition="end" onClick={() => open('activity')}>Reading activity</Button></header>
          <div className="bc-review-grid">{recentReviews.slice(0, 3).map(reviewCard)}</div>
        </section>

        <section className="bc-library" aria-labelledby="bc-library-title">
          <header className="bc-section-head"><h2 id="bc-library-title"><SectionLabel icon="books">Explore SK’s library</SectionLabel></h2>
            <Button variant="secondary" onClick={() => open('shelves')}>Browse SK’s shelves</Button></header>
          <div className="bc-library-grid">
            <Card className="bc-favourites"><h3>Favourite books</h3>{bookList(shelves.find(item => item.id === 'favourites').books.slice(0, 2))}
              <Button variant="ghost" icon="arrow" iconPosition="end" onClick={() => showShelf('favourites')}>Full favourites shelf</Button>
            </Card>
            <Card><h3>Favourite genres</h3><div className="bc-row">
              {favouriteGenres.map(name => <Button key={name} variant="secondary" onClick={() => open('genre', name)}>{name}</Button>)}
            </div><p className="bc-meta">{profile.friends.length} friends · {profile.following.length} following · {profile.followers.length} followers</p>
              <Button variant="ghost" onClick={() => open('social')}>View reading network</Button>
            </Card>
            <Card><h3>More from SK</h3><ul className="bc-shelf-list">
              {[
                ['about', 'About, ratings & rankings'], ['recap', 'Year in Books'], ['quotes', 'Saved quotes'],
                ['community', 'Groups, polls, lists & profile comments'],
              ].map(([id, label]) => <li key={id}><button type="button" onClick={() => open(id)}>{label}<Icon name="arrow"/></button></li>)}
            </ul></Card>
          </div>
        </section>
        </div>
      </div>
      <footer className="bc-footer"><a href="/reading-journal.html">Reading Journal</a><a href="/pick-a-feeling.html">Pick a Feeling</a></footer>
    </main>
    <div role="status" className="sr-only">{notice}</div>
    <div className={`bc-dialog ${panel?.kind === 'shelf' || panel?.kind === 'shelves' ? 'bc-drawer' : ''}`}>
      <Modal open={Boolean(panel)} onClose={() => setPanel(null)} title={panelTitles[panel?.kind] || 'Our Books in Common'}>
        <div className="bc-stack" ref={dialogBody}>
          {panel?.from && <Button variant="ghost" onClick={() => setPanel(panel.from)}>Back to {panelTitles[panel.from.kind] || 'previous panel'}</Button>}
          {panelContent()}
          <div role="status" className="sr-only">{notice}</div>
        </div>
      </Modal>
    </div>
  </div>;
}

createRoot(document.getElementById('root')).render(<BooksInCommon/>);
