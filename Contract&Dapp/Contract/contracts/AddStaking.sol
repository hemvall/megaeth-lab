// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TokenStaking {
    IERC20 public stakingToken;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 rewardDebt;
    }
    
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;
    
    uint256 public rewardRate = 100; // 1% per day (100 basis points)
    uint256 public constant SECONDS_PER_DAY = 86400;
    
    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }
    
    function stake(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Calculate pending rewards before updating stake
        updateRewards(msg.sender);
        
        // Transfer tokens from user to contract
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].timestamp = block.timestamp;
    }
    
    function unstake(uint256 _amount) external {
        require(stakes[msg.sender].amount >= _amount, "Insufficient staked amount");
        
        // Calculate and update rewards
        updateRewards(msg.sender);
        
        stakes[msg.sender].amount -= _amount;
        
        // Transfer tokens back to user
        stakingToken.transfer(msg.sender, _amount);
    }
    
    function claimRewards() external {
        updateRewards(msg.sender);
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        
        rewards[msg.sender] = 0;
        stakingToken.transfer(msg.sender, reward);
    }
    
    function updateRewards(address _user) internal {
        if (stakes[_user].amount > 0) {
            uint256 timeStaked = block.timestamp - stakes[_user].timestamp;
            uint256 dailyReward = (stakes[_user].amount * rewardRate) / 10000;
            uint256 reward = (dailyReward * timeStaked) / SECONDS_PER_DAY;
            
            rewards[_user] += reward;
            stakes[_user].timestamp = block.timestamp;
        }
    }
    
    function getStakeInfo(address _user) external view returns (uint256 stakedAmount, uint256 pendingRewards) {
        stakedAmount = stakes[_user].amount;
        
        if (stakedAmount > 0) {
            uint256 timeStaked = block.timestamp - stakes[_user].timestamp;
            uint256 dailyReward = (stakedAmount * rewardRate) / 10000;
            uint256 newRewards = (dailyReward * timeStaked) / SECONDS_PER_DAY;
            pendingRewards = rewards[_user] + newRewards;
        } else {
            pendingRewards = rewards[_user];
        }
    }
}