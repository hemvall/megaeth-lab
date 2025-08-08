const TOKEN_ADDRESS = "0x78f50a36ac83C5bDba773A32F8214f4E51F4e712";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Wallet, Coins, Send, CheckCircle, TrendingUp, Copy, ExternalLink } from "lucide-react";

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

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("mint");

  // Connect MetaMask wallet
  async function connectWallet() {
    if (window.ethereum) {
      try {
        setIsLoading(true);
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
        alert("Error connecting wallet: " + err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
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
    if (!contract) return alert("Connect wallet first");
    if (!ethers.isAddress(mintTo)) return alert("Invalid mint address");
    if (!mintAmount || isNaN(mintAmount) || Number(mintAmount) <= 0) return alert("Invalid mint amount");

    try {
      setIsLoading(true);
      const amountWei = ethers.parseUnits(mintAmount, 18);
      const tx = await contract.mint(mintTo, amountWei);
      await tx.wait();
      alert(`Successfully minted ${mintAmount} tokens to ${mintTo}!`);
      setMintTo("");
      setMintAmount("");
    } catch (err) {
      alert("Mint error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Transfer tokens
  async function handleTransfer() {
    if (!contract) return alert("Connect wallet first");
    if (!ethers.isAddress(transferTo)) return alert("Invalid transfer address");
    if (!transferAmount || isNaN(transferAmount) || Number(transferAmount) <= 0) return alert("Invalid transfer amount");

    try {
      setIsLoading(true);
      const amountWei = ethers.parseUnits(transferAmount, 18);
      const tx = await contract.transfer(transferTo, amountWei);
      await tx.wait();
      alert(`Successfully transferred ${transferAmount} tokens to ${transferTo}!`);
      setTransferTo("");
      setTransferAmount("");
    } catch (err) {
      alert("Transfer error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Approve spender
  async function handleApprove() {
    if (!contract) return alert("Connect wallet first");
    if (!ethers.isAddress(approveSpender)) return alert("Invalid approve address");
    if (!approveAmount || isNaN(approveAmount) || Number(approveAmount) <= 0) return alert("Invalid approve amount");

    try {
      setIsLoading(true);
      const amountWei = ethers.parseUnits(approveAmount, 18);
      const tx = await contract.approve(approveSpender, amountWei);
      await tx.wait();
      alert(`Successfully approved ${approveAmount} tokens for ${approveSpender}!`);
      setApproveSpender("");
      setApproveAmount("");
    } catch (err) {
      alert("Approve error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-2xl">
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Meep Token Dapp
          </h1>
          <p className="text-gray-300 text-lg">
            <Coins className="w-10 h-10 text-white mr-5" />
            Mint, transfer, and manage your MEEP tokens </p>
        </div>

        {!account ? (
          /* Connect Wallet Card */
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              <Wallet className="w-16 h-16 mx-auto text-purple-400 mb-6" />
              Connect Your Wallet
            </h2>
            <p className="text-gray-300 mb-8">Connect your MetaMask wallet to start interacting with MEEP tokens</p>
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Connecting..." : "Connect MetaMask"}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Account Info Card */}
            <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-xl flex items-center font-bold text-white">
                      <CheckCircle className="w-6 h-6 text-white" />
                      Wallet Connected</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">{formatAddress(account)}</span>
                      <button onClick={copyAddress} className="text-purple-400 hover:text-purple-300">
                        <Copy className="w-2 h-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-2xl font-bold text-white"><TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <a className="text-purple-400 font-medium"> ${tokenSymbol}</a>
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-gray-400">
                    <Coins className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    Total Supply : {formatNumber(totalSupply)}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-gray-400 text-center ">
                    <Wallet className="w-8 h-8 text-yellow-400" />
                    Your Balance : {formatNumber(balance)}
                  </div>
                </div>
              </div>
            </div>
            <br/>
            {/* Actions Card */}
            <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden mt-80">
              {/* Tabs */}
              <div className="flex border-b border-white/20">
                {["mint", "transfer", "approve"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === tab
                      ? "bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white border-b-2 border-purple-400"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === "mint" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <Coins className="w-6 h-6 mr-2 text-purple-400" />
                      Mint Tokens
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
                      <input
                        placeholder="0x..."
                        value={mintTo}
                        onChange={e => setMintTo(e.target.value)}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                      <input
                        placeholder="100"
                        value={mintAmount}
                        onChange={e => setMintAmount(e.target.value)}
                        type="number"
                        min="0"
                        step="any"
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={handleMint}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? "Minting..." : "Mint Tokens"}
                    </button>
                  </div>
                )}

                {activeTab === "transfer" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <Send className="w-6 h-6 mr-2 text-green-400" />
                      Transfer Tokens
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
                      <input
                        placeholder="0x..."
                        value={transferTo}
                        onChange={e => setTransferTo(e.target.value)}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                      <input
                        placeholder="50"
                        value={transferAmount}
                        onChange={e => setTransferAmount(e.target.value)}
                        type="number"
                        min="0"
                        step="any"
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={handleTransfer}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? "Transferring..." : "Transfer Tokens"}
                    </button>
                  </div>
                )}

                {activeTab === "approve" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2 text-blue-400" />
                      Approve Spender
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Spender Address</label>
                      <input
                        placeholder="0x..."
                        value={approveSpender}
                        onChange={e => setApproveSpender(e.target.value)}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                      <input
                        placeholder="25"
                        value={approveAmount}
                        onChange={e => setApproveAmount(e.target.value)}
                        type="number"
                        min="0"
                        step="any"
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? "Approving..." : "Approve Tokens"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}