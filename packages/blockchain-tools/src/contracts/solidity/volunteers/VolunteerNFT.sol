// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ERC721} from "solmate/tokens/ERC721.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {Strings} from "openzeppelin-contracts/utils/Strings.sol";

/**
 * @title VolunteerNFT
 * @dev A simple ERC721 contract for minting and managing Volunteer NFTs
 */
contract VolunteerNFT is ERC721, Owned {
    /**
     * @dev Constructor to initialize the NFT with a name, symbol, and owner
     */
    constructor(string memory name, string memory symbol, address owner) ERC721(name, symbol) Owned(owner) {}

    /**
     * @dev Mints a new NFT to the specified address with a given token ID
     * @param to The address to receive the minted NFT
     * @param tokenId The unique identifier for the NFT being minted
     */
    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId);
    }

    /**
     * @dev Burns an existing NFT, removing it from circulation
     * @param tokenId The unique identifier of the NFT to be burned
     */
    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    /**
     * @dev Returns the URI for a given token ID, typically pointing to metadata
     * @param id The unique identifier of the NFT
     * @return A string representing the token's metadata URI
     */
    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        return string(abi.encodePacked("ipfs://", Strings.toString(id)));
    }
}