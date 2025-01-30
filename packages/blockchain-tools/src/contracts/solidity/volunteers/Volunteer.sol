// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {IERC20} from "openzeppelin-contracts/interfaces/IERC20.sol";
import {ERC721} from "solmate/tokens/ERC721.sol";
import {IVolunteer} from "./interface/IVolunteer.sol";

/**
 * @title TokenDistributor
 * @dev A contract for distributing tokens and ETH to whitelisted addresses holding NFTs
 */
contract TokenDistributor is Owned, IVolunteer {
    /// @notice The list of acceptable tokens
    address[] public tokens;
    /// @notice The NFT contract to check ownership 
    ERC721 public nftContract;
    /// @dev Mapping to check if a wallet is whitelisted
    mapping(address => bool) public whitelisted;
    /// @dev List of addresses registered for token distribution
    address[] public registeredAddresses;

    /// @dev Event emitted when tokens are distributed
    event TokensDistributed(address indexed recipient, uint256 amount);

    /**
     * @dev Constructor to initialize the contract with tokens, NFT contract, and owner
     */
    constructor(address[] memory _tokens, ERC721 _nftContract, address _contract_owner) Owned(_contract_owner) {
        for (uint256 i = 0; i < _tokens.length; i++) {
            tokens.push(_tokens[i]);
        }
        nftContract = _nftContract; // @dev Set the NFT contract
    }

    /**
     * @dev Whitelists multiple addresses for token distribution
     * @param _addresses The list of addresses to be whitelisted
     */
    function whitelistAddresses(address[] memory _addresses) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelisted[_addresses[i]] = true; // @dev Mark each address as whitelisted
        }
        registeredAddresses = _addresses; // @dev Update registered addresses
    }

    /**
     * @dev Removes an address from the whitelist
     * @param user The address to be removed from the whitelist
     */
    function removeFromWhitelist(address user) external onlyOwner {
        whitelisted[user] = false; // @dev Mark the address as not whitelisted
    }

    /**
     * @dev Adds a new token address to the list of acceptable tokens
     * @param tokenAddress The address of the token to be added
     */
    function addTokenAddress(address tokenAddress) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address"); // @dev Ensure the token address is valid
        tokens.push(tokenAddress); // @dev Add the token address to the list
    }

    /**
     * @dev Distributes ETH and ERC20 tokens to whitelisted addresses holding NFTs
     */
    function distributeTokens() external onlyOwner {
        address[] memory recipients = registeredAddresses; // @dev Get the list of registered addresses
        require(recipients.length > 0, "No recipients provided"); // @dev Ensure there are recipients

        uint256 totalTokenBalance = address(this).balance; // @dev Start with ETH balance
        uint256 whitelistCount = 0;

        // Count whitelisted addresses
        for (uint256 i = 0; i < recipients.length; i++) {
            if (whitelisted[recipients[i]]) {
                whitelistCount++; // @dev Count how many addresses are whitelisted
            }
        }

        if (totalTokenBalance > 0) {
            // Calculate amount per recipient for ETH
            uint256 amountPerRecipient = totalTokenBalance / whitelistCount;

            // Distribute ETH
            for (uint256 i = 0; i < whitelistCount; i++) {
                address currentAddress = recipients[i];
                if (whitelisted[currentAddress]) {
                    if (nftContract.balanceOf(currentAddress) > 0) {
                        // Send ETH using call to avoid reentrancy attack
                        (bool success,) = currentAddress.call{value: amountPerRecipient}("");
                        require(success, "Transfer failed"); // @dev Ensure the transfer was successful
                        emit TokensDistributed(currentAddress, amountPerRecipient); // @dev Emit event for distribution
                    }
                }
            }
        }

        // Now distribute ERC20 tokens
        for (uint256 j = 0; j < tokens.length; j++) {
            IERC20 tokenContract = IERC20(tokens[j]);
            uint256 tokenBalance = tokenContract.balanceOf(address(this)); // @dev Get the token balance of the contract

            if (tokenBalance > 0) {
                uint256 amountPerTokenRecipient = tokenBalance / whitelistCount; // @dev Calculate amount per recipient

                for (uint256 i = 0; i < recipients.length; i++) {
                    address currentAddress = recipients[i];
                    if (whitelisted[currentAddress]) {
                        if (nftContract.balanceOf(currentAddress) > 0) {
                            tokenContract.transfer(currentAddress, amountPerTokenRecipient); // @dev Send tokens
                            emit TokensDistributed(currentAddress, amountPerTokenRecipient); // @dev Emit event for distribution
                        }
                    }
                }
            }
        }
    }

    /**
     * @dev Updates the whitelist and registers a new user
     * @param user The address to be added to the whitelist
     */
    function updateWhitelist(address user) external onlyOwner {
        whitelisted[user] = true; // @dev Mark the address as whitelisted
        registeredAddresses.push(user); // @dev Add the address to registered addresses
    }

    /**
     * @dev Returns the list of acceptable token addresses
     * @return _tokens The list of token addresses
     */
    function getTokens() external view returns (address[] memory _tokens) {
        _tokens = tokens; // @dev Return the list of tokens
        return tokens;
    }

    /**
     * @dev Returns the list of whitelisted addresses
     * @return whitelist The list of whitelisted addresses
     */
    function getWhitelistedAddresses() external view returns (address[] memory whitelist) {
        whitelist = registeredAddresses; // @dev Return the list of registered addresses
        return whitelist;
    }

    /**
     * @dev Checks if a user is whitelisted
     * @param user The address to check
     * @return status True if the user is whitelisted, false otherwise
     */
    function isWhitelisted(address user) external view returns (bool status) {
        status = whitelisted[user]; // @dev Return the whitelist status of the user
    }

    /**
     * @dev The contract should be able to receive Eth.
     */
    receive() external payable virtual {} // @dev Allow the contract to receive ETH
}