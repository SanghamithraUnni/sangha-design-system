export const profile = {
  name: 'SK', location: 'Bengaluru, India', joined: 'May 2014', active: 'Nov 9, 2026',
  bio: 'Mood reader. Usually halfway through something strange, sad, or set in a world I wish I could visit.',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
  ratings: 684, average: 3.92, reviews: 216, rank: '#42 in India this week',
  friends: ['Ananya Rao', 'Dev Menon', 'Leah Thomas'], following: ['Ananya Rao', 'Nina Joseph'],
  followers: ['Dev Menon', 'Leah Thomas', 'Rhea Shah'],
};

const prhCover = isbn => `https://images.penguinrandomhouse.com/cover/${isbn}`;

export const books = {
  midnight: { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fantasy', cover: 'ice',
    edition: { isbn: '9780525559474', publisher: 'Viking', format: 'Hardcover', coverUrl: prhCover('9780525559474') } },
  left: { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', genre: 'Speculative fiction', cover: 'ice',
    edition: { isbn: '9780441007318', publisher: 'Ace', format: 'Paperback', coverUrl: prhCover('9780441007318') } },
  piranesi: { title: 'Piranesi', author: 'Susanna Clarke', genre: 'Speculative fiction', cover: 'sea',
    edition: { isbn: '9781635575637', publisher: 'Bloomsbury', format: 'Hardcover', coverUrl: 'https://covers.bksh.co/cover187287-medium.png' } },
  tomorrow: { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', genre: 'Literary fiction', cover: 'rose',
    edition: { isbn: '9780593321201', publisher: 'Knopf', format: 'Hardcover', coverUrl: prhCover('9780593321201') } },
  dispossessed: { title: 'The Dispossessed', author: 'Ursula K. Le Guin', genre: 'Speculative fiction', cover: 'ochre',
    edition: { isbn: '9780061054884', publisher: 'Harper Voyager', format: 'Paperback', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780061054884-L.jpg?default=false' } },
  night: { title: 'The Night Circus', author: 'Erin Morgenstern', genre: 'Fantasy', cover: 'sea',
    edition: { isbn: '9780385534635', publisher: 'Doubleday', format: 'Hardcover', coverUrl: prhCover('9780385534635') } },
  station: { title: 'Station Eleven', author: 'Emily St. John Mandel', genre: 'Speculative fiction', cover: 'ice',
    edition: { isbn: '9780804172448', publisher: 'Vintage', format: 'Paperback', coverUrl: prhCover('9780804172448') } },
  sea: { title: 'The House in the Cerulean Sea', author: 'TJ Klune', genre: 'Fantasy', cover: 'ochre',
    edition: { isbn: '9781250217288', publisher: 'Tor Books', format: 'Hardcover', coverUrl: 'https://images.macmillan.com/folio-assets/macmillan_us_frontbookcovers_1000H/9781250217288.jpg' } },
  goldfinch: { title: 'The Goldfinch', author: 'Donna Tartt', genre: 'Literary fiction', cover: 'ochre',
    edition: { isbn: '9780316055444', publisher: 'Little, Brown Paperbacks', format: 'Trade paperback', coverUrl: 'https://www.hachettebookgroup.com/wp-content/uploads/2026/02/9780316055444.jpg?w=415' } },
  tranquility: { title: 'Sea of Tranquility', author: 'Emily St. John Mandel', genre: 'Speculative fiction', cover: 'ice',
    edition: { isbn: '9780593321447', publisher: 'Knopf', format: 'Hardcover', coverUrl: prhCover('9780593321447') } },
  pachinko: { title: 'Pachinko', author: 'Min Jin Lee', genre: 'Literary fiction', cover: 'rose',
    edition: { isbn: '9781455563937', publisher: 'Grand Central Publishing', format: 'Hardcover', coverUrl: 'https://www.hachettebookgroup.com/wp-content/uploads/2018/01/9781455563937.jpg?w=422' } },
};

export const currentRead = {
  book: 'left', page: 208, pages: 336, date: '2026-11-08',
  note: 'The journey across the ice has made me slow down. I keep rereading the quiet moments between Genly and Estraven.',
  likes: 8, comments: [
    { name: 'Ananya Rao', date: '2026-11-08', text: 'That stretch is why I always come back to this book.' },
    { name: 'Dev Menon', date: '2026-11-09', text: 'Adding this to my winter reading stack.' },
  ],
};

export const reviews = {
  midnight: {
    date: '2025-07-20', rating: 2, likes: 7,
    excerpt: 'I liked the doorway into each life, but the lesson arrived before the characters did.',
    text: 'The early scenes promised a stranger, messier book about regret. I wanted to stay in one of those alternate lives long enough to see its complications. Instead, the visits felt like illustrations of a lesson I had already understood. I can see why it comforts people, but I wanted more room for uncertainty.',
  },
  piranesi: {
    date: '2026-11-04', rating: 5, likes: 24,
    excerpt: 'I wanted to go back to the House as soon as I closed the book.',
    text: 'The tide charts and lists of statues could have felt like homework. Instead, they made the House feel like a place someone had lived in and loved. Piranesi notices things I would have hurried past. I finished this in one evening and spent the next morning thinking about his generosity.',
  },
  tomorrow: {
    date: '2026-10-21', rating: 4, likes: 17,
    excerpt: 'The games were interesting, but it was the friendship that kept me reading.',
    text: 'I loved the passages about making something together, especially when nobody could quite agree on who it belonged to. The middle dragged for me, but the small ways Sam and Sadie hurt and help each other felt painfully familiar.',
  },
  pachinko: {
    date: '2026-10-09', rating: 5, likes: 19,
    excerpt: 'Sunja’s quiet decisions stayed with me long after the last page.',
    text: 'What moved me most was how often love shows up as work: finding something to sell, keeping a household going, making a place for someone at the table. The book moves through decades, but those small choices gave me something to hold on to.',
  },
  night: {
    date: '2026-10-28', rating: 4, likes: 13,
    excerpt: 'I would happily spend another evening wandering between those tents.',
    text: 'I cared less about who won the contest than about the people building a life around it. The wandering structure worked for me once I treated each chapter like a tent I could step into for a while.',
  },
  dispossessed: {
    date: '2025-10-24', rating: 5, likes: 15,
    excerpt: 'I kept changing my mind about which world felt more familiar.',
    text: 'Shevek is most interesting when the answers he has grown up with stop being enough. I liked the way a meal, a room, or a conversation could make a political idea feel personal.',
  },
  sea: {
    date: '2025-07-16', rating: 4, likes: 9,
    excerpt: 'The small acts of trust were my favourite part.',
    text: 'I went in for the strange island and stayed for the everyday rituals. The story is at its best when Linus listens long enough to notice how much he has missed.',
  },
  station: {
    date: '2026-09-17', rating: 4, likes: 12,
    excerpt: 'The travelling symphony is the part I keep thinking about.',
    text: 'I expected the story to dwell on what people lost. What stayed with me was what they carried forward, from an old comic to a Shakespeare play. The jumps in time took me a while to settle into, but they paid off.',
  },
};

export const finishes = [
  { book: 'piranesi', date: '2026-11-02' },
  { book: 'tomorrow', date: '2026-10-18' },
  { book: 'pachinko', date: '2026-10-06' },
  { book: 'night', date: '2026-10-27' },
  { book: 'station', date: '2026-09-14' },
  { book: 'dispossessed', date: '2025-10-20' },
  { book: 'sea', date: '2025-07-13' },
  { book: 'midnight', date: '2025-07-19' },
];
export const challenge = {
  year: 2026, count: 130, goal: 120,
  milestones: [
    { date: '2025-10-20', title: 'Back to the Hainish Cycle', text: 'SK returned to Le Guin with The Dispossessed.' },
    { date: '2026-11-02', title: '130 books read', text: 'Piranesi took SK ten books past her goal.' },
    { date: '2026-10-18', title: 'Challenge complete', text: 'Tomorrow, and Tomorrow, and Tomorrow was book 120.' },
    { date: '2026-09-14', title: '100 books read', text: 'SK reached triple digits with Station Eleven.' },
  ],
};
export const shelves = [
  { id: 'read', name: 'Read', count: 684, books: ['piranesi', 'tomorrow', 'pachinko', 'night', 'station', 'dispossessed', 'sea', 'midnight'] },
  { id: 'want', name: 'Want to Read', count: 91, books: ['tranquility'] },
  { id: 'current', name: 'Currently Reading', count: 1, books: ['left'] },
  { id: 'dnf', name: 'Did Not Finish', count: 12, books: ['goldfinch'] },
  { id: 'favourites', name: 'Favourites', count: 26, books: ['piranesi', 'pachinko', 'station'] },
  { id: 'strange', name: 'Strange worlds', count: 18, books: ['left', 'piranesi', 'dispossessed'] },
];
export const favouriteGenres = ['Speculative fiction', 'Literary fiction', 'Fantasy'];
export const quotes = [
  { id: 'q1', text: 'Survival is insufficient.', book: 'station', tags: ['art', 'survival'], likes: 14 },
  { id: 'q2', text: 'The beauty of the House is immeasurable; its Kindness infinite.', book: 'piranesi', tags: ['wonder', 'kindness'], likes: 9 },
];
export const community = {
  groups: [{ title: 'Bengaluru Reading Circle', text: 'Monthly buddy reads and Sunday book swaps.' }],
  polls: [{ title: 'December buddy read', options: ['The Dispossessed', 'The House in the Cerulean Sea'] }],
  lists: [{ title: 'Books with impossible places', books: ['piranesi', 'night', 'sea'] }],
  comments: [{ name: 'Leah Thomas', date: '2026-11-03', text: 'Your October reads convinced me to finally pick up Pachinko.' }],
};

export const readingMoods = [
  {
    id: 'cry', label: 'Make me cry', caption: 'Big feelings, quiet endings', tone: 'lavender', icon: 'heart',
    picks: [
      {book: 'pachinko', shelf: 'favourites', reason: 'For the kind of cry that sneaks up on you. Sunja’s choices echo through generations, and the smallest acts of care hit hardest.'},
      {book: 'tomorrow', shelf: 'read', reason: 'The friendship at the centre aches because the characters care so much and still keep getting it wrong.'},
      {book: 'station', shelf: 'favourites', reason: 'Read it for the things people carry forward after loss, especially the art they make for one another.'},
    ],
  },
  {
    id: 'night', label: 'Keep me up all night', caption: 'One more chapter', tone: 'blue', icon: 'sparkle',
    picks: [
      {book: 'night', shelf: 'read', reason: 'Each tent reveals another piece of the competition. I kept opening one more chapter to see what was behind the next curtain.'},
      {book: 'station', shelf: 'favourites', reason: 'The jumps in time turn familiar objects into clues. I wanted to see where all those threads met.'},
      {book: 'tomorrow', shelf: 'read', reason: 'The momentum comes from watching a small creative decision turn into a much bigger personal one.'},
    ],
  },
  {
    id: 'world', label: 'Give me a world to get lost in', caption: 'Somewhere entirely different', tone: 'mint', icon: 'book',
    picks: [
      {book: 'piranesi', shelf: 'favourites', reason: 'Come for an endless house with oceans inside it. Stay for the way Piranesi makes its tides, statues, and quiet rituals feel like home.'},
      {book: 'dispossessed', shelf: 'strange', reason: 'Two societies feel real through the little things, like how a room is shared or what a meal means to someone.'},
      {book: 'sea', shelf: 'read', reason: 'A remote island and its peculiar household make this the warmest place on the shelf to disappear for an afternoon.'},
    ],
  },
];

export const bookDescriptions = {
  pachinko: 'Four generations of a Korean family build a life in Japan across decades of upheaval.',
  tomorrow: 'Two friends build video games together as their creative partnership tests their friendship.',
  station: 'A travelling theatre troupe performs in the years after a pandemic changes the world.',
  night: 'Two magicians compete inside a circus that only opens after dark.',
  piranesi: 'A solitary explorer maps a vast house filled with statues, tides, and clues to his past.',
  dispossessed: 'A physicist travels between two worlds with opposing ideas about freedom and ownership.',
  sea: 'A caseworker visits a remote island home for children with unusual powers.',
};
