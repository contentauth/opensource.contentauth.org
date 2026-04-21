/**
 * Copies each SKILL.md from .cursor/skills/<name>/ (canonical) to
 * .claude/skills/<name>/ so Cursor and Claude Code stay aligned.
 */
const fs = require('fs/promises');
const path = require('path');

const root = path.join(__dirname, '..');
const cursorSkillsDir = path.join(root, '.cursor', 'skills');

async function sync() {
  let entries;
  try {
    entries = await fs.readdir(cursorSkillsDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return;
    }
    throw err;
  }

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const name = ent.name;
    const src = path.join(cursorSkillsDir, name, 'SKILL.md');
    try {
      await fs.access(src);
    } catch {
      continue;
    }
    const destDir = path.join(root, '.claude', 'skills', name);
    await fs.mkdir(destDir, { recursive: true });
    const dest = path.join(destDir, 'SKILL.md');
    await fs.copyFile(src, dest);
    console.log(
      `sync-skills: ${path.relative(root, src)} -> ${path.relative(
        root,
        dest,
      )}`,
    );
  }
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
