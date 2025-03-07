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
    /// @notice The NFT contract to check ownership
    ERC1155 private immutable i_nftContract;
    /// @dev Base fee per unit of activities defined by the organization
    uint256 public s_baseFee;
    /// @dev Token ID that qualifies volunteer for payment.
    uint8 private constant NFT_TOKEN_ID_TWO = 2;

    /// @dev Event emitted when tokens are distributed
    event TokensDistributed(address indexed recipient, uint256 amount);

    /**
     * @dev Constructor to initialize the contract with tokens, NFT contract, and owner
     */
    constructor(address _token, address _owner, ERC1155 _nftContract, uint256 _baseFee) Owned(_owner) {
        require(_token != address(0), "Invalid token address");
        require(address(_nftContract) != address(0), "Invalid NFT contract");
        s_token = _token;
        i_nftContract = _nftContract; // @dev Set the NFT contract
        s_baseFee = _baseFee;
    }

    function distributeTokensByUnit(address[] memory _recipients) external onlyOwner {
        require(_recipients.length > 0, "No recipients provided");

        IERC20 tokenContract = IERC20(s_token);
        uint256 tokenBalance = tokenContract.balanceOf(address(this));
        require(tokenBalance > 0, "No tokens available for distribution");

        bool hasEligibleRecipients = false;
        uint256 totalRequiredTokens = 0;
        uint256 recipientsLength = _recipients.length;
        uint256 baseFee = s_baseFee;

        // First, calculate total required tokens
        for (uint256 i = 0; i < recipientsLength; i++) {
            address currentAddress = _recipients[i];
            uint256 currentAddressNFTBalance = i_nftContract.balanceOf(currentAddress, NFT_TOKEN_ID_TWO);
            if (currentAddressNFTBalance > 0) {
                uint256 currentAddressShare = currentAddressNFTBalance * baseFee;
                totalRequiredTokens += currentAddressShare;
                hasEligibleRecipients = true;
            }
        }

        // Ensure we have enough tokens and eligible recipients
        require(hasEligibleRecipients, "No eligible recipients");
        require(tokenBalance >= totalRequiredTokens, "Insufficient tokens to distribute");

        // Distribute tokens
        uint256 totalDistributed = 0;
        for (uint256 i = 0; i < recipientsLength; i++) {
            address currentAddress = _recipients[i];
            uint256 currentAddressNFTBalance = i_nftContract.balanceOf(currentAddress, NFT_TOKEN_ID_TWO);
            if (currentAddressNFTBalance > 0) {
                uint256 currentAddressShare = currentAddressNFTBalance * baseFee;
                tokenContract.transfer(currentAddress, currentAddressShare);
                totalDistributed += currentAddressShare;
                emit TokensDistributed(currentAddress, currentAddressShare);
            }
        }

        require(totalDistributed > 0, "No tokens were distributed");
        require(totalDistributed == totalRequiredTokens, "Distribution mismatch");
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
     * @dev Adds a new token address to the list of acceptable tokens
     * @param _tokenAddress The address of the token to be added
     */
    function changeTokenAddress(address _tokenAddress) external onlyOwner {
        require(_tokenAddress != address(0), "Invalid token address"); // @dev Ensure the token address is valid
        s_token = _tokenAddress; // @dev Add the token address to the list
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
    function getToken() external view returns (address) {
        return s_token;
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
     * @dev Returns the NFT contract address
     * @return _nftContract The NFT contract address
     */
    function getNFTAddress() external view returns (address) {
        return address(i_nftContract);
    }

    /**
     * @dev The contract should be able to receive Eth.
     */
    receive() external payable virtual {}
}
