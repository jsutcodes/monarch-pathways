import { useState } from "react";
import { INITIAL_CHECKLISTS } from "../data/checklists";

// This is future work per the request: task lists that will eventually be
// auto-applied to every student matching a program's eligibility criteria
// (see openapi/README.md, section 7, "College & Career Success
// Checklists"). There's no backend model for this yet, so all edits below
// only live in local component state.

let nextTaskSeq = 100;

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);

  function updateChecklist(checklistId, updater) {
    setChecklists((prev) =>
      prev.map((c) => (c.id === checklistId ? updater(c) : c))
    );
  }

  function toggleTask(checklistId, taskId) {
    updateChecklist(checklistId, (c) => ({
      ...c,
      tasks: c.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      ),
    }));
  }

  function removeTask(checklistId, taskId) {
    updateChecklist(checklistId, (c) => ({
      ...c,
      tasks: c.tasks.filter((t) => t.id !== taskId),
    }));
  }

  function addTask(checklistId, label) {
    if (!label.trim()) return;
    updateChecklist(checklistId, (c) => ({
      ...c,
      tasks: [...c.tasks, { id: `new-${nextTaskSeq++}`, label, done: false }],
    }));
  }

  function updateCriteria(checklistId, criteria) {
    updateChecklist(checklistId, (c) => ({ ...c, criteria }));
  }

  return (
    <div>
      <div className="page-header">
        <h1>Checklists</h1>
      </div>

      <p className="form-notice">
        This page is a placeholder for future work: task lists that will be
        automatically applied to every student matching a program's
        eligibility criteria (see <code>openapi/README.md</code>, section 7).
        Tasks and criteria below are editable, but changes aren't persisted
        yet — there's no backend model for checklists until that work lands.
      </p>

      {checklists.map((checklist) => (
        <ChecklistCard
          key={checklist.id}
          checklist={checklist}
          onToggleTask={(taskId) => toggleTask(checklist.id, taskId)}
          onRemoveTask={(taskId) => removeTask(checklist.id, taskId)}
          onAddTask={(label) => addTask(checklist.id, label)}
          onCriteriaChange={(criteria) => updateCriteria(checklist.id, criteria)}
        />
      ))}
    </div>
  );
}

function ChecklistCard({
  checklist,
  onToggleTask,
  onRemoveTask,
  onAddTask,
  onCriteriaChange,
}) {
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const completedCount = checklist.tasks.filter((t) => t.done).length;

  function handleAdd(event) {
    event.preventDefault();
    onAddTask(newTaskLabel);
    setNewTaskLabel("");
  }

  return (
    <section className="report-section checklist-card">
      <div className="checklist-card-header">
        <div>
          <h2>{checklist.name}</h2>
          <span className="badge badge-active">{checklist.program}</span>
        </div>
        <span className="muted">
          {completedCount}/{checklist.tasks.length} complete
        </span>
      </div>

      <div className="form-row">
        <label htmlFor={`criteria-${checklist.id}`}>
          Applies to students where...
        </label>
        <input
          id={`criteria-${checklist.id}`}
          type="text"
          value={checklist.criteria}
          onChange={(e) => onCriteriaChange(e.target.value)}
        />
      </div>

      <ul className="checklist-tasks">
        {checklist.tasks.map((task) => (
          <li key={task.id} className="checklist-task">
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggleTask(task.id)}
              />
              <span className={task.done ? "checklist-task-done" : ""}>
                {task.label}
              </span>
            </label>
            <button
              type="button"
              className="btn-link checklist-remove"
              onClick={() => onRemoveTask(task.id)}
            >
              Remove
            </button>
          </li>
        ))}
        {checklist.tasks.length === 0 && (
          <li className="muted">No tasks yet.</li>
        )}
      </ul>

      <form className="checklist-add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
    </section>
  );
}
