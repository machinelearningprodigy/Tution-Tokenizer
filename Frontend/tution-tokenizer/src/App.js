import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import TuitionTokenABI from './abis/TuitionToken.json';
import TokenizedTuitionPaymentsABI from './abis/TokenizedTuitionPayments.json';
import Wallet from './Wallet';
import './App.css';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [tuitionToken, setTuitionToken] = useState(null);
  const [tuitionPayments, setTuitionPayments] = useState(null);
  const [studentAddress, setStudentAddress] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [numberOfInstallments, setNumberOfInstallments] = useState('');
  const [planDetails, setPlanDetails] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState(0);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          const accounts = await web3.eth.requestAccounts();
          setAccounts(accounts);

          const tuitionToken = new web3.eth.Contract(TuitionTokenABI, '0x39D5b48d91865611192B7A7a47DeE3e2142EABBF');
          const tuitionPayments = new web3.eth.Contract(TokenizedTuitionPaymentsABI, '0x39D5b48d91865611192B7A7a47DeE3e2142EABBF');
          setTuitionToken(tuitionToken);
          setTuitionPayments(tuitionPayments);
        } catch (error) {
          console.error("Error initializing web3:", error);
        }
      } else {
        alert('MetaMask is not installed. Please install MetaMask to use this feature.');
      }
    };

    init();
  }, []);

  const createPlan = async () => {
    if (tuitionPayments && accounts.length > 0) {
      try {
        await tuitionPayments.methods.createTuitionPlan(studentAddress, totalAmount, numberOfInstallments)
          .send({ from: accounts[0] });
        alert('Tuition plan created!');
      } catch (error) {
        console.error("Error creating tuition plan:", error);
        alert('Failed to create the plan. Check the console for details.');
      }
    }
  };

  const payInstallment = async () => {
    if (tuitionPayments && accounts.length > 0) {
      try {
        await tuitionPayments.methods.payInstallment()
          .send({ from: accounts[0] });
        alert('Installment paid!');
      } catch (error) {
        console.error("Error paying installment:", error);
        alert('Failed to pay the installment. Check the console for details.');
      }
    }
  };

  const fetchPlanDetails = async () => {
    if (tuitionPayments && studentAddress) {
      try {
        const plan = await tuitionPayments.methods.getTuitionPlan(studentAddress).call();
        setPlanDetails(plan);
        setInstallmentAmount(plan.installmentAmount);
      } catch (error) {
        console.error("Error fetching plan details:", error);
        alert('Failed to fetch the plan details. Check the console for details.');
      }
    }
  };

  return (
    <div className="App">
      <Wallet web3={web3} setAccounts={setAccounts} />
      <h1>Tuition Payment System</h1>
      <div className="section">
        <h2>Create Tuition Plan</h2>
        <input type="text" placeholder="Student Address" onChange={e => setStudentAddress(e.target.value)} />
        <input type="number" placeholder="Total Amount" onChange={e => setTotalAmount(e.target.value)} />
        <input type="number" placeholder="Number of Installments" onChange={e => setNumberOfInstallments(e.target.value)} />
        <button onClick={createPlan}>Create Plan</button>
      </div>

      <div className="section">
        <h2>Pay Installment</h2>
        <button onClick={payInstallment}>Pay</button>
      </div>

      <div className="section">
        <h2>View Tuition Plan</h2>
        <input type="text" placeholder="Student Address" onChange={e => setStudentAddress(e.target.value)} />
        <button onClick={fetchPlanDetails}>Fetch Plan</button>
        {planDetails && (
          <div>
            <p>Total Amount: {planDetails.totalAmount}</p>
            <p>Installment Amount: {installmentAmount}</p>
            <p>Number of Installments: {planDetails.numberOfInstallments}</p>
            <p>Paid Installments: {planDetails.paidInstallments}</p>
            <p>Next Payment Date: {new Date(planDetails.nextPaymentDate * 1000).toLocaleDateString()}</p>
            <p>Status: {planDetails.isActive ? 'Active' : 'Completed'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
