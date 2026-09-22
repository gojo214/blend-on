<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database Rules (Drizzle ORM & Neon)
- **Forbid Migration Scripts**: Never use migration scripts (`drizzle-kit generate`, `drizzle-kit migrate`) in this project.
- **Prefer `db:push`**: Always prefer `npm run db:push` / `drizzle-kit push` for schema updates because this project is in active development and there is no need for backwards compatibility.

<!-- TRIGGER.DEV SKILLS START -->
## Trigger.dev agent skills

This project has Trigger.dev agent skills installed in `.agents/skills/`. Before writing or changing Trigger.dev code (background tasks, scheduled tasks, realtime, or chat.agent AI agents), load the most relevant skill: `trigger-authoring-tasks`, `trigger-chat-agent-advanced`, `trigger-cost-savings`, `trigger-getting-started`, `trigger-realtime-and-frontend`, `trigger-authoring-chat-agent`.
<!-- TRIGGER.DEV SKILLS END -->
