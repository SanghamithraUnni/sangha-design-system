import React from 'react';
import {beforeEach, expect, test} from 'vitest';
import {render, screen, within, cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Dashboard} from '../src/dashboard/main.jsx';
beforeEach(()=>{cleanup();localStorage.clear();});
test('filters tasks, changes status and keeps the change after remount',async()=>{
 const user=userEvent.setup();const view=render(<Dashboard/>);
 await user.click(screen.getByRole('button',{name:/^Done 2/}));
 expect(screen.getAllByRole('listitem')).toHaveLength(2);
 expect(screen.queryByText('Map out the onboarding journey')).toBeNull();
 await user.selectOptions(screen.getByLabelText('Status for Collect customer interview notes'),'To do');
 expect(screen.getAllByRole('listitem')).toHaveLength(1);
 view.unmount();render(<Dashboard/>);
 expect(screen.getByLabelText('Status for Collect customer interview notes')).toHaveValue('To do');
});
test('adds a task through the dialog and rejects whitespace',async()=>{
 const user=userEvent.setup();render(<Dashboard/>);
 await user.click(screen.getByRole('button',{name:'Add task'}));
 const dialog=screen.getByRole('dialog');
 await user.type(within(dialog).getByLabelText(/Task name/),'   ');
 await user.click(within(dialog).getByRole('button',{name:'Add task'}));
 expect(screen.getByText('Give your task a name.')).toBeInTheDocument();
 await user.type(within(dialog).getByLabelText(/Task name/),'Prepare launch checklist');
 await user.click(within(dialog).getByRole('button',{name:'Add task'}));
 expect(screen.getByText('Prepare launch checklist')).toBeInTheDocument();
 expect(screen.getAllByRole('listitem')).toHaveLength(7);
});
