import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
const path = value => fileURLToPath(new URL(value, import.meta.url));
export default defineConfig({
 resolve:{dedupe:['react','react-dom','@phosphor-icons/react']},
 server:{fs:{allow:[path('..')]}},
 build:{rollupOptions:{input:{showcase:path('./index.html'),topicRooms:path('./topic-rooms.html'),attentionDesk:path('./attention-desk.html'),switchboard:path('./switchboard.html'),readingJournal:path('./reading-journal.html'),pickAFeeling:path('./pick-a-feeling.html'),booksInCommon:path('./books-in-common.html')}}},
 test:{environment:'jsdom',setupFiles:['./tests/setup.js']}
});
