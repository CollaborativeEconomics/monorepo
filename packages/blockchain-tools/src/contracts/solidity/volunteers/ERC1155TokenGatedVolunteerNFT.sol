// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ERC1155} from "openzeppelin-contracts/token/ERC1155/ERC1155.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {Strings} from "openzeppelin-contracts/utils/Strings.sol";

/**
 * @title VolunteerNFT
 * @dev A simple ERC1155 contract for minting and managing Volunteer NFTs
 */
contract VolunteerNFT is ERC1155, Owned {
    uint256 public constant POA = 1;
    uint256 public constant POE = 2;
    /**
     * @dev Constructor to initialize the NFT with a URI and owner
     */

    constructor(string memory uri, address owner) ERC1155(uri) Owned(owner) {}

    /**
     * @dev Mints a new NFT to the specified address with a given token ID
     * @param to The address to receive the minted NFT
     * @param tokenId The unique identifier for the NFT being minted
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 tokenId, uint256 amount) external onlyOwner {
        _mint(to, tokenId, amount, "");
    }

    /**
     * @dev Burns an existing NFT, removing it from circulation
     * @param tokenId The unique identifier of the NFT to be burned
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 tokenId, uint256 amount) external onlyOwner {
        _burn(msg.sender, tokenId, amount);
    }

    /**
     * @dev Returns the URI for a given token ID, typically pointing to metadata
     * @param id The unique identifier of the NFT
     * @return A string representing the token's metadata URI
     */
    function uri(uint256 id) public view virtual override returns (string memory) {
        return string(abi.encodePacked("ipfs://", Strings.toString(id)));
    }
}
