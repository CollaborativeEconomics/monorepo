// SPDX-License-Identifier: PRIVATE
// Compatible with OpenZeppelin Contracts ^5.0.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GIVE is ERC721, Ownable {
    constructor()
        ERC721("GIVE Accounts", "GIVE")
        Ownable(msg.sender)
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://cfce.io/nft/";
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}
