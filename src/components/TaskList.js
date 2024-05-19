import React, { useState, useEffect, useContext } from 'react';
import { NearContext } from '@/context';
import { NearlyContract } from '../config';
import style from '@/styles/app.module.css';

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { signedAccountId, wallet } = useContext(NearContext);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasksData = await getTasksFromContract();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchTasks()

    const intervalId = setInterval(() => fetchTasks, 4000);
    return () => clearInterval(intervalId);

  }, []);

  const getTasksFromContract = async () => {

    const tasksData = await wallet.viewMethod({
        contractId: NearlyContract,
        method: 'get_tasks',
        args: {
            user_id: signedAccountId
        }
      });
      console.log(tasksData)
    return tasksData;
  };

  const fulfillTask = async(id) => {
    wallet.callMethod({
        contractId: NearlyContract,
        method: 'fulfill_task',
        args: {
            id: id
        }
    })
  }

  return (
    <div>
    <h1>List of Tasks</h1>
    <div>
        <table className={style.table}>
        <thead>
            <tr>
            <th>Name</th>
            <th>Day</th>
            <th>Time</th>
            <th>Staked</th>
            <th>Fulfilled</th>
            </tr>
        </thead>
        <tbody>
            {tasks.map(task => (
            <React.Fragment key={task.id}>
                <tr>
                <td>{task.task}</td>
                <td>{task.day}</td>
                <td>{task.time}</td>
                <td>{Math.round(task.staked * 100) / 100}</td>
                <td>
                    {task.fulfilled ? (
                    'Yes'
                    ) : (
                    <button onClick={() => fulfillTask(task.id)}>Fulfill</button>
                    )}
                </td>
                </tr>
                <tr>
                <td colSpan="5">Task Description: {task.description}</td>
                </tr>
            </React.Fragment>
            ))}
        </tbody>
        </table>
    </div>
    </div>
  );
};