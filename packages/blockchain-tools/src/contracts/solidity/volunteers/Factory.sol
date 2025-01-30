// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {TokenDistributor} from "./Volunteer.sol";
import {VolunteerNFT} from "./VolunteerNFT.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {ERC721} from "solmate/tokens/ERC721.sol";

/**
 * @title VolunteerFactory
 * @dev A contract for deploying TokenDistributor and VolunteerNFT contracts
 */
contract VolunteerFactory {
    /**
     * @dev Mapping of deployed token distributors by owner address
     */
    mapping(address => address) public deployedTokenDistributors;
    /**
     * @dev Mapping of deployed VolunteerNFTs by owner address
     */
    mapping(address => address) public deployedVolunteersNFT; 

    event VolunteerDeployed(address indexed owner, address indexed volunteerAddress); // @dev Event emitted when a volunteer contract is deployed

    /**
     * @dev Deploys a new TokenDistributor contract
     * @param _tokens The list of token addresses to be managed by the distributor
     * @param _nftContract The ERC721 contract used for NFT ownership checks
     * @param owner The address of the owner of the TokenDistributor
     * @return The address of the newly deployed TokenDistributor
     */
    function deployTokenDistributor(address[] memory _tokens, ERC721 _nftContract, address owner)
        external
        returns (address)
    {
        TokenDistributor token_distributor = new TokenDistributor(_tokens, _nftContract, owner); // @dev Create a new TokenDistributor
        deployedTokenDistributors[msg.sender] = address(token_distributor); // @dev Store the deployed contract address
        emit VolunteerDeployed(msg.sender, address(token_distributor)); // @dev Emit event for deployment
        return address(token_distributor); // @dev Return the address of the deployed contract
    }

    /**
     * @dev Deploys a new VolunteerNFT contract
     * @param name The name of the NFT
     * @param symbol The symbol of the NFT
     * @param owner The address of the owner of the VolunteerNFT
     * @return The address of the newly deployed VolunteerNFT
     */
    function deployVolunteerNFT(string memory name, string memory symbol, address owner) external returns (address) {
        // @dev Create a new VolunteerNFT
        VolunteerNFT volunteer_nft = new VolunteerNFT(name, symbol, owner); 
        // @dev Store the deployed contract address
        deployedVolunteersNFT[msg.sender] = address(volunteer_nft); 
        // Emit event for deployment
        emit VolunteerDeployed(msg.sender, address(volunteer_nft)); 
        return address(volunteer_nft); // @dev Return the address of the deployed contract
    }

    /**
     * @dev Retrieves the address of the deployed TokenDistributor for a given owner
     * @param owner The address of the owner
     * @return The address of the deployed TokenDistributor
     */
    function getDeployedTokenDistributor(address owner) external view returns (address) {
        return deployedTokenDistributors[owner];
    }

    /**
     * @dev Retrieves the address of the deployed VolunteerNFT for a given owner
     * @param owner The address of the owner
     * @return The address of the deployed VolunteerNFT
     */
    function getDeployedVolunteerNFT(address owner) external view returns (address) {
        return deployedVolunteersNFT[owner];
    }
}