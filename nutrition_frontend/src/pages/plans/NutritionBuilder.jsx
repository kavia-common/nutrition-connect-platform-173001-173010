import React, { useState } from 'react';
import { Button, Input } from '../../components/common';

/**
 * PUBLIC_INTERFACE
 * NutritionBuilder
 * Minimal drawer builder for creating a draft nutrition plan.
 * Props:
 * - initial?: { name?: string, notes?: string }
 * - onSave: (draft) => void
 * - onCancel: () => void
 */
export default function NutritionBuilder({ initial = {}, onSave, onCancel }) {
  const [name, setName] = useState(initial.name || '');
  const [notes, setNotes] = useState(initial.notes || '');
  const [items, setItems] = useState([
    // example default meal slots
    { item_type: 'nutrition', title: 'Breakfast', details: 'Oats + fruit + protein' },
    { item_type: 'nutrition', title: 'Lunch', details: 'Chicken + rice + veggies' },
  ]);
  const [saving, setSaving] = useState(false);

  function addItem() {
    setItems((arr) => [...arr, { item_type: 'nutrition', title: `Meal ${arr.length + 1}`, details: '' }]);
  }
  function updateItem(idx, field, value) {
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }
  function removeItem(idx) {
    setItems((arr) => arr.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const draft = {
        name: name?.trim() || 'Untitled Nutrition Plan',
        notes,
        items: items.map((it, idx) => ({ ...it, order_index: idx })),
      };
      await onSave?.(draft);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Input label="Plan Name" placeholder="e.g., Fat Loss Phase" value={name} onChange={(e) => setName(e.target.value)} />
      <div style={{ display: 'grid', gap: 8 }}>
        <label style={{ color: 'var(--color-text-dim)', fontSize: 13 }}>Notes</label>
        <textarea
          className="input"
          rows={3}
          placeholder="High-level guidance, macro targets, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div style={{ fontWeight: 800, marginTop: 6 }}>Meals</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map((it, idx) => (
          <div key={idx} className="card" style={{ background: 'var(--color-surface-2)' }}>
            <Input
              label="Title"
              value={it.title}
              onChange={(e) => updateItem(idx, 'title', e.target.value)}
            />
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ color: 'var(--color-text-dim)', fontSize: 13 }}>Details</label>
              <textarea
                className="input"
                rows={2}
                value={it.details || ''}
                onChange={(e) => updateItem(idx, 'details', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
              <Button variant="outline" onClick={() => removeItem(idx)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={addItem}>Add Meal</Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} loading={saving}>Save Plan</Button>
      </div>
    </div>
  );
}
