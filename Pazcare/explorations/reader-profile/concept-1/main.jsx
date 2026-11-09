import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Avatar, Badge, Button, Card, DropdownMenu, Icon, Input, List, Modal, ProgressBar, Tabs, Tag, Textarea,
} from '../../../design-system/src/components.jsx';
import {
  books, challenge, community, currentRead, favouriteGenres, finishes, profile, quotes, reviews, shelves,
} from '../data.js';
import './journal.css';

const monthFormat = new Intl.DateTimeFormat('en', {month: 'long', timeZone: 'UTC'});
const dateFormat = new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
const recentReviews = Object.keys(reviews).sort((a, b) => reviews[b].date.localeCompare(reviews[a].date));
const current = books[currentRead.book];
const dateLabel = date => dateFormat.format(new Date(date));
const monthsForYear = year => Array.from({length: 12}, (_, index) => {
  const name = monthFormat.format(new Date(Date.UTC(year, index)));
  const prefix = `${year}-${String(index + 1).padStart(2, '0')}`;
  const finished = finishes.filter(item => item.date.startsWith(prefix));
  const reviewed = recentReviews.filter(id => reviews[id].date.startsWith(prefix));
  const milestones = challenge.milestones.filter(item => item.date.startsWith(prefix));
  return {name, finished, reviewed, milestones, hasEntries: Boolean(finished.length + reviewed.length + milestones.length)};
});
const years = [...new Set([
  challenge.year,
  ...[...finishes, ...Object.values(reviews), ...challenge.milestones].map(item => Number(item.date.slice(0, 4))),
])].sort((a, b) => b - a);
const journalByYear = Object.fromEntries(years.map(year => [year, monthsForYear(year)]));
const bookCount = count => `${count} ${count === 1 ? 'book' : 'books'}`;

function nearestActiveMonth(months, index) {
  // Prefer the earlier month when both are equally close.
  return months.reduce((nearest, item, candidate) => {
    if (!item.hasEntries) return nearest;
    if (nearest === -1 || Math.abs(candidate - index) < Math.abs(nearest - index)) return candidate;
    return nearest;
  }, -1);
}

function Cover({id}) {
  const book = books[id];
  const [failedUrl, setFailedUrl] = useState(null);
  const url = book.edition.coverUrl;
  if (failedUrl !== url) {
    return <img className="rj-cover rj-cover-image" src={url} alt="" onError={() => setFailedUrl(url)}/>;
  }
  return <div aria-hidden="true" className={'rj-cover rj-cover-fallback ' + book.cover}>
    <span>{book.title}</span><small>{book.author}</small>
  </div>;
}

function SectionLabel({icon, children}) {
  return <span className="rj-heading-label"><span className="rj-heading-icon">
    <Icon name={icon}/>
  </span>{children}</span>;
}

function DateText({date}) {
  return <time dateTime={date}>{dateLabel(date)}</time>;
}

function Journal() {
  const [year, setYear] = useState(challenge.year);
  const [month, setMonth] = useState('October');
  const [bookIndex, setBookIndex] = useState(0);
  const months = journalByYear[year];
  const monthIndex = months.findIndex(item => item.name === month);
  const {finished: featuredBooks, hasEntries} = months[monthIndex];
  const featuredId = featuredBooks[bookIndex]?.book;
  const featured = books[featuredId];
  const featuredReview = reviews[featuredId];

  function selectMonth(name) {
    setMonth(name);
    setBookIndex(0);
  }

  function selectYear(nextYear) {
    const nextMonths = journalByYear[nextYear];
    setYear(nextYear);
    selectMonth(nextMonths[monthIndex].hasEntries ? month : nextMonths.findLast(item => item.hasEntries)?.name ?? month);
  }
  const ribbon = useRef(null);
  useEffect(() => {
    const strip = ribbon.current.querySelector('[role="tablist"]');
    const selected = strip.querySelector('[aria-selected="true"]');
    const viewport = strip.getBoundingClientRect();
    const tab = selected.getBoundingClientRect();
    if (tab.left < viewport.left || tab.right > viewport.right) {
      strip.scrollLeft += (tab.left + tab.right - viewport.left - viewport.right) / 2;
    }
  }, [month, year]);

  function jumpToMonth(name) {
    const tab = [...ribbon.current.querySelectorAll('[role="tab"]')].find(item => item.querySelector('[data-month]').dataset.month === name);
    selectMonth(name);
    tab?.focus();
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
    return <Button variant="secondary" aria-pressed={saved.includes(id)}
      icon={saved.includes(id) ? 'check' : 'plus'} onClick={() => save(id)}>
      {saved.includes(id) ? 'Saved to Want to Read' : 'Want to Read'}
    </Button>;
  }

  function likeButton(id, total) {
    return <Button variant="ghost" aria-pressed={Boolean(likes[id])}
      onClick={() => setLikes(previous => ({...previous, [id]: !previous[id]}))}>
      <span className="rj-like-label"><Icon name="heart"
        weight={likes[id] ? 'fill' : 'regular'}/>{likes[id] ? 'Liked' : 'Like'} · {total + Number(Boolean(likes[id]))}</span>
    </Button>;
  }

  function bookList(ids, dates = {}) {
    return <List emptyMessage="No books here yet." items={ids.map(id => ({
      id, title: books[id].title, description: dates[id] ? <>{books[id].author} · Finished <DateText date={dates[id]}/></> : books[id].author, leading: <Cover id={id}/>,
      trailing: <Button variant="ghost" onClick={() => open('book', id, panel)}>Open book</Button>,
    }))}/>;
  }

  function shelfLinks(items) {
    return <ul className="rj-shelf-list">{items.map(item => <li key={item.id}>
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
    return <article key={id} className="rj-review rj-book-review">
      <header className="rj-review-book">
        <Cover id={id}/>
        <div>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
        </div>
      </header>
      <div className="rj-row rj-review-meta">
        <span className="rj-rating" role="img" aria-label={`${review.rating} out of 5 stars`}>
          <span aria-hidden="true">{Array.from({length: 5}, (_, index) =>
            <Icon name="star" key={index} size="sm" weight={index < review.rating ? 'fill' : 'regular'}/>)}</span>
          <span aria-hidden="true">{review.rating}/5</span>
        </span>
        <DateText date={review.date}/>
      </div>
      <blockquote className="rj-review-excerpt"><p>“{review.excerpt}”</p></blockquote>
      <footer className="rj-row rj-review-actions">
        <Button variant="ghost" className="rj-accent-text" icon="arrow" iconPosition="end" onClick={() => open('review', id, panel)}>Read full review</Button>
        {likeButton(id, review.likes)}
      </footer>
    </article>;
  }

  const panelTitles = {
    about: 'About SK', shelves: 'SK’s bookshelves', shelf: shelf?.name, genre: panel?.id,
    review: 'SK’s review', book: books[panel?.id]?.title, activity: 'Recent activity',
    discussion: 'Reading update discussion', challenge: '2026 Reading Challenge', recap: '2026 Year in Books',
    social: 'SK’s reading network', quotes: 'Saved quotes', community: 'Groups, polls, lists & profile comments',
    search: 'Book search', account: 'Your reading account', saved: 'Your Want to Read shelf',
  };

  function panelContent() {
    const id = panel?.id;
    switch (panel?.kind) {
      case 'about':
        return <>
          <p>{profile.bio}</p>
          <dl className="rj-facts"><div><dt>Location</dt><dd>{profile.location}</dd></div>
            <div><dt>Joined</dt><dd>{profile.joined}</dd></div><div><dt>Last active</dt><dd>{profile.active}</dd></div>
            <div><dt>Ratings</dt><dd>{profile.ratings}</dd></div><div><dt>Average rating</dt><dd>{profile.average} / 5</dd></div>
            <div><dt>Reviews</dt><dd>{profile.reviews}</dd></div><div><dt>Reviewer ranking</dt><dd>{profile.rank}</dd></div></dl>
        </>;
      case 'shelves':
        return <><p>Browse SK’s reading status and custom shelves.</p>{shelfLinks(shelves)}</>;
      case 'shelf':
        return <><p>{shelf.count} {shelf.count === 1 ? 'book' : 'books'} · Showing {shelf.books.length} sample {shelf.books.length === 1 ? 'title' : 'titles'}</p>
          {shelf.id === 'read' && <p>Average rating: {profile.average} / 5</p>}{bookList(shelf.books)}</>;
      case 'genre':
        return bookList(Object.keys(books).filter(key => books[key].genre === id));
      case 'book':
        return <><div className="rj-book"><Cover id={id}/><p>{books[id].author} · {books[id].genre}</p></div>
          <div className="rj-row">{saveButton(id)}{reviews[id] && <Button variant="ghost" onClick={() => open('review', id, panel)}>Read SK’s review</Button>}</div></>;
      case 'review':
        return <><div className="rj-book"><Cover id={id}/><div><h3>{books[id].title}</h3><p>{books[id].author}</p></div></div>
          <div className="rj-row"><Badge tone="accent">{reviews[id].rating} / 5 stars</Badge><DateText date={reviews[id].date}/></div>
          <p>{reviews[id].excerpt}</p><p>{reviews[id].text}</p>
          <div className="rj-row">{likeButton(id, reviews[id].likes)}{saveButton(id)}</div></>;
      case 'activity':
        return <><article className="rj-review"><h3>Reading update · {current.title}</h3><DateText date={currentRead.date}/>
          <p>{currentRead.note}</p><div className="rj-row">{likeButton('update', currentRead.likes)}
            <Button variant="secondary" onClick={() => open('discussion', null, panel)}>View all comments ({comments.length})</Button></div>
        </article>{recentReviews.map(reviewCard)}</>;
      case 'discussion':
        return <><p>{currentRead.note}</p><h3>{comments.length} comments</h3>
          <List items={comments.map((item, index) => ({id: index, title: item.name, description: item.text, trailing: <DateText date={item.date}/>}))}/>
          <form onSubmit={postComment}><Textarea label="Write a comment" value={comment} onChange={event => setComment(event.target.value)} rows={3}/>
            <Button type="submit" disabled={!comment.trim()}>Post comment</Button></form></>;
      case 'challenge':
        return <><Badge tone="success">Goal complete</Badge><h3>{challenge.count} of {challenge.goal} books</h3>
          <p>A selection from SK’s {challenge.year} challenge.</p>{bookList(finishes.filter(item => item.date.startsWith(String(challenge.year))).map(item => item.book))}</>;
      case 'recap':
        return <><p>SK’s {challenge.year} recap so far.</p>
          <dl className="rj-facts"><div><dt>Books read</dt><dd>{challenge.count}</dd></div><div><dt>Goal</dt><dd>{challenge.goal}</dd></div>
            <div><dt>Most revisited genre</dt><dd>{favouriteGenres[0]}</dd></div></dl><h3>A standout read</h3>{bookList(['piranesi'])}</>;
      case 'social':
        return <>{['friends', 'following', 'followers'].map(key => <section key={key}><h3 className="rj-capitalize">{key} · {profile[key].length}</h3>
          <List compact items={profile[key].map(name => ({id: name, title: name, leading: <Avatar size="sm" name={name}/>}))}/></section>)}</>;
      case 'quotes':
        return quotes.map(quote => <article key={quote.id} className="rj-review"><p>“{quote.text}”</p>
          <Button variant="ghost" onClick={() => open('book', quote.book, panel)}>{books[quote.book].author} · {books[quote.book].title}</Button>
          <div className="rj-row">{quote.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}{likeButton(quote.id, quote.likes)}</div></article>);
      case 'community':
        return <>
          <h3><SectionLabel icon="people">Groups</SectionLabel></h3><List items={community.groups.map(item => ({id: item.title, title: item.title, description: item.text}))}/>
          <h3><SectionLabel icon="review">Polls</SectionLabel></h3>{community.polls.map(poll => <div key={poll.title}><p>{poll.title}</p><div className="rj-row">
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
        return bookList(saved);
      default:
        return null;
    }
  }

  return <div className="rj">
    <header className="rj-top"><div className="rj-container rj-top-inner">
      <a className="rj-wordmark" href="#profile">good<strong>reads</strong></a>
      <nav aria-label="Goodreads" className="rj-row rj-top-nav">
        <Button variant="ghost" onClick={() => open('saved')}>My Books</Button>
        <Button variant="ghost" onClick={() => open('social')}>Friends</Button>
        <Button variant="ghost" onClick={() => open('account')}>Account</Button>
      </nav>
      <form role="search" aria-label="Books" className="rj-search" onSubmit={event => {event.preventDefault(); open('search');}}>
        <div className="rj-search-field">
          <Icon name="search"/>
          <Input label="Global book search" type="search" enterKeyHint="search" placeholder="Search books or authors" value={query} onChange={event => setQuery(event.target.value)}/>
        </div>
        <Button type="submit" variant="accent">Search</Button>
      </form>
    </div></header>
    <main className="rj-container rj-main" id="profile">
      <div className="rj-body">
      <section className="rj-profile" aria-labelledby="profile-name">
        <Avatar name="SK" src={profile.photo} size="lg"/>
        <div><p className="rj-kicker"><SectionLabel icon="profile">Reader profile</SectionLabel></p><h1 id="profile-name">SK</h1><p>{profile.bio}</p></div>
        <div className="rj-row">
          <Button aria-pressed={following} variant={following ? 'secondary' : 'primary'} onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow'}</Button>
          <DropdownMenu label="More" items={[
            {id: 'about', label: 'About SK', onSelect: () => open('about')},
            {id: 'social', label: 'Friends & followers', onSelect: () => open('social')},
            {id: 'community', label: 'Community', onSelect: () => open('community')},
          ]}/>
        </div>
      </section>

        <section className="rj-journal" aria-labelledby="journal-title">
          <section className="rj-spotlight" aria-label="Featured book">
            <div className="rj-spotlight-copy">
              <p className="rj-kicker"><SectionLabel icon="sparkle">Reading Journal · {year}</SectionLabel></p>
              <h2 id="journal-title">{month} in Books</h2>
              {featured ? <>
                <div aria-live="polite" aria-atomic="true" className="rj-spotlight-review">
                  <h3>{featured.title}</h3>
                  <p>{featured.author}</p>
                  {featuredReview && <>
                    <p><Badge tone="accent">{featuredReview.rating} / 5 stars</Badge></p>
                    <p>{featuredReview.excerpt}</p>
                  </>}
                </div>
                {featuredReview && <div className="rj-row">
                  <Button variant="primary" icon="arrow" iconPosition="end" onClick={() => open('review', featuredId)}>Read full review</Button>
                  {likeButton(featuredId, featuredReview.likes)}
                </div>}
                {featuredBooks.length > 1 && <div className="rj-row rj-spotlight-nav" role="group" aria-label="Browse featured books">
                  <Button variant="secondary" aria-label="Previous featured book"
                    onClick={() => setBookIndex(index => (index + featuredBooks.length - 1) % featuredBooks.length)}>←</Button>
                  <span role="status">{bookIndex + 1} of {featuredBooks.length}</span>
                  <Button variant="secondary" aria-label="Next featured book"
                    onClick={() => setBookIndex(index => (index + 1) % featuredBooks.length)}>→</Button>
                </div>}
              </> : hasEntries && <p>No books finished this month.</p>}
            </div>
            {featured && <div className="rj-spotlight-art"><Cover key={featuredId} id={featuredId}/></div>}
          </section>
          <div className="rj-ribbon" ref={ribbon}>
            <header className="rj-ribbon-head">
              <h3><SectionLabel icon="calendar">Year Ribbon</SectionLabel></h3>
              <label>Journal year <select value={year} onChange={event => selectYear(Number(event.target.value))}>
                {years.map(option => <option key={option} value={option}>{option}</option>)}
              </select></label>
            </header>
            <Tabs label="Year Ribbon · journal month" value={month} onChange={selectMonth}
              items={months.map(({name, finished, reviewed, milestones, hasEntries}, index) => {
                const nearest = hasEntries ? -1 : nearestActiveMonth(months, index);
                return {
                  id: name,
                  label: <span className="rj-month-label" data-month={name}>
                    <span className="rj-spines" aria-hidden="true">
                      {finished.map(({book, date}) => <span key={book + date} className={`rj-spine ${books[book].cover}`}/>)}
                      {!finished.length && <span className="rj-spine rj-spine-empty"/>}
                    </span>
                    <strong><span aria-hidden="true">{name.slice(0, 3)}</span><span className="sr-only">{name}</span></strong>
                    <span className="rj-month-count">{bookCount(finished.length)}</span>
                  </span>,
                  content: name === month && <div className="rj-spread">
                    <header className="rj-row rj-spread-head">
                      <h3><SectionLabel icon="calendar">{name}</SectionLabel></h3><Badge tone="accent">{bookCount(finished.length)} finished</Badge>
                    </header>
                    {!hasEntries ? <div className="rj-empty">
                      <p>No reading activity logged this month</p>
                      {nearest !== -1 && <Button variant="secondary" onClick={() => jumpToMonth(months[nearest].name)}>
                        Jump to {months[nearest].name}
                      </Button>}
                    </div> : <div className="rj-spread-columns">
                      <section className="rj-stack rj-spread-section" aria-label={`Finished in ${name}`}>
                        <h4><SectionLabel icon="books">Finished in {name}</SectionLabel></h4>
                        {finished.length ? <ul className="rj-finished">
                          {finished.map(({book, date}) => <li key={book + date}>
                            <button type="button" onClick={() => open('book', book)}>
                              <span className="rj-finished-cover"><Cover id={book}/></span>
                              <span className="rj-finished-copy"><strong>{books[book].title}</strong><span>{books[book].author}</span></span>
                              <DateText date={date}/>
                            </button>
                          </li>)}
                        </ul> : <p>No books finished this month.</p>}
                      </section>
                      <section className="rj-stack rj-spread-section rj-spread-milestones">
                          <h4><SectionLabel icon="trophy">Milestones</SectionLabel></h4>
                          {milestones.length ? milestones.map(item => <article className="rj-milestone" key={item.date}>
                            <strong>{item.title}</strong><p>{item.text}</p><DateText date={item.date}/>
                          </article>) : <p>No milestones this month.</p>}
                        </section>
                        <section className="rj-stack rj-spread-section rj-spread-reviews">
                          <header className="rj-row rj-reviews-heading">
                            <h4><SectionLabel icon="review">Reviews written</SectionLabel></h4>
                            <Badge>{reviewed.length} {reviewed.length === 1 ? 'review' : 'reviews'}</Badge>
                          </header>
                          {reviewed.length ? <div className="rj-review-grid">{reviewed.map(reviewCard)}</div> : <p>No reviews this month.</p>}
                        </section>
                    </div>}
                  </div>,
                };
              })}/>
          </div>
        </section>
        <aside className="rj-stack" aria-label="More from SK">
        <Card className="rj-now">
          <h2 className="rj-kicker"><SectionLabel icon="book">Currently reading</SectionLabel></h2>
          <div className="rj-book"><Cover id={currentRead.book}/><div className="rj-stack">
            <div><h3>{current.title}</h3><p>{current.author}</p></div>
            <ProgressBar label={`Page ${currentRead.page} of ${currentRead.pages}`} value={Math.round(currentRead.page / currentRead.pages * 100)}/>
          </div></div>
          <div className="rj-row">{saveButton(currentRead.book)}</div>
          <details className="rj-reading-note">
            <summary>Latest note & discussion</summary>
            <blockquote><p>“{currentRead.note}”</p><footer>SK’s latest note · <DateText date={currentRead.date}/></footer></blockquote>
            <div className="rj-row">{likeButton('update', currentRead.likes)}
              <Button variant="ghost" onClick={() => open('discussion')}>View all comments ({comments.length})</Button></div>
            <p className="rj-meta"><strong>{comments[0].name}</strong> · {comments[0].text}</p>
          </details>
        </Card>
        <Card className="rj-challenge">
          <h2 className="rj-kicker"><SectionLabel icon="target">{challenge.year} yearly challenge</SectionLabel></h2>
          <p className="rj-number">{challenge.count} <small>of {challenge.goal} books</small></p>
          <ProgressBar label="Yearly challenge progress" value={challenge.count} max={challenge.goal} showValue={false}/>
          <p><Badge tone="success">Goal complete</Badge></p>
          <div className="rj-row"><Button variant="secondary" onClick={() => open('challenge')}>View books</Button>
            <Button variant="ghost" onClick={() => open('recap')}>Year in Books</Button></div>
        </Card>
        </aside>
      </div>
      <section className="rj-explore" aria-labelledby="explore-sk">
        <header className="rj-row rj-explore-head">
          <div><h2 id="explore-sk"><SectionLabel icon="book">Explore SK’s library</SectionLabel></h2>
          <p>Browse her shelves, favourites, and recent activity.</p></div>
          <Button variant="ghost" className="rj-accent-text" icon="arrow" iconPosition="end" onClick={() => open('activity')}>Recent reviews</Button>
        </header>
        <div className="rj-explore-grid">
          <Card className="rj-explore-shelves"><h3><SectionLabel icon="books">Bookshelves</SectionLabel></h3>{shelfLinks(shelves)}</Card>
          <Card className="rj-explore-favourites"><h3><SectionLabel icon="heart">Favourite books</SectionLabel></h3>{bookList(shelves.find(item => item.id === 'favourites').books.slice(0, 2))}
            <Button variant="ghost" className="rj-accent-text" icon="arrow" iconPosition="end" onClick={() => showShelf('favourites')}>Full favourites shelf</Button></Card>
          <div className="rj-stack rj-explore-details">
          <Card><h3><SectionLabel icon="tag">Favourite genres</SectionLabel></h3><div className="rj-row">{favouriteGenres.map(genre => <Tag key={genre} onToggle={() => open('genre', genre)}>{genre}</Tag>)}</div></Card>
          <Card><h3><SectionLabel icon="people">More from SK</SectionLabel></h3><ul className="rj-shelf-list">
            {Object.entries({about: 'About, ratings & rankings', activity: 'Recent reviews & activity', social: 'Friends, following & followers', quotes: 'Saved quotes', community: 'Groups, polls, lists & profile comments'}).map(([key, label]) =>
              <li key={key}><button onClick={() => open(key)}>{label}</button></li>)}
          </ul><p className="rj-meta">{profile.friends.length} friends · {profile.following.length} following · {profile.followers.length} followers</p></Card>
          </div>
        </div>
      </section>
    </main>
    <div role="status" className="sr-only">{notice}</div>
    <div className={`rj-dialog ${panel?.kind === 'shelf' || panel?.kind === 'shelves' ? 'rj-drawer' : ''}`}>
      <Modal open={Boolean(panel)} onClose={() => setPanel(null)} title={panelTitles[panel?.kind] || 'Reading Journal'}>
        <div className="rj-stack" ref={dialogBody}>{panel?.from && <Button variant="ghost" onClick={() => setPanel(panel.from)}>Back to {panel.from.kind === 'shelf' ? 'shelf' : panel.from.kind === 'shelves' ? 'bookshelves' : panel.from.kind === 'book' ? 'book' : 'previous panel'}</Button>}
          {panelContent()}<div role="status" className="sr-only">{notice}</div></div>
      </Modal>
    </div>
  </div>;
}

createRoot(document.getElementById('root')).render(<Journal/>);
