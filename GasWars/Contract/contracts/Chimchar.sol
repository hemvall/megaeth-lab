// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Chimchar is ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = 10;
    uint256 public constant MINT_PRICE = 0.0001 ether;

    mapping(address => bool) public hasMinted;
    bool public mintOpen = false;
    bool public revealed = false;

    uint256 public shinyTokenId;
    string public baseURI;

    constructor() Ownable(msg.sender) ERC721("Chimchar", "MMF") {}

    function openMint() external onlyOwner {
        mintOpen = true;
    }

    function closeMint() external onlyOwner {
        mintOpen = false;
    }

    function mint() external payable {
        require(mintOpen, "Mint is not open");
        require(totalSupply() < MAX_SUPPLY, "Sold out");
        require(!hasMinted[msg.sender], "Already minted");
        require(msg.value >= MINT_PRICE, "Not enough ETH");

        uint256 tokenId = totalSupply();
        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
    }

    function reveal() external onlyOwner {
        require(!revealed, "Already revealed");
        require(totalSupply() == MAX_SUPPLY, "Mint not finished");

        shinyTokenId = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)
            )
        ) % MAX_SUPPLY;

        revealed = true;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {

        if (!revealed) {
            return string(abi.encodePacked(baseURI, "hidden.json"));
        }

        return string(abi.encodePacked(baseURI, Strings.toString(tokenId + 1), ".json"));
    }

    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
