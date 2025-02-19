// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Owned} from "solmate/auth/Owned.sol";
import {IERC20} from "openzeppelin-contracts/interfaces/IERC20.sol";
import {ERC1155} from "openzeppelin-contracts/token/ERC1155/ERC1155.sol";
import {IVolunteer} from "./interface/IVolunteer.sol";

/**
 * @title TokenDistributor
 * @author Lawal Abubakar Babatunde
 * @dev A contract for distributing tokens to whitelisted addresses holding NFTs
 */
contract TokenDistributor is Owned, IVolunteer {
    /// @notice The list of acceptable tokens
    address public s_token;
    /// @dev List of addresses registered for token distribution
    address[] public s_registeredAddresses;
    /// @notice The NFT contract to check ownership
    ERC1155 private immutable i_nftContract;
    /// @dev Mapping to check if a wallet is whitelisted
    mapping(address => bool) public whitelisted;
    /// @dev Base fee per unit of activities defined by the organization
    uint256 public s_baseFee;
    /// @dev Token ID that qualifies volunteer for payment.
    uint8 private constant NFT_TOKEN_ID_TWO = 2;

    /// @dev Event emitted when tokens are distributed
    event TokensDistributed(address indexed recipient, uint256 amount);

    /**
     * @dev Constructor to initialize the contract with tokens, NFT contract, and owner
     */
    constructor(address _token, address _owner, ERC1155 _nftContract, uint256 _baseFee)
        Owned(_owner)
    {
        s_token = _token;
        i_nftContract = _nftContract; // @dev Set the NFT contract
        s_baseFee = _baseFee;
    }

    function distributeTokensByUnit(address[] memory recipients) external onlyOwner {
        require(recipients.length > 0, "No recipients provided");
        
        // Check contract has token balance
        IERC20 tokenContract = IERC20(s_token);
        uint256 tokenBalance = tokenContract.balanceOf(address(this));
        require(tokenBalance > 0, "No tokens available for distribution");

        // Check at least one recipient is whitelisted and holds NFTs
        bool hasEligibleRecipients = false;
        for (uint256 i = 0; i < recipients.length; i++) {
            if (whitelisted[recipients[i]] && 
                i_nftContract.balanceOf(recipients[i], NFT_TOKEN_ID_TWO) > 0) {
                hasEligibleRecipients = true;
                break;
            }
        }
        require(hasEligibleRecipients, "No eligible recipients");

        // Cache values for gas optimization
        uint256 recipientsLength = recipients.length;
        uint256 baseFee = s_baseFee;
        uint256 totalDistributed = 0;

        // Distribute tokens
        for (uint256 i = 0; i < recipientsLength; i++) {
            address currentAddress = recipients[i];
            if (whitelisted[currentAddress]) {
                uint256 currentAddressNFTBalance = i_nftContract.balanceOf(currentAddress, NFT_TOKEN_ID_TWO);
                if (currentAddressNFTBalance > 0) {
                    uint256 currentAddressShare = currentAddressNFTBalance * baseFee;
                    tokenContract.transfer(currentAddress, currentAddressShare);
                    totalDistributed += currentAddressShare;
                    emit TokensDistributed(currentAddress, currentAddressShare);
                }
            }
        }

        // Ensure at least some tokens were distributed
        require(totalDistributed > 0, "No tokens were distributed");
    }

    /**
    * @dev Withdraws the remaining tokens from the contract after the campaign has ended
    * This function is only callable by the owner
    */
    function withdrawToken() external onlyOwner {
        IERC20 tokenContract = IERC20(s_token);
        uint256 tokenBalance = tokenContract.balanceOf(address(this)); // @dev Get the token balance of the contract
        tokenContract.transfer(owner, tokenBalance); // @dev Send the remaining tokens to the owner
    }

    /**
     * @dev Whitelists multiple addresses for token distribution
     * @param _addresses The list of addresses to be whitelisted
     */
    function whitelistAddresses(address[] memory _addresses) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            // @dev Check if the address is not already whitelisted
            if (!whitelisted[_addresses[i]]) {
                whitelisted[_addresses[i]] = true;
                s_registeredAddresses.push(_addresses[i]); 
            }
        }
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
    function changeTokenAddress(address tokenAddress) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address"); // @dev Ensure the token address is valid
        s_token = tokenAddress; // @dev Add the token address to the list
    }

    /**
     * @dev Updates the whitelist and registers a new user
     * @param user The address to be added to the whitelist
     */
    function updateWhitelist(address user) external onlyOwner {
        whitelisted[user] = true; 
        s_registeredAddresses.push(user); 
    }

    /**
     * @dev Updates the base fee
     * @param _baseFee The new base fee
     */
    function updateBaseFee(uint256 _baseFee) external onlyOwner {
        s_baseFee = _baseFee; // @dev Update the base fee
    }

    /**
     * @dev Returns the current donation token address
     * @return _token The current donation token address
     */
    function getToken() external view returns (address _token) {
        _token = s_token; 
        return _token;
    }

    /**
     * @dev Returns the list of whitelisted addresses
     * @return whitelist The list of whitelisted addresses
     */
    function getWhitelistedAddresses() external view returns (address[] memory whitelist) {
        whitelist = s_registeredAddresses; // @dev Return the list of registered addresses
    }

    /**
     *
     * @dev Returns the current base fee
     * @return _baseFee The current base fee
     */
    function getBaseFee() external view returns (uint256 _baseFee) {
        _baseFee = s_baseFee; // @dev Return the base fee
    }

    /**
     * @dev Checks if a user is whitelisted
     * @param user The address to check
     * @return status True if the user is whitelisted, false otherwise
     */
    function isWhitelisted(address user) external view returns (bool status) {
        status = whitelisted[user]; // @dev Return the whitelist status of the user
    }

    function getNFTAddress() external view returns (ERC1155) {
        return i_nftContract;
    }

    /**
     * @dev The contract should be able to receive Eth.
     */
    receive() external payable virtual {}
}
