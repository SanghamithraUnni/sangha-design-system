export const visitor = {
  name: 'You',
  photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces',
};

export const visitorShelves = [
  {
    id: 'shared', label: 'Shared reads',
    read: [
      {book: 'midnight', rating: 5, note: 'The different lives made me think about all the things I still get to choose.'},
      {book: 'station', note: 'The travelling symphony made this feel hopeful.'},
      {book: 'goldfinch', rating: 5, note: 'I kept thinking about what Theo owes the people who tried to help him.'},
      {book: 'thursday-murder-club', genre: 'Mystery', rating: 4},
      {book: 'braiding-sweetgrass', genre: 'Nonfiction', rating: 4},
    ],
    saved: ['night', 'tranquility'],
  },
  {id: 'saved', label: 'Saved books only', read: [], saved: ['night', 'tranquility']},
  {id: 'genres', label: 'Shared genres only', read: [{book: 'goldfinch', rating: 5}], saved: []},
  {id: 'empty', label: 'Empty shelf', read: [], saved: []},
];
