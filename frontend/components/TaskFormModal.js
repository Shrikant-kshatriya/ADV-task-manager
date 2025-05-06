'use client';
import { useState } from 'react';

export default function TaskFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', desc: '', priority: 'medium', dueDate: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form className="bg-gray-800 p-6 rounded-xl text-white w-full max-w-md" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
        <h2 className="text-xl mb-4">Create Task</h2>
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full mb-2 p-2 rounded bg-gray-700" />
        <textarea name="desc" placeholder="Description" value={form.desc} onChange={handleChange} className="w-full mb-2 p-2 rounded bg-gray-700" />
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full mb-2 p-2 rounded bg-gray-700" />
        <select name="priority" value={form.priority} onChange={handleChange} className="w-full mb-4 p-2 rounded bg-gray-700">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="text-gray-300">Cancel</button>
          <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Submit</button>
        </div>
      </form>
    </div>
  );
}