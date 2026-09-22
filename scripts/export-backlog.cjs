const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'BACKLOG.md'), 'utf8');
const epics = [];
let epic;
let story;
let section;
for (const line of source.split(/\r?\n/)) {
    const epicMatch = line.match(/^## Epic (\d+): (.+)$/);
    const storyMatch = line.match(/^### (US-\d+): (.+)$/);
    if (epicMatch) {
        epic = { id: Number(epicMatch[1]), title: epicMatch[2], stories: [] };
        epics.push(epic);
        story = null;
    } else if (storyMatch) {
        assert.ok(epic, 'Story must follow an epic');
        story = { id: storyMatch[1], title: storyMatch[2], acceptance: [], tasks: [] };
        epic.stories.push(story);
        section = null;
    } else if (/^## /.test(line)) {
        story = null;
    } else if (story) {
        const field = line.match(/^- \*\*(Status|Priority|User story):\*\* (.+)$/);
        if (field) story[field[1]] = field[2];
        else if (line === '- **Acceptance criteria:**') section = 'acceptance';
        else if (line === '- **Tasks:**') section = 'tasks';
        else if (section && line.startsWith('  - ')) story[section].push(line.slice(4));
    }
}

const priorities = { Critical: 1, High: 2, Medium: 3, Low: 4 };
const states = ['To Do', 'In Progress', 'Done'];
const stories = epics.flatMap(item => item.stories);
assert.ok(epics.length && stories.length, 'Backlog must contain epics and stories');
assert.equal(new Set(stories.map(item => item.id)).size, stories.length, 'Duplicate story ID');
for (const item of stories) {
    assert.ok(states.includes(item.Status), `Invalid status: ${item.id}`);
    assert.ok(priorities[item.Priority], `Invalid priority: ${item.id}`);
    assert.ok(item['User story'] && item.acceptance.length && item.tasks.length, `Incomplete story: ${item.id}`);
}

const csv = rows => rows.map(row => row.map(value => '"' + String(value ?? '').replace(/"/g, '""') + '"').join(',')).join('\r\n') + '\r\n';
const escapeHtml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const htmlList = values => '<ul>' + values.map(value => '<li>' + escapeHtml(value) + '</li>').join('') + '</ul>';
const statusTag = status => 'source-status-' + status.toLowerCase().replace(/ /g, '-');
const aggregateStatus = items => items.every(item => item.Status === 'Done') ? 'Done' : items.every(item => item.Status === 'To Do') ? 'To Do' : 'In Progress';

// Export only unfinished work; retain the complete history in BACKLOG.md.
const outstandingEpics = epics.map(group => ({
    ...group,
    stories: group.stories.filter(item => item.Status !== 'Done').map(item => ({
        ...item,
        tasks: item.tasks.filter(task => !task.startsWith('Completed:'))
    }))
})).filter(group => group.stories.length > 0);
const outstandingStories = outstandingEpics.flatMap(group => group.stories);

const jira = [['Issue ID', 'Parent', 'Issue Type', 'Summary', 'Description', 'Status', 'Priority', 'Labels']];
const azure = [['Work Item Type', 'Title 1', 'Title 2', 'Title 3', 'Description', 'Priority', 'Tags']];
for (const group of outstandingEpics) {
    const epicId = `EPIC-${String(group.id).padStart(2, '0')}`;
    const epicStatus = aggregateStatus(group.stories);
    const priority = Math.min(...group.stories.map(item => priorities[item.Priority]));
    const priorityName = Object.keys(priorities).find(key => priorities[key] === priority);
    const title = `${epicId}: ${group.title}`;
    const description = `Source: BACKLOG.md\nSource status: ${epicStatus}\nContains: ${group.stories.map(item => item.id).join(', ')}. Status is derived from its stories.`;
    jira.push([group.id, '', 'Epic', title, description, epicStatus, priorityName === 'Critical' ? 'Highest' : priorityName, 'lwk-backlog']);
    const groupHtml = '<p>' + escapeHtml(description).replace(/\n/g, '</p><p>') + '</p>';
    azure.push(['Epic', title, '', '', groupHtml, priority, `lwk-backlog; ${epicId}; ${statusTag(epicStatus)}`]);
    azure.push(['Feature', '', `FEAT-${String(group.id).padStart(2, '0')}: ${group.title}`, '', groupHtml + '<p>Grouping feature for the standard Azure Agile hierarchy. No additional implementation scope.</p>', priority, `lwk-backlog; ${epicId}; ${statusTag(epicStatus)}`]);
    for (const item of group.stories) {
        const summary = `${item.id}: ${item.title}`;
        const description = `Local ID: ${item.id}\nSource status: ${item.Status}\nParent: ${epicId}\n\n${item['User story']}\n\nAcceptance criteria:\n${item.acceptance.map(value => '- ' + value).join('\n')}\n\nTasks / verification:\n${item.tasks.map(value => '- ' + value).join('\n')}`;
        jira.push([1000 + Number(item.id.slice(3)), group.id, 'Story', summary, description, item.Status, item.Priority === 'Critical' ? 'Highest' : item.Priority, 'lwk-backlog']);
        const html = `<p>Local ID: ${item.id}. Source status: ${item.Status}. Parent: ${epicId}.</p><p>${escapeHtml(item['User story'])}</p><p><strong>Acceptance criteria</strong></p>${htmlList(item.acceptance)}<p><strong>Tasks / verification</strong></p>${htmlList(item.tasks)}`;
        azure.push(['User Story', '', '', summary, html, priorities[item.Priority], `lwk-backlog; ${item.id}; ${epicId}; ${statusTag(item.Status)}`]);
    }
}

// Validate relationships and rectangular records before writing either export.
const seen = new Set();
for (const row of jira.slice(1)) {
    assert.equal(row.length, jira[0].length);
    assert.ok(!seen.has(row[0]), 'Duplicate Jira import ID');
    if (row[1] !== '') assert.ok(seen.has(row[1]), 'Jira parent must precede child');
    seen.add(row[0]);
}
for (const row of azure.slice(1)) {
    assert.equal(row.length, azure[0].length);
    assert.equal(row.slice(1, 4).filter(Boolean).length, 1, 'Exactly one hierarchy title per row');
}
const destination = path.join(root, 'backlog-imports');
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, 'jira.csv'), csv(jira), 'utf8');
fs.writeFileSync(path.join(destination, 'azure-devops-agile.csv'), csv(azure), 'utf8');
console.log(`Exported ${outstandingEpics.length} outstanding epics and ${outstandingStories.length} outstanding stories. Jira: ${jira.length - 1} rows. Azure: ${azure.length - 1} rows (includes ${outstandingEpics.length} grouping features).`);
console.log(JSON.stringify(Object.fromEntries(states.map(state => [state, outstandingStories.filter(item => item.Status === state).length]))));
