# Topic Rooms

An exploration of team messaging organised around subjects. Channels lead to a topic list, then a conversation with its own composer. Direct messages and group chats stay lightweight.

Run `pnpm dev` from `design-system/` and open `/topic-rooms.html`. The component showcase is at `/design-system/`. `pnpm build` includes both pages.

The page imports Sangha components directly from `design-system/src/components.jsx`; its CSS uses shared tokens and stays scoped to the product. No shared component or skill changes are required. The full-width workspace deliberately exceeds the portfolio's 1120px reading container to keep three regions readable. Between 701–1000px, topics and conversations share a pane; on phones, channels, topics and conversations use separate views.

Try switching channels, searching message content or subjects, filtering unread/followed topics, creating a topic, sending a reply, following, resolving/reopening, reacting, opening the shared design notes, and messaging a teammate or group. Enter adds a newline; Ctrl/Command+Enter sends. Drafts belong to each conversation.

Sample data, local messages, drafts and topic state persist in browser storage under `sangha-topic-rooms-v1`. This is a local prototype: no backend, real delivery, account management or live collaboration. Search covers the channel directory and channel topics/messages. The design attachment is a built-in illustrative preview with review notes. To reset the demo, remove that storage key in browser developer tools.

Run the existing test suite with `pnpm test` in `design-system/`. The Topic Rooms interaction tests cover creation, conversation-specific drafts, sends, filters, state persistence and topic actions.
