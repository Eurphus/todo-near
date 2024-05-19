import { useState, useEffect, useContext } from 'react';

import { NearContext } from '@/context';
import styles from '@/styles/app.module.css';
import { NearlyContract } from '../../config';
import { TaskList } from '@/components/TaskList';
import { utils } from "near-api-js"

// Contract that the app will interact with
const CONTRACT = NearlyContract;

export default function HelloNear() {
  const { signedAccountId, wallet } = useContext(NearContext);

  const [newName, setNewName] = useState('loading...')
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!wallet) return;

    //wallet.viewMethod({ contractId: CONTRACT, method: 'check_expired_tasks' })
  }, [wallet]);

  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);


  const add_task = async () => {
    setShowSpinner(true)

    // Conversion to NEAR
    let num = 0.5424 * (10 ** 24)
    num = BigInt(Math.floor(num))

    // TRYING OUT METHOD FOR TIME
    const date = new Date();
    const showTime = date.getHours() 
        + ':' + date.getMinutes() 
        + ":" + date.getSeconds();
    // TRYING OUT METHOD FOR TIME
    await wallet.callMethod({
      contractId: CONTRACT,
      method: 'add_task',
      args: {
        name: newName, 
        description: "An example for setting up this awesome program!!!!!!! I love BlockChain!!!!!!!!!!",
        day: ":D", 
        time: "10:00", // PREVIOUSLY "10:00"
        deposit: "5"
      },
      deposit: num
    });
    setShowSpinner(false);
  }

return (
  <main className={styles.main}>
    <div className={styles.description}>
      <p>
        Interacting with the contract: &nbsp;
        <code className={styles.code}>{CONTRACT}</code>
      </p>
    </div>

    <div className={styles.center}>
      <div className="w-50 center">
        <TaskList/>
      </div>
    </div>
    <div className={styles.center}>
      {/* Moved the input below */}
      <div className="input-group mt-3" hidden={!loggedIn}> {/* Added margin top */}
        <input
          type="text"
          className="form-control w-20"
          placeholder="Store a new greeting"
          onChange={t => setNewName(t.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-secondary" onClick={add_task}>
            <span hidden={showSpinner}> Save </span>
            <i
              className="spinner-border spinner-border-sm"
              hidden={!showSpinner}
            ></i>
          </button>
        </div>
      </div>
      <div className="w-100 text-end align-text-center" hidden={loggedIn}>
        <p className="m-0"> Please login to do stuff?? </p>
      </div>
    </div>
  </main>
);
}