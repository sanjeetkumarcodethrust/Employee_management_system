import React from 'react';
import AcceptTask from './AcceptTask';
import NewTask from './NewTask';
import CompleteTask from './CompleteTask';
import FailedTask from './FailedTask';

const TaskList = ({ data, onUpdateStatus }) => {
  const tasks = data?.tasks || [];

  return (
    <div
      id='tasklist'
      className='h-[50%] overflow-x-auto flex items-stretch justify-start gap-5 flex-nowrap py-4 mt-8 pb-4'
    >
      {tasks.length === 0 ? (
        <div className='flex items-center justify-center w-full bg-[#232323] rounded-2xl border border-gray-800 p-8'>
          <p className='text-gray-400 text-lg'>No tasks assigned yet.</p>
        </div>
      ) : (
        tasks.map((task, idx) => {
          if (task.active) {
            return (
              <AcceptTask
                key={idx}
                index={idx}
                data={task}
                onUpdateStatus={onUpdateStatus}
              />
            );
          }
          if (task.newTask) {
            return (
              <NewTask
                key={idx}
                index={idx}
                data={task}
                onUpdateStatus={onUpdateStatus}
              />
            );
          }
          if (task.completed) {
            return <CompleteTask key={idx} index={idx} data={task} />;
          }
          if (task.failed) {
            return <FailedTask key={idx} index={idx} data={task} />;
          }
          return null;
        })
      )}
    </div>
  );
};

export default TaskList;
