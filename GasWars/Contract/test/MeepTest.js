import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const TOKEN_ADDRESS = "0x214707242a21d8226bA2b88f3B8f148a499C1c"; // remplace par la tienne
const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

export default function MeepDapp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("0");
  const [balance, setBalance] = useState("0");

  // Form states
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [approveSpender, setApproveSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");

  // Connect MetaMask wallet
  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);
        const _signer = await _provider.getSigner();
        setSigner(_signer);
        const _account = await _signer.getAddress();
        setAccount(_account);

        const _contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, _signer);
        setContract(_contract);
      } catch (err) {
        alert("Erreur connexion wallet : " + err.message);
      }
    } else {
      alert("MetaMask non détecté");
    }
  }

  // Load token info + user balance
  useEffect(() => {
    if (!contract || !account) return;

    async function loadData() {
      try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        const supply = await contract.totalSupply();
        const bal = await contract.balanceOf(account);

        setTokenName(name);
        setTokenSymbol(symbol);
        setTotalSupply(ethers.formatUnits(supply, 18));
        setBalance(ethers.formatUnits(bal, 18));
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [contract, account]);

  // Mint tokens
  async function handleMint() {
    if (!contract) return alert("Connect wallet d'abord");
    if (!ethers.isAddress(mintTo)) return alert("Adresse mint invalide");
    if (!mintAmount || isNaN(mintAmount) || Number(mintAmount) <= 0) return alert("Montant mint invalide");

    try {
      const amountWei = ethers.parseUnits(mintAmount, 18);
      const tx = await contract.mint(mintTo, amountWei);
      await tx.wait();
      alert(`Mint ${mintAmount} tokens to ${mintTo} réussi !`);
    } catch (err) {
      alert("Erreur mint : " + err.message);
    }
  }

  // Transfer tokens
  async function handleTransfer() {
    if (!contract) return alert("Connect wallet d'abord");
    if (!ethers.isAddress(transferTo)) return alert("Adresse transfert invalide");
    if (!transferAmount || isNaN(transferAmount) || Number(transferAmount) <= 0) return alert("Montant transfert invalide");

    try {
      const amountWei = ethers.parseUnits(transferAmount, 18);
      const tx = await contract.transfer(transferTo, amountWei);
      await tx.wait();
      alert(`Transfer ${transferAmount} tokens to ${transferTo} réussi !`);
    } catch (err) {
      alert("Erreur transfer : " + err.message);
    }
  }

  // Approve spender
  async function handleApprove() {
    if (!contract) return alert("Connect wallet d'abord");
    if (!ethers.isAddress(approveSpender)) return alert("Adresse approve invalide");
    if (!approveAmount || isNaN(approveAmount) || Number(approveAmount) <= 0) return alert("Montant approve invalide");

    try {
      const amountWei = ethers.parseUnits(approveAmount, 18);
      const tx = await contract.approve(approveSpender, amountWei);
      await tx.wait();
      alert(`Approved ${approveAmount} tokens for ${approveSpender} réussi !`);
    } catch (err) {
      alert("Erreur approve : " + err.message);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Meep Token Dapp</h1>

      {!account ? (
        <button onClick={connectWallet} style={{ padding: 10, fontSize: 16 }}>Connect MetaMask</button>
      ) : (
        <div>
          <p><b>Connected wallet:</b> {account}</p>
          <p><b>Token:</b> {tokenName} ({tokenSymbol})</p>
          <p><b>Total Supply:</b> {totalSupply}</p>
          <p><b>Your Balance:</b> {balance}</p>

          <hr />

          <h2>Mint Tokens</h2>
          <input
            placeholder="Address to mint to"
            value={mintTo}
            onChange={e => setMintTo(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="Amount"
            value={mintAmount}
            onChange={e => setMintAmount(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
            type="number"
            min="0"
            step="any"
          />
          <button onClick={handleMint} style={{ padding: 10, width: "100%" }}>Mint</button>

          <hr />

          <h2>Transfer Tokens</h2>
          <input
            placeholder="Recipient address"
            value={transferTo}
            onChange={e => setTransferTo(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="Amount"
            value={transferAmount}
            onChange={e => setTransferAmount(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
            type="number"
            min="0"
            step="any"
          />
          <button onClick={handleTransfer} style={{ padding: 10, width: "100%" }}>Transfer</button>

          <hr />

          <h2>Approve Spender</h2>
          <input
            placeholder="Spender address"
            value={approveSpender}
            onChange={e => setApproveSpender(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="Amount"
            value={approveAmount}
            onChange={e => setApproveAmount(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
            type="number"
            min="0"
            step="any"
          />
          <button onClick={handleApprove} style={{ padding: 10, width: "100%" }}>Approve</button>
        </div>
      )}
    </div>
  );
}
