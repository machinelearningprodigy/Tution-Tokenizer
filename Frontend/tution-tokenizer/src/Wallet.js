// src/Wallet.js

import React, { useState, useEffect } from 'react';

const Wallet = ({ web3, setAccounts }) => {
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0] || '');
      }
    };

    loadAccount();
  }, [web3]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setAccounts(accounts);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      alert('MetaMask is not installed');
    }
  };

  return (
    <div className="wallet">
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default Wallet;
