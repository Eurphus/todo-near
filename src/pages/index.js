import { useState, useEffect, useContext } from 'react';

import { NearContext } from '@/context';
import styles from '@/styles/app.module.css';
import { NearlyContract } from '../config';
import { TaskList } from '@/components/TaskList';


export default function HelloNear() {
  const { signedAccountId, wallet } = useContext(NearContext);

  const [newName, setNewName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [charity, setCharity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!wallet) return;

    wallet.viewMethod({
      contractId: NearlyContract,
      method: 'get_tasks',
      args: {
          user_id: signedAccountId
      }
    });
  }, [signedAccountId, wallet]);

  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  const add_task = async () => {
    setShowSpinner(true)
    const allValuesNotEmpty = newName && amount && description && date && time;
    if(!allValuesNotEmpty) {
      setShowSpinner(false);
      return
    }
    setShowSpinner(true)

    // Conversion to NEAR
    let num = amount * (10 ** 24)
    num = BigInt(Math.floor(num))
    let args = {
      name: newName, 
      description: description,
      day: date, 
      time: time,
      charity: charity
    }

    console.log(args)
    await wallet.callMethod({
      contractId: NearlyContract,
      method: 'add_task',
      args: args,
      deposit: num
    });

    setNewName('');
    setAmount('');
    setDescription('');
    setCharity('');
    setDate('');
    setTime('');

    setShowSpinner(false);
  }

return (
  <main className={styles.main}>
    <div className={styles.description}>
      <p>
        Interacting with the contract: &nbsp;
        <code className={styles.code}>{NearlyContract}</code>
      </p>
    </div>

    <div className={styles.center}>
      <div className="w-50 center">
        <TaskList />
      </div>
    </div>

    <div className={styles.center}>
      <div className="input-group mt-3" hidden={!loggedIn}>
        <input
          type="text"
          className="form-control w-20"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          className="form-control w-20"
          placeholder="5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          className="form-control w-20"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          className="form-control w-20"
          placeholder="sickkids.testnet"
          value={charity}
          onChange={(e) => setCharity(e.target.value)}
        />
        <input
          type="date"
          className="form-control w-20"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          className="form-control w-20"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-secondary" onClick={add_task}>
            <span hidden={showSpinner}>Save</span>
            <i
              className="spinner-border spinner-border-sm"
              hidden={!showSpinner}
            ></i>
          </button>
        </div>
      </div>
      <div className="w-100 text-end align-text-center" hidden={loggedIn}>
        <p className="m-0">Please login to do stuff</p>
      </div>
    </div>
  </main>
);
}