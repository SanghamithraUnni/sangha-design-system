import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Avatar, Badge, Button, Card, DropdownMenu, Icon, Input, List, Modal, ProgressBar, Tag, Textarea,
} from '../../../design-system/src/components.jsx';
import {
  bookDescriptions, books, challenge, community, currentRead, favouriteGenres, finishes, profile, quotes, readingMoods, reviews, shelves,
} from '../data.js';
import './feeling.css';

const dateFormat = new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
const dateLabel = date => dateFormat.format(new Date(date));
const recentReviews = Object.keys(reviews).filter(id => books[id]).sort((a, b) => reviews[b].date.localeCompare(reviews[a].date));
const current = books[currentRead.book];
const libraryIds = Object.keys(books);
const favourites = shelves.find(item => item.id === 'favourites');
const shelfBooks = shelf => shelf?.books.filter(id => books[id]) ?? [];
const savedQuote = quotes.find(quote => books[quote.book]);
const moods = readingMoods.map(mood => ({
  ...mood,
  picks: mood.picks.filter(pick => books[pick.book]),
}));
const firstPopulatedMood = moods.find(mood => mood.picks.length);
const fallbackBook = shelfBooks(favourites)[0] ?? (current ? currentRead.book : libraryIds[0]);
const fallbackShelf = shelves.find(shelf => shelf.id === 'favourites' && shelfBooks(shelf).includes(fallbackBook))
  ?? shelves.find(shelf => shelfBooks(shelf).includes(fallbackBook));

function Cover({id}) {
  const book = books[id];
  const [failedUrl, setFailedUrl] = useState(null);
  const url = book.edition.coverUrl;
  if (failedUrl !== url) {
    return <img className="pf-cover pf-cover-image" src={url} alt="" onError={() => setFailedUrl(url)}/>;
  }
  return <div aria-hidden="true" className={'pf-cover pf-cover-fallback ' + book.cover}>
    <span>{book.title}</span><small>{book.author}</small>
  </div>;
}

function SectionLabel({icon, children}) {
  return <span className="pf-heading-label"><span className="pf-heading-icon">
    <Icon name={icon}/>
  </span>{children}</span>;
}

function DateText({date}) {
  return <time dateTime={date}>{dateLabel(date)}</time>;
}

function PickAFeeling() {
  const [moodId, setMoodId] = useState('world');
  const [featuredBook, setFeaturedBook] = useState(null);
  const postcardHeading = useRef(null);
  const savedShelfAction = useRef(null);
  const mood = moods.find(item => item.id === moodId);
  const pick = mood.picks.find(item => item.book === featuredBook) ?? mood.picks[0];
  const fallback = !firstPopulatedMood && fallbackBook ? {book: fallbackBook, shelf: fallbackShelf?.id} : null;
  const featured = pick ?? fallback;
  const alternatives = mood.picks.filter(item => item.book !== featured?.book).slice(0, 2);
  const featuredShelf = shelves.find(shelf => shelf.id === featured?.shelf);
  const sameShelf = shelfBooks(featuredShelf).filter(id => id !== featured?.book);
  const alternativesOnShelf = sameShelf.some(id => alternatives.some(item => item.book === id));

  function selectMood(id) {
    setMoodId(id);
    setFeaturedBook(null);
  }

  function tryAnotherMood() {
    const next = moods.find(item => item.id !== moodId && item.picks.length) ?? moods.find(item => item.id !== moodId);
    if (next) {
      selectMood(next.id);
      document.getElementById(`pf-mood-${next.id}`)?.focus();
    }
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
      <span className="pf-like-label"><Icon name="heart"
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
    return <ul className="pf-shelf-list">{items.map(item => <li key={item.id}>
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
    return <article key={id} className="pf-review pf-book-review">
      <header className="pf-review-book">
        <Cover id={id}/>
        <div>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
        </div>
      </header>
      <div className="pf-row pf-review-meta">
        <span className="pf-rating" role="img" aria-label={`${review.rating} out of 5 stars`}>
          <span aria-hidden="true">{Array.from({length: 5}, (_, index) =>
            <Icon name="star" key={index} size="sm" weight={index < review.rating ? 'fill' : 'regular'}/>)}</span>
          <span aria-hidden="true">{review.rating}/5</span>
        </span>
        <DateText date={review.date}/>
      </div>
      <blockquote className="pf-review-excerpt"><p>“{review.excerpt}”</p></blockquote>
      <footer className="pf-row pf-review-actions">
        <Button variant="ghost" className="pf-accent-text" icon="arrow" iconPosition="end" onClick={() => open('review', id, panel)}>Read full review</Button>
        {likeButton(id, review.likes)}
      </footer>
    </article>;
  }

  const panelTitles = {
    about: 'About SK', shelves: 'SK’s bookshelves', shelf: shelf?.name, genre: panel?.id,
    review: 'SK’s review', book: books[panel?.id]?.title, activity: 'Recent activity',
    discussion: 'Reading update discussion', challenge: `${challenge.year} Reading Challenge`, recap: `${challenge.year} Year in Books`,
    social: 'SK’s reading network', quotes: 'Saved quotes', community: 'Groups, polls, lists & profile comments',
    search: 'Book search', account: 'Your reading account', saved: 'Your Want to Read shelf',
  };

  function panelContent() {
    const id = panel?.id;
    switch (panel?.kind) {
      case 'about':
        return <>
          <p>{profile.bio}</p>
          <dl className="pf-facts"><div><dt>Location</dt><dd>{profile.location}</dd></div>
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
        return <><div className="pf-book"><Cover id={id}/><p>{books[id].author} · {books[id].genre}</p></div>
          <div className="pf-row">{saveButton(id)}{reviews[id] && <Button variant="ghost" onClick={() => open('review', id, panel)}>Read SK’s review</Button>}</div></>;
      case 'review':
        return <><div className="pf-book"><Cover id={id}/><div><h3>{books[id].title}</h3><p>{books[id].author}</p></div></div>
          <div className="pf-row"><Badge tone="accent">{reviews[id].rating} / 5 stars</Badge><DateText date={reviews[id].date}/></div>
          <p>{reviews[id].excerpt}</p><p>{reviews[id].text}</p>
          <div className="pf-row">{likeButton(id, reviews[id].likes)}{saveButton(id)}</div></>;
      case 'activity':
        return <>{current && <article className="pf-review"><h3>Reading update · {current.title}</h3><DateText date={currentRead.date}/>
          <p>{currentRead.note}</p><div className="pf-row">{likeButton('update', currentRead.likes)}
            <Button variant="secondary" onClick={() => open('discussion', null, panel)}>View all comments ({comments.length})</Button></div>
        </article>}{recentReviews.map(reviewCard)}{!current && !recentReviews.length && <p>No reading activity yet.</p>}</>;
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
          <dl className="pf-facts"><div><dt>Books read</dt><dd>{challenge.count}</dd></div><div><dt>Goal</dt><dd>{challenge.goal}</dd></div>
            <div><dt>Most revisited genre</dt><dd>{favouriteGenres[0]}</dd></div></dl><h3>A standout read</h3>{bookList(['piranesi'])}</>;
      case 'social':
        return <>{['friends', 'following', 'followers'].map(key => <section key={key}><h3 className="pf-capitalize">{key} · {profile[key].length}</h3>
          <List compact items={profile[key].map(name => ({id: name, title: name, leading: <Avatar size="sm" name={name}/>}))}/></section>)}</>;
      case 'quotes':
        return quotes.filter(quote => books[quote.book]).map(quote => <article key={quote.id} className="pf-review"><p>“{quote.text}”</p>
          <Button variant="ghost" onClick={() => open('book', quote.book, panel)}>{books[quote.book].author} · {books[quote.book].title}</Button>
          <div className="pf-row">{quote.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}{likeButton(quote.id, quote.likes)}</div></article>);
      case 'community':
        return <>
          <h3><SectionLabel icon="people">Groups</SectionLabel></h3><List items={community.groups.map(item => ({id: item.title, title: item.title, description: item.text}))}/>
          <h3><SectionLabel icon="review">Polls</SectionLabel></h3>{community.polls.map(poll => <div key={poll.title}><p>{poll.title}</p><div className="pf-row">
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

  function postcard({book: id, reason}) {
    const book = books[id];
    const review = reviews[id];
    const isSaved = saved.includes(id);
    return <article className="pf-postcard">
      <div className="pf-postcard-art"><Cover key={id} id={id}/></div>
      <div className="pf-postcard-copy">
        <p className="pf-kicker"><Icon name={fallback ? 'books' : mood.icon}/>{fallback ? 'From SK’s shelves' : 'A postcard from SK'}</p>
        <h2 ref={postcardHeading} tabIndex={-1}>{book.title}</h2>
        <p className="pf-author">{book.author}</p>
        {featuredShelf && <Button variant="ghost" className="pf-source" icon="books" onClick={() => showShelf(featuredShelf.id)}>
          From SK’s {featuredShelf.name} shelf
        </Button>}
        {reason ? <blockquote className="pf-shelf-note"><Icon name="quote" size="sm"/><div>
          <cite>SK’s shelf note</cite><p>{reason}</p>
        </div></blockquote> : <>
          {!fallback && <p><Tag>{mood.label}</Tag></p>}
          {bookDescriptions[id] && <div className="pf-description"><strong>Book description</strong><p>{bookDescriptions[id]}</p></div>}
        </>}
        <div className="pf-row pf-postcard-actions">
          {fallback ? <Button icon="books" onClick={() => open('shelves')}>Browse SK’s shelves</Button> : isSaved
            ? <div className="pf-save-confirm"><Icon name="check"/><div><strong>Saved to your Want to Read shelf</strong>
              <Button ref={savedShelfAction} variant="ghost" className="pf-accent-text" onClick={() => open('saved')}>View shelf</Button></div></div>
            : <Button icon="plus" onClick={() => {
              save(id);
              requestAnimationFrame(() => savedShelfAction.current?.focus());
            }}>Want to Read</Button>}
          {review && <Button variant="ghost" className="pf-accent-text" icon="arrow" iconPosition="end" onClick={() => open('review', id)}>Read review</Button>}
        </div>
      </div>
    </article>;
  }

  return <div className="pf">
    <header className="pf-header">
      <div className="pf-wrap pf-header-inner">
        <a className="pf-wordmark" href="#pick-a-feeling">good<strong>reads</strong></a>
        <nav aria-label="Goodreads" className="pf-row">
          <Button variant="ghost" onClick={() => open('saved')}>My Books</Button>
          <Button variant="ghost" onClick={() => open('social')}>Friends</Button>
          <Button variant="ghost" onClick={() => open('account')}>Account</Button>
        </nav>
        <form className="pf-search" role="search" aria-label="Books"
          onSubmit={event => {event.preventDefault(); open('search');}}>
          <div className="pf-search-field"><Icon name="search"/>
            <Input label="Search books" type="search" placeholder="Search books" enterKeyHint="search"
              value={query} onChange={event => setQuery(event.target.value)}/>
          </div>
          <Button type="submit" variant="accent">Search</Button>
        </form>
      </div>
    </header>
    <main id="pick-a-feeling" className="pf-wrap pf-page">
      <section className="pf-stage" aria-label="SK’s profile">
        <div className="pf-profile">
          <Avatar name={profile.name} src={profile.photo} size="lg"/>
          <div><strong>{profile.name}</strong><p>{profile.bio}</p></div>
          <div className="pf-row">
            {libraryIds.length > 0 && <Button variant={following ? 'secondary' : 'primary'} aria-pressed={following}
              onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow'}</Button>}
            <DropdownMenu label="More" items={[
              {id: 'about', label: 'About SK', onSelect: () => open('about')},
              {id: 'shelves', label: 'SK’s bookshelves', onSelect: () => open('shelves')},
              {id: 'social', label: 'Friends & followers', onSelect: () => open('social')},
            ]}/>
          </div>
        </div>
      </section>

      <div className="pf-content">
        <section className={`pf-selection pf-tone-${mood.tone}`} aria-label="Shelf Postcards">
          <div className="pf-intro">
            <div className="pf-intro-copy">
              <p className="pf-kicker"><Icon name="sparkle"/> Shelf Postcards</p>
              <h1 id="mood-question">What are you in the mood for?</h1>
              <p>Pick a bookmark and see what SK would pull off her shelf.</p>
            </div>
            {libraryIds.length > 0 && <fieldset className="pf-moods" aria-labelledby="mood-question">
              {moods.map((item, index) => <label key={item.id} className={`pf-mood pf-tone-${item.tone}`}>
                <input id={`pf-mood-${item.id}`} type="radio" name="reading-mood" value={item.id} checked={moodId === item.id}
                  onChange={() => selectMood(item.id)}/>
                <span className="pf-mood-hole" aria-hidden="true"/>
                <span className="pf-mood-art" aria-hidden="true"><Icon name={item.icon} size="lg"/></span>
                <span className="pf-mood-copy"><strong>{item.label}</strong><small>{item.caption}</small></span>
                <span className="pf-mood-index" aria-hidden="true">{moodId === item.id ? <Icon name="check"/> : `0${index + 1}`}</span>
              </label>)}
            </fieldset>}
          </div>
          <p className="sr-only" role="status">{featured ? `Featured pick: ${books[featured.book].title}.` : `No picks for ${mood.label}.`}</p>
          {featured ? postcard(featured) : <article className="pf-postcard pf-postcard-empty">
            <div className="pf-blank-bookmark" aria-hidden="true"><Icon name="book" size="lg"/></div>
            <div className="pf-postcard-copy">
              {libraryIds.length === 0 ? <>
                <h2>SK’s shelves are just getting started</h2>
                <p>{profile.bio}</p>
                <div className="pf-row">
                  <Button aria-pressed={following} onClick={() => setFollowing(!following)}>{following ? 'Following SK' : 'Follow SK'}</Button>
                  <a className="ds-button secondary" href="https://www.goodreads.com/genres">Browse books <Icon name="external"/></a>
                </div>
              </> : <>
                <h2>No picks for this feeling yet</h2>
                <p>SK hasn’t tagged a book for this bookmark. There’s another postcard waiting.</p>
                <Button variant="secondary" onClick={() => {
                  selectMood(firstPopulatedMood.id);
                  document.getElementById(`pf-mood-${firstPopulatedMood.id}`)?.focus();
                }}>Try {firstPopulatedMood.label.toLowerCase()}</Button>
              </>}
            </div>
          </article>}
          {alternatives.length > 0 && <section className="pf-alternatives" aria-label="More for this mood">
            <h3>More for this mood</h3>
            <div className="pf-alternative-grid">{alternatives.map(item => <button key={item.book} type="button" onClick={() => {
              setFeaturedBook(item.book);
              requestAnimationFrame(() => postcardHeading.current?.focus());
            }}>
              <Cover id={item.book}/><span><strong>{books[item.book].title}</strong><small>{books[item.book].author}</small></span><Icon name="arrow"/>
            </button>)}</div>
          </section>}
          {pick && mood.picks.length === 1 && <Button variant="ghost" icon="arrow" iconPosition="end" onClick={tryAnotherMood}>Try another feeling</Button>}
        </section>

        {featuredShelf && <section className="pf-same-shelf" aria-labelledby="pf-same-title">
          <h2 id="pf-same-title"><SectionLabel icon="books">From the same shelf</SectionLabel></h2>
          {!alternativesOnShelf && sameShelf.length > 0 && <div className="pf-shelf-covers">
            {sameShelf.slice(0, 3).map(id => <button type="button" key={id} aria-label={`Open ${books[id].title}`} onClick={() => open('book', id)}>
              <Cover id={id}/>
            </button>)}
          </div>}
          <Button variant="ghost" className="pf-accent-text" icon="arrow" iconPosition="end" onClick={() => showShelf(featuredShelf.id)}>
            Explore SK’s {featuredShelf.name} shelf
          </Button>
        </section>}

        <section className="pf-updates" aria-label="SK’s reading updates">
          {current && <Card className="pf-current">
            <h2><SectionLabel icon="book">Currently reading</SectionLabel></h2>
            <div className="pf-book">
              <Cover id={currentRead.book}/>
              <div><h3>{current.title}</h3><p>{current.author}</p>
                <ProgressBar label={`Page ${currentRead.page} of ${currentRead.pages}`} value={Math.round(currentRead.page / currentRead.pages * 100)} showValue={false}/>
                <Badge tone="accent"><Icon name="book" size="sm"/> {Math.round(currentRead.page / currentRead.pages * 100)}% through</Badge>
              </div>
            </div>
            {currentRead.note && <blockquote className="pf-excerpt"><Icon name="quote" size="sm"/><div>
              <p>“{currentRead.note}”</p><cite>Latest reaction · <DateText date={currentRead.date}/></cite>
            </div></blockquote>}
            {comments.length > 0 && <p className="pf-meta">{comments.at(-1).name} · {comments.at(-1).text}</p>}
            <div className="pf-row">{saveButton(currentRead.book)}
              <Button variant="ghost" icon="review" onClick={() => open('discussion')}>View all comments ({comments.length})</Button>
            </div>
          </Card>}
          <Card className="pf-challenge">
            <h2><SectionLabel icon="target">Yearly challenge</SectionLabel></h2>
            <p className="pf-challenge-count"><strong>{challenge.count}</strong> of {challenge.goal} books</p>
            <ProgressBar label={`${challenge.year} reading goal`} max={challenge.goal} value={challenge.count} showValue={false}/>
            {challenge.count >= challenge.goal && <p className="pf-goal-stamp"><Badge tone="success"><Icon name="trophy" size="sm"/> Goal complete</Badge></p>}
            <div className="pf-row">
              <Button variant="secondary" onClick={() => open('challenge')}>View books</Button>
              <Button variant="ghost" onClick={() => open('recap')}>Year in Books</Button>
            </div>
          </Card>
        </section>

        {recentReviews.length > 0 ? <section className="pf-reviews" aria-labelledby="pf-recent">
          <header className="pf-section-head">
            <h2 id="pf-recent"><SectionLabel icon="review">Recent reviews</SectionLabel></h2>
            <Button variant="ghost" icon="arrow" iconPosition="end" onClick={() => open('activity')}>All reading activity</Button>
          </header>
          <div className="pf-review-grid">{recentReviews.slice(0, 3).map(reviewCard)}</div>
        </section> : savedQuote ? <Card className="pf-quote-fallback">
          <h2><SectionLabel icon="quote">A line SK saved</SectionLabel></h2>
          <blockquote>“{savedQuote.text}”</blockquote>
          <p>{books[savedQuote.book].title} · {books[savedQuote.book].author}</p>
        </Card> : shelfBooks(favourites).length > 0 ? <Card className="pf-quote-fallback">
          <h2><SectionLabel icon="heart">SK’s favourites</SectionLabel></h2>
          {bookList(shelfBooks(favourites).slice(0, 3))}
        </Card> : null}

        <section className="pf-library" aria-labelledby="pf-library-title">
          <header className="pf-section-head"><h2 id="pf-library-title"><SectionLabel icon="books">SK’s Shelves</SectionLabel></h2>
            <Button variant="secondary" onClick={() => open('shelves')}>Browse bookshelves</Button>
          </header>
          <div className="pf-shelf-grid">{shelves.map(shelf => <button type="button" key={shelf.id} onClick={() => showShelf(shelf.id)}>
            <span className="pf-mini-stack" aria-hidden="true">
              {shelfBooks(shelf).slice(0, 3).map(id => <Cover key={id} id={id}/>)}
              {shelfBooks(shelf).length === 0 && <Icon name="books" size="lg"/>}
            </span>
            <strong>{shelf.name}</strong><Badge>{libraryIds.length ? shelf.count : 0}</Badge>
          </button>)}</div>
          <div className="pf-library-grid">
            <Card><h3>Favourite books</h3>
              {bookList(shelves.find(item => item.id === 'favourites').books.slice(0, 2))}
              <Button variant="ghost" icon="arrow" iconPosition="end" onClick={() => showShelf('favourites')}>Full favourites shelf</Button>
            </Card>
            <Card><h3>Favourite genres</h3><div className="pf-row">
              {favouriteGenres.map(genre => <Button key={genre} variant="secondary" onClick={() => open('genre', genre)}>{genre}</Button>)}
            </div><p className="pf-meta">{profile.friends.length} friends · {profile.following.length} following · {profile.followers.length} followers</p>
              <Button variant="ghost" onClick={() => open('social')}>View reading network</Button>
            </Card>
            <Card><h3>More from SK</h3><ul className="pf-shelf-list">
              <li><button type="button" onClick={() => open('about')}>About, ratings & rankings <Icon name="arrow"/></button></li>
              <li><button type="button" onClick={() => open('activity')}>Reading activity <Icon name="arrow"/></button></li>
              <li><button type="button" onClick={() => open('quotes')}>Saved quotes <Icon name="arrow"/></button></li>
              <li><button type="button" onClick={() => open('community')}>Groups, polls, lists & profile comments <Icon name="arrow"/></button></li>
            </ul></Card>
          </div>
        </section>
      </div>
    </main>
    <footer className="pf-wrap pf-footer"><span>Pick a Feeling · SK on Goodreads</span><a href="/reading-journal.html">Open Reading Journal</a></footer>
    <div role="status" className="sr-only">{notice}</div>
    <div className={`pf-dialog ${panel?.kind === 'shelf' || panel?.kind === 'shelves' ? 'pf-drawer' : ''}`}>
      <Modal open={Boolean(panel)} onClose={() => setPanel(null)} title={panelTitles[panel?.kind] || 'Pick a Feeling'}>
        <div className="pf-stack" ref={dialogBody}>
          {panel?.from && <Button variant="ghost" onClick={() => setPanel(panel.from)}>Back to {panelTitles[panel.from.kind] || 'previous panel'}</Button>}
          {panelContent()}
          <div role="status" className="sr-only">{notice}</div>
        </div>
      </Modal>
    </div>
  </div>;
}

createRoot(document.getElementById('root')).render(<PickAFeeling/>);
